/**
 * @file routes/places.routes.js
 * @description Routes for tourist places.
 */

const express = require('express');
const router = express.Router();
const { getPlacesByCity } = require('../controllers/places.controller');

// GET /api/places?city=CityName&source=all|google|opentripmap
router.get('/', getPlacesByCity);

module.exports = router;
