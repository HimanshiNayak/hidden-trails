'use client';

/**
 * @file components/Footer.jsx
 * @description Footer with warm creamy aesthetic — 4-column grid layout.
 */

import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

const LINKS_EXPLORE = [
    { label: 'Beaches', href: '/search?city=Goa' },
    { label: 'Hill Stations', href: '/search?city=Shimla' },
    { label: 'Heritage Sites', href: '/search?city=Agra' },
    { label: 'Waterfalls', href: '/search?city=Cherrapunji' },
    { label: 'Backwaters', href: '/search?city=Kerala' },
];

const POPULAR_CITIES = [
    'Jaipur', 'Goa', 'Mumbai', 'Delhi', 'Kerala', 'Agra', 'Varanasi', 'Shimla',
];

export default function Footer() {
    return (
        <footer style={{
            background: '#2D1B0E',
            color: '#E8D5BE',
            paddingTop: '64px',
            paddingBottom: '0',
            marginTop: 'auto',
        }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', paddingBottom: '48px' }}>

                    {/* Brand column */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{
                                width: '36px', height: '36px',
                                background: 'var(--gradient-primary)',
                                borderRadius: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <MapPin size={16} color="#fff" />
                            </div>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 800, color: '#FAF7F2' }}>
                                Incredible<span style={{ color: 'var(--color-primary-light)' }}>Trails</span>
                            </span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: '#9C8577', lineHeight: 1.7, marginBottom: '20px' }}>
                            Your smart travel companion for discovering India's best destinations, hidden gems, and finest hotels. Start your incredible trail today.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                                { label: 'X', text: 'X' },
                                { label: 'FB', text: 'f' },
                                { label: 'IG', text: 'in' },
                            ].map((s, i) => (
                                <button key={i} style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    fontSize: '0.75rem', fontWeight: 700, color: '#9C8577',
                                    cursor: 'pointer', transition: 'var(--transition-base)',
                                }}
                                    onMouseEnter={e => e.target.style.background = 'rgba(155,107,75,0.35)'}
                                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
                                >{s.text}</button>
                            ))}
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#FAF7F2', marginBottom: '16px' }}>Explore</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {LINKS_EXPLORE.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} style={{ fontSize: '0.88rem', color: '#9C8577', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = 'var(--color-primary-light)'}
                                        onMouseLeave={e => e.target.style.color = '#9C8577'}
                                    >{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Cities */}
                    <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#FAF7F2', marginBottom: '16px' }}>Popular Cities</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {POPULAR_CITIES.map((city) => (
                                <li key={city}>
                                    <Link href={`/search?city=${encodeURIComponent(city)}`}
                                        style={{ fontSize: '0.88rem', color: '#9C8577', textDecoration: 'none', transition: 'color 0.2s' }}
                                        onMouseEnter={e => e.target.style.color = 'var(--color-primary-light)'}
                                        onMouseLeave={e => e.target.style.color = '#9C8577'}
                                    >{city}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: '#FAF7F2', marginBottom: '16px' }}>Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { icon: <Mail size={14} />, text: 'hello@incredibletrails.in' },
                                { icon: <Phone size={14} />, text: '+91 98765 43210' },
                                { icon: <MapPin size={14} />, text: 'India' },
                            ].map(({ icon, text }, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#9C8577' }}>
                                    <span style={{ color: 'var(--color-primary-light)' }}>{icon}</span>
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    padding: '20px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                }}>
                    <p style={{ fontSize: '0.8rem', color: '#6B5744' }}>© 2026 Himanshi Nayak.</p>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
                            <span key={l} style={{ fontSize: '0.8rem', color: '#6B5744', cursor: 'pointer' }}>{l}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
