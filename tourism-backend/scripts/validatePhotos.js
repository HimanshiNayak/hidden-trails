/**
 * @file scripts/validatePhotos.js
 * @description Validates ALL photo/image URLs across both data files.
 *
 *   For Wikimedia URLs: validates via Wikipedia file-existence API (avoids CDN rate limits)
 *   For other URLs (Unsplash etc): sends HEAD request with retries
 *
 * Usage: node scripts/validatePhotos.js
 */

const https = require('https');
const http = require('http');

// ── Collect all URLs ─────────────────────────────────────────────────────────
function collectUrls() {
    const urls = [];

    // Hidden places
    const hiddenPlaces = require('../data/hiddenPlaces.seed');
    for (const place of hiddenPlaces) {
        if (place.image) {
            urls.push({ name: place.name, url: place.image, source: 'hiddenPlaces' });
        }
    }

    // Static places
    const { staticPlaces, staticHotels } = require('../data/staticPlaces');
    for (const [city, places] of Object.entries(staticPlaces)) {
        for (const place of places) {
            if (place.photos && place.photos.length > 0) {
                for (const photo of place.photos) {
                    urls.push({ name: place.name, url: photo.url, source: `staticPlaces.${city}` });
                }
            }
        }
    }

    // Static hotels
    for (const [city, hotels] of Object.entries(staticHotels)) {
        for (const hotel of hotels) {
            if (hotel.photos && hotel.photos.length > 0) {
                for (const photo of hotel.photos) {
                    urls.push({ name: hotel.name, url: photo.url, source: `staticHotels.${city}` });
                }
            }
        }
    }

    return urls;
}

// ── HTTP fetch helper ────────────────────────────────────────────────────────
function httpGet(url) {
    return new Promise((resolve, reject) => {
        const mod = url.startsWith('https') ? https : http;
        mod.get(url, {
            timeout: 15000,
            headers: { 'User-Agent': 'TourismAppValidator/1.0 (educational; nodejs)' }
        }, (res) => {
            let data = '';
            res.on('data', (c) => (data += c));
            res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
        }).on('error', reject).on('timeout', function () { this.destroy(); reject(new Error('TIMEOUT')); });
    });
}

// ── Validate Wikimedia URL via API ───────────────────────────────────────────
// Instead of hitting the CDN (which rate-limits aggressively), we check if the
// file exists via the MediaWiki API. The thumbnail URL structure is predictable:
//   .../thumb/{hash}/{filename}/{width}px-{filename}
// We extract the filename and query the API.
async function validateWikimediaUrl(url) {
    try {
        // Extract filename from Wikimedia thumbnail URL
        // Format: .../thumb/a/ab/Filename.jpg/800px-Filename.jpg
        // or: .../commons/a/ab/Filename.jpg (direct, no thumb)
        const match = url.match(/\/(?:thumb\/)?[a-f0-9]\/[a-f0-9]{2}\/([^/]+?)(?:\/\d+px-|$)/);
        if (!match) {
            return { ok: false, status: 'Could not parse Wikimedia URL' };
        }

        const filename = decodeURIComponent(match[1]);
        const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&format=json`;

        const res = await httpGet(apiUrl);
        if (res.status !== 200) {
            return { ok: false, status: `API ${res.status}` };
        }

        const json = JSON.parse(res.data);
        const pages = json.query?.pages || {};
        for (const pid of Object.keys(pages)) {
            // pid === "-1" means file not found
            if (pid === '-1') {
                return { ok: false, status: 'File not found on Wikimedia' };
            }
            // Check if imageinfo exists (means file is real)
            if (pages[pid].imageinfo) {
                return { ok: true, status: 200 };
            }
        }

        return { ok: true, status: 200 }; // Page exists, likely valid
    } catch (e) {
        return { ok: false, status: e.message };
    }
}

// ── Validate non-Wikimedia URL via HEAD ──────────────────────────────────────
function validateUrlHead(url, maxRedirects = 5) {
    return new Promise((resolve) => {
        if (maxRedirects <= 0) return resolve({ ok: false, status: 'Too many redirects' });

        const mod = url.startsWith('https') ? https : http;
        const req = mod.request(url, {
            method: 'HEAD',
            timeout: 15000,
            headers: { 'User-Agent': 'TourismAppValidator/1.0 (educational; nodejs)' }
        }, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let redir = res.headers.location;
                if (redir.startsWith('/')) {
                    const p = new URL(url);
                    redir = `${p.protocol}//${p.host}${redir}`;
                }
                return resolve(validateUrlHead(redir, maxRedirects - 1));
            }
            resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode });
        });
        req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: 'TIMEOUT' }); });
        req.on('error', (e) => resolve({ ok: false, status: e.code || e.message }));
        req.end();
    });
}

// ── Validate with retry ─────────────────────────────────────────────────────
async function validateWithRetry(url, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        const result = await validateUrlHead(url);
        if (result.ok || (result.status !== 429 && result.status !== 'TIMEOUT')) return result;
        await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
    }
    return { ok: false, status: '429 (after retries)' };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const urls = collectUrls();

    // Deduplicate
    const seen = new Set();
    const unique = [];
    for (const entry of urls) {
        if (!seen.has(entry.url)) {
            seen.add(entry.url);
            unique.push(entry);
        }
    }

    // Separate Wikimedia and other URLs
    const wikimedia = unique.filter((e) => e.url.includes('upload.wikimedia.org'));
    const others = unique.filter((e) => !e.url.includes('upload.wikimedia.org'));

    console.log(`\n  Validating ${unique.length} unique photo URLs (${urls.length} total references)`);
    console.log(`  Wikimedia: ${wikimedia.length} | Other: ${others.length}\n`);

    const results = { valid: 0, broken: 0, errors: [] };

    // ── Validate Wikimedia URLs via API (fast, no rate limit issues) ──────
    console.log('  Checking Wikimedia URLs via API...');
    for (let i = 0; i < wikimedia.length; i++) {
        const entry = wikimedia[i];
        const result = await validateWikimediaUrl(entry.url);
        if (result.ok) {
            results.valid++;
            process.stdout.write('.');
        } else {
            results.broken++;
            results.errors.push({ ...entry, status: result.status });
            process.stdout.write('X');
        }
        // Polite delay for API
        if ((i + 1) % 10 === 0) await sleep(500);
    }
    console.log('');

    // ── Validate other URLs via HEAD ─────────────────────────────────────
    console.log('  Checking other URLs via HEAD...');
    for (let i = 0; i < others.length; i++) {
        const entry = others[i];
        const result = await validateWithRetry(entry.url);
        if (result.ok) {
            results.valid++;
            process.stdout.write('.');
        } else {
            results.broken++;
            results.errors.push({ ...entry, status: result.status });
            process.stdout.write('X');
        }
        await sleep(300);
    }
    console.log('');

    // ── Summary ──────────────────────────────────────────────────────────
    console.log('\n' + '='.repeat(60));
    console.log(`  Valid:   ${results.valid}`);
    console.log(`  Broken:  ${results.broken}`);
    console.log(`  Total:   ${unique.length} unique (${urls.length} references)`);
    console.log('='.repeat(60));

    if (results.errors.length > 0) {
        console.log('\n  Broken URLs:\n');
        for (const err of results.errors) {
            console.log(`  [${err.source}] ${err.name}`);
            console.log(`    Status: ${err.status}`);
            console.log(`    URL: ${err.url}\n`);
        }
        process.exit(1);
    } else {
        console.log('\n  All photo URLs are valid!\n');
        process.exit(0);
    }
}

main();
