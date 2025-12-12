'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { getFiltersForCategory, type FilterConfig } from '@/config/categoryFilters';
import RangeFilter from './RangeFilter';
import MultiSelectFilter from './MultiSelectFilter';
import SingleSelectFilter from './SingleSelectFilter';
import { Product } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface CategorySpecificFiltersProps {
  categorySlug: string;
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

export type FilterValues = Record<string, any>;

export default function CategorySpecificFilters({
  categorySlug,
  products,
  onFilterChange,
}: CategorySpecificFiltersProps) {
  const { getTextClass } = useTheme();
  const filterConfigs = useMemo(() => getFiltersForCategory(categorySlug), [categorySlug]);
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const onFilterChangeRef = useRef(onFilterChange);

  // Keep ref up to date
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  // Initialize filter values with defaults
  useEffect(() => {
    const initialValues: FilterValues = {};
    filterConfigs.forEach((config) => {
      if (config.type === 'range') {
        initialValues[config.id] = [config.min!, config.max!];
      } else if (config.type === 'multiSelect') {
        initialValues[config.id] = [];
      } else if (config.type === 'singleSelect') {
        initialValues[config.id] = config.defaultValue || config.options?.[0]?.value || 'all';
      } else if (config.type === 'boolean') {
        initialValues[config.id] = config.defaultValue ?? false;
      }
    });
    setFilterValues(initialValues);
  }, [categorySlug, filterConfigs]);

  const applyFilters = useCallback((
    products: Product[],
    values: FilterValues,
    configs: FilterConfig[]
  ): Product[] => {
    return products.filter((product) => {
      const attrs = product.categoryAttributes;
      if (!attrs) return true;

      return configs.every((config) => {
        const value = values[config.id];
        const attrValue = (attrs as any)[config.id];

        // Skip if no filter value or default "all" value
        if (value === undefined || value === 'all') return true;

        switch (config.type) {
          case 'range':
            if (attrValue === undefined || attrValue === null) return true;
            const [min, max] = value as [number, number];
            return attrValue >= min && attrValue <= max;

          case 'multiSelect':
            if (!Array.isArray(value) || value.length === 0) return true;
            if (!attrValue) return false;

            // If attrValue is an array (product has multiple values)
            if (Array.isArray(attrValue)) {
              return value.some((filterVal) =>
                attrValue.some((prodVal) => String(prodVal) === String(filterVal))
              );
            }
            // If attrValue is a single value
            return value.some((filterVal) => String(attrValue) === String(filterVal));

          case 'singleSelect':
            if (value === 'all') return true;
            if (attrValue === undefined || attrValue === null) return false;

            // Handle boolean values
            if (typeof attrValue === 'boolean') {
              return String(attrValue) === String(value);
            }

            // Handle string/number values
            return String(attrValue) === String(value);

          case 'boolean':
            if (!value) return true;
            return attrValue === true;

          default:
            return true;
        }
      });
    });
  }, []);

  // Apply filters whenever filter values change
  useEffect(() => {
    const filtered = applyFilters(products, filterValues, filterConfigs);
    onFilterChangeRef.current(filtered);
  }, [filterValues, products, filterConfigs, applyFilters]);

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterId]: value,
    }));
  };

  const clearCategoryFilters = () => {
    const clearedValues: FilterValues = {};
    filterConfigs.forEach((config) => {
      if (config.type === 'range') {
        clearedValues[config.id] = [config.min!, config.max!];
      } else if (config.type === 'multiSelect') {
        clearedValues[config.id] = [];
      } else if (config.type === 'singleSelect') {
        clearedValues[config.id] = config.defaultValue || 'all';
      } else if (config.type === 'boolean') {
        clearedValues[config.id] = false;
      }
    });
    setFilterValues(clearedValues);
  };

  // Check if any filters are active
  const hasActiveFilters = filterConfigs.some((config) => {
    const value = filterValues[config.id];
    if (config.type === 'range') {
      const [min, max] = value || [config.min, config.max];
      return min !== config.min || max !== config.max;
    }
    if (config.type === 'multiSelect') {
      return Array.isArray(value) && value.length > 0;
    }
    if (config.type === 'singleSelect') {
      return value !== 'all' && value !== config.defaultValue;
    }
    if (config.type === 'boolean') {
      return value === true;
    }
    return false;
  });

  if (filterConfigs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <h3 className={`text-lg font-bold ${getTextClass()}`}>Specifications</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearCategoryFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 font-medium transition-all rounded-lg shadow-md hover:shadow-lg"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Specs
          </button>
        )}
      </div>

      <div className="space-y-6 divide-y divide-gray-200">
        {filterConfigs.map((config) => {
          const value = filterValues[config.id];

          switch (config.type) {
            case 'range':
              return (
                <div key={config.id} className="pt-6 first:pt-0">
                  <RangeFilter
                    id={config.id}
                    label={config.label}
                    min={config.min!}
                    max={config.max!}
                    step={config.step!}
                    unit={config.unit}
                    value={value || [config.min!, config.max!]}
                    onChange={(newValue) => handleFilterChange(config.id, newValue)}
                  />
                </div>
              );

            case 'multiSelect':
              return (
                <div key={config.id} className="pt-6 first:pt-0">
                  <MultiSelectFilter
                    id={config.id}
                    label={config.label}
                    options={config.options || []}
                    value={value || []}
                    onChange={(newValue) => handleFilterChange(config.id, newValue)}
                  />
                </div>
              );

            case 'singleSelect':
              return (
                <div key={config.id} className="pt-6 first:pt-0">
                  <SingleSelectFilter
                    id={config.id}
                    label={config.label}
                    options={config.options || []}
                    value={value || config.defaultValue || 'all'}
                    onChange={(newValue) => handleFilterChange(config.id, newValue)}
                  />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
