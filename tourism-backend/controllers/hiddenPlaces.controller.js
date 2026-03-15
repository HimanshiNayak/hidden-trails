/**
 * @file controllers/hiddenPlaces.controller.js
 * @description Controllers for managing hidden places (MongoDB only).
 * Supports listing all, filtering by category, and getting individual details.
 */

const HiddenPlace = require('../models/HiddenPlace');

/**
 * GET /api/hidden-places
 * Returns all active hidden places. Optionally filter by category.
 * Query params: category (optional)
 */
const getAllHiddenPlaces = async (req, res, next) => {
    try {
        const { category, state } = req.query;

        const filter = { isActive: true };
        if (category) filter.category = category;
        if (state) filter.state = new RegExp(state, 'i'); // case-insensitive

        const places = await HiddenPlace.find(filter)
            .select('-__v')
            .sort({ name: 1 })
            .lean();

        console.log(`[HiddenPlaces] 📋 Returning ${places.length} hidden places`);

        res.json({
            success: true,
            count: places.length,
            data: places,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/hidden-places/:id
 * Returns a single hidden place by MongoDB _id.
 */
const getHiddenPlaceById = async (req, res, next) => {
    try {
        const place = await HiddenPlace.findById(req.params.id).select('-__v').lean();

        if (!place) {
            return res.status(404).json({
                success: false,
                message: 'Hidden place not found.',
            });
        }

        res.json({ success: true, data: place });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/hidden-places/categories
 * Returns list of all unique categories.
 */
const getCategories = async (req, res, next) => {
    try {
        const categories = await HiddenPlace.distinct('category', { isActive: true });
        res.json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllHiddenPlaces, getHiddenPlaceById, getCategories };
