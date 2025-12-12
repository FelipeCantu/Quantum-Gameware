'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface RangeFilterProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function RangeFilter({
  id,
  label,
  min,
  max,
  step,
  unit = '',
  value,
  onChange,
}: RangeFilterProps) {
  const { getTextClass, getInputBgClass } = useTheme();
  const [localValue, setLocalValue] = useState<[number, number]>(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value);
    const newValue: [number, number] = [newMin, localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value);
    const newValue: [number, number] = [localValue[0], newMax];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const percentage = (val: number) => ((val - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className={`text-sm font-semibold ${getTextClass()} flex items-center gap-2`}>
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          {label}
        </label>
        <span className="text-sm font-semibold text-purple-700 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full shadow-sm">
          {localValue[0]}{unit} - {localValue[1]}{unit}
        </span>
      </div>

      <div className="relative pt-2 pb-1">
        {/* Track */}
        <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full shadow-inner">
          {/* Active range highlight */}
          <div
            className="absolute h-2 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 rounded-full shadow-md"
            style={{
              left: `${percentage(localValue[0])}%`,
              right: `${100 - percentage(localValue[1])}%`,
            }}
          />
        </div>

        {/* Min slider */}
        <input
          type="range"
          id={`${id}-min`}
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 -top-0 appearance-none bg-transparent pointer-events-none
                     [&::-webkit-slider-thumb]:pointer-events-auto
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:border-3
                     [&::-webkit-slider-thumb]:border-purple-600
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:hover:scale-125
                     [&::-webkit-slider-thumb]:hover:shadow-xl
                     [&::-webkit-slider-thumb]:active:scale-110
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-moz-range-thumb]:pointer-events-auto
                     [&::-moz-range-thumb]:appearance-none
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-white
                     [&::-moz-range-thumb]:border-3
                     [&::-moz-range-thumb]:border-purple-600
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:shadow-lg
                     [&::-moz-range-thumb]:hover:scale-125
                     [&::-moz-range-thumb]:transition-all"
        />

        {/* Max slider */}
        <input
          type="range"
          id={`${id}-max`}
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 -top-0 appearance-none bg-transparent pointer-events-none
                     [&::-webkit-slider-thumb]:pointer-events-auto
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-white
                     [&::-webkit-slider-thumb]:border-3
                     [&::-webkit-slider-thumb]:border-pink-600
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:shadow-lg
                     [&::-webkit-slider-thumb]:hover:scale-125
                     [&::-webkit-slider-thumb]:hover:shadow-xl
                     [&::-webkit-slider-thumb]:active:scale-110
                     [&::-webkit-slider-thumb]:transition-all
                     [&::-moz-range-thumb]:pointer-events-auto
                     [&::-moz-range-thumb]:appearance-none
                     [&::-moz-range-thumb]:w-5
                     [&::-moz-range-thumb]:h-5
                     [&::-moz-range-thumb]:rounded-full
                     [&::-moz-range-thumb]:bg-white
                     [&::-moz-range-thumb]:border-3
                     [&::-moz-range-thumb]:border-pink-600
                     [&::-moz-range-thumb]:cursor-pointer
                     [&::-moz-range-thumb]:shadow-lg
                     [&::-moz-range-thumb]:hover:scale-125
                     [&::-moz-range-thumb]:transition-all"
        />
      </div>

      {/* Min/Max inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${id}-min-input`} className={`block text-xs font-semibold ${getTextClass()} mb-2`}>
            Minimum
          </label>
          <div className="relative">
            <input
              type="number"
              id={`${id}-min-input`}
              min={min}
              max={localValue[1]}
              step={step}
              value={localValue[0]}
              onChange={handleMinChange}
              className={`w-full px-3 py-2 text-sm ${getInputBgClass()} ${getTextClass()} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 shadow-sm hover:border-purple-400 transition-colors font-medium`}
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                {unit}
              </span>
            )}
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-max-input`} className={`block text-xs font-semibold ${getTextClass()} mb-2`}>
            Maximum
          </label>
          <div className="relative">
            <input
              type="number"
              id={`${id}-max-input`}
              min={localValue[0]}
              max={max}
              step={step}
              value={localValue[1]}
              onChange={handleMaxChange}
              className={`w-full px-3 py-2 text-sm ${getInputBgClass()} ${getTextClass()} rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-sm hover:border-pink-400 transition-colors font-medium`}
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">
                {unit}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
