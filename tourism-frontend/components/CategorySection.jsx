'use client';

/**
 * @file components/CategorySection.jsx
 * @description Category interest cards with Unsplash image backgrounds.
 */

import Link from 'next/link';

const CATEGORIES = [
    { label: 'Waterfalls', href: '/search?city=Cherrapunji', image: 'https://images.unsplash.com/photo-1444290679983-dd3aabf671ec?w=600&q=80' },
    { label: 'Caves', href: '/search?city=Meghalaya', image: 'https://images.unsplash.com/photo-1517239320384-e08ad2c24a3e?w=600&q=80' },
    { label: 'Hill Stations', href: '/search?city=Shimla', image: 'https://images.unsplash.com/photo-1742107939655-4f8af7484dfa?w=600&q=80' },
    { label: 'Temples', href: '/search?city=Varanasi', image: 'https://images.unsplash.com/photo-1713922622737-8aadb956c0f0?w=600&q=80' },
    { label: 'Wildlife', href: '/search?city=Ranthambore', image: 'https://images.unsplash.com/photo-1524129426126-1b85d8c74fd2?w=600&q=80' },
    { label: 'Beaches', href: '/search?city=Goa', image: 'https://images.unsplash.com/photo-1753618282728-f05ecfc5c9d6?w=600&q=80' },
    { label: 'Heritage', href: '/search?city=Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80' },
    { label: 'Backwaters', href: '/search?city=Kerala', image: 'https://images.unsplash.com/photo-1593417034675-3ed7eda1bee9?w=600&q=80' },
];

export default function CategorySection() {
    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <div className="section-label">Browse by Interest</div>
                    <h2 className="section-title">Explore by Category</h2>
                    <p className="section-subtitle">Find your perfect type of Indian adventure</p>
                </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                {CATEGORIES.map((cat) => (
                    <Link key={cat.label} href={cat.href} style={{ textDecoration: 'none' }}>
                        <div
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                height: '140px',
                                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%), url(${cat.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                cursor: 'pointer',
                                transition: 'var(--transition-bounce)',
                                boxShadow: 'var(--shadow-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                            }}
                        >
                            <span style={{
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                color: '#fff',
                                fontFamily: "'Playfair Display', serif",
                                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                letterSpacing: '0.5px',
                            }}>{cat.label}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
