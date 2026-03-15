/**
 * @file models/Place.js
 * @description Mongoose schema for tourist places fetched from APIs.
 * Used to store cached place data from Google Places and OpenTripMap.
 */

const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
}, { _id: false });

const placeSchema = new mongoose.Schema(
    {
        // Unique external identifier (Google place_id or OpenTripMap xid)
        externalId: { type: String, unique: true, sparse: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        address: { type: String, default: '' },
        city: { type: String, required: true, trim: true, index: true },
        state: { type: String, default: '' },
        country: { type: String, default: 'India' },
        category: {
            type: String,
            enum: ['tourist_attraction', 'historical', 'nature', 'cultural', 'monument', 'eco_tourism', 'other'],
            default: 'other',
        },
        rating: { type: Number, min: 0, max: 5, default: null },
        totalRatings: { type: Number, default: 0 },
        photos: [photoSchema],
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        source: {
            type: String,
            enum: ['google', 'opentripmap', 'mongodb'],
            default: 'google',
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Index for geo queries
placeSchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Place', placeSchema);
