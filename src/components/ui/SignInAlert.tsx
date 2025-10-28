// src/components/ui/SignInAlert.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SignInAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function SignInAlert({ isOpen, onClose, message }: SignInAlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md z-[9998] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Alert Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full border-2 border-white/30 overflow-hidden transform transition-all duration-300 pointer-events-auto ${
            isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group z-20 hover:scale-110"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 group-hover:text-white transition-colors"
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
          <div className="relative p-6 sm:p-8 md:p-10">
            {/* Icon */}
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div className="relative">
                {/* Animated glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-60 animate-pulse"></div>

                {/* Icon container */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/10">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 text-center leading-tight">
              Sign In Required
            </h3>

            {/* Message */}
            <p className="text-white/80 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed text-center max-w-sm mx-auto px-2">
              {message || 'Please sign in to save items to your wishlist and access them across all your devices.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mb-4">
              <button
                onClick={handleSignIn}
                className="w-full px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </button>

              <button
                onClick={handleSignUp}
                className="w-full px-6 py-3 sm:py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </button>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleClose}
              className="w-full text-white/60 hover:text-white text-sm sm:text-base transition-colors py-2 hover:underline"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
