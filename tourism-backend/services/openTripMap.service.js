/**
 * @file services/openTripMap.service.js
 * @description Service for fetching places from OpenTripMap API.
 *
 * OpenTripMap provides a rich database of natural, cultural, and historical
 * places. We use radius-based search centered on city coordinates.
 *
 * API Docs: https://opentripmap.io/docs
 *
 * Flow:
 * 1. Geocode city name → lat/lng (using OpenTripMap's geoname endpoint)
 * 2. Fetch places by radius and category filter
 * 3. Fetch details for each place (name, description, photos)
 */

const axios = require('axios');

const OTM_BASE_URL = 'https://api.opentripmap.com/0.1/en';
const SEARCH_RADIUS_METERS = 20000; // 20km radius around city center
const MAX_RESULTS = 30; // Max places to fetch per category
const REQUEST_TIMEOUT_MS = 10000;

// Categories to fetch from OpenTripMap
// Full list: https://opentripmap.io/catalog
const OTM_CATEGORIES = [
    'natural', // Natural places (mountains, lakes, etc.)
    'cultural', // Cultural places (museums, temples, etc.)
    'historic', // Historical monuments, forts, etc.
    'interesting_places', // General interesting places
];

/**
 * Get city coordinates from OpenTripMap geoname API.
 * @param {string} city - City name.
 * @param {string} apiKey - OpenTripMap API key.
 * @returns {Promise<{lat: number, lng: number}|null>}
 */
const getCityCoordinates = async (city, apiKey) => {
    try {
        const response = await axios.get(`${OTM_BASE_URL}/place/geoname`, {
            params: {
                name: city,
                country: 'IN', // India only
                apikey: apiKey,
            },
            timeout: REQUEST_TIMEOUT_MS,
        });

        const { lat, lon, status } = response.data;

        if (status === 'NOT_FOUND' || !lat || !lon) {
            console.warn(`[OpenTripMap] ⚠️  City "${city}" not found in geoname API.`);
            return null;
        }

        console.log(`[OpenTripMap] 📍 Coordinates for "${city}": ${lat}, ${lon}`);
        return { lat, lng: lon };
    } catch (error) {
        console.error(`[OpenTripMap] ❌ Error fetching coordinates for "${city}": ${error.message}`);
        return null;
    }
};

/**
 * Fetch places list (xid + name) for a given location and category.
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @param {string} category - OpenTripMap category kind.
 * @param {string} apiKey - OpenTripMap API key.
 * @returns {Promise<Array>} Array of place list items.
 */
const fetchPlacesByRadius = async (lat, lng, category, apiKey) => {
    try {
        const response = await axios.get(`${OTM_BASE_URL}/places/radius`, {
            params: {
                radius: SEARCH_RADIUS_METERS,
                lon: lng,
                lat,
                kinds: category,
                limit: MAX_RESULTS,
                format: 'json',
                apikey: apiKey,
            },
            timeout: REQUEST_TIMEOUT_MS,
        });

        const places = response.data || [];
        console.log(`  [OpenTripMap] Category: "${category}" | Found: ${places.length}`);
        return places;
    } catch (error) {
        console.error(`  [OpenTripMap] ❌ Error fetching radius places (${category}): ${error.message}`);
        return [];
    }
};

/**
 * Fetch detailed info for a single place by xid.
 * @param {string} xid - OpenTripMap place ID.
 * @param {string} apiKey - OpenTripMap API key.
 * @returns {Promise<Object|null>} Place details or null on error.
 */
const fetchPlaceDetail = async (xid, apiKey) => {
    try {
        const response = await axios.get(`${OTM_BASE_URL}/places/xid/${xid}`, {
            params: { apikey: apiKey },
            timeout: REQUEST_TIMEOUT_MS,
        });

        return response.data;
    } catch (error) {
        // Don't log individual detail failures to avoid noise
        return null;
    }
};

/**
 * Map OpenTripMap kinds to our internal category.
 * @param {string} kinds - Comma-separated kinds string from OTM.
 * @returns {string} Internal category.
 */
const mapCategory = (kinds) => {
    if (!kinds) return 'other';
    if (kinds.includes('natural')) return 'nature';
    if (kinds.includes('historic')) return 'historical';
    if (kinds.includes('cultural')) return 'cultural';
    if (kinds.includes('monument')) return 'monument';
    return 'tourist_attraction';
};

/**
 * Fetch tourist places from OpenTripMap for a city.
 * Combines results from multiple categories, deduplicates by xid.
 * @param {string} city - City name.
 * @returns {Promise<Array>} Normalized place objects.
 */
const fetchOTMPlacesForCity = async (city) => {
    const apiKey = process.env.OPENTRIPMAP_API_KEY;

    if (!apiKey || apiKey === 'YOUR_OPENTRIPMAP_API_KEY_HERE') {
        console.warn('[OpenTripMap] ⚠️  API key not configured. Skipping OpenTripMap fetch.');
        return [];
    }

    console.log(`[OpenTripMap] 🔍 Fetching places for city: "${city}"`);

    // Step 1: Get city coordinates
    const coords = await getCityCoordinates(city, apiKey);
    if (!coords) return [];

    // Step 2: Fetch places for each category
    const allPlaces = [];
    for (const category of OTM_CATEGORIES) {
        const places = await fetchPlacesByRadius(coords.lat, coords.lng, category, apiKey);
        allPlaces.push(...places);
    }

    // Step 3: Deduplicate by xid
    const seen = new Set();
    const unique = allPlaces.filter((p) => {
        if (!p.xid || seen.has(p.xid)) return false;
        seen.add(p.xid);
        return true;
    });

    console.log(`[OpenTripMap] 📋 Unique places to process: ${unique.length}`);

    // Step 4: Fetch details for top places (limit to avoid rate limits)
    const TOP_N = Math.min(unique.length, 25);
    const detailedPlaces = [];

    for (let i = 0; i < TOP_N; i++) {
        const place = unique[i];
        const detail = await fetchPlaceDetail(place.xid, apiKey);

        if (!detail || !detail.point) {
            // Fall back to list data if detail fetch fails
            if (place.point && place.name) {
                detailedPlaces.push({
                    externalId: `otm_${place.xid}`,
                    name: place.name,
                    description: '',
                    address: '',
                    city,
                    rating: null,
                    totalRatings: 0,
                    photos: place.preview?.source
                        ? [{ url: place.preview.source }]
                        : [],
                    location: {
                        lat: place.point.lat,
                        lng: place.point.lon,
                    },
                    category: mapCategory(place.kinds),
                    source: 'opentripmap',
                });
            }
            continue;
        }

        detailedPlaces.push({
            externalId: `otm_${detail.xid}`,
            name: detail.name || place.name,
            description: detail.wikipedia_extracts?.text || detail.info?.descr || '',
            address: detail.address
                ? `${detail.address.road || ''}, ${detail.address.city || city}, India`.replace(/^,\s*/, '')
                : '',
            city,
            rating: null,
            totalRatings: 0,
            photos: detail.preview?.source
                ? [{ url: detail.preview.source }]
                : [],
            location: {
                lat: detail.point.lat,
                lng: detail.point.lon,
            },
            category: mapCategory(detail.kinds),
            source: 'opentripmap',
        });
    }

    console.log(`[OpenTripMap] ✅ Processed ${detailedPlaces.length} places for "${city}"`);
    return detailedPlaces;
};

module.exports = { fetchOTMPlacesForCity, getCityCoordinates };
