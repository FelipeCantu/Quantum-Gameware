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
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const allImages = [product.image, ...(product.images || [])];
  
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

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden';
      // Hide the header when lightbox is open
      const header = document.querySelector('header');
      if (header) {
        (header as HTMLElement).style.display = 'none';
      }
    } else {
      document.body.style.overflow = 'unset';
      // Show the header when lightbox is closed
      const header = document.querySelector('header');
      if (header) {
        (header as HTMLElement).style.display = '';
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      // Ensure header is visible when component unmounts
      const header = document.querySelector('header');
      if (header) {
        (header as HTMLElement).style.display = '';
      }
    };
  }, [lightboxOpen]);
  
  return (
    <>
      <div className="space-y-4 lg:space-y-6">
        {/* Main Image Display */}
        <div className="relative group">
          <div 
            className="relative aspect-square w-full rounded-2xl lg:rounded-3xl overflow-hidden bg-white shadow-2xl cursor-pointer select-none border border-gray-100"
            onClick={() => setLightboxOpen(true)}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
            )}
            
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className={`object-contain p-4 md:p-8 transition-all duration-700 ${
                isZoomed ? 'scale-110' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              priority
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Premium Badges */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2 z-10">
              {product.isNew && (
                <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs md:text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                  <span className="text-sm md:text-base">✨</span>
                  <span>NEW</span>
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs md:text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                  <span className="text-sm md:text-base">🔥</span>
                  <span>SALE -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</span>
                </span>
              )}
              {!product.inStock && (
                <span className="px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-gray-600 to-slate-600 text-white text-xs md:text-sm font-bold rounded-lg shadow-lg backdrop-blur-sm flex items-center gap-1.5">
                  <span className="text-sm md:text-base">📦</span>
                  <span>OUT OF STOCK</span>
                </span>
              )}
            </div>

            {/* Fullscreen button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxOpen(true);
              }}
              className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-2.5 md:p-3 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
              aria-label="View fullscreen"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage > 0 ? selectedImage - 1 : allImages.length - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium">
                {selectedImage + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
        
        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 bg-white border-2 ${
                  selectedImage === index 
                    ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-500 scale-105 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300 hover:scale-105 opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="112px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[999999] animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close Button - X */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
            className="fixed top-6 right-6 z-[1000000] w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-xl group"
            aria-label="Close fullscreen"
          >
            <svg className="w-7 h-7 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Image Container */}
          <div 
            className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </div>

          {/* Navigation */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage > 0 ? selectedImage - 1 : allImages.length - 1);
                }}
                className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-[1000000] w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-xl"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
                }}
                className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-[1000000] w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-xl"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Counter */}
          {allImages.length > 1 && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[1000000] bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm md:text-base font-medium shadow-lg">
              {selectedImage + 1} of {allImages.length}
            </div>
          )}

          {/* Keyboard hint */}
          <div className="fixed bottom-6 right-6 z-[1000000] bg-black/70 backdrop-blur-md text-white/80 px-4 py-2 rounded-lg text-xs hidden md:flex items-center gap-2 shadow-lg">
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd>
            <span>to close</span>
            <span className="text-white/40">•</span>
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd>
            <span>to navigate</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .group:hover .group-hover\:opacity-100 {
          opacity: 1;
        }
      `}</style>
    </>
  );
}