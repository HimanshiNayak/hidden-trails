'use client';

/**
 * @file app/destination/[name]/page.jsx
 * @description Individual destination detail page.
 * Shows: banner image, photo gallery, description, map, and nearby hotels.
 *
 * URL: /destination/[name]?lat=XX&lng=XX&city=XX&isHidden=true
 *
 * For hidden places, data comes from URL params.
 * Coordinates are used to display map and fetch nearby hotels.
 */

import { useState, useEffect, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ImageGallery from '../../../components/ImageGallery';
import HotelCard from '../../../components/HotelCard';
import { getHotels, getPlaces } from '../../../services/api';
import { buildMapEmbedUrl, formatCategory, getCategoryBadgeClass, truncate } from '../../../utils/helpers';
import { ArrowLeft, MapPin, Clock, DollarSign, Lightbulb, Star, Navigation } from 'lucide-react';

function DestinationContent() {
    const params = useParams();
    const searchParams = useSearchParams();

    // Decode place name from URL
    const placeName = decodeURIComponent(params.name || '');
    const lat = parseFloat(searchParams.get('lat') || '20');
    const lng = parseFloat(searchParams.get('lng') || '78');
    const city = decodeURIComponent(searchParams.get('city') || placeName);
    const isHidden = searchParams.get('isHidden') === 'true';
    const heroImage = searchParams.get('img') || '';

    const [place, setPlace] = useState(null);
    const [hotels, setHotels] = useState([]);
    const [relatedPlaces, setRelatedPlaces] = useState([]);
    const [loadingHotels, setLoadingHotels] = useState(true);
    const [mainImgError, setMainImgError] = useState(false);
    const [heroImgLoaded, setHeroImgLoaded] = useState(false);
    const [heroImgFailed, setHeroImgFailed] = useState(false);

    // Load place details and nearby hotels
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch hotels for the city
                const hotelResponse = await getHotels(city);
                setHotels((hotelResponse.data || []).slice(0, 3));
            } catch (err) {
                console.error('[Destination] Failed to load hotels:', err.message);
            } finally {
                setLoadingHotels(false);
            }
        };
        loadData();
    }, [city]);

    // Preload hero image
    useEffect(() => {
        if (!heroImage) return;
        setHeroImgLoaded(false);
        setHeroImgFailed(false);
        const img = new Image();
        img.onload = () => setHeroImgLoaded(true);
        img.onerror = () => setHeroImgFailed(true);
        img.src = heroImage;
    }, [heroImage]);

    const mapUrl = buildMapEmbedUrl(lat, lng);

    // Build a fallback gradient background based on place name hash
    const gradients = [
        'linear-gradient(135deg, #1a1a3e 0%, #0f766e 100%)',
        'linear-gradient(135deg, #78350f 0%, #1a1a3e 100%)',
        'linear-gradient(135deg, #4c1d95 0%, #1e3a5f 100%)',
        'linear-gradient(135deg, #14532d 0%, #1e3a5f 100%)',
        'linear-gradient(135deg, #7f1d1d 0%, #1a1a3e 100%)',
    ];
    const gradientIndex = placeName.charCodeAt(0) % gradients.length;
    const showHeroImage = heroImage && heroImgLoaded && !heroImgFailed;

    return (
        <div style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
            {/* ── Banner / Hero ── */}
            <div
                style={{
                    position: 'relative',
                    height: 'clamp(300px, 50vh, 500px)',
                    overflow: 'hidden',
                    background: gradients[gradientIndex],
                }}
            >
                {/* Background image (if available) */}
                {showHeroImage && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${heroImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            zIndex: 1,
                        }}
                    />
                )}

                {/* Dark overlay — makes text readable over the image */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: showHeroImage
                            ? 'linear-gradient(to top, rgba(13,13,26,0.92) 0%, rgba(13,13,26,0.55) 40%, rgba(13,13,26,0.45) 100%)'
                            : 'linear-gradient(to top, rgba(13,13,26,0.95) 0%, rgba(13,13,26,0.3) 50%, rgba(13,13,26,0.5) 100%)',
                        zIndex: 2,
                    }}
                />

                {/* Content overlay */}
                <div
                    className="container"
                    style={{
                        position: 'absolute',
                        bottom: '32px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 3,
                        width: '100%',
                    }}
                >
                    <Link
                        href={city ? `/search?city=${encodeURIComponent(city)}` : '/'}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginBottom: '16px' }}
                    >
                        <ArrowLeft size={16} /> Back to {city || 'Search'}
                    </Link>

                    <h1
                        style={{
                            fontFamily: 'var(--font-primary)',
                            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            color: '#fff',
                            marginBottom: '12px',
                        }}
                    >
                        {placeName}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
                            <MapPin size={15} style={{ color: 'var(--color-primary)' }} />
                            {city}, India
                        </span>
                        {isHidden && (
                            <span className="badge" style={{ background: 'rgba(255,107,53,0.2)', color: 'var(--color-primary)', border: '1px solid rgba(255,107,53,0.35)' }}>
                                Hidden Gem
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 360px',
                        gap: '40px',
                        alignItems: 'start',
                    }}
                >
                    {/* ─── Left Column ─── */}
                    <div>
                        {/* About */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px' }}>
                                About {placeName}
                            </h2>
                            <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.8', fontSize: '0.95rem' }}>
                                {placeName} is a wonderful destination to explore in {city}, India.
                                Known for its rich history, culture, and natural beauty, it attracts visitors
                                from across the country and around the world. Whether you're interested in
                                history, architecture, nature, or local culture — this destination has something for everyone.
                            </p>
                        </section>

                        {/* Map Section */}
                        <section style={{ marginBottom: '40px' }}>
                            <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Navigation size={20} style={{ color: 'var(--color-primary)' }} /> Location
                            </h2>
                            <div
                                style={{
                                    borderRadius: 'var(--radius-lg)',
                                    overflow: 'hidden',
                                    border: '1px solid var(--color-border)',
                                    height: '320px',
                                }}
                            >
                                <iframe
                                    src={mapUrl}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    style={{ border: 0, display: 'block' }}
                                    allowFullScreen
                                    loading="lazy"
                                    title={`Map of ${placeName}`}
                                />
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                                Coordinates: {lat.toFixed(4)}, {lng.toFixed(4)}
                            </p>
                        </section>

                        {/* Nearby Hotels */}
                        <section>
                            <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>
                                Nearby Accommodation
                            </h2>
                            {loadingHotels ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} style={{ height: '280px', borderRadius: 'var(--radius-lg)' }} className="skeleton" />
                                    ))}
                                </div>
                            ) : hotels.length > 0 ? (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                                        {hotels.map((hotel, idx) => (
                                            <HotelCard key={hotel.externalId || idx} hotel={hotel} />
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        <Link href={`/search?city=${encodeURIComponent(city)}`} style={{ color: 'var(--color-primary)', fontSize: '0.875rem', fontWeight: 600 }}>
                                            View all hotels in {city} →
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                    No hotels found nearby. Try searching for hotels in {city}.
                                </p>
                            )}
                        </section>
                    </div>

                    {/* ─── Right Column — Info Card ─── */}
                    <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 20px)' }}>
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Header */}
                            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--color-border)' }}>
                                <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                                    Quick Info
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Essential details for your visit</p>
                            </div>

                            {/* Info items */}
                            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <InfoRow icon={<MapPin size={16} style={{ color: 'var(--color-primary)' }} />} label="Location" value={`${city}, India`} />
                                <InfoRow icon={<Clock size={16} style={{ color: '#f59e0b' }} />} label="Best Time" value="October to March" />
                                <InfoRow icon={<DollarSign size={16} style={{ color: '#22c55e' }} />} label="Entry Fee" value="Check locally" />
                                <InfoRow icon={<Star size={16} style={{ color: '#f59e0b' }} />} label="Category" value={isHidden ? 'Hidden Gem' : 'Tourist Attraction'} />
                            </div>

                            {/* CTA */}
                            <div style={{ padding: '0 20px 20px' }}>
                                <a
                                    href={`https://www.google.com/maps/search/${encodeURIComponent(placeName + ' ' + city)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                >
                                    <Navigation size={16} /> View on Google Maps
                                </a>
                            </div>
                        </div>

                        {/* Pro Tips */}
                        <div
                            style={{
                                marginTop: '20px',
                                padding: '18px 20px',
                                background: 'rgba(255,107,53,0.06)',
                                border: '1px solid rgba(255,107,53,0.15)',
                                borderRadius: 'var(--radius-lg)',
                            }}
                        >
                            <h4 style={{ fontFamily: 'var(--font-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Lightbulb size={16} style={{ color: '#f59e0b' }} /> Traveler Tips
                            </h4>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', paddingLeft: '8px', borderLeft: '2px solid var(--color-primary)' }}>
                                    Book accommodation in advance during peak season (Oct–Feb)
                                </li>
                                <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', paddingLeft: '8px', borderLeft: '2px solid var(--color-primary)' }}>
                                    Early morning visits avoid crowds and offer best photography
                                </li>
                                <li style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', paddingLeft: '8px', borderLeft: '2px solid var(--color-primary)' }}>
                                    Hire a local guide for deeper cultural context
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive sidebar → stacks below */}
            <style jsx>{`
        @media (max-width: 768px) {
          div[style*="1fr 360px"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: static !important; }
          div[style*="repeat(3,1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}

/** Small info row for the sidebar card */
function InfoRow({ icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ marginTop: '1px', flexShrink: 0 }}>{icon}</div>
            <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                    {label}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>{value}</span>
            </div>
        </div>
    );
}

export default function DestinationPage() {
    return (
        <Suspense fallback={
            <div style={{ paddingTop: 'calc(var(--nav-height) + 80px)', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
        }>
            <DestinationContent />
        </Suspense>
    );
}
