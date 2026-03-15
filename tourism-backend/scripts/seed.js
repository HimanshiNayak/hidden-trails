/**
 * @file scripts/seed.js
 * @description Seed script — populates MongoDB with 55+ curated hidden places.
 *
 * Usage:
 *   npm run seed
 *   node scripts/seed.js
 *
 * This script connects to MongoDB, clears existing hidden places,
 * and inserts the full curated dataset.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env variables from project root
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const HiddenPlace = require('../models/HiddenPlace');
const hiddenPlaces = require('../data/hiddenPlaces.seed');

const seed = async () => {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
        console.error('❌ MONGO_URI not found in .env file. Please configure it first.');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing hidden places
        const deleted = await HiddenPlace.deleteMany({});
        console.log(`🗑️  Cleared ${deleted.deletedCount} existing hidden places`);

        // Insert new data
        const inserted = await HiddenPlace.insertMany(hiddenPlaces, { ordered: false });
        console.log(`✅ Successfully seeded ${inserted.length} hidden places!`);

        // Print category breakdown
        const breakdown = {};
        hiddenPlaces.forEach((p) => {
            breakdown[p.category] = (breakdown[p.category] || 0) + 1;
        });
        console.log('\n📊 Category breakdown:');
        Object.entries(breakdown).forEach(([cat, count]) => {
            console.log(`   ${cat}: ${count}`);
        });

        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB. Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seed();
