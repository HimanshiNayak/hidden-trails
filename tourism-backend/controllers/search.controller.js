/**
 * @file controllers/search.controller.js
 * @description Main search controller — combines Google Places, OpenTripMap,
 * MongoDB hidden places, and static fallback data into a unified response.
 *
 * Priority order:
 *   1. Cache (in-memory → MongoDB)
 *   2. Google Places API (requires key)
 *   3. OpenTripMap API (requires key, free signup)
 *   4. Static fallback dataset (always available, no key needed)
 *   5. MongoDB hidden places (always available after seeding)
 *
 * Response format:
 * {
 *   success: true,
 *   city: "Jaipur",
 *   fromCache: false,
 *   dataSource: "static" | "api" | "cache",
 *   data: {
 *     places: [...],       // Tourist places (API or static fallback)
 *     hotels: [...],       // Hotels (API or static fallback)
 *     hiddenPlaces: [...]  // Curated hidden gems from MongoDB
 *   }
 * }
 */

const { fetchPlacesForCity, fetchHotelsForCity } = require('../services/googlePlaces.service');
const { fetchOTMPlacesForCity } = require('../services/openTripMap.service');
const { fetchHotelsViaGeoapify } = require('../services/geoapify.service');
const { getCachedResult, setCachedResult } = require('../services/cache.service');
const HiddenPlace = require('../models/HiddenPlace');
const { getStaticPlaces, getStaticHotels } = require('../data/staticPlaces');


/**
 * Merge two place arrays and deduplicate by name similarity.
 * Uses primary source first; secondary fills gaps for unique names.
 * @param {Array} primary - Primary source places.
 * @param {Array} secondary - Secondary source places.
 * @returns {Array} Merged, deduplicated places.
 */
const mergePlaces = (primary, secondary) => {
    const primaryNames = new Set(
        primary.map((p) => p.name?.toLowerCase().trim())
    );
    const uniqueSecondary = secondary.filter(
        (p) => !primaryNames.has(p.name?.toLowerCase().trim())
    );
    return [...primary, ...uniqueSecondary];
};

/**
 * GET /api/search?city=CityName
 * Main combined search endpoint.
 *
 * @param {Object} req - Express request (req.query.city)
 * @param {Object} res - Express response
 * @param {Function} next - Error forwarding
 */
const searchByCity = async (req, res, next) => {
    try {
        const { city } = req.query;

        // Input validation
        if (!city || typeof city !== 'string' || city.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid city name (min 2 characters).',
            });
        }

        const normalizedCity = city.trim();
        console.log(`\n[Search] 🌍 Search request for city: "${normalizedCity}"`);

        // ── Step 1: Check cache ──────────────────────────────────────────────────
        const cached = await getCachedResult(normalizedCity);
        if (cached) {
            console.log(`[Search] ⚡ Cache hit for "${normalizedCity}"`);
            return res.json({
                success: true,
                city: normalizedCity,
                fromCache: true,
                dataSource: 'cache',
                data: cached,
            });
        }

        // ── Step 2: Fetch from all API sources in parallel ────────────────────
        console.log(`[Search] 📡 Fetching from all sources for "${normalizedCity}"...`);

        const [googlePlacesResult, googleHotelsResult, otmPlacesResult, hiddenPlacesResult] = await Promise.allSettled([
            fetchPlacesForCity(normalizedCity),
            fetchHotelsForCity(normalizedCity),
            fetchOTMPlacesForCity(normalizedCity),
            HiddenPlace.find({ isActive: true })
                .select('-__v -createdAt -updatedAt')
                .lean(),
        ]);

        // Extract values safely (handle individual API failures gracefully)
        const googlePlaces = googlePlacesResult.status === 'fulfilled' ? googlePlacesResult.value : [];
        const googleHotels = googleHotelsResult.status === 'fulfilled' ? googleHotelsResult.value : [];
        const otmPlaces = otmPlacesResult.status === 'fulfilled' ? otmPlacesResult.value : [];
        const hidden = hiddenPlacesResult.status === 'fulfilled' ? hiddenPlacesResult.value : [];

        // Log any API failures
        if (googlePlacesResult.status === 'rejected') {
            console.warn('[Search] ⚠️  Google Places API unavailable:', googlePlacesResult.reason?.message);
        }
        if (googleHotelsResult.status === 'rejected') {
            console.warn('[Search] ⚠️  Google Hotels API unavailable:', googleHotelsResult.reason?.message);
        }
        if (otmPlacesResult.status === 'rejected') {
            console.warn('[Search] ⚠️  OpenTripMap API unavailable:', otmPlacesResult.reason?.message);
        }
        if (hiddenPlacesResult.status === 'rejected') {
            console.warn('[Search] ⚠️  MongoDB unavailable:', hiddenPlacesResult.reason?.message);
        }

        // ── Step 3: Merge API results ─────────────────────────────────────────
        let mergedPlaces = mergePlaces(googlePlaces, otmPlaces);
        let hotels = googleHotels;
        let dataSource = 'api';

        // ── Step 4: Apply static fallbacks if APIs returned nothing ──────────
        if (mergedPlaces.length === 0) {
            const staticFallback = getStaticPlaces(normalizedCity);
            if (staticFallback.length > 0) {
                console.log(`[Search] 📦 Using static places fallback for "${normalizedCity}" (${staticFallback.length} places)`);
                mergedPlaces = staticFallback;
                dataSource = 'static';
            } else {
                console.log(`[Search] ℹ️  No places found for "${normalizedCity}" in APIs or static data`);
                dataSource = 'none';
            }
        }

        if (hotels.length === 0) {
            // Try Geoapify before static fallback
            try {
                const geoapifyHotels = await fetchHotelsViaGeoapify(normalizedCity);
                if (geoapifyHotels.length > 0) {
                    console.log(`[Search] 🌍 Geoapify returned ${geoapifyHotels.length} hotels for "${normalizedCity}"`);
                    hotels = geoapifyHotels;
                }
            } catch (err) {
                console.warn(`[Search] ⚠️  Geoapify hotels failed: ${err.message}`);
            }
        }

        if (hotels.length === 0) {
            const staticHotelFallback = getStaticHotels(normalizedCity);
            if (staticHotelFallback.length > 0) {
                console.log(`[Search] 📦 Using static hotels fallback for "${normalizedCity}" (${staticHotelFallback.length} hotels)`);
                hotels = staticHotelFallback;
            }
        }


        // ── Step 5: Build final response ──────────────────────────────────────
        const responseData = {
            places: mergedPlaces,
            hotels,
            hiddenPlaces: hidden,
        };

        console.log(
            `[Search] ✅ Done for "${normalizedCity}": ` +
            `${mergedPlaces.length} places (source: ${dataSource}), ` +
            `${hotels.length} hotels, ${hidden.length} hidden gems`
        );

        // ── Step 6: Cache the result ──────────────────────────────────────────
        await setCachedResult(normalizedCity, responseData);

        return res.json({
            success: true,
            city: normalizedCity,
            fromCache: false,
            dataSource,
            data: responseData,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { searchByCity };
