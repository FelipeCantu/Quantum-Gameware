// src/context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  getBgClass: () => string;
  getCardBgClass: () => string;
  getTextClass: () => string;
  getSecondaryTextClass: () => string;
  getMutedTextClass: () => string;
  getBorderClass: () => string;
  getInputBgClass: () => string;
  getHoverBgClass: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  // Detect and track system theme preference
  useEffect(() => {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      // Set initial system theme
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

      // Listen for changes to system theme preference
      const handler = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handler);

      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, []);

  // Calculate effective theme based on user preference
  const effectiveTheme: 'light' | 'dark' = theme === 'system' ? systemTheme : theme;

  // Set theme preference and save to localStorage
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Helper functions to get appropriate classes
  const getBgClass = () => {
    return effectiveTheme === 'light'
      ? 'bg-gradient-to-br from-gray-50 to-gray-100'
      : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
  };

  const getCardBgClass = () => {
    return effectiveTheme === 'light'
      ? 'bg-white'
      : 'bg-slate-800/50';
  };

  const getTextClass = () => {
    return effectiveTheme === 'light'
      ? 'text-gray-900'
      : 'text-gray-50';
  };

  const getSecondaryTextClass = () => {
    return effectiveTheme === 'light'
      ? 'text-gray-600'
      : 'text-gray-300';
  };

  const getMutedTextClass = () => {
    return effectiveTheme === 'light'
      ? 'text-gray-500'
      : 'text-gray-400';
  };

  const getBorderClass = () => {
    return effectiveTheme === 'light'
      ? 'border-gray-200'
      : 'border-slate-700';
  };

  const getInputBgClass = () => {
    return effectiveTheme === 'light'
      ? 'bg-white border-gray-300'
      : 'bg-slate-800 border-slate-600';
  };

  const getHoverBgClass = () => {
    return effectiveTheme === 'light'
      ? 'hover:bg-gray-50'
      : 'hover:bg-slate-700/50';
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      effectiveTheme,
      setTheme,
      getBgClass,
      getCardBgClass,
      getTextClass,
      getSecondaryTextClass,
      getMutedTextClass,
      getBorderClass,
      getInputBgClass,
      getHoverBgClass
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
