/**
 * @file services/cache.service.js
 * @description Search result caching service.
 *
 * Two-layer caching:
 * 1. In-memory cache (node-cache) for ultra-fast repeated requests
 * 2. MongoDB SearchCache for persistence across server restarts
 *
 * Cache TTL is controlled by CACHE_TTL_SECONDS env variable (default: 24h).
 */

const NodeCache = require('node-cache');
const SearchCache = require('../models/SearchCache');

// In-memory cache with TTL sync'd to env variable
const TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS, 10) || 86400;
const memCache = new NodeCache({ stdTTL: TTL_SECONDS, checkperiod: 600 });

/**
 * Normalize city name to use as a cache key.
 * @param {string} city - Raw city name.
 * @returns {string} Lowercase trimmed city key.
 */
const getCacheKey = (city) => city.toLowerCase().trim();

/**
 * Check for a cached result by city.
 * Checks in-memory cache first, then MongoDB.
 * @param {string} city - City name.
 * @returns {Promise<Object|null>} Cached data or null if not found/expired.
 */
const getCachedResult = async (city) => {
    const key = getCacheKey(city);

    // Layer 1: Check in-memory cache (fastest)
    const memResult = memCache.get(key);
    if (memResult) {
        console.log(`[Cache] ⚡ In-memory cache HIT for "${city}"`);
        return memResult;
    }

    // Layer 2: Check MongoDB cache
    try {
        const dbResult = await SearchCache.findOne({ city: key }).lean();
        if (dbResult) {
            console.log(`[Cache] 🗃️  MongoDB cache HIT for "${city}"`);
            // Populate in-memory cache for future requests
            memCache.set(key, dbResult.data);
            return dbResult.data;
        }
    } catch (error) {
        console.error(`[Cache] ❌ MongoDB cache read error: ${error.message}`);
    }

    console.log(`[Cache] 💨 Cache MISS for "${city}" — fetching from APIs`);
    return null;
};

/**
 * Store search results in both in-memory and MongoDB cache.
 * @param {string} city - City name.
 * @param {Object} data - Data to cache: { places, hotels, hiddenPlaces }.
 * @returns {Promise<void>}
 */
const setCachedResult = async (city, data) => {
    const key = getCacheKey(city);

    // Save to in-memory cache
    memCache.set(key, data);

    // Save/update in MongoDB cache (upsert)
    try {
        await SearchCache.findOneAndUpdate(
            { city: key },
            { data, cachedAt: new Date() },
            { upsert: true, new: true }
        );
        console.log(`[Cache] 💾 Cached results for "${city}" in MongoDB`);
    } catch (error) {
        console.error(`[Cache] ❌ MongoDB cache write error: ${error.message}`);
        // Non-fatal: results are still returned, just not persisted
    }
};

/**
 * Invalidate cache for a specific city.
 * @param {string} city - City name.
 * @returns {Promise<void>}
 */
const invalidateCache = async (city) => {
    const key = getCacheKey(city);
    memCache.del(key);
    try {
        await SearchCache.deleteOne({ city: key });
        console.log(`[Cache] 🗑️  Cache invalidated for "${city}"`);
    } catch (error) {
        console.error(`[Cache] ❌ Cache invalidation error: ${error.message}`);
    }
};

module.exports = { getCachedResult, setCachedResult, invalidateCache };
