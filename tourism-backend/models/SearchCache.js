/**
 * @file models/SearchCache.js
 * @description Mongoose schema for caching combined search results.
 * Prevents redundant API calls by storing results keyed by city name.
 * Results auto-expire after CACHE_TTL_SECONDS (default: 24 hours).
 */

const mongoose = require('mongoose');

const searchCacheSchema = new mongoose.Schema(
    {
        // Cache key: normalized lowercase city name
        city: { type: String, required: true, unique: true, lowercase: true, trim: true },
        // Cached result payload
        data: {
            places: { type: Array, default: [] },
            hotels: { type: Array, default: [] },
            hiddenPlaces: { type: Array, default: [] },
        },
        // Timestamp when cache was created (used for TTL calculation)
        cachedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// TTL index: MongoDB will automatically delete expired documents
// The expireAfterSeconds is set dynamically based on env variable
const TTL_SECONDS = parseInt(process.env.CACHE_TTL_SECONDS, 10) || 86400;
searchCacheSchema.index({ cachedAt: 1 }, { expireAfterSeconds: TTL_SECONDS });

module.exports = mongoose.model('SearchCache', searchCacheSchema);
