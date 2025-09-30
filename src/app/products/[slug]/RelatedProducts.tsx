'use client';

import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 md:py-16 lg:py-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            You Might Also Like
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Similar products that other customers loved
          </p>
        </div>
        
        <div className="relative">
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory minimal-scrollbar">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-none w-72 sm:w-80 md:w-96 snap-start"
              >
                <ProductCard 
                  product={product} 
                  imageAspectRatio="wide"
                  className="h-full bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 md:mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            View All Products
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .minimal-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.4) transparent;
        }
        
        .minimal-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        
        .minimal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .minimal-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 2px;
        }
        
        .minimal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.6);
        }
      `}</style>
    </section>
  );
}