'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  category: {
    slug: string;
    name: string;
    icon: string;
    description: string;
    priceRange: { min: number; max: number };
    image?: string;
    video?: string;
  };
  index: number;
  productCount: number;
}

const CategoryCard = ({ category, index, productCount }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Load video metadata when component mounts
  useEffect(() => {
    if (videoRef.current && category.video) {
      const video = videoRef.current;
      
      // Load the video metadata and first frame
      video.load();
      
      // When metadata is loaded, seek to first frame
      const handleLoadedMetadata = () => {
        video.currentTime = 0.1; // Seek to a tiny bit in to ensure frame loads
        setVideoLoaded(true);
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [category.video]);

  // Handle hover play/pause
  useEffect(() => {
    if (isHovered && videoRef.current && category.video && videoLoaded) {
      videoRef.current.play().catch(err => console.log('Video play failed:', err));
    } else if (videoRef.current && videoLoaded) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0.1; // Reset to first frame
    }
  }, [isHovered, category.video, videoLoaded]);

  // Fallback image if none provided
  const fallbackImage = `https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80`;
  const categoryImage = category.image || fallbackImage;

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer h-64 sm:h-72 md:h-80 block animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Layer - Only show if no video OR video hasn't loaded */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        category.video && videoLoaded ? 'opacity-0' : 'opacity-100'
      }`}>
        <img
          src={categoryImage}
          alt={category.name}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse" />
        )}
      </div>

      {/* Video Layer - Always visible when loaded, plays on hover */}
      {category.video && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          src={category.video}
          loop
          muted
          playsInline
          preload="metadata"
        />
      )}

      {/* Gradient Overlay (always visible but subtle) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Product Count Badge - Always visible - RESPONSIVE */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg z-10">
        {productCount} {productCount === 1 ? 'product' : 'products'}
      </div>

      {/* Category Name - ALWAYS VISIBLE - RESPONSIVE */}
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-20">
        <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] line-clamp-2">
          {category.name}
        </h3>
      </div>

      {/* Sliding Text Overlay - EXTREMELY TRANSPARENT - RESPONSIVE */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-black/10 backdrop-blur-sm transition-all duration-500 ease-out ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ paddingTop: '4rem' }}
      >
        <div className="p-3 pb-12 sm:p-4 sm:pb-14 md:p-6 md:pb-16">
          {/* Icon - RESPONSIVE */}
          <div className="text-3xl sm:text-4xl md:text-5xl mb-2 md:mb-3 transform transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
            {category.icon}
          </div>
          
          {/* Description - RESPONSIVE */}
          <p className="text-white text-xs sm:text-sm leading-relaxed mb-2 md:mb-4 transform transition-all duration-500 delay-100 line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            {category.description}
          </p>
          
          {/* Price Range - RESPONSIVE */}
          <div className="text-white text-sm sm:text-base md:text-lg font-semibold mb-2 md:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
            ${category.priceRange.min} - ${category.priceRange.max}
          </div>
          
          {/* View Button - RESPONSIVE */}
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/95 text-gray-900 rounded-lg md:rounded-xl text-xs sm:text-sm font-semibold hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm">
            View Collection
            <svg className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className={`absolute inset-0 border-2 border-white/0 rounded-2xl md:rounded-3xl transition-all duration-500 pointer-events-none ${
        isHovered ? 'border-white/30' : ''
      }`} />
    </Link>
  );
};

interface EnhancedCategoryGridProps {
  categories: Array<{
    slug: string;
    name: string;
    icon: string;
    description: string;
    priceRange: { min: number; max: number };
    image?: string;
    video?: string;
  }>;
  productCounts: { [key: string]: number };
}

export default function EnhancedCategoryGrid({ categories, productCounts }: EnhancedCategoryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-16">
      {categories.map((category, index) => (
        <CategoryCard 
          key={category.slug} 
          category={category} 
          index={index}
          productCount={productCounts[category.slug] || 0}
        />
      ))}
    </div>
  );
}