/**
 * @file routes/search.routes.js
 * @description Routes for combined city search.
 */

const express = require('express');
const router = express.Router();
const { searchByCity } = require('../controllers/search.controller');

// GET /api/search?city=CityName
router.get('/', searchByCity);

module.exports = router;
