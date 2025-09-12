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
      <div className="space-y-6">
        {/* Main Image Display */}
        <div className="relative group">
          <div 
            className="relative h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl cursor-zoom-in"
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
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
              {product.isNew && (
                <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm animate-pulse">
                  ✨ NEW
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                  🔥 SALE
                </span>
              )}
              {!product.inStock && (
                <span className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                  📦 OUT OF STOCK
                </span>
              )}
            </div>

            {/* Zoom Hint */}
            <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  →
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Thumbnail Gallery */}
        {allImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 w-20 lg:h-24 lg:w-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                  selectedImage === index 
                    ? 'ring-4 ring-blue-500 scale-105 shadow-lg' 
                    : 'hover:scale-105 hover:shadow-md opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <Image
              src={allImages[selectedImage]}
              alt={product.name}
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] rounded-2xl"
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(selectedImage < allImages.length - 1 ? selectedImage + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300"
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