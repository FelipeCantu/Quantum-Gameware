// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Cart from '@/components/Cart';
import './globals.css';
import ScrollBehavior from '@/components/ui/ScrollBehavior';

const inter = Inter({ subsets: ['latin'] });

// Custom brand font - Ethnocentric
const brandFont = localFont({
  src: '../../public/fonts/ethnocentric.regular.woff2',
  variable: '--font-brand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quantum Gameware - Premium Gaming Accessories',
  description: 'High-quality gaming accessories for professional gamers',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#23378e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={brandFont.variable}>
      {/* REMOVED scroll-smooth class - this was preventing instant scroll to top */}
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <ScrollBehavior />
              <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <Cart />
              </div>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}