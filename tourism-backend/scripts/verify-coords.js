/**
 * Verifies coordinates for every entry in staticPlaces, staticHotels, and hiddenPlaces.
 * Usage: node scripts/verify-coords.js
 */

const { staticPlaces, staticHotels } = require('../data/staticPlaces');
const hiddenPlaces = require('../data/hiddenPlaces.seed');

let pass = 0;
let fail = 0;
const broken = [];

function isValid(lat, lng) {
    return (
        typeof lat === 'number' && isFinite(lat) && lat >= -90 && lat <= 90 &&
        typeof lng === 'number' && isFinite(lng) && lng >= -180 && lng <= 180
    );
}

function check(label, lat, lng) {
    if (isValid(lat, lng)) {
        pass++;
    } else {
        fail++;
        broken.push({ label, lat, lng });
    }
}

// ── Static Places ─────────────────────────────────────────────────────────────
for (const [city, places] of Object.entries(staticPlaces)) {
    for (const p of places) {
        const lat = p.location?.lat;
        const lng = p.location?.lng;
        check(`[Place] ${city}: ${p.name}`, lat, lng);
    }
}

// ── Static Hotels ─────────────────────────────────────────────────────────────
for (const [city, hotels] of Object.entries(staticHotels)) {
    for (const h of hotels) {
        const lat = h.location?.lat;
        const lng = h.location?.lng;
        check(`[Hotel] ${city}: ${h.name}`, lat, lng);
    }
}

// ── Hidden Places ─────────────────────────────────────────────────────────────
for (const gem of hiddenPlaces) {
    check(`[Hidden] ${gem.name}`, gem.lat, gem.lng);
}

// ── Report ────────────────────────────────────────────────────────────────────
console.log(`\n🔍 Checked ${pass + fail} entries\n`);

if (broken.length === 0) {
    console.log(`✅ All ${pass} entries have valid coordinates!\n`);
} else {
    console.log(`✅ PASS: ${pass}`);
    console.log(`❌ FAIL: ${fail}\n`);
    console.log('Broken entries (missing or invalid lat/lng):');
    for (const b of broken) {
        console.log(`  ${b.label}  →  lat=${b.lat}  lng=${b.lng}`);
    }
}
