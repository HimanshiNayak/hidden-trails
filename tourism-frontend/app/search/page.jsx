'use client';

/**
 * @file app/search/page.jsx
 * @description Search Results page — warm creamy aesthetic.
 * Tabs: Places | Hotels | Hidden Gems. Fully works without API keys via static fallback.
 */

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, MapPin, Zap, AlertCircle, Search, Building2, Gem } from 'lucide-react';
import PlaceCard from '../../components/PlaceCard';
import HotelCard from '../../components/HotelCard';
import SearchBar from '../../components/SearchBar';
import { searchByCity } from '../../services/api';

function SearchResults() {
    const params = useSearchParams();
    const router = useRouter();
    const city = params.get('city') || '';

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('places');

    useEffect(() => {
        if (!city) return;
        const load = async () => {
            setLoading(true);
            setError(null);
            setResults(null);
            try {
                const res = await searchByCity(city);
                if (res?.data) setResults(res.data);
                else setError('No results returned from the server.');
            } catch (e) {
                setError(e.message || 'Could not connect to the server. Make sure the backend is running.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [city]);

    const places = results?.places || [];
    const hotels = results?.hotels || [];
    // Normalize hidden gems: the API returns flat lat/lng/city/image fields,
    // but PlaceCard expects { location: { lat, lng }, photos: [{ url }], city }
    const hidden = (results?.hiddenPlaces || []).map((g) => ({
        ...g,
        location: { lat: g.lat, lng: g.lng },
        photos: g.image ? [{ url: g.image }] : (g.photos || []),
        city: g.city || g.nearestCity || '',
        isHidden: true,
    }));
    const fromCache = results?.fromCache;

    // ── No city entered ──
    if (!city) {
        return (
            <div style={{ paddingTop: '120px', textAlign: 'center', padding: '120px 24px' }}>
                <div style={{ marginBottom: '16px' }}><Search size={40} color="var(--color-primary)" /></div>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--color-text)', marginBottom: '12px' }}>Find Your Destination</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Search any Indian city to discover places, hotels, and hidden gems.</p>
                <SearchBar />
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh', paddingBottom: '80px' }}>

            {/* ── Search header ── */}
            <div style={{
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
                padding: '32px 0 0',
                boxShadow: 'var(--shadow-sm)',
            }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <MapPin size={18} color="var(--color-primary)" />
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--color-text)' }}>
                            Exploring <span style={{ color: 'var(--color-primary)' }}>{city}</span>
                        </h1>
                        {fromCache && (
                            <span className="cache-badge"><Zap size={11} /> cached</span>
                        )}
                    </div>

                    {/* Results summary */}
                    {results && !loading && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                            Found{' '}
                            <strong style={{ color: 'var(--color-primary)' }}>{places.length} places</strong>,{' '}
                            <strong style={{ color: 'var(--color-secondary-dark)' }}>{hotels.length} hotels</strong>, and{' '}
                            <strong style={{ color: 'var(--color-accent)' }}>{hidden.length} hidden gems</strong>
                        </p>
                    )}

                    {/* Tabs */}
                    <div className="tabs">
                        {[
                            { key: 'places', label: 'Places', icon: <MapPin size={14} />, count: places.length },
                            { key: 'hotels', label: 'Hotels', icon: <Building2 size={14} />, count: hotels.length },
                            { key: 'hidden', label: 'Hidden Gems', icon: <Gem size={14} />, count: hidden.length },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.icon}
                                {tab.label}
                                {!loading && results && (
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: '20px', height: '20px', borderRadius: '50%',
                                        background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : 'rgba(155,107,75,0.12)',
                                        fontSize: '0.72rem', fontWeight: 700,
                                        color: activeTab === tab.key ? '#fff' : 'var(--color-primary)',
                                    }}>{tab.count}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="container" style={{ paddingTop: '40px' }}>

                {/* Loading */}
                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: '16px' }}>
                        <div className="spinner" />
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Searching {city}…</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="error-banner">
                        <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0 }} />
                        <div>
                            <p style={{ fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>Couldn't load results</p>
                            <p style={{ fontSize: '0.88rem', color: '#DC2626' }}>{error}</p>
                        </div>
                    </div>
                )}

                {/* Results */}
                {results && !loading && (
                    <>
                        {/* Places tab */}
                        {activeTab === 'places' && (
                            places.length > 0 ? (
                                <div className="grid-3">
                                    {places.map((p, i) => <PlaceCard key={i} place={p} />)}
                                </div>
                            ) : (
                                <EmptyState icon={<MapPin size={40} color="var(--color-primary)" />} label="No places found" hint={`Try searching a major city like "Jaipur" or "Goa"`} />
                            )
                        )}

                        {/* Hotels tab */}
                        {activeTab === 'hotels' && (
                            hotels.length > 0 ? (
                                <div className="grid-3">
                                    {hotels.map((h, i) => <HotelCard key={i} hotel={h} />)}
                                </div>
                            ) : (
                                <EmptyState icon={<Building2 size={40} color="var(--color-primary)" />} label="No hotels found" hint="Hotels are available for Jaipur, Delhi, Goa, Mumbai, Kerala, Agra, Varanasi, Shimla" />
                            )
                        )}

                        {/* Hidden Gems tab */}
                        {activeTab === 'hidden' && (
                            hidden.length > 0 ? (
                                <div className="grid-3">
                                    {hidden.map((g, i) => <PlaceCard key={i} place={g} />)}
                                </div>
                            ) : (
                                <EmptyState icon={<Gem size={40} color="var(--color-primary)" />} label="No hidden gems found" hint="Run `npm run seed` in the backend to populate hidden gems" />
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function EmptyState({ icon, label, hint }) {
    return (
        <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px dashed var(--color-border)',
        }}>
            <div style={{ marginBottom: '16px' }}>{icon}</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: 'var(--color-text)', marginBottom: '8px' }}>{label}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>{hint}</p>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="spinner" />
            </div>
        }>
            <SearchResults />
        </Suspense>
    );
}
