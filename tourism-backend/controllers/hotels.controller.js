/**
 * @file controllers/hotels.controller.js
 * @description Controller for hotel search.
 * Priority fallback chain: Google Places → Geoapify → Static Data
 */

const { fetchHotelsForCity } = require('../services/googlePlaces.service');
const { fetchHotelsViaGeoapify } = require('../services/geoapify.service');
const { getStaticHotels } = require('../data/staticPlaces');

/**
 * GET /api/hotels?city=CityName
 * Returns hotels for a city using the best available data source.
 */
const getHotelsByCity = async (req, res, next) => {
    try {
        const { city } = req.query;

        if (!city || city.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid city name.',
            });
        }

        const normalizedCity = city.trim();
        let hotels = [];

        // 1. Try Google Places
        try {
            hotels = await fetchHotelsForCity(normalizedCity);
        } catch (err) {
            console.warn(`[Hotels] ⚠️  Google Places unavailable: ${err.message}`);
        }

        // 2. Try Geoapify if Google returned nothing
        if (hotels.length === 0) {
            try {
                hotels = await fetchHotelsViaGeoapify(normalizedCity);
                if (hotels.length > 0) {
                    console.log(`[Hotels] 🌍 Geoapify returned ${hotels.length} hotels for "${normalizedCity}"`);
                }
            } catch (err) {
                console.warn(`[Hotels] ⚠️  Geoapify unavailable: ${err.message}`);
            }
        }

        // 3. Static fallback
        if (hotels.length === 0) {
            const staticFallback = getStaticHotels(normalizedCity);
            if (staticFallback.length > 0) {
                console.log(`[Hotels] 📦 Using static fallback for "${normalizedCity}" (${staticFallback.length} hotels)`);
                hotels = staticFallback;
            }
        }

        console.log(`[Hotels] ✅ Returning ${hotels.length} hotels for "${normalizedCity}"`);

        res.json({
            success: true,
            city: normalizedCity,
            count: hotels.length,
            data: hotels,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getHotelsByCity };
