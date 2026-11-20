// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Cart from '@/components/Cart';
import AIAssistant from '@/components/AIAssistant';
import ThemeWrapper from '@/components/ThemeWrapper';
import Motion from '@/components/Motion';
import { site } from '@/data/site';
import { getProducts } from '@/sanity/lib/queries';
import { stockedSlugs } from '@/data/taxonomy';
import { archivo, brand, jetbrains } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: gaming and streaming gear at one honest price`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: site.name, images: ['/og.png'] },
  twitter: { card: 'summary_large_image' },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#eceef2',
};

// Before first paint: the signed-in user's theme preference (light unless they chose dark),
// then the motion flags. Hidden-until-revealed styles only apply when JS and motion are on.
const headScript = `(function(){try{var d=document.documentElement;d.classList.remove('dark');var u=localStorage.getItem('userData'),t=localStorage.getItem('authToken');if(u&&t){var p=JSON.parse(u);if(p&&p.preferences&&p.preferences.theme==='dark')d.classList.add('dark');}}catch(e){}document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion');})();`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: site.name,
  url: site.url,
  description: site.description,
  logo: `${site.url}/nextgens-logo-blue.png`,
  telephone: site.phone.label,
};

// The menus read the stocked categories, so they refresh with the catalog.
export const revalidate = 60;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Menus list only categories with products in them (DESIGN.md, catalog structure).
  const stocked = stockedSlugs(await getProducts());
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable} ${brand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <div id="curtain" aria-hidden="true">
          <div className="curtain__ghost curtain__ghost--q" />
          <div className="curtain__ghost curtain__ghost--g" />
          <div className="curtain__panel"><span className="curtain__label" /></div>
        </div>
        {/* Duotone filters for the superposition ghosts: dark pixels become cobalt or gill, white stays white. */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
          <filter id="ghost-q" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.149 1" />
              <feFuncG type="table" tableValues="0.2 1" />
              <feFuncB type="table" tableValues="1 1" />
            </feComponentTransfer>
          </filter>
          <filter id="ghost-g" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0" />
            <feComponentTransfer>
              <feFuncR type="table" tableValues="1 1" />
              <feFuncG type="table" tableValues="0.31 1" />
              <feFuncB type="table" tableValues="0.604 1" />
            </feComponentTransfer>
          </filter>
        </svg>
        <AuthProvider>
          <ThemeProvider>
            <WishlistProvider>
              <CartProvider>
                <ThemeWrapper>
                  <Header stocked={stocked} />
                  <main id="main" tabIndex={-1} className="flex-1">
                    {children}
                  </main>
                  <Footer stocked={stocked} />
                  <Cart />
                  <AIAssistant />
                </ThemeWrapper>
              </CartProvider>
            </WishlistProvider>
          </ThemeProvider>
        </AuthProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <Motion />
      </body>
    </html>
  );
}
