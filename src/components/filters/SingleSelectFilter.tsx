'use client';

import { useTheme } from '@/context/ThemeContext';

interface FilterOption {
  label: string;
  value: string | number | boolean;
}

interface SingleSelectFilterProps {
  id: string;
  label: string;
  options: FilterOption[];
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

export default function SingleSelectFilter({
  id,
  label,
  options,
  value,
  onChange,
}: SingleSelectFilterProps) {
  const { getTextClass, getInputBgClass } = useTheme();

  return (
    <div className="space-y-3">
      <label htmlFor={id} className={`text-sm font-semibold ${getTextClass()} flex items-center gap-2`}>
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={String(value)}
          onChange={(e) => {
            const selectedOption = options.find(
              (opt) => String(opt.value) === e.target.value
            );
            if (selectedOption) {
              onChange(selectedOption.value);
            }
          }}
          className={`w-full px-4 py-2.5 pr-10 text-sm ${getInputBgClass()} ${getTextClass()} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50 appearance-none font-medium shadow-sm`}
        >
          {options.map((option) => (
            <option key={String(option.value)} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
