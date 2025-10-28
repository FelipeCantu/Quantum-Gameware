// src/components/ui/SignInAlert.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface SignInAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function SignInAlert({ isOpen, onClose, message }: SignInAlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  // Ensure we're on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure smooth animation
      setTimeout(() => setIsVisible(true), 10);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const handleSignIn = () => {
    handleClose();
    setTimeout(() => router.push('/auth/signin'), 300);
  };

  const handleSignUp = () => {
    handleClose();
    setTimeout(() => router.push('/auth/signup'), 300);
  };

  if (!isOpen || !isMounted) return null;

  // Render the modal using a portal to document.body
  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-lg z-[9998] transition-all duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Alert Modal */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none">
        <div
          className={`relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-[90vw] sm:max-w-lg mx-auto border-2 border-white/30 overflow-hidden transform transition-all duration-500 pointer-events-auto ${
            isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-8'
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signin-alert-title"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Gradient Orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            {/* Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 p-1.5 sm:p-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm transition-all duration-200 group z-20 hover:scale-110 active:scale-95"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content */}
          <div className="relative p-5 sm:p-6 md:p-8 lg:p-10">
            {/* Icon */}
            <div className="mb-5 sm:mb-6 lg:mb-8 flex justify-center">
              <div className="relative">
                {/* Animated glow - larger and more vibrant */}
                <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-pink-400 via-blue-400 to-purple-400 rounded-full blur-2xl opacity-70 animate-pulse"></div>

                {/* Icon container with better sizing */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-500 via-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/20 backdrop-blur-sm">
                  <svg
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white drop-shadow-2xl"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 id="signin-alert-title" className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3 lg:mb-4 text-center leading-tight px-2">
              Sign In Required
            </h3>

            {/* Message */}
            <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg mb-5 sm:mb-6 lg:mb-8 leading-relaxed text-center max-w-md mx-auto px-2">
              {message || 'Please sign in to save items to your wishlist and access them across all your devices.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <button
                onClick={handleSignIn}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm sm:text-base rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </button>

              <button
                onClick={handleSignUp}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 lg:py-3.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold text-sm sm:text-base rounded-lg sm:rounded-xl border-2 border-white/40 hover:border-white/60 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Create Account</span>
              </button>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleClose}
              className="w-full text-white/70 hover:text-white text-xs sm:text-sm lg:text-base transition-all duration-200 py-1.5 sm:py-2 hover:underline font-medium"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
