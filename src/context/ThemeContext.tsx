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

  // Helper classes read the design tokens (src/styles/tokens.css), which already switch on
  // .dark, so light and dark return the same class.
  const getBgClass = () => 'bg-[var(--c-bg)]';
  const getCardBgClass = () => 'bg-[var(--c-paper)]';
  const getTextClass = () => 'text-[var(--c-fg)]';
  const getSecondaryTextClass = () => 'text-[var(--c-muted)]';
  const getMutedTextClass = () => 'text-[var(--c-muted)]';
  const getBorderClass = () => 'border-[var(--c-line)]';
  const getInputBgClass = () => 'bg-[var(--c-paper)] border-[var(--c-line-strong)]';
  const getHoverBgClass = () => 'hover:bg-[var(--c-line)]';

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
