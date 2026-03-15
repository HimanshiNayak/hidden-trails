/**
 * @file app/layout.jsx
 * @description Root layout for the Next.js App Router.
 * Applies global CSS, fonts, and wraps all pages with Navbar and Footer.
 */

import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Incredible Trails — Discover India',
    description:
        'Discover amazing destinations, hidden gems, and the best hotels across India. Plan your perfect trip with Incredible Trails.',
    keywords: 'India tourism, travel India, hidden places India, tourist attractions India, hotels India, incredible trails',
    openGraph: {
        title: 'Incredible Trails — Discover India',
        description: 'Discover amazing destinations across India with Incredible Trails.',
        type: 'website',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#FAF7F2" />
            </head>
            <body>
                {/* Global Navigation */}
                <Navbar />

                {/* Page Content */}
                <main>{children}</main>

                {/* Global Footer */}
                <Footer />
            </body>
        </html>
    );
}
