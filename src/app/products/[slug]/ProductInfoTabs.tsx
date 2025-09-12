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
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'features', label: 'Features', icon: '⚡' },
    { id: 'compatibility', label: 'Compatibility', icon: '🔗' },
    { id: 'specs', label: 'Specifications', icon: '🔧' },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/20 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-300 border-b-2 border-blue-400 bg-white/10'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">About This Product</h3>
            <p className="text-white/90 leading-relaxed text-lg">
              {product.description}
            </p>
            {product.features && product.features.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-white mb-3">Quick Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-300 rounded-full text-sm backdrop-blur-sm"
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
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Key Features</h3>
            <div className="grid gap-4">
              {product.features.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-colors border border-white/20"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'compatibility' && product.compatibility && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Platform Compatibility</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.compatibility.map((platform, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-colors border border-white/20"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="font-medium text-white/90">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Technical Specifications</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="grid gap-4">
                <div className="flex justify-between py-2 border-b border-white/20">
                  <span className="font-medium text-white/70">Brand</span>
                  <span className="text-white">{product.brand}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/20">
                  <span className="font-medium text-white/70">Category</span>
                  <span className="text-white">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/20">
                  <span className="font-medium text-white/70">Model</span>
                  <span className="text-white">{product.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/20">
                  <span className="font-medium text-white/70">In Stock</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                    {product.inStock ? 'Yes' : 'No'}
                  </span>
                </div>
                {product.rating && (
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-white/70">Rating</span>
                    <span className="text-white">{product.rating}/5 ⭐</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}