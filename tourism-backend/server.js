/**
 * @file server.js
 * @description Main entry point for the Smart Tourism Platform API.
 * Sets up Express app with middleware, routes, and database connection.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const searchRoutes = require('./routes/search.routes');
const placesRoutes = require('./routes/places.routes');
const hotelsRoutes = require('./routes/hotels.routes');
const hiddenPlacesRoutes = require('./routes/hiddenPlaces.routes');
const citiesRoutes = require('./routes/cities.routes');

// Initialize Express
const app = express();

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet()); // Adds security headers

// ─── CORS Configuration ───────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'http://localhost:3000'
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Request Logging ──────────────────────────────────────────────────────────
// Use 'combined' in production for detailed logs, 'dev' in development
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting (disabled for development) ────────────────────────────────
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
//     standardHeaders: true,
//     legacyHeaders: false,
//     message: {
//         success: false,
//         message: 'Too many requests from this IP, please try again after 15 minutes.',
//     },
// });
// app.use('/api', limiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'ok',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/search', searchRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/hotels', hotelsRoutes);
app.use('/api/hidden-places', hiddenPlacesRoutes);
app.use('/api/cities', citiesRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Tourism API running on port ${PORT} [${process.env.NODE_ENV}]`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
