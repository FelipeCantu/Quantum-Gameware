// src/context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark';

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
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>('light');

  // Load theme from user preferences or localStorage
  useEffect(() => {
    if (user) {
      // User is logged in - use their preference or saved theme
      if (user.preferences?.theme && (user.preferences.theme === 'light' || user.preferences.theme === 'dark')) {
        setThemeState(user.preferences.theme);
      } else {
        const savedTheme = localStorage.getItem('theme') as Theme;
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
          setThemeState(savedTheme);
        } else {
          setThemeState('light');
          localStorage.setItem('theme', 'light');
        }
      }
    } else {
      // User is NOT logged in - always default to light theme
      setThemeState('light');
      localStorage.setItem('theme', 'light');
    }
  }, [user]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Theme is always the effective theme (no system resolution needed)
  const effectiveTheme: 'light' | 'dark' = theme;

  // Helper functions to get appropriate classes
  const getBgClass = () => {
    return effectiveTheme === 'light'
      ? 'bg-white'
      : 'bg-gray-900';
  };

  const getCardBgClass = () => {
    return effectiveTheme === 'light'
      ? 'bg-white/90'
      : 'bg-white/10';
  };

  const getTextClass = () => {
    return effectiveTheme === 'light'
      ? 'text-gray-900'
      : 'text-white';
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
      : 'border-white/20';
  };

  const getInputBgClass = () => {
    return effectiveTheme === 'light'
      ? 'bg-white border-gray-300'
      : 'bg-white/10 border-white/30';
  };

  const getHoverBgClass = () => {
    return effectiveTheme === 'light'
      ? 'hover:bg-gray-50'
      : 'hover:bg-white/5';
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
