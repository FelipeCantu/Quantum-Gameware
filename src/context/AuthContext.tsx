// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types for our authentication system
interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  address?: UserAddress;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  role: 'customer' | 'admin';
}

interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  firstName?: string;
  lastName?: string;
  agreeToTerms: boolean;
  subscribeToMarketing?: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<{ success: boolean; error?: string }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we're in the browser
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (parseError) {
            // Invalid JSON data, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear potentially corrupted data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (credentials: SignInCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Simulate API call for now - replace with actual API endpoint
      // For testing purposes, we'll simulate a successful login
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: 'user_123',
          email: credentials.email,
          name: 'Test User',
          firstName: 'Test',
          lastName: 'User',
          avatar: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: true,
          role: 'customer'
        };

        const mockToken = 'mock_jwt_token_' + Date.now();
        
        // Store auth data
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('userData', JSON.stringify(mockUser));
        }
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        return { success: true };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: SignUpCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual endpoint
      if (credentials.email && credentials.password && credentials.name && credentials.agreeToTerms) {
        const mockUser: User = {
          id: 'user_' + Date.now(),
          email: credentials.email,
          name: credentials.name,
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          avatar: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: false,
          role: 'customer'
        };

        const mockToken = 'mock_jwt_token_' + Date.now();
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', mockToken);
          localStorage.setItem('userData', JSON.stringify(mockUser));
        }
        
        setUser(mockUser);
        setIsAuthenticated(true);
        
        return { success: true };
      }

      return { success: false, error: 'All fields are required' };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // In a real app, call logout API to invalidate token on server
      // await fetch('/api/auth/signout', { method: 'POST' });
    } finally {
      // Clear local storage and state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Simulate API call
      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      }
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Update failed. Please try again.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API call
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return { success: false, error: 'Invalid email address' };
      }
      
      // In a real app, this would send a password reset email
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Reset failed. Please try again.' };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}