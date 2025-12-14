'use client';

import { useTheme } from '@/context/ThemeContext';
import ProductGrid from '@/components/ProductGrid';
import BrandCarousel from '@/components/BrandCarousel';
import ParallaxSection from '@/components/ui/ParallaxSection';
import ParallaxLayer from '@/components/ui/ParallaxLayer';
import { Product } from '@/types';

export default function HomeContent({
  featuredProducts
}: {
  featuredProducts: Product[];
}) {
  const { getBgClass, getTextClass, effectiveTheme } = useTheme();

  return (
    <>
      {/* Brand Carousel */}
      <BrandCarousel />

      {/* Featured Products Section with themed background and subtle parallax */}
      <section className={`${getBgClass()} py-20 relative overflow-hidden`}>
        {/* Fixed background gradient layer for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none">
          <div className={`absolute inset-0 ${effectiveTheme === 'light' ? 'bg-gradient-to-br from-blue-50/50 to-purple-50/50' : 'bg-gradient-to-br from-slate-900/30 to-slate-800/30'}`}></div>
        </div>

        {/* Animated grid pattern background with parallax */}
        <ParallaxLayer speed={0.02} className="absolute inset-0 opacity-30 pointer-events-none z-0">
          <div className={`w-full h-full ${effectiveTheme === 'light' ? 'bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]'} bg-[size:4rem_4rem]`}></div>
        </ParallaxLayer>

        {/* Geometric shape backgrounds with parallax */}
        <ParallaxLayer speed={0.03} className="absolute top-20 left-[10%] w-32 h-32 opacity-20 pointer-events-none z-0">
          <div className={`w-full h-full rotate-45 ${effectiveTheme === 'light' ? 'bg-gradient-to-br from-blue-300 to-blue-200' : 'bg-gradient-to-br from-blue-600/30 to-blue-500/20'} rounded-lg blur-sm`}></div>
        </ParallaxLayer>
        <ParallaxLayer speed={0.04} className="absolute top-40 right-[15%] w-24 h-24 opacity-15 pointer-events-none z-0">
          <div className={`w-full h-full rounded-full ${effectiveTheme === 'light' ? 'bg-gradient-to-br from-purple-300 to-purple-200' : 'bg-gradient-to-br from-purple-600/30 to-purple-500/20'} blur-sm`}></div>
        </ParallaxLayer>

        {/* Subtle parallax decorative background elements - reduced speeds for smoothness */}
        <ParallaxLayer speed={0.035} className="absolute top-10 left-10 w-64 h-64 opacity-20 pointer-events-none z-0">
          <div className={`w-full h-full rounded-full filter blur-3xl ${effectiveTheme === 'light' ? 'bg-blue-200' : 'bg-blue-500/20'}`}></div>
        </ParallaxLayer>
        <ParallaxLayer speed={0.05} className="absolute bottom-20 right-20 w-48 h-48 opacity-15 pointer-events-none z-0">
          <div className={`w-full h-full rounded-full filter blur-2xl ${effectiveTheme === 'light' ? 'bg-purple-200' : 'bg-purple-500/20'}`}></div>
        </ParallaxLayer>

        {/* Additional subtle parallax layers for depth */}
        <ParallaxLayer speed={0.03} className="absolute top-1/3 right-1/3 w-52 h-52 opacity-18 pointer-events-none z-0">
          <div className={`w-full h-full rounded-full filter blur-3xl ${effectiveTheme === 'light' ? 'bg-indigo-200' : 'bg-indigo-500/20'}`}></div>
        </ParallaxLayer>
        <ParallaxLayer speed={0.045} className="absolute bottom-1/4 left-1/4 w-40 h-40 opacity-12 pointer-events-none z-0">
          <div className={`w-full h-full rounded-full filter blur-2xl ${effectiveTheme === 'light' ? 'bg-cyan-200' : 'bg-cyan-500/20'}`}></div>
        </ParallaxLayer>

        {/* Floating decorative lines with parallax */}
        <ParallaxLayer speed={0.025} className="absolute top-[30%] left-0 w-full h-px opacity-10 pointer-events-none z-0">
          <div className={`w-full h-full ${effectiveTheme === 'light' ? 'bg-gradient-to-r from-transparent via-blue-400 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-500 to-transparent'}`}></div>
        </ParallaxLayer>

        {/* Content layer with proper z-index */}
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 lg:mb-20 relative z-20">
              <div className={`inline-block px-8 py-6 rounded-2xl backdrop-blur-md ${effectiveTheme === 'light' ? 'bg-white/60 shadow-lg' : 'bg-slate-900/60 shadow-2xl shadow-black/20'} border ${effectiveTheme === 'light' ? 'border-gray-200/50' : 'border-white/10'}`}>
                <h2 className={`text-3xl lg:text-4xl font-bold ${getTextClass()} mb-4`}>
                  Featured Products
                </h2>
                <p className={`text-xl max-w-2xl mx-auto ${effectiveTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  Discover our hand-picked selection of premium gaming gear
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <ProductGrid products={Array.isArray(featuredProducts) ? featuredProducts : []} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
