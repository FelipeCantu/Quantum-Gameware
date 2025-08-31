// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Cart from '@/components/Cart';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GameGear - Premium Gaming Accessories',
  description: 'High-quality gaming accessories for professional gamers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <Cart />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}