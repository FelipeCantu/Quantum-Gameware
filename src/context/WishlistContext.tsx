// src/context/WishlistContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (productId: string) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isLoading: boolean;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated, user]);

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/wishlist');

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWishlist = async () => {
    await fetchWishlist();
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlist.includes(productId);
  };

  const addToWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      return false;
    }
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (isInWishlist(productId)) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isLoading,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
