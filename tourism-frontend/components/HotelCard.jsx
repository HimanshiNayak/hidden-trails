'use client';

/**
 * @file components/HotelCard.jsx
 * @description Hotel card — warm creamy aesthetic. No Wikipedia fallback.
 */

import { useState, useEffect } from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import { getStars } from '../utils/helpers';

const TYPE_COLORS = {
    hotel: { bg: 'rgba(155,107,75,0.12)', text: '#7A5038' },
    resort: { bg: 'rgba(122,158,126,0.15)', text: '#476B4A' },
    homestay: { bg: 'rgba(212,149,106,0.15)', text: '#9B4E20' },
    guest_house: { bg: 'rgba(100,120,150,0.12)', text: '#1E3A5F' },
};

export default function HotelCard({ hotel }) {
    const [imgSrc, setImgSrc] = useState(null);
    const [imgFailed, setImgFailed] = useState(false);

    useEffect(() => {
        if (!hotel) return;
        setImgFailed(false);
        const provided = hotel?.photos?.[0]?.url || hotel?.image;
        setImgSrc(provided || null);
    }, [hotel?.name, hotel?.city]);

    const handleImgError = () => {
        setImgFailed(true);
        setImgSrc(null);
    };

    if (!hotel) return null;

    const { filled, empty } = getStars(hotel.rating);
    const typeStyle = TYPE_COLORS[hotel.type] || TYPE_COLORS.hotel;
    const showImage = !!imgSrc && !imgFailed;

    return (
        <article className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* -- Image -- */}
            <div style={{ position: 'relative', height: '200px', overflow: 'hidden', flexShrink: 0, background: '#F5EFE6' }}>

                {/* Gradient fallback */}
                {!showImage && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, #EDE0CC, #C49A7A)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', textTransform: 'capitalize', letterSpacing: '0.05em' }}>
                            {(hotel.type || 'hotel').replace('_', ' ')}
                        </span>
                    </div>
                )}

                {showImage && (
                    <img
                        src={imgSrc}
                        alt={hotel.name}
                        onError={handleImgError}
                        className="hotel-img"
                        style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.45s ease',
                        }}
                    />
                )}

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', background: 'linear-gradient(to top, rgba(45,27,14,0.5), transparent)', zIndex: 1 }} />

                {/* Type badge */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
                    <span style={{
                        padding: '4px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                        textTransform: 'capitalize', background: typeStyle.bg, color: typeStyle.text,
                    }}>
                        {hotel.type?.replace('_', ' ') || 'Hotel'}
                    </span>
                </div>

                {hotel.openNow === true && (
                    <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                            background: 'rgba(16,185,129,0.85)', color: '#fff',
                        }}>
                            <Clock size={10} /> Open
                        </span>
                    </div>
                )}
            </div>

            {/* -- Body -- */}
            <div className="card-body">
                <h3 className="card-title">{hotel.name}</h3>

                {hotel.rating && (
                    <div className="rating">
                        <div className="rating-stars">
                            {[...Array(filled)].map((_, i) => <Star key={`f${i}`} size={12} fill="#D97706" color="#D97706" />)}
                            {[...Array(empty)].map((_, i) => <Star key={`e${i}`} size={12} fill="none" color="#D4C4B8" />)}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>{hotel.rating.toFixed(1)}</span>
                        {hotel.totalRatings > 0 && (
                            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>({hotel.totalRatings.toLocaleString()})</span>
                        )}
                    </div>
                )}

                {hotel.address && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'flex-start', gap: '4px', marginTop: '4px' }}>
                        <MapPin size={11} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        {hotel.address.length > 70 ? hotel.address.slice(0, 70) + '...' : hotel.address}
                    </p>
                )}
            </div>

            <style jsx>{`
        article:hover .hotel-img { transform: scale(1.06); }
      `}</style>
        </article>
    );
}
