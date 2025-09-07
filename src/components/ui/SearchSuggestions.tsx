// src/components/ui/SearchSuggestions.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  onClose: () => void;
}

interface Suggestion {
  type: 'category' | 'product' | 'brand';
  title: string;
  subtitle?: string;
  icon?: string;
  href: string;
}

export default function SearchSuggestions({ query, onSelect, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Sample popular searches and brands
  const popularSearches = [
    'gaming keyboard',
    'wireless mouse', 
    'RGB headset',
    '4K monitor',
    'mechanical switches',
    'gaming chair',
    'streaming microphone',
    'wireless controller'
  ];

  const popularBrands = [
    'Corsair', 'Razer', 'Logitech', 'SteelSeries', 
    'HyperX', 'ASUS', 'Acer', 'Secretlab'
  ];

  useEffect(() => {
    if (!query || query.length < 2) {
      // Show popular categories when no query
      setSuggestions([
        ...categories.slice(0, 6).map(cat => ({
          type: 'category' as const,
          title: cat.name,
          subtitle: `From $${cat.priceRange.min}`,
          icon: cat.icon,
          href: `/categories/${cat.slug}`
        })),
        ...popularSearches.slice(0, 4).map(search => ({
          type: 'product' as const,
          title: search,
          subtitle: 'Popular search',
          href: `/products?search=${encodeURIComponent(search)}`
        }))
      ]);
      return;
    }

    // Filter suggestions based on query
    const filteredSuggestions: Suggestion[] = [];

    // Category suggestions
    categories
      .filter(cat => 
        cat.name.toLowerCase().includes(query.toLowerCase()) ||
        cat.description.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3)
      .forEach(cat => {
        filteredSuggestions.push({
          type: 'category',
          title: cat.name,
          subtitle: `${cat.features.length} key features`,
          icon: cat.icon,
          href: `/categories/${cat.slug}`
        });
      });

    // Brand suggestions
    popularBrands
      .filter(brand => brand.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2)
      .forEach(brand => {
        filteredSuggestions.push({
          type: 'brand',
          title: brand,
          subtitle: 'Brand',
          href: `/products?brand=${encodeURIComponent(brand)}`
        });
      });

    // Popular search suggestions
    popularSearches
      .filter(search => search.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .forEach(search => {
        filteredSuggestions.push({
          type: 'product',
          title: search,
          subtitle: 'Search suggestion',
          href: `/products?search=${encodeURIComponent(search)}`
        });
      });

    setSuggestions(filteredSuggestions.slice(0, 8));
  }, [query]);

  if (suggestions.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-gray-500 mb-2">No suggestions found</div>
        <Link
          href={`/products?search=${encodeURIComponent(query)}`}
          onClick={onClose}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Search for "{query}"
        </Link>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {query.length >= 2 && (
        <div className="p-3 border-b border-gray-100">
          <Link
            href={`/products?search=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="flex items-center p-2 rounded-lg hover:bg-blue-50 transition-colors group"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900">Search for "{query}"</div>
              <div className="text-xs text-gray-500">Press Enter or click to search</div>
            </div>
          </Link>
        </div>
      )}

      <div className="p-2">
        {suggestions.map((suggestion, index) => (
          <Link
            key={`${suggestion.type}-${index}`}
            href={suggestion.href}
            onClick={onClose}
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="w-10 h-10 flex items-center justify-center mr-3">
              {suggestion.type === 'category' && suggestion.icon ? (
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {suggestion.icon}
                </span>
              ) : suggestion.type === 'brand' ? (
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {suggestion.title}
              </div>
              {suggestion.subtitle && (
                <div className="text-sm text-gray-500 truncate">
                  {suggestion.subtitle}
                </div>
              )}
            </div>
            <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {query.length < 2 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            💡 Tip: Try searching for "RGB keyboard" or "wireless mouse"
          </div>
        </div>
      )}
    </div>
  );
}