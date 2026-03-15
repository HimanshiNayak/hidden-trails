/**
 * @file utils/helpers.js
 * @description Utility helper functions for the tourism platform.
 */

/**
 * Generate star rating display array.
 * @param {number|null} rating - Rating value (0-5).
 * @returns {{ filled: number, empty: number }} Star counts.
 */
export const getStars = (rating) => {
    if (!rating) return { filled: 0, empty: 5 };
    const filled = Math.round(rating);
    return { filled, empty: 5 - filled };
};

/**
 * Get the first available photo URL from a place/hotel object.
 * Priority: photos[0].url → place.image → null.
 * @param {Object} place - Place or hotel object.
 * @returns {string|null} Photo URL, or null if no image is available.
 */
export const getPlacePhoto = (place) => {
    if (place?.photos?.length > 0 && place.photos[0]?.url) {
        return place.photos[0].url;
    }
    if (place?.image) return place.image;

    return null;
};


/**
 * Format a category string into a human-readable label.
 * @param {string} category - Raw category string.
 * @returns {string} Formatted label.
 */
export const formatCategory = (category) => {
    if (!category) return 'Place';
    return category
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Truncate text to a maximum number of characters.
 * @param {string} text - Input text.
 * @param {number} max - Maximum characters.
 * @returns {string} Truncated text with ellipsis if needed.
 */
export const truncate = (text, max = 120) => {
    if (!text) return '';
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + '…';
};

/**
 * Get CSS class name for a badge based on category.
 * @param {string} category - Category string.
 * @returns {string} CSS class.
 */
export const getCategoryBadgeClass = (category) => {
    const map = {
        nature: 'badge-nature',
        cultural: 'badge-cultural',
        historical: 'badge-historical',
        waterfall: 'badge-waterfall',
        cave: 'badge-cave',
        beach: 'badge-beach',
        eco_tourism: 'badge-eco_tourism',
        heritage: 'badge-heritage',
        hill_station: 'badge-hill_station',
    };
    return `badge ${map[category] || 'badge-primary'}`;
};

/**
 * Get text abbreviation icon for a category.
 * @param {string} category - Category string.
 * @returns {string} Short text label.
 */
export const getCategoryIcon = (category) => {
    const icons = {
        waterfall: 'WF',
        cave: 'CV',
        hill_station: 'HS',
        cultural: 'CL',
        eco_tourism: 'ET',
        beach: 'BC',
        heritage: 'HT',
        lake: 'LK',
        forest: 'FR',
        village: 'VL',
        historical: 'HS',
        monument: 'MN',
        nature: 'NT',
        tourist_attraction: 'TA',
        hotel: 'HT',
        resort: 'RS',
        homestay: 'HM',
        guest_house: 'GH',
    };
    return icons[category] || 'TA';
};

/**
 * Build Google Maps static map URL for a location.
 * Only used if NEXT_PUBLIC_GOOGLE_MAPS_KEY is set.
 * @param {number} lat - Latitude.
 * @param {number} lng - Longitude.
 * @param {number} zoom - Zoom level (1-20).
 * @returns {string} Google Maps embed URL.
 */
export const buildMapEmbedUrl = (lat, lng, zoom = 14) => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (key && key !== 'YOUR_GOOGLE_MAPS_JS_API_KEY_HERE') {
        return `https://www.google.com/maps/embed/v1/view?key=${key}&center=${lat},${lng}&zoom=${zoom}&maptype=satellite`;
    }
    // Fallback: OpenStreetMap embed (no key needed)
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02},${lat - 0.02},${lng + 0.02},${lat + 0.02}&layer=mapnik&marker=${lat},${lng}`;
};

/**
 * Decode HTML entities (used for place names from APIs).
 * @param {string} str - String with possible HTML entities.
 * @returns {string} Decoded string.
 */
export const decodeHtml = (str) => {
    if (!str) return '';
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
};
