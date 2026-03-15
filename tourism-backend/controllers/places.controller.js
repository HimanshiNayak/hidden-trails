/**
 * @file controllers/places.controller.js
 * @description Controller for place-specific endpoints.
 * Falls back to static dataset when external APIs are unavailable.
 */

const { fetchPlacesForCity } = require('../services/googlePlaces.service');
const { fetchOTMPlacesForCity } = require('../services/openTripMap.service');
const { getStaticPlaces } = require('../data/staticPlaces');

/**
 * GET /api/places?city=CityName&source=all|google|opentripmap|static
 * Returns tourist places for a city. Falls back to static data if APIs return nothing.
 */
const getPlacesByCity = async (req, res, next) => {
    try {
        const { city, source = 'all' } = req.query;

        if (!city || city.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid city name.',
            });
        }

        const normalizedCity = city.trim();
        let places = [];

        // Fetch from Google Places
        if (source === 'google' || source === 'all') {
            try {
                const googlePlaces = await fetchPlacesForCity(normalizedCity);
                places.push(...googlePlaces);
            } catch (err) {
                console.warn(`[Places] ⚠️  Google Places unavailable: ${err.message}`);
            }
        }

        // Fetch from OpenTripMap
        if (source === 'opentripmap' || source === 'all') {
            try {
                const otmPlaces = await fetchOTMPlacesForCity(normalizedCity);
                const existingNames = new Set(places.map((p) => p.name?.toLowerCase()));
                const uniqueOTM = otmPlaces.filter((p) => !existingNames.has(p.name?.toLowerCase()));
                places.push(...uniqueOTM);
            } catch (err) {
                console.warn(`[Places] ⚠️  OpenTripMap unavailable: ${err.message}`);
            }
        }

        // ── Static fallback ───────────────────────────────────────────────────
        if (places.length === 0) {
            const staticFallback = getStaticPlaces(normalizedCity);
            if (staticFallback.length > 0) {
                console.log(`[Places] 📦 Using static fallback for "${normalizedCity}" (${staticFallback.length} places)`);
                places = staticFallback;
            }
        }

        console.log(`[Places] ✅ Returning ${places.length} places for "${normalizedCity}"`);

        res.json({
            success: true,
            city: normalizedCity,
            count: places.length,
            data: places,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPlacesByCity };
