'use client';

/**
 * @file components/ImageGallery.jsx
 * @description Responsive photo gallery with lightbox / modal view.
 * Displays a grid of place images. Clicking any opens it in a full-screen modal.
 */

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Array<{url: string}>} props.photos - Array of photo objects.
 * @param {string} props.placeName - Place name for alt text.
 */
export default function ImageGallery({ photos = [], placeName = 'Place' }) {
    const [lightboxIndex, setLightboxIndex] = useState(null); // null = closed
    const [imgErrors, setImgErrors] = useState({});

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape') setLightboxIndex(null);
            if (e.key === 'ArrowRight' && lightboxIndex !== null) nextImage();
            if (e.key === 'ArrowLeft' && lightboxIndex !== null) prevImage();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [lightboxIndex]);

    // Prevent background scroll when lightbox is open
    useEffect(() => {
        if (lightboxIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [lightboxIndex]);

    const validPhotos = photos.filter((p) => p.url && !imgErrors[p.url]);

    if (validPhotos.length === 0) return null;

    const nextImage = () => setLightboxIndex((prev) => (prev + 1) % validPhotos.length);
    const prevImage = () => setLightboxIndex((prev) => (prev - 1 + validPhotos.length) % validPhotos.length);
    const handleImgError = (url) => setImgErrors((prev) => ({ ...prev, [url]: true }));

    return (
        <>
            {/* ── Gallery Grid ── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: validPhotos.length === 1 ? '1fr' : validPhotos.length === 2 ? '1fr 1fr' : '2fr 1fr 1fr',
                    gap: '8px',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    maxHeight: '480px',
                }}
            >
                {validPhotos.slice(0, 4).map((photo, index) => (
                    <div
                        key={photo.url}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            background: '#1a1a2e',
                            gridRow: index === 0 && validPhotos.length > 2 ? 'span 2' : 'auto',
                            minHeight: '180px',
                        }}
                        onClick={() => setLightboxIndex(index)}
                    >
                        <img
                            src={photo.url}
                            alt={`${placeName} photo ${index + 1}`}
                            onError={() => handleImgError(photo.url)}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.4s ease',
                                display: 'block',
                            }}
                            className="gallery-img"
                        />

                        {/* Hover overlay with zoom icon */}
                        <div
                            className="gallery-overlay"
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'rgba(13,13,26,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0,
                                transition: 'opacity 0.25s ease',
                            }}
                        >
                            <ZoomIn size={28} color="#fff" />
                        </div>

                        {/* "More photos" overlay on 4th image */}
                        {index === 3 && validPhotos.length > 4 && (
                            <div
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontFamily: 'var(--font-primary)',
                                    fontWeight: 700,
                                    fontSize: '1.3rem',
                                }}
                            >
                                +{validPhotos.length - 4} more
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Lightbox ── */}
            {lightboxIndex !== null && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.93)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onClick={() => setLightboxIndex(null)}
                >
                    {/* Close button */}
                    <button
                        onClick={() => setLightboxIndex(null)}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            cursor: 'pointer',
                            zIndex: 10000,
                        }}
                    >
                        <X size={20} />
                    </button>

                    {/* Prev button */}
                    {validPhotos.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            style={{
                                position: 'absolute',
                                left: '20px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            <ChevronLeft size={22} />
                        </button>
                    )}

                    {/* Main Image */}
                    <img
                        src={validPhotos[lightboxIndex]?.url}
                        alt={`${placeName} photo`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '85vh',
                            objectFit: 'contain',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: 'var(--shadow-lg)',
                        }}
                    />

                    {/* Next button */}
                    {validPhotos.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '44px',
                                height: '44px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            <ChevronRight size={22} />
                        </button>
                    )}

                    {/* Counter */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '24px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '0.85rem',
                            background: 'rgba(0,0,0,0.5)',
                            padding: '6px 16px',
                            borderRadius: 'var(--radius-full)',
                        }}
                    >
                        {lightboxIndex + 1} / {validPhotos.length}
                    </div>
                </div>
            )}

            <style jsx>{`
        .gallery-img:hover { transform: scale(1.06); }
        .gallery-overlay:hover, *:hover > .gallery-overlay { opacity: 1; }
      `}</style>
        </>
    );
}
