'use client';

/**
 * @file components/Navbar.jsx
 * @description Sticky navigation with warm creamy aesthetic.
 * Glass effect on scroll, logo, desktop nav, quick search, mobile menu.
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, MapPin } from 'lucide-react';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/#categories', label: 'Categories' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [quickSearch, setQuickSearch] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const router = useRouter();
    const inputRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleQuickSearch = (e) => {
        if (e.key === 'Enter' && quickSearch.trim().length >= 2) {
            router.push(`/search?city=${encodeURIComponent(quickSearch.trim())}`);
            setQuickSearch('');
        }
    };

    return (
        <>
            <nav
                className={`navbar ${scrolled ? 'scrolled' : ''}`}
                style={{
                    background: scrolled
                        ? 'rgba(250, 247, 242, 0.97)'
                        : 'rgba(250, 247, 242, 0.80)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: `1px solid ${scrolled ? 'rgba(155,107,75,0.18)' : 'rgba(155,107,75,0.08)'}`,
                    boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
                }}
            >
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '32px', width: '100%' }}>

                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, textDecoration: 'none' }}>
                        <div style={{
                            width: '38px', height: '38px',
                            background: 'var(--gradient-primary)',
                            borderRadius: '12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(155,107,75,0.3)',
                        }}>
                            <MapPin size={18} color="#fff" />
                        </div>
                        <span style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: 'var(--color-text)',
                        }}>
                            Incredible<span style={{ color: 'var(--color-primary)' }}>Trails</span>
                        </span>
                    </Link>

                    {/* Desktop nav links */}
                    <div style={{ display: 'flex', gap: '4px', flex: 1 }} className="hide-mobile">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} style={{
                                padding: '8px 16px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: 'var(--color-text-secondary)',
                                transition: 'var(--transition-base)',
                                textDecoration: 'none',
                            }}
                                onMouseEnter={e => { e.target.style.color = 'var(--color-primary)'; e.target.style.background = 'rgba(155,107,75,0.08)'; }}
                                onMouseLeave={e => { e.target.style.color = 'var(--color-text-secondary)'; e.target.style.background = 'transparent'; }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Quick search */}
                    <div style={{ position: 'relative', flexShrink: 0 }} className="hide-mobile">
                        <Search size={15} style={{
                            position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                            color: searchFocused ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            transition: 'color 0.2s',
                            pointerEvents: 'none',
                        }} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Quick search..."
                            value={quickSearch}
                            onChange={(e) => setQuickSearch(e.target.value)}
                            onKeyDown={handleQuickSearch}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            style={{
                                width: '220px',
                                padding: '9px 16px 9px 38px',
                                borderRadius: 'var(--radius-full)',
                                border: `1.5px solid ${searchFocused ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                background: searchFocused ? '#fff' : 'rgba(155,107,75,0.05)',
                                color: 'var(--color-text)',
                                fontSize: '0.85rem',
                                outline: 'none',
                                transition: 'var(--transition-base)',
                                fontFamily: 'Inter, sans-serif',
                            }}
                        />
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--color-text)', padding: '8px', display: 'none' }}
                        className="show-mobile"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div style={{
                    position: 'fixed', top: 'var(--nav-height)', left: 0, right: 0, zIndex: 999,
                    background: 'rgba(250,247,242,0.98)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid var(--color-border)',
                    padding: '20px 24px',
                    display: 'flex', flexDirection: 'column', gap: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    animation: 'fadeInUp 0.2s ease both',
                }}>
                    {NAV_LINKS.map((link) => (
                        <Link key={link.href} href={link.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: 'var(--color-text-secondary)',
                                background: 'transparent',
                                transition: 'var(--transition-base)',
                                textDecoration: 'none',
                                display: 'block',
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <input
                        type="text"
                        placeholder="Search a city..."
                        value={quickSearch}
                        onChange={(e) => setQuickSearch(e.target.value)}
                        onKeyDown={handleQuickSearch}
                        style={{
                            marginTop: '8px',
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-full)',
                            border: '1.5px solid var(--color-border)',
                            background: '#fff',
                            color: 'var(--color-text)',
                            fontSize: '0.9rem',
                            outline: 'none',
                            fontFamily: 'Inter, sans-serif',
                        }}
                    />
                </div>
            )}

            <style jsx global>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
        </>
    );
}
