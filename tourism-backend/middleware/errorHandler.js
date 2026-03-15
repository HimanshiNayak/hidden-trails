/**
 * @file middleware/errorHandler.js
 * @description Centralized error handling middleware.
 * Catches all errors thrown in controllers/services and
 * returns a consistent JSON error response.
 */

const errorHandler = (err, req, res, next) => {
    // Log full error stack in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('❌ Error:', err.stack);
    } else {
        // In production, log just the message (no stack)
        console.error('❌ Error:', err.message);
    }

    // Determine status code
    const statusCode = err.statusCode || err.status || 500;

    // Build response
    const response = {
        success: false,
        message: err.message || 'Internal Server Error',
    };

    // Add extra detail in development
    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;
