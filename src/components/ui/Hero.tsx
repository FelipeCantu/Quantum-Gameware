// src/components/ui/Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Level Up Your Game</h1>
        <p className="text-xl opacity-90 mb-8">
          Premium gaming accessories for the competitive edge
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/products" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Shop Now
          </Link>
          <Link 
            href="/categories" 
            className="border border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </section>
  );
}