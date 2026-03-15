/**
 * @file config/db.js
 * @description MongoDB connection using Mongoose.
 * Handles connection errors gracefully and logs connection status.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
        console.error('❌ MONGO_URI is not defined in environment variables. Check your .env file.');
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(MONGO_URI, {
            // These options help avoid deprecation warnings
            serverSelectionTimeoutMS: 5001, // Timeout after 5s if no server found
        });

        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected.');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected.');
    });
};

module.exports = connectDB;
