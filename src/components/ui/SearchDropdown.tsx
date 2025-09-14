// components/ui/Header/SearchDropdown.tsx
import { useState } from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDropdown({ isOpen, onClose }: SearchDropdownProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
      <form onSubmit={handleSearch} className="p-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for gaming gear..."
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            autoFocus
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Search button */}
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Search
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          Press Enter to search or browse categories below
        </div>
      </form>
      
      {/* Quick Categories */}
      <div className="border-t border-gray-100 p-2">
        <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-2">Quick Categories</div>
        <div className="space-y-1">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              onClick={onClose}
              className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="text-lg mr-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {category.name}
                </span>
                <div className="text-xs text-gray-500">
                  Starting at ${category.priceRange.min}
                </div>
              </div>
              <svg 
                className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
        
        {/* View All Categories */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Link
            href="/categories"
            onClick={onClose}
            className="flex items-center justify-center w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors font-medium group"
          >
            View All Categories
            <svg 
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Popular Searches - Optional */}
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="text-xs font-medium text-gray-500 mb-2">Popular Searches</div>
        <div className="flex flex-wrap gap-2">
          {['Gaming Mouse', 'Mechanical Keyboard', 'Gaming Headset', 'RGB Lighting'].map((term) => (
            <button
              key={term}
              onClick={() => {
                setSearchQuery(term);
                // Auto-submit the search
                window.location.href = `/products?search=${encodeURIComponent(term)}`;
                onClose();
              }}
              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}