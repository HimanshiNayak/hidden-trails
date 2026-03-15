'use client';

/**
 * @file components/HiddenGemsSection.jsx
 * @description Horizontal carousel of hidden gems — warm creamy aesthetic.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gem, MapPin, ArrowRight } from 'lucide-react';
import { getHiddenPlaces } from '../services/api';
import { getPlacePhoto, truncate } from '../utils/helpers';

export default function HiddenGemsSection() {
    const [gems, setGems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getHiddenPlaces();
                const all = res?.data || [];
                // Random shuffle, pick 12
                const shuffled = all.sort(() => Math.random() - 0.5).slice(0, 12);
                setGems(shuffled);
            } catch (e) {
                setError('Could not load hidden gems. Make sure the backend is running.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <div className="section-label"><Gem size={14} /> Discover India</div>
                    <h2 className="section-title">Hidden Gems</h2>
                    <p className="section-subtitle">Off-the-beaten-path wonders you won't find in guidebooks</p>
                </div>
                <Link href="/search?city=Jaipur">
                    <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        See All <ArrowRight size={14} />
                    </button>
                </Link>
            </div>

            {/* Loading skeleton */}
            {loading && (
                <div className="scroll-x">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ width: '240px', height: '300px', flexShrink: 0, borderRadius: 'var(--radius-lg)' }} />
                    ))}
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="error-banner">
                    <p style={{ fontSize: '0.88rem', color: '#991B1B' }}>{error}</p>
                </div>
            )}

            {/* Carousel */}
            {!loading && !error && gems.length > 0 && (
                <div className="scroll-x" style={{ paddingBottom: '16px' }}>
                    {gems.map((gem, i) => (
                        <GemCard key={i} gem={gem} />
                    ))}
                </div>
            )}

            {!loading && !error && gems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>
                    <p>Run <code style={{ background: 'rgba(155,107,75,0.1)', padding: '2px 8px', borderRadius: '6px', color: 'var(--color-primary)' }}>npm run seed</code> in the backend to populate hidden gems.</p>
                </div>
            )}
        </div>
    );
}

function GemCard({ gem }) {
    const [imgSrc, setImgSrc] = useState(null);
    const [imgFailed, setImgFailed] = useState(false);
    const gemCity = gem.city || gem.nearestCity || '';
    const destination = `/destination/${encodeURIComponent(gem.name)}?lat=${gem.lat}&lng=${gem.lng}&city=${encodeURIComponent(gemCity)}&isHidden=true`;

    useEffect(() => {
        setImgFailed(false);
        const provided = gem?.photos?.[0]?.url || gem?.image;
        setImgSrc(provided || null);
    }, [gem?.name]);

    const handleImgError = () => {
        setImgFailed(true);
        setImgSrc(null);
    };

    const showImage = !!imgSrc && !imgFailed;

    return (
        <Link href={destination} style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div
                style={{
                    width: '240px',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid rgba(155,107,75,0.08)',
                    transition: 'var(--transition-bounce)',
                    cursor: 'pointer',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
            >
                {/* Image */}
                <div style={{ position: 'relative', height: '160px', overflow: 'hidden', background: '#F5EFE6' }}>
                    {!showImage && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(135deg, #D4956A, #9B6B4B)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}><span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Hidden Gem</span></div>
                    )}
                    {showImage && (
                        <img
                            src={imgSrc}
                            alt={gem.name}
                            onError={handleImgError}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        />
                    )}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(to top, rgba(45,27,14,0.5), transparent)', zIndex: 1 }} />
                </div>

                {/* Info */}
                <div style={{ padding: '16px' }}>
                    <h4 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '0.95rem', fontWeight: 700,
                        color: 'var(--color-text)', marginBottom: '6px',
                    }}>{gem.name}</h4>
                    {(gem.city || gem.nearestCity) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            <MapPin size={10} color="var(--color-primary)" />
                            {gem.city || gem.nearestCity}
                        </div>
                    )}
                    {gem.description && (
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                            {truncate(gem.description, 65)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}

