/**
 * @file services/api.js
 * @description Centralized Axios API service for communicating with the backend.
 * All API calls are made through this module to keep URL management in one place.
 */

import axios from 'axios';

// Create Axios instance with base URL from environment variable
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api',
    timeout: 30000, // 30 seconds (API calls can be slow with pagination)
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        // Log outgoing requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] → ${config.method?.toUpperCase()} ${config.url}`, config.params || '');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[API] ← ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        // Log API errors
        const message = error.response?.data?.message || error.message || 'An unknown error occurred';
        console.error(`[API] ❌ Error: ${message}`);
        return Promise.reject(new Error(message));
    }
);

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Combined city search — returns places, hotels, and hidden places.
 * @param {string} city - City name to search.
 * @returns {Promise<{places: Array, hotels: Array, hiddenPlaces: Array}>}
 */
export const searchByCity = async (city) => {
    const response = await api.get('/search', { params: { city } });
    return response.data;
};

/**
 * Fetch tourist places for a city.
 * @param {string} city - City name.
 * @param {string} source - One of: 'all', 'google', 'opentripmap'
 * @returns {Promise<Array>}
 */
export const getPlaces = async (city, source = 'all') => {
    const response = await api.get('/places', { params: { city, source } });
    return response.data;
};

/**
 * Fetch hotels for a city.
 * @param {string} city - City name.
 * @returns {Promise<Array>}
 */
export const getHotels = async (city) => {
    const response = await api.get('/hotels', { params: { city } });
    return response.data;
};

/**
 * Fetch all hidden places. Optionally filter by category.
 * @param {Object} filters - { category?: string, state?: string }
 * @returns {Promise<Array>}
 */
export const getHiddenPlaces = async (filters = {}) => {
    const response = await api.get('/hidden-places', { params: filters });
    return response.data;
};

/**
 * Fetch a single hidden place by ID.
 * @param {string} id - MongoDB _id.
 * @returns {Promise<Object>}
 */
export const getHiddenPlaceById = async (id) => {
    const response = await api.get(`/hidden-places/${id}`);
    return response.data;
};

/**
 * Fetch all unique hidden place categories.
 * @returns {Promise<Array<string>>}
 */
export const getHiddenPlaceCategories = async () => {
    const response = await api.get('/hidden-places/categories');
    return response.data;
};

/**
 * Fetch all available cities with images and place counts.
 * @returns {Promise<{success: boolean, count: number, data: Array}>}
 */
export const getCities = async () => {
    const response = await api.get('/cities');
    return response.data;
};

/**
 * Backend health check.
 * @returns {Promise<Object>}
 */
export const healthCheck = async () => {
    const response = await api.get('/health');
    return response.data;
};

export default api;
