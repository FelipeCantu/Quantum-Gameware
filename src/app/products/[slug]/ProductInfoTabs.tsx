// src/app/products/[slug]/ProductInfoTabs.tsx
'use client';

import { useState } from 'react';
import { Product } from '@/types';

interface ProductInfoTabsProps {
  product: Product;
}

export default function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋', shortLabel: 'Info' },
    { id: 'features', label: 'Features', icon: '⚡', shortLabel: 'Features' },
    { id: 'compatibility', label: 'Compatibility', icon: '🔗', shortLabel: 'Compat' },
    { id: 'specs', label: 'Specifications', icon: '🔧', shortLabel: 'Specs' },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl border border-white/20 overflow-hidden">
      {/* Enhanced Tab Navigation with Better Mobile Experience */}
      <div className="border-b border-white/20">
        {/* Mobile: Horizontal Scroll */}
        <div className="flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-3 md:py-4 font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 min-w-0 ${
                activeTab === tab.id
                  ? 'text-blue-300 border-b-2 border-blue-400 bg-white/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base md:text-lg">{tab.icon}</span>
              {/* Show short label on mobile, full label on desktop */}
              <span className="text-xs md:text-sm lg:text-base block sm:hidden">
                {tab.shortLabel}
              </span>
              <span className="text-xs md:text-sm lg:text-base hidden sm:block">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Tab Content with Better Mobile Layout */}
      <div className="p-4 md:p-6 lg:p-8">
        {activeTab === 'overview' && (
          <div className="space-y-4 md:space-y-6 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">About This Product</h3>
            <p className="text-white/90 leading-relaxed text-sm md:text-base lg:text-lg">
              {product.description}
            </p>
            {product.features && product.features.length > 0 && (
              <div className="mt-4 md:mt-6">
                <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Quick Features:</h4>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <span 
                      key={index}
                      className="px-2 md:px-3 py-1 md:py-1.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-xs md:text-sm backdrop-blur-sm hover:bg-blue-500/30 transition-colors duration-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'features' && product.features && (
          <div className="space-y-4 md:space-y-6 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">Key Features</h3>
            <div className="grid gap-3 md:gap-4">
              {product.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-all duration-300 border border-white/20 group opacity-0 animate-[slideInUp_0.4s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90 font-medium text-sm md:text-base leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'compatibility' && product.compatibility && (
          <div className="space-y-4 md:space-y-6 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">Platform Compatibility</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {product.compatibility.map((platform, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-all duration-300 border border-white/20 group opacity-0 animate-[slideInUp_0.4s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-sm md:text-base font-bold">✓</span>
                  </div>
                  <span className="font-medium text-white/90 text-sm md:text-base">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-4 md:space-y-6 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]">
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-white">Technical Specifications</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
              <div className="divide-y divide-white/10">
                {[
                  { label: "Brand", value: product.brand },
                  { label: "Category", value: product.category },
                  { label: "Model", value: product.name },
                  { 
                    label: "In Stock", 
                    value: product.inStock ? "Yes" : "No", 
                    valueClass: product.inStock ? 'text-green-400' : 'text-red-400' 
                  },
                  ...(product.rating ? [{ label: "Rating", value: `${product.rating}/5 ⭐` }] : [])
                ].map((spec, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-4 p-4 md:p-6 hover:bg-white/5 transition-colors duration-300"
                  >
                    <span className="font-medium text-white/70 text-sm md:text-base">
                      {spec.label}
                    </span>
                    <span className={`font-medium text-sm md:text-base sm:text-right ${
                      spec.valueClass || 'text-white'
                    }`}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-3 text-sm md:text-base">Product Dimensions</h4>
                <div className="space-y-2 text-xs md:text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Length:</span>
                    <span>Not specified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Width:</span>
                    <span>Not specified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Height:</span>
                    <span>Not specified</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-3 text-sm md:text-base">Package Info</h4>
                <div className="space-y-2 text-xs md:text-sm text-white/80">
                  <div className="flex justify-between">
                    <span>Weight:</span>
                    <span>Not specified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Includes:</span>
                    <span>Product + Manual</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warranty:</span>
                    <span>1 Year</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}