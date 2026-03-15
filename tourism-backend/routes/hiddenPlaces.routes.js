/**
 * @file routes/hiddenPlaces.routes.js
 * @description Routes for hidden places (curated Indian gems).
 */

const express = require('express');
const router = express.Router();
const {
    getAllHiddenPlaces,
    getHiddenPlaceById,
    getCategories,
} = require('../controllers/hiddenPlaces.controller');

// GET /api/hidden-places              — All hidden places (optional ?category=&state=)
// GET /api/hidden-places/categories   — Unique category list
// GET /api/hidden-places/:id          — Single hidden place
router.get('/categories', getCategories);
router.get('/', getAllHiddenPlaces);
router.get('/:id', getHiddenPlaceById);

module.exports = router;
