// src/app/products/[slug]/ProductImageGallery.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const allImages = [product.image, ...(product.images || [])];
  
  // Handle touch swipe for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && allImages.length > 1) {
      setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
    }
    if (isRightSwipe && allImages.length > 1) {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : allImages.length - 1);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') {
          setLightboxOpen(false);
        }
        if (e.key === 'ArrowLeft' && allImages.length > 1) {
          setSelectedImage(selectedImage > 0 ? selectedImage - 1 : allImages.length - 1);
        }
        if (e.key === 'ArrowRight' && allImages.length > 1) {
          setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, selectedImage, allImages.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen]);
  
  return (
    <>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        {/* Enhanced Main Image Display */}
        <div className="relative group">
          <div 
            className="relative h-[250px] xs:h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] w-full rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg md:shadow-xl cursor-zoom-in select-none"
            onClick={() => setLightboxOpen(true)}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ${
                isZoomed ? 'scale-110' : 'scale-100'
              }`}
              priority
              sizes="(max-width: 375px) 100vw, (max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            />
            
            {/* Enhanced Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Enhanced Badges with Better Mobile Positioning */}
            <div className="absolute top-3 left-3 md:top-4 md:left-4 lg:top-6 lg:left-6 flex flex-col gap-1.5 md:gap-2 lg:gap-3 z-10">
              {product.isNew && (
                <span className="px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs md:text-sm font-bold rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                  ✨ NEW
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs md:text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                  🔥 SALE
                </span>
              )}
              {!product.inStock && (
                <span className="px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs md:text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                  📦 OUT OF STOCK
                </span>
              )}
            </div>

            {/* Enhanced Zoom Hint */}
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 lg:bottom-6 lg:right-6 bg-black/70 backdrop-blur-sm text-white px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 rounded-full text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
              🔍 Click to view full size
            </div>

            {/* Mobile Swipe Hint */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 sm:hidden">
                👈 👉 Swipe to browse
              </div>
            )}

            {/* Enhanced Navigation Arrows for Desktop */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage > 0 ? selectedImage - 1 : allImages.length - 1);
                  }}
                  className="absolute left-2 md:left-3 lg:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-sm md:text-base lg:text-lg hidden sm:flex"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="absolute right-2 md:right-3 lg:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-sm md:text-base lg:text-lg hidden sm:flex"
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute top-3 right-3 md:top-4 md:right-4 lg:top-6 lg:right-6 bg-black/70 backdrop-blur-sm text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm z-10">
                {selectedImage + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="space-y-2 md:space-y-3">
            {/* Desktop/Tablet: Horizontal thumbnails */}
            <div className="hidden sm:flex gap-2 md:gap-3 lg:gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28 rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    selectedImage === index 
                      ? 'ring-2 md:ring-3 lg:ring-4 ring-blue-500 scale-105 shadow-lg' 
                      : 'hover:scale-105 hover:shadow-md opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, (max-width: 1280px) 96px, 112px"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 rounded-lg md:rounded-xl lg:rounded-2xl"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Mobile: Dot indicators */}
            <div className="flex sm:hidden justify-center gap-2 mt-3">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedImage === index 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full w-full flex items-center justify-center">
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] w-full rounded-lg md:rounded-xl"
              priority
              sizes="90vw"
            />
            
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 text-lg md:text-xl lg:text-2xl"
              aria-label="Close lightbox"
            >
              ✕
            </button>
            
            {/* Lightbox Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage > 0 ? selectedImage - 1 : allImages.length - 1);
                  }}
                  className="absolute left-2 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 text-lg md:text-xl lg:text-2xl"
                  aria-label="Previous image"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="absolute right-2 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 text-lg md:text-xl lg:text-2xl"
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            )}

            {/* Lightbox Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm md:text-base">
                {selectedImage + 1} of {allImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 2px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </>
  );
}