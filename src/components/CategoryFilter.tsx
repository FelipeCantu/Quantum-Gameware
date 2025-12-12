'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '@/types';
import CategorySpecificFilters from './filters/CategorySpecificFilters';
import { hasCustomFilters } from '@/config/categoryFilters';
import { useTheme } from '@/context/ThemeContext';

interface ActiveFilter {
  id: string;
  label: string;
  value: string;
}

// Import categories with error handling using dynamic import
// Note: Removed unused variable declaration

// Fallback categories for build safety
const fallbackCategories = [
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
  const { getCardBgClass, getTextClass, getSecondaryTextClass, getBorderClass, getInputBgClass, effectiveTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loadedCategories, setLoadedCategories] = useState(fallbackCategories);
  const [categoryFilteredProducts, setCategoryFilteredProducts] = useState<Product[]>(products);
  const [showFilters, setShowFilters] = useState(true);


  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesModule = await import('@/data/categories');
        setLoadedCategories(categoriesModule.categories || fallbackCategories);
      } catch {
        setLoadedCategories(fallbackCategories);
      }
    };
    loadCategories();
  }, []);

  // Ensure component is mounted before applying filters
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize available brands to prevent unnecessary recalculations
  const availableBrands = useMemo(() => {
    if (!products || products.length === 0) return [];
    try {
      return [...new Set(products.map(p => p?.brand).filter(Boolean))].sort();
    } catch {
      return [];
    }
  }, [products]);

  // Memoize category filtering logic
  const filterByCategory = useCallback((productList: Product[], categorySlug?: string) => {
    if (!categorySlug || !loadedCategories.length) return productList;

    try {
      const categoryData = loadedCategories.find(c => c?.slug === categorySlug);
      if (!categoryData) return productList;

      return productList.filter(product => {
        if (!product?.category) return false;

        const productCategory = product.category.toLowerCase();
        const categoryName = categoryData.name?.toLowerCase() || '';
        const categoryWords = categoryName.split(' ');

        return productCategory.includes(categoryWords[1] || categoryWords[0]) ||
               categoryName.includes(productCategory);
      });
    } catch {
      return productList;
    }
  }, [loadedCategories]);

  // Memoize the category-filtered products to avoid recreating array every render
  const baseCategoryProducts = useMemo(
    () => filterByCategory(products, selectedCategory),
    [products, selectedCategory, filterByCategory]
  );

  // Filter products based on all criteria
  const filterProducts = useCallback(() => {
    if (!mounted || !products) return;

    try {
      // Start with category-specific filtered products if available
      let filtered = selectedCategory && hasCustomFilters(selectedCategory)
        ? [...categoryFilteredProducts]
        : [...products];

      // Category filter (for non-specific attributes)
      if (!hasCustomFilters(selectedCategory)) {
        filtered = filterByCategory(filtered, selectedCategory);
      }

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
    } catch {
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
    filterByCategory,
    categoryFilteredProducts
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

  // Get active filters for display
  const activeFilters = useMemo((): ActiveFilter[] => {
    const filters: ActiveFilter[] = [];

    if (searchTerm) {
      filters.push({ id: 'search', label: 'Search', value: searchTerm });
    }
    if (priceRange[0] !== 0 || priceRange[1] !== 1000) {
      filters.push({ id: 'price', label: 'Price', value: `$${priceRange[0]} - $${priceRange[1]}` });
    }
    selectedBrands.forEach(brand => {
      filters.push({ id: `brand-${brand}`, label: 'Brand', value: brand });
    });
    if (inStockOnly) {
      filters.push({ id: 'stock', label: 'In Stock', value: 'Yes' });
    }

    return filters;
  }, [searchTerm, priceRange, selectedBrands, inStockOnly]);

  const removeFilter = useCallback((filterId: string) => {
    if (filterId === 'search') {
      setSearchTerm('');
    } else if (filterId === 'price') {
      setPriceRange([0, 1000]);
    } else if (filterId === 'stock') {
      setInStockOnly(false);
    } else if (filterId.startsWith('brand-')) {
      const brand = filterId.replace('brand-', '');
      setSelectedBrands(prev => prev.filter(b => b !== brand));
    }
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
      <div className={`${getCardBgClass()} rounded-2xl border ${getBorderClass()} p-6 mb-8 shadow-lg`}>
        <div className="animate-pulse">
          <div className={`h-4 ${getCardBgClass()} rounded w-1/4 mb-4`}></div>
          <div className={`h-10 ${getCardBgClass()} rounded mb-6`}></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`h-20 ${getCardBgClass()} rounded`}></div>
            <div className={`h-20 ${getCardBgClass()} rounded`}></div>
            <div className={`h-20 ${getCardBgClass()} rounded`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getCardBgClass()} rounded-2xl border ${getBorderClass()} mb-8 shadow-xl overflow-hidden transition-all duration-300`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Filter & Sort</h2>
              <p className="text-sm text-white/80">Refine your search</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 border border-white/30"
                aria-label="Clear all filters"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 border border-white/30"
              aria-label={showFilters ? "Hide filters" : "Show filters"}
            >
              {showFilters ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Hide
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Show
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Chips */}
        {activeFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white text-sm font-medium transition-all duration-200 border border-white/30"
                >
                  <span className="text-xs opacity-70">{filter.label}:</span>
                  <span className="font-semibold">{filter.value}</span>
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="ml-1 p-0.5 hover:bg-white/20 rounded-full transition-colors"
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filter Content */}
      <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="p-6">
          {/* Search and Sort Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="product-search" className={`block ${getTextClass()} font-semibold mb-2 text-sm`}>
                🔍 Search Products
              </label>
              <div className="relative">
                <input
                  id="product-search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, brand, or description..."
                  className={`w-full px-4 py-3 pl-11 ${getInputBgClass()} ${getTextClass()} rounded-xl border-2 border-transparent focus:border-purple-500 focus:ring-0 transition-all duration-200 shadow-sm`}
                  aria-label="Search products"
                />
                <svg
                  className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500"
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
              <label htmlFor="sort-select" className={`block ${getTextClass()} font-semibold mb-2 text-sm`}>
                📊 Sort By
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full px-4 py-3 ${getInputBgClass()} ${getTextClass()} rounded-xl border-2 border-transparent focus:border-purple-500 focus:ring-0 transition-all duration-200 cursor-pointer shadow-sm`}
                aria-label="Sort products"
              >
                <option value="newest">⭐ Newest First</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="name">🔤 Name A-Z</option>
                <option value="rating">⭐ Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>

            {/* Price Range */}
            <div className={`p-5 rounded-xl border-2 ${getBorderClass()} hover:border-purple-300 transition-all duration-200 bg-gradient-to-br ${effectiveTheme === 'light' ? 'from-purple-50 to-pink-50' : 'from-purple-900/10 to-pink-900/10'}`}>
              <label className={`block ${getTextClass()} font-bold mb-4 flex items-center gap-2`}>
                <div className="p-1.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                💰 Price Range
              </label>
              <div className="mb-3 px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg text-center">
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="price-min" className={`text-xs ${getSecondaryTextClass()} font-medium mb-1 block`}>Min: ${priceRange[0]}</label>
                  <input
                    id="price-min"
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                    className="w-full h-2 accent-purple-600 cursor-pointer"
                    aria-label={`Minimum price: $${priceRange[0]}`}
                  />
                </div>
                <div>
                  <label htmlFor="price-max" className={`text-xs ${getSecondaryTextClass()} font-medium mb-1 block`}>Max: ${priceRange[1]}</label>
                  <input
                    id="price-max"
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                    className="w-full h-2 accent-purple-600 cursor-pointer"
                    aria-label={`Maximum price: $${priceRange[1]}`}
                  />
                </div>
              </div>
            </div>

            {/* Brands */}
            <div className={`p-5 rounded-xl border-2 ${getBorderClass()} hover:border-purple-300 transition-all duration-200 bg-gradient-to-br ${effectiveTheme === 'light' ? 'from-indigo-50 to-blue-50' : 'from-indigo-900/10 to-blue-900/10'}`}>
              <label className={`block ${getTextClass()} font-bold mb-4 flex items-center gap-2`}>
                <div className="p-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                🏷️ Brands
                {selectedBrands.length > 0 && (
                  <span className="ml-auto px-2 py-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs rounded-full font-bold">
                    {selectedBrands.length}
                  </span>
                )}
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                {availableBrands.length > 0 ? (
                  availableBrands.map(brand => (
                    <label
                      key={brand}
                      className={`flex items-center cursor-pointer group p-2.5 rounded-lg transition-all duration-200 ${
                        selectedBrands.includes(brand)
                          ? 'bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 shadow-sm'
                          : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="mr-3 w-4 h-4 rounded border-2 border-indigo-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                        aria-label={`Filter by ${brand}`}
                      />
                      <span className={`${selectedBrands.includes(brand) ? 'font-semibold text-indigo-700 dark:text-indigo-300' : getSecondaryTextClass()} transition-colors flex-1`}>
                        {brand}
                      </span>
                      {selectedBrands.includes(brand) && (
                        <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  ))
                ) : (
                  <p className={`${getSecondaryTextClass()} text-sm text-center py-4`}>No brands available</p>
                )}
              </div>
            </div>

            {/* Additional Filters */}
            <div className={`p-5 rounded-xl border-2 ${getBorderClass()} hover:border-purple-300 transition-all duration-200 bg-gradient-to-br ${effectiveTheme === 'light' ? 'from-green-50 to-emerald-50' : 'from-green-900/10 to-emerald-900/10'}`}>
              <label className={`block ${getTextClass()} font-bold mb-4 flex items-center gap-2`}>
                <div className="p-1.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                ✨ Quick Filters
              </label>
              <div className="space-y-2">
                <label className={`flex items-center cursor-pointer group p-3 rounded-lg transition-all duration-200 ${
                  inStockOnly
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 shadow-sm'
                    : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="mr-3 w-4 h-4 rounded border-2 border-green-300 text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-0 cursor-pointer"
                    aria-label="Show only in-stock products"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <div className={`w-2 h-2 rounded-full ${inStockOnly ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <span className={`${inStockOnly ? 'font-semibold text-green-700 dark:text-green-300' : getSecondaryTextClass()} transition-colors`}>
                      In Stock Only
                    </span>
                  </div>
                  {inStockOnly && (
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Category-Specific Filters */}
          {selectedCategory && hasCustomFilters(selectedCategory) && (
            <div className={`mt-6 pt-6 border-t-2 ${getBorderClass()}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${getTextClass()}`}>Category Specifications</h3>
                  <p className={`text-sm ${getSecondaryTextClass()}`}>Filter by specific product features</p>
                </div>
              </div>
              <div className={`p-6 rounded-xl border-2 ${getBorderClass()} bg-gradient-to-br ${effectiveTheme === 'light' ? 'from-gray-50 to-slate-50' : 'from-gray-900/10 to-slate-900/10'}`}>
                <CategorySpecificFilters
                  categorySlug={selectedCategory}
                  products={baseCategoryProducts}
                  onFilterChange={setCategoryFilteredProducts}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}