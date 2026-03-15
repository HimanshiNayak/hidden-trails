/**
 * @file services/geoapify.service.js
 * @description Hotel search via Geoapify Places API.
 *
 * Geoapify offers a free tier of 3000 req/day — no credit card required.
 * Register at https://www.geoapify.com to get a free API key.
 *
 * Flow:
 * 1. Geocode city name → lat/lon (Geoapify Geocoding API)
 * 2. Fetch nearby hotels/accommodations (Geoapify Places API)
 * 3. Normalize results to our internal hotel schema
 */

const axios = require('axios');

const GEOCODE_URL = 'https://api.geoapify.com/v1/geocode/search';
const PLACES_URL = 'https://api.geoapify.com/v2/places';
const TIMEOUT_MS = 8000;

/**
 * Map Geoapify category strings to our internal hotel type.
 * @param {string[]} categories - Array of Geoapify category strings.
 * @returns {string} Internal type.
 */
const mapType = (categories = []) => {
    const cats = categories.join(',').toLowerCase();
    if (cats.includes('hostel')) return 'guest_house';
    if (cats.includes('guest')) return 'guest_house';
    if (cats.includes('motel')) return 'guest_house';
    if (cats.includes('resort')) return 'resort';
    if (cats.includes('apartment')) return 'homestay';
    return 'hotel';
};

/**
 * Geocode a city name to lat/lon using Geoapify.
 * @param {string} city - City name.
 * @param {string} apiKey - Geoapify API key.
 * @returns {Promise<{lat: number, lon: number}|null>}
 */
const geocodeCity = async (city, apiKey) => {
    try {
        const res = await axios.get(GEOCODE_URL, {
            params: {
                text: `${city}, India`,
                format: 'json',
                limit: 1,
                apiKey,
            },
            timeout: TIMEOUT_MS,
        });
        const result = res.data?.results?.[0];
        if (!result) {
            console.warn(`[Geoapify] ⚠️  City "${city}" not found in geocoding.`);
            return null;
        }
        console.log(`[Geoapify] 📍 Geocoded "${city}": ${result.lat}, ${result.lon}`);
        return { lat: result.lat, lon: result.lon };
    } catch (err) {
        console.error(`[Geoapify] ❌ Geocoding error for "${city}": ${err.message}`);
        return null;
    }
};

/**
 * Fetch hotels near a city using Geoapify Places API.
 * @param {string} city - City name.
 * @returns {Promise<Array>} Normalized hotel objects.
 */
const fetchHotelsViaGeoapify = async (city) => {
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
        console.warn('[Geoapify] ⚠️  API key not configured. Skipping Geoapify hotel fetch.');
        return [];
    }

    console.log(`[Geoapify] 🏨 Fetching hotels for "${city}"...`);

    // Step 1: Geocode
    const coords = await geocodeCity(city, apiKey);
    if (!coords) return [];

    // Step 2: Fetch accommodations within 15km radius
    try {
        const res = await axios.get(PLACES_URL, {
            params: {
                categories: 'accommodation.hotel,accommodation.hostel,accommodation.motel,accommodation.guest_house,accommodation.resort',
                filter: `circle:${coords.lon},${coords.lat},15000`,
                bias: `proximity:${coords.lon},${coords.lat}`,
                limit: 20,
                apiKey,
            },
            timeout: TIMEOUT_MS,
        });

        const features = res.data?.features || [];
        console.log(`[Geoapify] ✅ Found ${features.length} hotels for "${city}"`);

        // Normalize to our internal schema
        return features
            .filter((f) => f.properties?.name)   // skip unnamed places
            .map((f) => ({
                externalId: `geo_${f.properties.place_id}`,
                name: f.properties.name,
                address: f.properties.formatted || '',
                city,
                location: {
                    lat: f.geometry.coordinates[1],
                    lng: f.geometry.coordinates[0],
                },
                rating: null,
                totalRatings: 0,
                type: mapType(f.properties.categories || []),
                openNow: null,
                photos: [],   // Geoapify free tier has no photos
                source: 'geoapify',
            }));
    } catch (err) {
        console.error(`[Geoapify] ❌ Places fetch error for "${city}": ${err.message}`);
        return [];
    }
};

module.exports = { fetchHotelsViaGeoapify };
