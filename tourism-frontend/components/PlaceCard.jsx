'use client';

/**
 * @file components/PlaceCard.jsx
 * @description Card for tourist places.
 * Image priority: backend-provided photo → gradient fallback.
 * No Wikipedia API fallback (it returns wrong/unrelated images).
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { formatCategory, getCategoryBadgeClass, getStars, truncate } from '../utils/helpers';

// Warm earthy category gradients for cases where no image loads
const CATEGORY_GRADIENTS = {
    nature: 'linear-gradient(135deg, #7A9E7E, #5C7A5F)',
    cultural: 'linear-gradient(135deg, #C49A7A, #9B6B4B)',
    historical: 'linear-gradient(135deg, #9B6B4B, #7A5038)',
    waterfall: 'linear-gradient(135deg, #0EA5E9, #0369A1)',
    cave: 'linear-gradient(135deg, #6B4226, #4B3621)',
    beach: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    eco_tourism: 'linear-gradient(135deg, #7A9E7E, #476B4A)',
    heritage: 'linear-gradient(135deg, #D97706, #B45309)',
    hill_station: 'linear-gradient(135deg, #059669, #047857)',
    tourist_attraction: 'linear-gradient(135deg, #D4956A, #9B6B4B)',
    monument: 'linear-gradient(135deg, #C49A7A, #7A5038)',
};

export default function PlaceCard({ place, link }) {
    const [imgSrc, setImgSrc] = useState(null);
    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
        if (!place) return;
        setImgFailed(false);
        const provided = place?.photos?.[0]?.url || place?.image;
        setImgSrc(provided || null);
    }, [place?.name, place?.city]);

    const handleImgError = () => {
        setImgFailed(true);
        setImgSrc(null);
    };

    if (!place) return null;

    const gradient = CATEGORY_GRADIENTS[place.category] || CATEGORY_GRADIENTS.tourist_attraction;
    const { filled, empty } = getStars(place.rating);
    const placeImage = place?.photos?.[0]?.url || place?.image || '';
    const destination = link || `/destination/${encodeURIComponent(place.name)}?lat=${place.location?.lat}&lng=${place.location?.lng}&city=${encodeURIComponent(place.city || '')}${placeImage ? `&img=${encodeURIComponent(placeImage)}` : ''}`;

    const showImage = !!imgSrc && !imgFailed;

    return (
        <Link href={destination} style={{ display: 'block', textDecoration: 'none', height: '100%' }}>
            <article className="card" style={{ height: '100%', cursor: 'pointer' }}>

                {/* -- Image -- */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden', flexShrink: 0, background: '#F5EFE6' }}>

                    {/* Gradient fallback (shows while loading OR if image failed) */}
                    {!showImage && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: gradient,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'opacity 0.3s',
                        }}>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                {formatCategory(place.category)}
                            </span>
                        </div>
                    )}

                    {/* Actual image */}
                    {showImage && (
                        <img
                            src={imgSrc}
                            alt={place.name}
                            onError={handleImgError}
                            className="place-img"
                            style={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.45s ease',
                            }}
                        />
                    )}

                    {/* Bottom gradient overlay */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
                        background: 'linear-gradient(to top, rgba(45,27,14,0.55) 0%, transparent 100%)',
                        zIndex: 1,
                    }} />

                    {/* Category badge */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                        <span className={getCategoryBadgeClass(place.category)}>{formatCategory(place.category)}</span>
                    </div>
                </div>

                {/* -- Body -- */}
                <div className="card-body">
                    <h3 className="card-title">{place.name}</h3>

                    {place.rating && (
                        <div className="rating">
                            <div className="rating-stars">
                                {[...Array(filled)].map((_, i) => <Star key={`f${i}`} size={12} fill="#D97706" color="#D97706" />)}
                                {[...Array(empty)].map((_, i) => <Star key={`e${i}`} size={12} fill="none" color="#D4C4B8" />)}
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{place.rating.toFixed(1)}</span>
                            {place.totalRatings > 0 && (
                                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>({place.totalRatings.toLocaleString()})</span>
                            )}
                        </div>
                    )}

                    {place.address && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '4px' }}>
                            <MapPin size={11} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            {truncate(place.address, 80)}
                        </p>
                    )}
                </div>
            </article>

            <style jsx>{`
        article:hover .place-img { transform: scale(1.06); }
      `}</style>
        </Link>
    );
}
