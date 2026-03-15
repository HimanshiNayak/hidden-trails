/**
 * @file services/googlePlaces.service.js
 * @description Service for fetching places and hotels from Google Places API.
 *
 * Features:
 * - Multi-query search (5 types of place queries per city)
 * - next_page_token pagination (fetches up to 3 pages per query)
 * - Deduplication by place_id
 * - India-only filtering (components=country:in + address check)
 * - Photo URL construction (min 3 photos per place)
 * - Hotel multi-query (hotels, resorts, homestays, guest houses)
 */

const axios = require('axios');

// Base URL for Google Places Text Search API
const PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
// Base URL for fetching place photos
const PHOTO_BASE_URL = 'https://maps.googleapis.com/maps/api/place/photo';
// Delay between paginated requests (Google requires 2s between page requests)
const PAGE_DELAY_MS = 2000;
// Max number of photos to fetch per place
const MAX_PHOTOS = 3;
// Max width for photo requests
const PHOTO_MAX_WIDTH = 800;

/**
 * Utility: sleep for a given number of milliseconds.
 * @param {number} ms - Milliseconds to sleep.
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Build a Google Places Photo URL from a photo_reference.
 * @param {string} photoReference - The photo_reference from Places API.
 * @param {string} apiKey - Google API key.
 * @returns {string} Full photo URL.
 */
const buildPhotoUrl = (photoReference, apiKey) => {
    return `${PHOTO_BASE_URL}?maxwidth=${PHOTO_MAX_WIDTH}&photo_reference=${photoReference}&key=${apiKey}`;
};

/**
 * Fetch a single page of places from Google Places Text Search API.
 * @param {string} query - Search query string.
 * @param {string} apiKey - Google API key.
 * @param {string|null} pageToken - next_page_token from previous response.
 * @returns {Promise<{results: Array, nextPageToken: string|null}>}
 */
const fetchPlacesPage = async (query, apiKey, pageToken = null) => {
    const params = {
        query,
        key: apiKey,
        components: 'country:in', // India only
        language: 'en',
    };

    if (pageToken) {
        params.pagetoken = pageToken;
    }

    try {
        const response = await axios.get(PLACES_BASE_URL, {
            params,
            timeout: 10000, // 10 second timeout
        });

        const { results, next_page_token, status } = response.data;

        // Log API status for debugging
        console.log(`  [Google Places] Query: "${query}" | Status: ${status} | Results: ${results?.length || 0}`);

        if (status === 'REQUEST_DENIED') {
            console.error('  [Google Places] ❌ API key invalid or Places API not enabled.');
            return { results: [], nextPageToken: null };
        }

        if (status === 'ZERO_RESULTS') {
            return { results: [], nextPageToken: null };
        }

        return {
            results: results || [],
            nextPageToken: next_page_token || null,
        };
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error(`  [Google Places] ⏱️  Timeout for query: "${query}"`);
        } else {
            console.error(`  [Google Places] ❌ Error for query "${query}": ${error.message}`);
        }
        return { results: [], nextPageToken: null };
    }
};

/**
 * Fetch all pages of results for a query (up to maxPages).
 * Google allows 3 pages max (60 results) per query.
 * @param {string} query - Search query.
 * @param {string} apiKey - Google API key.
 * @param {number} maxPages - Max pages to fetch (default: 3).
 * @returns {Promise<Array>} All place results across pages.
 */
const fetchAllPages = async (query, apiKey, maxPages = 3) => {
    let allResults = [];
    let pageToken = null;

    for (let page = 0; page < maxPages; page++) {
        // Google requires a delay before fetching next page
        if (page > 0 && pageToken) {
            await sleep(PAGE_DELAY_MS);
        }

        const { results, nextPageToken } = await fetchPlacesPage(query, apiKey, pageToken);
        allResults = [...allResults, ...results];
        pageToken = nextPageToken;

        // No more pages available
        if (!nextPageToken) break;
    }

    return allResults;
};

/**
 * Normalize a Google Places result into our standard format.
 * @param {Object} place - Raw Google Places result.
 * @param {string} apiKey - Google API key (for photo URLs).
 * @param {string} category - Place category tag.
 * @returns {Object} Normalized place object.
 */
const normalizePlaceResult = (place, apiKey, category = 'tourist_attraction') => {
    // Build photo URLs (up to MAX_PHOTOS)
    const photos = (place.photos || [])
        .slice(0, MAX_PHOTOS)
        .map((p) => ({
            url: buildPhotoUrl(p.photo_reference, apiKey),
            width: p.width,
            height: p.height,
        }));

    return {
        externalId: place.place_id,
        name: place.name,
        address: place.formatted_address || '',
        city: extractCityFromAddress(place.formatted_address),
        rating: place.rating || null,
        totalRatings: place.user_ratings_total || 0,
        photos,
        location: {
            lat: place.geometry?.location?.lat || 0,
            lng: place.geometry?.location?.lng || 0,
        },
        category,
        source: 'google',
    };
};

/**
 * Extract city name from a formatted address string.
 * @param {string} address - Formatted address from Google Places.
 * @returns {string} City name or empty string.
 */
const extractCityFromAddress = (address) => {
    if (!address) return '';
    // Typical format: "Place Name, City, State, India"
    const parts = address.split(',');
    if (parts.length >= 3) {
        return parts[parts.length - 3].trim();
    }
    return parts[0].trim();
};

/**
 * Filter results to ensure they are in India.
 * @param {Array} results - Array of raw Google Places results.
 * @returns {Array} Filtered results.
 */
const filterIndianPlaces = (results) => {
    return results.filter((p) => {
        const address = (p.formatted_address || '').toLowerCase();
        return address.includes('india');
    });
};

/**
 * Deduplicate places by place_id.
 * @param {Array} places - Array of place objects with externalId.
 * @returns {Array} Deduplicated places.
 */
const deduplicatePlaces = (places) => {
    const seen = new Set();
    return places.filter((p) => {
        if (seen.has(p.externalId)) return false;
        seen.add(p.externalId);
        return true;
    });
};

// ─── Category mapping ──────────────────────────────────────────────────────────
/**
 * Map query types to internal category values.
 */
const PLACE_QUERIES = (city) => [
    { query: `tourist attractions in ${city} India`, category: 'tourist_attraction' },
    { query: `places to visit in ${city} India`, category: 'tourist_attraction' },
    { query: `historical places in ${city} India`, category: 'historical' },
    { query: `nature places in ${city} India`, category: 'nature' },
    { query: `cultural places in ${city} India`, category: 'cultural' },
];

const HOTEL_QUERIES = (city) => [
    { query: `hotels in ${city} India`, type: 'hotel' },
    { query: `resorts in ${city} India`, type: 'resort' },
    { query: `homestays in ${city} India`, type: 'homestay' },
    { query: `guest houses in ${city} India`, type: 'guest_house' },
];

// ─── Public Functions ──────────────────────────────────────────────────────────

/**
 * Fetch tourist places for a city from Google Places API.
 * Runs multiple queries and combines deduplicated results.
 * @param {string} city - City name to search.
 * @returns {Promise<Array>} Array of normalized place objects.
 */
const fetchPlacesForCity = async (city) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
        console.warn('[Google Places] ⚠️  API key not configured. Skipping Google Places fetch.');
        return [];
    }

    console.log(`[Google Places] 🔍 Fetching places for city: "${city}"`);

    const queries = PLACE_QUERIES(city);
    const allRawResults = [];

    // Run each query type sequentially to respect API rate limits
    for (const { query, category } of queries) {
        const results = await fetchAllPages(query, apiKey, 2); // Limit 2 pages per query
        const filtered = filterIndianPlaces(results);
        const normalized = filtered.map((p) => normalizePlaceResult(p, apiKey, category));
        allRawResults.push(...normalized);
    }

    // Deduplicate by externalId (place_id)
    const unique = deduplicatePlaces(allRawResults);
    console.log(`[Google Places] ✅ Total unique places for "${city}": ${unique.length}`);

    return unique;
};

/**
 * Fetch hotels for a city from Google Places API.
 * Runs multiple hotel-type queries and combines results.
 * @param {string} city - City name to search.
 * @returns {Promise<Array>} Array of normalized hotel objects.
 */
const fetchHotelsForCity = async (city) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GOOGLE_PLACES_API_KEY_HERE') {
        console.warn('[Google Places] ⚠️  API key not configured. Skipping hotel fetch.');
        return [];
    }

    console.log(`[Google Places] 🏨 Fetching hotels for city: "${city}"`);

    const queries = HOTEL_QUERIES(city);
    const allHotels = [];

    for (const { query, type } of queries) {
        const results = await fetchAllPages(query, apiKey, 1); // 1 page per hotel type
        const filtered = filterIndianPlaces(results);
        const normalized = filtered.map((place) => {
            const photos = (place.photos || [])
                .slice(0, MAX_PHOTOS)
                .map((p) => ({ url: buildPhotoUrl(p.photo_reference, apiKey) }));

            return {
                externalId: place.place_id,
                name: place.name,
                address: place.formatted_address || '',
                city: extractCityFromAddress(place.formatted_address),
                rating: place.rating || null,
                totalRatings: place.user_ratings_total || 0,
                photos,
                location: {
                    lat: place.geometry?.location?.lat || 0,
                    lng: place.geometry?.location?.lng || 0,
                },
                openNow: place.opening_hours?.open_now || null,
                type,
                source: 'google',
            };
        });

        allHotels.push(...normalized);
    }

    // Deduplicate hotels
    const seen = new Set();
    const unique = allHotels.filter((h) => {
        if (seen.has(h.externalId)) return false;
        seen.add(h.externalId);
        return true;
    });

    console.log(`[Google Places] ✅ Total unique hotels for "${city}": ${unique.length}`);
    return unique;
};

module.exports = { fetchPlacesForCity, fetchHotelsForCity };
