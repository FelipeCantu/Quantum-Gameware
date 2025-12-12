'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface FilterOption {
  label: string;
  value: string | number | boolean;
}

interface MultiSelectFilterProps {
  id: string;
  label: string;
  options: FilterOption[];
  value: (string | number | boolean)[];
  onChange: (value: (string | number | boolean)[]) => void;
  collapsible?: boolean;
}

export default function MultiSelectFilter({
  id,
  label,
  options,
  value,
  onChange,
  collapsible = true,
}: MultiSelectFilterProps) {
  const { getTextClass, getInputBgClass } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = (optionValue: string | number | boolean) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleSelectAll = () => {
    if (value.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((opt) => opt.value));
    }
  };

  return (
    <div className="space-y-3">
      {collapsible ? (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-full flex items-center justify-between text-sm font-semibold ${getTextClass()} hover:text-purple-600 transition-colors group`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {label}
          </span>
          <div className="flex items-center gap-2">
            {value.length > 0 && (
              <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-semibold shadow-sm">
                {value.length}
              </span>
            )}
            {isExpanded ? (
              <svg className={`w-4 h-4 ${getTextClass()} group-hover:text-purple-600 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className={`w-4 h-4 ${getTextClass()} group-hover:text-purple-600 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </button>
      ) : (
        <div className="flex items-center justify-between">
          <label className={`text-sm font-semibold ${getTextClass()} flex items-center gap-2`}>
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {label}
          </label>
          {value.length > 0 && (
            <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-semibold shadow-sm">
              {value.length}
            </span>
          )}
        </div>
      )}

      {(!collapsible || isExpanded) && (
        <div className="space-y-3 pl-1">
          {options.length > 3 && (
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-semibold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.length === options.length ? "M6 18L18 6M6 6l12 12" : "M5 13l4 4L19 7"} />
              </svg>
              {value.length === options.length ? 'Deselect All' : 'Select All'}
            </button>
          )}

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {options.map((option) => {
              const isChecked = value.includes(option.value);
              return (
                <label
                  key={String(option.value)}
                  htmlFor={`${id}-${String(option.value)}`}
                  className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      id={`${id}-${String(option.value)}`}
                      checked={isChecked}
                      onChange={() => handleToggle(option.value)}
                      className="sr-only"
                    />
                    <div
                      className={`
                        w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shadow-sm
                        ${
                          isChecked
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent scale-110'
                            : `${getInputBgClass()} border-gray-300 group-hover:border-purple-400 group-hover:bg-purple-50`
                        }
                      `}
                    >
                      {isChecked && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm transition-colors ${
                      isChecked
                        ? `${getTextClass()} font-semibold`
                        : `${getTextClass()}`
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
