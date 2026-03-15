/**
 * Quick script to clear all search cache from MongoDB
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });

const MONGO_URI = process.env.MONGO_URI;

(async () => {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear SearchCache collection
    const result = await mongoose.connection.db.collection('searchcaches').deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} cached search results`);
    
    await mongoose.disconnect();
    console.log('Done!');
    process.exit(0);
})();
