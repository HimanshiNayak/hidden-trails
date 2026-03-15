/**
 * @file models/HiddenPlace.js
 * @description Mongoose schema for curated "hidden gems" of India.
 * These are manually curated places not easily found on mainstream platforms.
 */

const mongoose = require('mongoose');

const hiddenPlaceSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        city: { type: String, default: '' },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: ['waterfall', 'cave', 'hill_station', 'cultural', 'eco_tourism', 'beach', 'heritage', 'village', 'lake', 'forest', 'other'],
            required: true,
        },
        image: { type: String, default: '' }, // URL or relative path
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        bestTimeToVisit: { type: String, default: '' },
        entryFee: { type: String, default: 'Free' },
        nearestCity: { type: String, default: '' },
        tips: { type: String, default: '' },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Text index for search
hiddenPlaceSchema.index({ name: 'text', state: 'text', description: 'text' });
hiddenPlaceSchema.index({ category: 1 });

module.exports = mongoose.model('HiddenPlace', hiddenPlaceSchema);
