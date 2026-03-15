/**
 * @file routes/hotels.routes.js
 * @description Routes for hotel search.
 */

const express = require('express');
const router = express.Router();
const { getHotelsByCity } = require('../controllers/hotels.controller');

// GET /api/hotels?city=CityName
router.get('/', getHotelsByCity);

module.exports = router;
