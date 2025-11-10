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
  const { user, refreshUser } = useAuth();
  const [theme, setThemeState] = useState<Theme>('light');

  // Load theme from user preferences or localStorage
  useEffect(() => {
    if (user) {
      // User is logged in - use their database preference
      if (user.preferences?.theme && (user.preferences.theme === 'light' || user.preferences.theme === 'dark')) {
        setThemeState(user.preferences.theme);
        localStorage.setItem('theme', user.preferences.theme);
        console.log('✅ Theme loaded from user preferences:', user.preferences.theme);
      } else if (user.preferences?.theme === 'system') {
        // If user has 'system' preference, default to 'light' for now
        setThemeState('light');
        localStorage.setItem('theme', 'light');
      } else {
        // No preference in database, check localStorage
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

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    // If user is logged in, save theme to database
    if (user) {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              preferences: {
                ...user.preferences,
                theme: newTheme
              }
            })
          });

          if (response.ok) {
            console.log('✅ Theme preference saved to database');

            // Update localStorage userData with new theme preference
            const userData = localStorage.getItem('userData');
            if (userData) {
              try {
                const parsedUser = JSON.parse(userData);
                parsedUser.preferences = {
                  ...parsedUser.preferences,
                  theme: newTheme
                };
                localStorage.setItem('userData', JSON.stringify(parsedUser));
                console.log('✅ Theme preference updated in localStorage');
              } catch (error) {
                console.error('❌ Error updating localStorage userData:', error);
              }
            }

            // Refresh user data to sync the updated preference
            await refreshUser();
          } else {
            console.error('❌ Failed to save theme preference to database');
          }
        }
      } catch (error) {
        console.error('❌ Error saving theme preference:', error);
      }
    }
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
