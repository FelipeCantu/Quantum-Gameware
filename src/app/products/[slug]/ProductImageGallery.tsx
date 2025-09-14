// src/app/products/[slug]/ProductImageGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const allImages = [product.image, ...(product.images || [])];
  
  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {/* Main Image Display */}
        <div className="relative group">
          <div 
            className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg md:shadow-xl cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              fill
              className={`object-cover transition-all duration-700 ${
                isZoomed ? 'scale-110' : 'scale-100'
              }`}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-2 md:gap-3 z-10">
              {product.isNew && (
                <span className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs md:text-sm font-bold rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                  ✨ NEW
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs md:text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                  🔥 SALE
                </span>
              )}
              {!product.inStock && (
                <span className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs md:text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                  📦 OUT OF STOCK
                </span>
              )}
            </div>

            {/* Zoom Hint */}
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-black/70 backdrop-blur-sm text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              🔍 Click to view full size
            </div>

            {/* Navigation Arrows for Multiple Images */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage > 0 ? selectedImage - 1 : allImages.length - 1);
                  }}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-sm md:text-base"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 text-sm md:text-base"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-1 md:pb-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                  selectedImage === index 
                    ? 'ring-2 md:ring-3 ring-blue-500 scale-105 shadow-md md:shadow-lg' 
                    : 'hover:scale-105 hover:shadow-sm md:hover:shadow-md opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 64px, (max-width: 1024px) 80px, 96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 md:p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl lg:max-w-6xl max-h-full w-full">
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] w-full rounded-lg md:rounded-xl"
              priority
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 text-sm md:text-base"
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
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 text-sm md:text-base"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 text-sm md:text-base"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}