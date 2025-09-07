'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '@/types';

// Import categories with error handling
let categories: Array<{
  slug: string;
  name: string;
  icon: string;
  description: string;
  priceRange: { min: number; max: number };
}> = [];

try {
  const categoriesModule = require('@/data/categories');
  categories = categoriesModule.categories || [];
} catch (error) {
  console.warn('Categories data not found, using fallback');
  // Fallback categories for build safety
  categories = [
    {
      slug: 'keyboards',
      name: 'Gaming Keyboards',
      icon: '⌨️',
      description: 'Mechanical keyboards for gaming',
      priceRange: { min: 49, max: 299 }
    },
    {
      slug: 'mice',
      name: 'Gaming Mice',
      icon: '🖱️',
      description: 'High-precision gaming mice',
      priceRange: { min: 29, max: 199 }
    },
    {
      slug: 'headsets',
      name: 'Gaming Headsets',
      icon: '🎧',
      description: 'Immersive gaming headsets',
      priceRange: { min: 39, max: 399 }
    },
    {
      slug: 'monitors',
      name: 'Gaming Monitors',
      icon: '🖥️',
      description: 'High-refresh gaming monitors',
      priceRange: { min: 199, max: 1299 }
    }
  ];
}

interface CategoryFilterProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
  selectedCategory?: string;
}

export default function CategoryFilter({ 
  products, 
  onFilterChange, 
  selectedCategory 
}: CategoryFilterProps) {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Ensure component is mounted before applying filters
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize available brands to prevent unnecessary recalculations
  const availableBrands = useMemo(() => {
    if (!products || products.length === 0) return [];
    try {
      return [...new Set(products.map(p => p?.brand).filter(Boolean))].sort();
    } catch (error) {
      console.warn('Error processing brands:', error);
      return [];
    }
  }, [products]);

  // Memoize category filtering logic
  const filterByCategory = useCallback((productList: Product[], categorySlug?: string) => {
    if (!categorySlug || !categories.length) return productList;
    
    try {
      const categoryData = categories.find(c => c?.slug === categorySlug);
      if (!categoryData) return productList;

      return productList.filter(product => {
        if (!product?.category) return false;
        
        const productCategory = product.category.toLowerCase();
        const categoryName = categoryData.name?.toLowerCase() || '';
        const categoryWords = categoryName.split(' ');
        
        return productCategory.includes(categoryWords[1] || categoryWords[0]) ||
               categoryName.includes(productCategory);
      });
    } catch (error) {
      console.warn('Error filtering by category:', error);
      return productList;
    }
  }, []);

  // Filter products based on all criteria
  const filterProducts = useCallback(() => {
    if (!mounted || !products) return;

    try {
      let filtered = [...products];

      // Category filter
      filtered = filterByCategory(filtered, selectedCategory);

      // Search filter
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(product => {
          if (!product) return false;
          
          const name = product.name?.toLowerCase() || '';
          const description = product.description?.toLowerCase() || '';
          const brand = product.brand?.toLowerCase() || '';
          
          return name.includes(searchLower) ||
                 description.includes(searchLower) ||
                 brand.includes(searchLower);
        });
      }

      // Price range filter
      filtered = filtered.filter(product => {
        const price = product?.price || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });

      // Brand filter
      if (selectedBrands.length > 0) {
        filtered = filtered.filter(product => 
          product?.brand && selectedBrands.includes(product.brand)
        );
      }

      // Stock filter
      if (inStockOnly) {
        filtered = filtered.filter(product => product?.inStock === true);
      }

      // Sort products
      filtered = [...filtered]; // Create new array to avoid mutation
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => (a?.price || 0) - (b?.price || 0));
          break;
        case 'price-high':
          filtered.sort((a, b) => (b?.price || 0) - (a?.price || 0));
          break;
        case 'name':
          filtered.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
          break;
        case 'rating':
          filtered.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
          break;
        case 'newest':
        default:
          // Keep original order (newest first)
          break;
      }

      onFilterChange(filtered);
    } catch (error) {
      console.warn('Error filtering products:', error);
      onFilterChange(products || []);
    }
  }, [
    mounted,
    products,
    selectedCategory,
    searchTerm,
    priceRange,
    selectedBrands,
    sortBy,
    inStockOnly,
    onFilterChange,
    filterByCategory
  ]);

  // Apply filters whenever any filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterProducts();
    }, 100); // Small debounce to prevent excessive filtering

    return () => clearTimeout(timeoutId);
  }, [filterProducts]);

  const toggleBrand = useCallback((brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setPriceRange([0, 1000]);
    setSelectedBrands([]);
    setSortBy('newest');
    setInStockOnly(false);
  }, []);

  const handlePriceRangeChange = useCallback((index: 0 | 1, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setPriceRange(prev => {
      const newRange: [number, number] = [...prev];
      newRange[index] = numValue;
      
      // Ensure min doesn't exceed max and vice versa
      if (index === 0 && numValue > prev[1]) {
        newRange[1] = numValue;
      } else if (index === 1 && numValue < prev[0]) {
        newRange[0] = numValue;
      }
      
      return newRange;
    });
  }, []);

  // Don't render interactive elements until mounted
  if (!mounted) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-white/20 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-20 bg-white/20 rounded"></div>
            <div className="h-20 bg-white/20 rounded"></div>
            <div className="h-20 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Search */}
        <div className="flex-1">
          <label htmlFor="product-search" className="block text-white font-medium mb-2">
            Search Products
          </label>
          <div className="relative">
            <input
              id="product-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, brand, or description..."
              className="w-full px-4 py-3 pl-10 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              aria-label="Search products"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label htmlFor="sort-select" className="block text-white font-medium mb-2">
            Sort By
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            aria-label="Sort products"
          >
            <option value="newest" className="bg-gray-800">Newest First</option>
            <option value="price-low" className="bg-gray-800">Price: Low to High</option>
            <option value="price-high" className="bg-gray-800">Price: High to Low</option>
            <option value="name" className="bg-gray-800">Name A-Z</option>
            <option value="rating" className="bg-gray-800">Highest Rated</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-medium transition-colors border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Price Range */}
          <div>
            <label className="block text-white font-medium mb-3">
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <div className="space-y-3">
              <div>
                <label htmlFor="price-min" className="sr-only">Minimum price</label>
                <input
                  id="price-min"
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                  className="w-full accent-blue-500"
                  aria-label={`Minimum price: $${priceRange[0]}`}
                />
              </div>
              <div>
                <label htmlFor="price-max" className="sr-only">Maximum price</label>
                <input
                  id="price-max"
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                  className="w-full accent-blue-500"
                  aria-label={`Maximum price: $${priceRange[1]}`}
                />
              </div>
            </div>
          </div>

          {/* Brands */}
          <div>
            <label className="block text-white font-medium mb-3">Brands</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableBrands.length > 0 ? (
                availableBrands.map(brand => (
                  <label key={brand} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="mr-2 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                      aria-label={`Filter by ${brand}`}
                    />
                    <span className="text-white/80">{brand}</span>
                  </label>
                ))
              ) : (
                <p className="text-white/60 text-sm">No brands available</p>
              )}
            </div>
          </div>

          {/* Additional Filters */}
          <div>
            <label className="block text-white font-medium mb-3">Additional Filters</label>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="mr-2 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                  aria-label="Show only in-stock products"
                />
                <span className="text-white/80">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}