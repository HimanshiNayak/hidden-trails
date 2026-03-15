/**
 * @file controllers/cities.controller.js
 * @description Controller for the /api/cities endpoint.
 * Returns all available cities from static data, Place collection, and HiddenPlace collection.
 */

const Place = require('../models/Place');
const HiddenPlace = require('../models/HiddenPlace');
const { staticPlaces, staticHotels } = require('../data/staticPlaces');

/**
 * GET /api/cities
 * Returns all unique cities with a representative image, state, and place count.
 */
const getAllCities = async (req, res, next) => {
    try {
        const cityMap = new Map(); // key: lowercase city name, value: { name, state, image, placeCount }

        // ── 1. Gather cities from static places ──────────────────────────────
        for (const [key, places] of Object.entries(staticPlaces)) {
            if (places.length > 0) {
                const first = places[0];
                const cityName = first.city || key.charAt(0).toUpperCase() + key.slice(1);
                const lowerKey = cityName.toLowerCase();
                if (!cityMap.has(lowerKey)) {
                    cityMap.set(lowerKey, {
                        name: cityName,
                        state: first.state || '',
                        image: first.photos?.[0]?.url || '',
                        placeCount: places.length,
                    });
                } else {
                    const existing = cityMap.get(lowerKey);
                    existing.placeCount += places.length;
                }
            }
        }

        // ── 2. Gather cities from MongoDB Place collection ───────────────────
        try {
            const dbCities = await Place.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: { $toLower: '$city' },
                        name: { $first: '$city' },
                        state: { $first: '$state' },
                        image: { $first: { $arrayElemAt: ['$photos.url', 0] } },
                        placeCount: { $sum: 1 },
                    },
                },
            ]);
            for (const city of dbCities) {
                const lowerKey = city._id;
                if (!cityMap.has(lowerKey)) {
                    cityMap.set(lowerKey, {
                        name: city.name,
                        state: city.state || '',
                        image: city.image || '',
                        placeCount: city.placeCount,
                    });
                } else {
                    const existing = cityMap.get(lowerKey);
                    existing.placeCount += city.placeCount;
                    if (!existing.image && city.image) existing.image = city.image;
                }
            }
        } catch (err) {
            console.warn('[Cities] ⚠️  Could not query Place collection:', err.message);
        }

        // ── 3. Gather cities from HiddenPlace collection ────────────────────
        try {
            const hiddenCities = await HiddenPlace.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: { $toLower: { $ifNull: ['$nearestCity', '$city'] } },
                        name: { $first: { $ifNull: ['$nearestCity', '$city'] } },
                        state: { $first: '$state' },
                        image: { $first: '$image' },
                        placeCount: { $sum: 1 },
                    },
                },
            ]);
            for (const city of hiddenCities) {
                if (!city._id || city._id.trim() === '') continue;
                const lowerKey = city._id;
                if (!cityMap.has(lowerKey)) {
                    cityMap.set(lowerKey, {
                        name: city.name,
                        state: city.state || '',
                        image: city.image || '',
                        placeCount: city.placeCount,
                    });
                } else {
                    const existing = cityMap.get(lowerKey);
                    existing.placeCount += city.placeCount;
                    if (!existing.image && city.image) existing.image = city.image;
                    if (!existing.state && city.state) existing.state = city.state;
                }
            }
        } catch (err) {
            console.warn('[Cities] ⚠️  Could not query HiddenPlace collection:', err.message);
        }

        // ── 4. Convert map to array and sort by place count ─────────────────
        const cities = Array.from(cityMap.values())
            .filter((c) => c.name && c.name.trim() !== '')
            .sort((a, b) => b.placeCount - a.placeCount);

        console.log(`[Cities] ✅ Returning ${cities.length} cities`);

        res.json({
            success: true,
            count: cities.length,
            data: cities,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCities };
