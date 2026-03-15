/**
 * Verifies all image URLs in staticPlaces.js and hiddenPlaces.seed.js
 * Usage: node scripts/verify-images.js
 */
const https = require('https');
const http = require('http');

const { staticPlaces, staticHotels } = require('../data/staticPlaces');
const hiddenPlaces = require('../data/hiddenPlaces.seed');

function checkUrl(url) {
    return new Promise((resolve) => {
        const lib = url.startsWith('https') ? https : http;

        function attempt(method) {
            try {
                const req = lib.request(url, { method, timeout: 8000 }, (res) => {
                    req.destroy();
                    if (res.statusCode === 405 && method === 'HEAD') {
                        attempt('GET'); // retry with GET — same outer resolve
                    } else {
                        resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
                    }
                });
                req.on('error', () => resolve({ url, status: 0, ok: false }));
                req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT', ok: false }); });
                req.end();
            } catch {
                resolve({ url, status: 0, ok: false });
            }
        }

        attempt('HEAD');
    });
}

async function main() {
    const urls = [];

    for (const [city, places] of Object.entries(staticPlaces)) {
        for (const p of places) {
            const u = p.photos?.[0]?.url;
            if (u) urls.push({ label: `[Place] ${city}: ${p.name}`, url: u });
        }
    }
    for (const [city, hotels] of Object.entries(staticHotels)) {
        for (const h of hotels) {
            const u = h.photos?.[0]?.url;
            if (u) urls.push({ label: `[Hotel] ${city}: ${h.name}`, url: u });
        }
    }
    for (const hp of hiddenPlaces) {
        if (hp.image) urls.push({ label: `[Hidden] ${hp.name}`, url: hp.image });
    }

    console.log(`\n🔍 Checking ${urls.length} URLs...\n`);
    const results = await Promise.all(urls.map(({ label, url }) =>
        checkUrl(url).then(r => ({ ...r, label }))
    ));

    const broken = results.filter(r => !r.ok);
    const ok = results.filter(r => r.ok);

    console.log(`✅ PASS (${ok.length}):`);
    ok.forEach(r => console.log(`   ${r.status} ${r.label}`));

    console.log(`\n❌ FAIL (${broken.length}):`);
    broken.forEach(r => console.log(`   [${r.status}] ${r.label}\n         ${r.url}`));

    console.log(`\nSummary: ${ok.length} OK, ${broken.length} broken`);
}

main();
