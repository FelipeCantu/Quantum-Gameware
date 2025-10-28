// src/components/ui/WishlistButton.tsx
'use client';

import { useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import SignInAlert from './SignInAlert';
import Toast from './Toast';

interface WishlistButtonProps {
  productSlug: string;
  productName: string;
  variant?: 'default' | 'compact';
}

export default function WishlistButton({ productSlug, productName, variant = 'default' }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [showSignInAlert, setShowSignInAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const inWishlist = isInWishlist(productSlug);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      setShowSignInAlert(true);
      return;
    }

    const wasInWishlist = inWishlist;
    setIsLoading(true);
    const success = await toggleWishlist(productSlug);
    setIsLoading(false);

    if (success) {
      if (wasInWishlist) {
        setToastMessage('Removed from wishlist');
        setToastType('info');
      } else {
        setToastMessage('Added to wishlist! ❤️');
        setToastType('success');
      }
      setShowToast(true);
    } else {
      setToastMessage('Failed to update wishlist');
      setToastType('error');
      setShowToast(true);
    }
  };

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={handleWishlistToggle}
          disabled={isLoading}
          className={`
            p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center
            ${inWishlist
              ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
              : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/30 hover:border-white/50'
            }
          `}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isLoading ? (
            <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                inWishlist ? 'text-white' : 'text-white'
              }`}
              fill={inWishlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        </button>

        <SignInAlert
          isOpen={showSignInAlert}
          onClose={() => setShowSignInAlert(false)}
          message="Please sign in to save items to your wishlist and access them across all your devices."
        />

        <Toast
          message={toastMessage}
          type={toastType}
          isOpen={showToast}
          onClose={() => setShowToast(false)}
        />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleWishlistToggle}
        disabled={isLoading}
        className={`
          w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 sm:gap-3
          ${inWishlist
            ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
            : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 hover:border-white/50'
          }
        `}
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{inWishlist ? 'Removing...' : 'Adding...'}</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill={inWishlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
          </>
        )}
      </button>

      <SignInAlert
        isOpen={showSignInAlert}
        onClose={() => setShowSignInAlert(false)}
        message="Please sign in to save items to your wishlist and access them across all your devices."
      />

      <Toast
        message={toastMessage}
        type={toastType}
        isOpen={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
