/**
 * @file models/Hotel.js
 * @description Mongoose schema for hotels / accommodations.
 * Stores data from Google Places (hotels, resorts, homestays, guest houses).
 */

const mongoose = require('mongoose');

const hotelPhotoSchema = new mongoose.Schema({
    url: { type: String, required: true },
}, { _id: false });

const hotelSchema = new mongoose.Schema(
    {
        externalId: { type: String, unique: true, sparse: true },
        name: { type: String, required: true, trim: true },
        address: { type: String, default: '' },
        city: { type: String, required: true, trim: true, index: true },
        rating: { type: Number, min: 0, max: 5, default: null },
        totalRatings: { type: Number, default: 0 },
        photos: [hotelPhotoSchema],
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        phone: { type: String, default: '' },
        website: { type: String, default: '' },
        openNow: { type: Boolean, default: null },
        type: {
            type: String,
            enum: ['hotel', 'resort', 'homestay', 'guest_house', 'other'],
            default: 'hotel',
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);
