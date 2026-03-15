'use client';

/**
 * @file app/explore/page.jsx
 * @description Explore by Cities page — Stunning city tile grid with hero header,
 * animated cards, and search/filter. Fetches cities from backend API.
 */

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MapPin, Search, Compass, ArrowRight, Sparkles, Globe, TrendingUp } from 'lucide-react';
import { getCities } from '../../services/api';

/* ── Fisher–Yates shuffle ─────────────────────────────────────────────── */
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/* ── Fallback images for cities without photos ─────────────────────── */
const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80',
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&q=80',
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
];

/* ── Stats data ────────────────────────────────────────────────────── */
const STATS = [
    { icon: <Globe size={20} />, label: 'States Covered', value: '28+' },
    { icon: <MapPin size={20} />, label: 'Destinations', value: '500+' },
    { icon: <Sparkles size={20} />, label: 'Hidden Gems', value: '50+' },
    { icon: <TrendingUp size={20} />, label: 'Monthly Visitors', value: '10K+' },
];

export default function ExplorePage() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [hoveredCity, setHoveredCity] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await getCities();
                if (res?.data) {
                    setCities(shuffle(res.data));
                }
            } catch (e) {
                setError(e.message || 'Failed to load cities');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filteredCities = useMemo(() => {
        if (!searchQuery.trim()) return cities;
        const q = searchQuery.toLowerCase();
        return cities.filter(
            (c) =>
                c.name?.toLowerCase().includes(q) ||
                c.state?.toLowerCase().includes(q)
        );
    }, [cities, searchQuery]);

    return (
        <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

            {/* ════════════════════════════════════════════════════════════════
                HERO SECTION
            ════════════════════════════════════════════════════════════════ */}
            <section style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '100px 0 60px',
                background: 'var(--gradient-hero)',
            }}>
                {/* Decorative blobs */}
                <div className="blob" style={{
                    width: '400px', height: '400px',
                    background: 'rgba(155,107,75,0.12)',
                    top: '-80px', right: '-100px',
                    animationDelay: '0s',
                }} />
                <div className="blob" style={{
                    width: '300px', height: '300px',
                    background: 'rgba(122,158,126,0.12)',
                    bottom: '-60px', left: '-80px',
                    animationDelay: '4s',
                }} />
                <div className="blob" style={{
                    width: '200px', height: '200px',
                    background: 'rgba(212,149,106,0.10)',
                    top: '30%', left: '60%',
                    animationDelay: '8s',
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    {/* Label */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <span className="section-label">
                            <Compass size={14} />
                            Explore India
                        </span>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        textAlign: 'center',
                        color: 'var(--color-text)',
                        marginBottom: '16px',
                        lineHeight: 1.15,
                    }}>
                        Explore by{' '}
                        <span style={{
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Cities
                        </span>
                    </h1>

                    <p style={{
                        textAlign: 'center',
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto 36px',
                        lineHeight: 1.7,
                    }}>
                        Discover incredible destinations across India. From bustling metros to serene hill towns,
                        find your next adventure.
                    </p>

                    {/* Search Bar */}
                    <div style={{
                        maxWidth: '560px',
                        margin: '0 auto 40px',
                        position: 'relative',
                    }}>
                        <Search size={18} style={{
                            position: 'absolute',
                            left: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)',
                            pointerEvents: 'none',
                        }} />
                        <input
                            id="explore-search"
                            type="text"
                            placeholder="Search cities or states..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '18px 24px 18px 52px',
                                borderRadius: 'var(--radius-full)',
                                border: '2px solid rgba(155,107,75,0.15)',
                                background: 'var(--color-surface)',
                                color: 'var(--color-text)',
                                fontSize: '1rem',
                                fontFamily: "'Inter', sans-serif",
                                outline: 'none',
                                transition: 'var(--transition-base)',
                                boxShadow: 'var(--shadow-md)',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--color-primary)';
                                e.target.style.boxShadow = '0 0 0 4px rgba(155,107,75,0.12)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(155,107,75,0.15)';
                                e.target.style.boxShadow = 'var(--shadow-md)';
                            }}
                        />
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}>
                        {STATS.map((stat) => (
                            <div key={stat.label} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '12px 24px',
                                borderRadius: 'var(--radius-full)',
                                background: 'rgba(255,255,255,0.7)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(155,107,75,0.1)',
                                boxShadow: 'var(--shadow-sm)',
                            }}>
                                <div style={{ color: 'var(--color-primary)' }}>{stat.icon}</div>
                                <div>
                                    <div style={{
                                        fontWeight: 800,
                                        fontSize: '1.1rem',
                                        color: 'var(--color-text)',
                                        lineHeight: 1.2,
                                    }}>{stat.value}</div>
                                    <div style={{
                                        fontSize: '0.72rem',
                                        color: 'var(--color-text-muted)',
                                        fontWeight: 600,
                                    }}>{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════
                CITIES GRID
            ════════════════════════════════════════════════════════════════ */}
            <section className="container" style={{ padding: '60px 24px 100px' }}>

                {/* Count label */}
                {!loading && !error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '32px',
                        flexWrap: 'wrap',
                        gap: '12px',
                    }}>
                        <p style={{
                            fontSize: '0.92rem',
                            color: 'var(--color-text-secondary)',
                            fontWeight: 600,
                        }}>
                            Showing <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>
                                {filteredCities.length}
                            </span> destinations
                            {searchQuery && (
                                <span> for &ldquo;<em>{searchQuery}</em>&rdquo;</span>
                            )}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: 'var(--radius-full)',
                                    border: '1.5px solid var(--color-border)',
                                    background: 'transparent',
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'var(--transition-base)',
                                }}
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px',
                    }}>
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="skeleton" style={{
                                height: i % 3 === 0 ? '340px' : i % 3 === 1 ? '280px' : '310px',
                                borderRadius: 'var(--radius-lg)',
                            }} />
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="error-banner" style={{ maxWidth: '600px', margin: '60px auto' }}>
                        <MapPin size={20} color="#DC2626" />
                        <div>
                            <p style={{ fontWeight: 700, color: '#991B1B', marginBottom: '4px' }}>
                                Could not load cities
                            </p>
                            <p style={{ fontSize: '0.88rem', color: '#DC2626' }}>{error}</p>
                        </div>
                    </div>
                )}

                {/* City Tiles — Masonry-style dynamic grid */}
                {!loading && !error && filteredCities.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '24px',
                        gridAutoRows: '10px',
                    }}>
                        {filteredCities.map((city, i) => {
                            // Varied heights for visual interest
                            const heightVariants = [28, 24, 32, 26, 30, 22, 34, 28];
                            const spanRows = heightVariants[i % heightVariants.length];
                            const isHovered = hoveredCity === city.name;
                            const fallbackImg = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];

                            return (
                                <Link
                                    key={city.name}
                                    href={`/search?city=${encodeURIComponent(city.name)}`}
                                    style={{
                                        gridRowEnd: `span ${spanRows}`,
                                        position: 'relative',
                                        borderRadius: 'var(--radius-lg)',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow-md)',
                                        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        animation: `fadeInUp 0.5s ease ${i * 0.04}s both`,
                                    }}
                                    onMouseEnter={() => setHoveredCity(city.name)}
                                    onMouseLeave={() => setHoveredCity(null)}
                                >
                                    {/* Background image */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundImage: `url(${city.image || fallbackImg})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        transition: 'transform 0.6s ease',
                                        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                                    }} />

                                    {/* Gradient overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: isHovered
                                            ? 'linear-gradient(to top, rgba(45,27,14,0.85) 0%, rgba(45,27,14,0.3) 40%, transparent 70%)'
                                            : 'linear-gradient(to top, rgba(45,27,14,0.75) 0%, rgba(45,27,14,0.15) 50%, transparent 70%)',
                                        transition: 'background 0.4s ease',
                                    }} />

                                    {/* Place count badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                        padding: '6px 14px',
                                        borderRadius: 'var(--radius-full)',
                                        background: 'rgba(255,255,255,0.2)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        color: '#fff',
                                        fontSize: '0.72rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}>
                                        <MapPin size={10} />
                                        {city.placeCount} places
                                    </div>

                                    {/* Content */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '24px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                    }}>
                                        <h3 style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '1.4rem',
                                            fontWeight: 800,
                                            color: '#fff',
                                            lineHeight: 1.2,
                                            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                        }}>
                                            {city.name}
                                        </h3>
                                        {city.state && (
                                            <p style={{
                                                fontSize: '0.82rem',
                                                color: 'rgba(255,255,255,0.8)',
                                                fontWeight: 500,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}>
                                                <MapPin size={11} />
                                                {city.state}
                                            </p>
                                        )}

                                        {/* Explore button on hover */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            marginTop: '8px',
                                            opacity: isHovered ? 1 : 0,
                                            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
                                            transition: 'all 0.3s ease',
                                        }}>
                                            <span style={{
                                                padding: '7px 18px',
                                                borderRadius: 'var(--radius-full)',
                                                background: 'rgba(255,255,255,0.2)',
                                                backdropFilter: 'blur(8px)',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                color: '#fff',
                                                fontSize: '0.78rem',
                                                fontWeight: 700,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}>
                                                Explore
                                                <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* No results */}
                {!loading && !error && filteredCities.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1.5px dashed var(--color-border)',
                        maxWidth: '500px',
                        margin: '0 auto',
                    }}>
                        <Search size={40} color="var(--color-primary)" style={{ marginBottom: '16px' }} />
                        <h3 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.4rem',
                            color: 'var(--color-text)',
                            marginBottom: '8px',
                        }}>
                            No cities found
                        </h3>
                        <p style={{
                            color: 'var(--color-text-muted)',
                            fontSize: '0.9rem',
                            marginBottom: '20px',
                        }}>
                            No results for &ldquo;{searchQuery}&rdquo;. Try a different search term.
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="btn btn-primary"
                        >
                            Show all cities
                        </button>
                    </div>
                )}
            </section>

            {/* ════════════════════════════════════════════════════════════════
                INLINE STYLES / CSS
            ════════════════════════════════════════════════════════════════ */}
            <style jsx>{`
                @media (max-width: 768px) {
                    section > div[style*="grid-template-columns"] {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 480px) {
                    section > div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
