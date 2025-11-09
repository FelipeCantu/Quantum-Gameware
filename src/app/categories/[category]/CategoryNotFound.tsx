'use client';

import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

export default function CategoryNotFound() {
  const { getCardBgClass, getBorderClass, getTextClass, getSecondaryTextClass } = useTheme();

  return (
    <div className="relative z-10 flex items-center justify-center min-h-[50vh]">
      <div className="max-w-md mx-auto text-center px-4">
        <div className={`${getCardBgClass()} rounded-3xl p-12 border ${getBorderClass()} shadow-sm`}>
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className={`w-10 h-10 ${getSecondaryTextClass()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className={`text-3xl font-bold ${getTextClass()} mb-4`}>Category Not Found</h1>
          <p className={`${getSecondaryTextClass()} mb-8 text-lg leading-relaxed`}>
            We couldn&apos;t find the category you&apos;re looking for.
          </p>
          <div className="space-y-4">
            <Link
              href="/categories"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Browse All Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
