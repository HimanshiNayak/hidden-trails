'use client';

/**
 * @file components/SearchBar.jsx
 * @description Hero search bar with warm creamy styling and city suggestions.
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, MapPin } from 'lucide-react';

const CITY_SUGGESTIONS = [
    'Jaipur', 'Delhi', 'Goa', 'Mumbai', 'Kerala', 'Agra', 'Varanasi',
    'Shimla', 'Darjeeling', 'Udaipur', 'Rishikesh', 'Pushkar', 'Manali',
    'Ooty', 'Coorg', 'Mysore', 'Hampi', 'Pondicherry', 'Leh', 'Spiti',
];

export default function SearchBar({ size = 'default' }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggest, setShowSuggest] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);
    const wrapRef = useRef(null);
    const router = useRouter();

    const isLarge = size === 'large';

    // Filter suggestions from static list
    useEffect(() => {
        if (query.length < 1) { setSuggestions([]); setShowSuggest(false); return; }
        const filtered = CITY_SUGGESTIONS.filter((c) =>
            c.toLowerCase().startsWith(query.toLowerCase()) && c.toLowerCase() !== query.toLowerCase()
        ).slice(0, 6);
        setSuggestions(filtered);
        setShowSuggest(filtered.length > 0);
    }, [query]);

    // Click outside to close
    useEffect(() => {
        const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSuggest(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (city) => {
        const q = (city || query).trim();
        if (q.length < 2) { inputRef.current?.focus(); return; }
        setLoading(true);
        setShowSuggest(false);
        router.push(`/search?city=${encodeURIComponent(q)}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div ref={wrapRef} style={{ position: 'relative', width: '100%', maxWidth: isLarge ? '600px' : '420px', margin: '0 auto' }}>
            {/* Input row */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#fff',
                border: `2px solid ${focused ? 'var(--color-primary)' : 'rgba(155,107,75,0.2)'}`,
                borderRadius: 'var(--radius-full)',
                padding: isLarge ? '6px 6px 6px 22px' : '4px 4px 4px 18px',
                boxShadow: focused ? '0 0 0 4px rgba(155,107,75,0.12), var(--shadow-md)' : 'var(--shadow-md)',
                transition: 'var(--transition-base)',
            }}>
                <Search size={isLarge ? 20 : 16} color={focused ? 'var(--color-primary)' : 'var(--color-text-muted)'} style={{ flexShrink: 0, transition: 'color 0.2s' }} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Search a city — Jaipur, Goa, Kerala…"
                    style={{
                        flex: 1,
                        border: 'none',
                        background: 'transparent',
                        outline: 'none',
                        fontSize: isLarge ? '1.05rem' : '0.9rem',
                        color: 'var(--color-text)',
                        fontFamily: 'Inter, sans-serif',
                    }}
                />
                <button
                    onClick={() => handleSearch()}
                    disabled={loading}
                    style={{
                        padding: isLarge ? '12px 28px' : '10px 20px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--gradient-primary)',
                        color: '#fff',
                        border: 'none',
                        fontSize: isLarge ? '0.95rem' : '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'var(--transition-bounce)',
                        flexShrink: 0,
                        boxShadow: '0 4px 16px rgba(155,107,75,0.3)',
                        opacity: loading ? 0.7 : 1,
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    {loading
                        ? <><Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Searching…</>
                        : 'Explore'}
                </button>
            </div>

            {/* Suggestions dropdown */}
            {showSuggest && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    left: 0, right: 0,
                    background: '#fff',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                    overflow: 'hidden',
                    animation: 'fadeInUp 0.18s ease both',
                }}>
                    {suggestions.map((city) => (
                        <button
                            key={city}
                            onMouseDown={() => { setQuery(city); handleSearch(city); }}
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(155,107,75,0.07)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '0.9rem',
                                color: 'var(--color-text-secondary)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.15s',
                                fontFamily: 'Inter, sans-serif',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(155,107,75,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <MapPin size={14} color="var(--color-primary)" />
                            <span><strong style={{ color: 'var(--color-primary)' }}>{city.slice(0, query.length)}</strong>{city.slice(query.length)}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
