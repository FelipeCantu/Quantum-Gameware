// src/context/AuthContext.tsx - Fixed for Vercel deployment
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Enhanced types for real user data
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
  initialized: boolean; // NEW: Track if auth has been initialized
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
  phone?: string;
  agreeToTerms: boolean;
  subscribeToMarketing?: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<{ success: boolean; error?: string }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
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
  const [initialized, setInitialized] = useState(false);

  // Check for existing session on mount - FIXED VERSION
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Ensure we're in the browser
        if (typeof window === 'undefined') {
          setLoading(false);
          setInitialized(true);
          return;
        }

        console.log('🔐 Initializing auth...');

        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (!token || !userData) {
          console.log('❌ No token or user data found');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          setInitialized(true);
          return;
        }

        try {
          const parsedUser = JSON.parse(userData);
          console.log('📄 Found stored user:', parsedUser.email);
          
          // For demo tokens, validate format and set user immediately
          if (token.startsWith('demo_token_')) {
            console.log('✅ Demo token detected, setting user');
            setUser(parsedUser);
            setIsAuthenticated(true);
            setLoading(false);
            setInitialized(true);
            return;
          }
          
          // For production tokens, verify with backend
          console.log('🔍 Verifying token with backend...');
          const response = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const result = await response.json();
            if (result.valid && result.user) {
              console.log('✅ Token verified, user authenticated');
              setUser(result.user);
              setIsAuthenticated(true);
              
              // Update localStorage with fresh user data
              localStorage.setItem('userData', JSON.stringify(result.user));
            } else {
              console.log('❌ Token verification failed');
              // Invalid token, clear storage
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              setUser(null);
              setIsAuthenticated(false);
            }
          } else {
            console.log('❌ Token verification request failed');
            // Token verification failed, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (parseError) {
          console.error('❌ Error parsing stored data:', parseError);
          // Clear corrupted data
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        // Clear potentially corrupted data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        console.log('🏁 Auth initialization complete');
        setLoading(false);
        setInitialized(true);
      }
    };

    // Initialize auth immediately
    initializeAuth();
  }, []);

  const signIn = async (credentials: SignInCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔑 Starting sign in process...');
      setLoading(true);
      
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        console.log('✅ Sign in successful');
        
        // Store auth data
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        console.log('❌ Sign in failed:', data.message);
        return { success: false, error: data.message || 'Invalid credentials' };
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (credentials: SignUpCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📝 Starting sign up process...');
      setLoading(true);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        console.log('✅ Sign up successful');
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userData', JSON.stringify(data.user));
        }
        
        setUser(data.user);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        console.log('❌ Sign up failed:', data.message);
        return { success: false, error: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('❌ Sign up error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('🚪 Signing out...');
      
      // Call backend to sign out
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('❌ Sign out API error:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Sign out complete');
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user || !isAuthenticated) {
        return { success: false, error: 'Not authenticated' };
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, error: 'No authentication token' };
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        const updatedUser = data.user;
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('userData', JSON.stringify(updatedUser));
        }
        setUser(updatedUser);
        
        console.log('✅ Profile updated successfully');
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Update failed' };
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return { success: false, error: 'Update failed. Please try again.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return { success: false, error: 'Invalid email address' };
      }
      
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Reset failed' };
      }
    } catch (error) {
      console.error('❌ Password reset error:', error);
      return { success: false, error: 'Reset failed. Please try again.' };
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.valid && result.user) {
          setUser(result.user);
          localStorage.setItem('userData', JSON.stringify(result.user));
        }
      }
    } catch (error) {
      console.error('❌ User refresh error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    initialized,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}