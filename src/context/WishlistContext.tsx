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
      console.log('Not authenticated');
      return false;
    }

    try {
      console.log('Adding to wishlist:', productId);
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      console.log('Response status:', response.status, response.statusText);
      const data = await response.json();
      console.log('Wishlist API response:', data);

      if (response.ok) {
        setWishlist(data.wishlist);
        return true;
      } else {
        console.error('Wishlist API error - Status:', response.status, 'Data:', data);
        return false;
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      console.log('Not authenticated');
      return false;
    }

    try {
      console.log('Removing from wishlist:', productId);
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      console.log('Remove wishlist API response:', data);

      if (response.ok) {
        setWishlist(data.wishlist);
        return true;
      } else {
        console.error('Remove wishlist API error:', data);
        return false;
      }
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
