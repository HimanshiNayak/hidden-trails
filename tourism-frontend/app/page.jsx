'use client';

/**
 * @file app/page.jsx
 * @description Homepage — warm creamy Pinterest-style travel aesthetic.
 * Hero, SearchBar, stats bar, quick city links, Hidden Gems, Categories, Popular Destinations.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star, TrendingUp, Eye, Globe, Heart } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import HiddenGemsSection from '../components/HiddenGemsSection';
import CategorySection from '../components/CategorySection';
import { searchByCity } from '../services/api';
import { getPlacePhoto, formatCategory, getStars } from '../utils/helpers';

// Popular cities for quick-link chips
const POPULAR_CITIES = [
    { name: 'Jaipur' },
    { name: 'Goa' },
    { name: 'Kerala' },
    { name: 'Shimla' },
    { name: 'Agra' },
    { name: 'Mumbai' },
    { name: 'Delhi' },
    { name: 'Varanasi' },
];

const STATS = [
    { icon: <Globe size={20} />, value: '500+', label: 'Destinations' },
    { icon: <Eye size={20} />, value: '50+', label: 'Hidden Gems' },
    { icon: <MapPin size={20} />, value: '25+', label: 'States Covered' },
    { icon: <Heart size={20} />, value: '1M+', label: 'Happy Travelers' },
];

export default function HomePage() {
    const [popularPlaces, setPopularPlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(true);

    useEffect(() => {
        const loadPopular = async () => {
            try {
                const res = await searchByCity('Jaipur');
                if (res?.data?.places) {
                    setPopularPlaces(res.data.places.slice(0, 8));
                }
            } catch (e) {
                console.warn('[Home] Could not load popular places:', e.message);
            } finally {
                setLoadingPlaces(false);
            }
        };
        loadPopular();
    }, []);

    return (
        <main style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

            {/* ── Hero with photo collage background ─────────────────────────── */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                paddingTop: 'var(--nav-height)',
                background: '#1a1207',
            }}>

                {/* Photo collage grid behind everything */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gridTemplateRows: 'repeat(3, 1fr)',
                    gap: '4px',
                    opacity: 0.45,
                }}>
                    {[
                        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=70',  /* Taj Mahal */
                        'https://images.unsplash.com/photo-1524129426126-1b85d8c74fd2?w=500&q=70',  /* Tiger */
                        'https://images.unsplash.com/photo-1742107939655-4f8af7484dfa?w=500&q=70',  /* Misty hills */
                        'https://images.unsplash.com/photo-1593417034675-3ed7eda1bee9?w=500&q=70',  /* Kerala backwaters */
                        'https://images.unsplash.com/photo-1713922622737-8aadb956c0f0?w=500&q=70',  /* Ganga aarti */
                        'https://images.unsplash.com/photo-1444290679983-dd3aabf671ec?w=500&q=70',  /* Waterfall */
                        'https://images.unsplash.com/photo-1517239320384-e08ad2c24a3e?w=500&q=70',  /* Cave */
                        'https://images.unsplash.com/photo-1753618282728-f05ecfc5c9d6?w=500&q=70',  /* Beach aerial */
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg/960px-Wide_angle_of_Galigopuram_of_Virupaksha_Temple%2C_Hampi_%2804%29_%28cropped%29.jpg',  /* Hampi */
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Rani_ki_vav_02.jpg/960px-Rani_ki_vav_02.jpg',  /* Rani ki Vav */
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Breathtaking_beauty_of_Dzukou_Valley_in_Manipur-Nagaland_border_%28edit%29.jpg/800px-Breathtaking_beauty_of_Dzukou_Valley_in_Manipur-Nagaland_border_%28edit%29.jpg',  /* Dzukou Valley */
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Tso_Moriri%2C_Ladakh_%2834855616204%29.jpg/960px-Tso_Moriri%2C_Ladakh_%2834855616204%29.jpg',  /* Tso Moriri */
                    ].map((src, i) => (
                        <div key={i} style={{ overflow: 'hidden' }}>
                            <img
                                src={src}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    ))}
                </div>

                {/* Dark gradient overlay for readability */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'radial-gradient(ellipse at center, rgba(26,18,7,0.55) 0%, rgba(26,18,7,0.85) 70%, rgba(26,18,7,0.95) 100%)',
                }} />

                {/* Warm color accent glow */}
                <div style={{
                    position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                    width: '600px', height: '600px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,149,106,0.15) 0%, transparent 70%)',
                    zIndex: 1, filter: 'blur(40px)',
                }} />

                {/* Hero Content */}
                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: '780px', animation: 'fadeInUp 0.8s ease both' }}>

                    {/* Label pill */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '8px 20px', borderRadius: '999px',
                            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.8)',
                        }}>Smart Tourism Platform for India</span>
                    </div>

                    {/* Headline */}
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '20px',
                        color: '#fff',
                    }}>
                        Discover India's<br />
                        <span style={{ color: '#D4956A' }}>Hidden Wonders</span>
                    </h1>

                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: '40px',
                        lineHeight: 1.7,
                        maxWidth: '520px',
                        margin: '0 auto 40px',
                    }}>
                        From snow-capped peaks to pristine beaches — explore 500+ destinations, 50+ hidden gems, and the best hotels across India.
                    </p>

                    {/* Search Bar */}
                    <SearchBar size="large" />

                    {/* Popular quick chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', alignSelf: 'center', fontWeight: 600 }}>Popular:</span>
                        {POPULAR_CITIES.slice(0, 5).map((c) => (
                            <Link key={c.name} href={`/search?city=${encodeURIComponent(c.name)}`}>
                                <span style={{
                                    display: 'inline-block', padding: '6px 16px', borderRadius: '999px',
                                    background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500,
                                    cursor: 'pointer', transition: 'all 0.2s ease',
                                }}
                                    onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.2)'; }}
                                    onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                                >{c.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stats bar at bottom */}
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    zIndex: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0',
                    background: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(16px)',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                }}>
                    {STATS.map((s, i) => (
                        <div key={i} style={{
                            flex: 1,
                            maxWidth: '220px',
                            padding: '20px 16px',
                            textAlign: 'center',
                            borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                        }}>
                            <div style={{ color: '#D4956A', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Hidden Gems ──────────────────────────────────────────────────── */}
            <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <HiddenGemsSection />
                </div>
            </section>

            {/* ── Categories ───────────────────────────────────────────────────── */}
            <section className="section" style={{ background: 'var(--color-bg)' }}>
                <div className="container">
                    <CategorySection />
                </div>
            </section>

            {/* ── Popular Destinations ─────────────────────────────────────────── */}
            <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <div className="section-label"><TrendingUp size={14} /> Popular Destinations</div>
                            <h2 className="section-title">Top Places in Jaipur</h2>
                            <p className="section-subtitle">Handpicked must-visit spots from the Pink City</p>
                        </div>
                        <Link href="/search?city=Jaipur">
                            <button className="btn btn-outline">Explore All →</button>
                        </Link>
                    </div>

                    {/* Grid */}
                    {loadingPlaces ? (
                        <div className="grid-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="card" style={{ height: '320px' }}>
                                    <div className="skeleton" style={{ height: '200px' }} />
                                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div className="skeleton" style={{ height: '16px', width: '70%' }} />
                                        <div className="skeleton" style={{ height: '12px', width: '50%' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : popularPlaces.length > 0 ? (
                        <div className="grid-4">
                            {popularPlaces.map((place, i) => (
                                <PopularPlaceCard key={i} place={place} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
                            <p>Start the backend to see popular places here.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── Explore Cities CTA ───────────────────────────────────────────── */}
            <section className="section" style={{ background: 'var(--color-bg)' }}>
                <div className="container">
                    <div style={{
                        background: 'var(--gradient-primary)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '60px 40px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)',
                    }}>
                        {/* Decorative blobs inside CTA */}
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: 200, height: 200, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: 160, height: 160, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ marginBottom: '16px' }}><Globe size={36} color="#fff" /></div>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: '#fff', fontWeight: 800, marginBottom: '14px' }}>
                                Ready to Explore India?
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7 }}>
                                Search any Indian city to find tourist places, hidden gems, and hotels — all in one place.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {POPULAR_CITIES.map((c) => (
                                    <Link key={c.name} href={`/search?city=${encodeURIComponent(c.name)}`}>
                                        <button style={{
                                            padding: '10px 22px',
                                            borderRadius: 'var(--radius-full)',
                                            background: 'rgba(255,255,255,0.18)',
                                            border: '1.5px solid rgba(255,255,255,0.35)',
                                            color: '#fff',
                                            fontSize: '0.88rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'var(--transition-bounce)',
                                            backdropFilter: 'blur(8px)',
                                        }}
                                            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.3)'; e.target.style.transform = 'translateY(-2px)'; }}
                                            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.18)'; e.target.style.transform = 'translateY(0)'; }}
                                        >
                                            {c.name}
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

/** Inline mini place card for popular destinations grid */
function PopularPlaceCard({ place }) {
    const [imgError, setImgError] = useState(false);
    const photo = !imgError ? getPlacePhoto(place) : null;
    const { filled, empty } = getStars(place.rating);
    const destination = `/destination/${encodeURIComponent(place.name)}?lat=${place.location?.lat}&lng=${place.location?.lng}&city=${encodeURIComponent(place.city || '')}`;

    return (
        <Link href={destination} style={{ display: 'block', textDecoration: 'none' }}>
            <article className="card" style={{ height: '100%' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                    {photo ? (
                        <img
                            src={photo}
                            alt={place.name}
                            onError={() => setImgError(true)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                            className="place-img"
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', background: 'var(--gradient-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{formatCategory(place.category)}</span>
                        </div>
                    )}
                    {/* Bottom gradient */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'var(--gradient-card)' }} />
                    {/* Badge */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                        <span className="badge badge-primary">{formatCategory(place.category)}</span>
                    </div>
                </div>

                <div className="card-body">
                    <h3 className="card-title">{place.name}</h3>
                    {place.rating && (
                        <div className="rating">
                            <div className="rating-stars">
                                {[...Array(filled)].map((_, i) => <Star key={`f${i}`} size={12} fill="#D97706" color="#D97706" />)}
                                {[...Array(empty)].map((_, i) => <Star key={`e${i}`} size={12} fill="none" color="#D4C4B8" />)}
                            </div>
                            <span style={{ fontWeight: 600 }}>{place.rating.toFixed(1)}</span>
                        </div>
                    )}
                    {place.address && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                            <MapPin size={11} style={{ flexShrink: 0, marginTop: '2px' }} />
                            {place.address.length > 70 ? place.address.slice(0, 70) + '…' : place.address}
                        </p>
                    )}
                </div>

                <style jsx>{`
          article:hover .place-img { transform: scale(1.06); }
        `}</style>
            </article>
        </Link>
    );
}
