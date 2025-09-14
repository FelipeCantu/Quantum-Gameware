// components/ui/Header/UserMenu.tsx
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface UserMenuProps {
  isScrolled: boolean;
}

// This would typically come from your auth context/provider
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export default function UserMenu({ isScrolled }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false); // Replace with actual auth state
  const [user, setUser] = useState<User | null>(null); // Replace with actual user data
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simulate auth state - replace with your actual auth logic
  useEffect(() => {
    // Example: check for auth token, user session, etc.
    const checkAuthState = () => {
      // This is where you'd check your auth provider
      // setIsSignedIn(!!authToken);
      // setUser(userData);
    };
    
    checkAuthState();
  }, []);

  const handleSignOut = async () => {
    try {
      // Add your sign out logic here
      // await signOut();
      setIsSignedIn(false);
      setUser(null);
      setIsOpen(false);
      
      // Optional: redirect to home page
      // window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const buttonClasses = `p-2.5 group rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 active:scale-95 flex-shrink-0 ${
    isScrolled 
      ? 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
      : 'hover:bg-white/10'
  }`;

  // Show sign in button when not authenticated
  if (!isSignedIn) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          href="/auth/signin"
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
            isScrolled
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30'
          }`}
        >
          Sign In
        </Link>
        
        {/* Optional: Add Sign Up button */}
        <Link
          href="/auth/signup"
          className={`hidden sm:block px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
            isScrolled
              ? 'text-blue-600 hover:bg-blue-50 border border-blue-200'
              : 'text-white hover:bg-white/10 border border-white/30'
          }`}
        >
          Sign Up
        </Link>
      </div>
    );
  }

  // Show user menu when authenticated
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonClasses} flex items-center space-x-2`}
        aria-label="User menu"
      >
        {user?.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            isScrolled ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
          }`}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        
        <svg 
          className={`hidden sm:block h-4 w-4 transition-all duration-300 ${
            isOpen ? 'rotate-180' : ''
          } ${
            isScrolled ? 'text-gray-600' : 'text-white'
          }`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          {/* User Info Header */}
          {user && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">{user.name || 'User'}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              My Account
            </Link>
            
            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              My Orders
            </Link>
            
            <Link
              href="/wishlist"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
            </Link>
            
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors group"
            >
              <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>

            <div className="border-t border-gray-100 my-2"></div>

            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <svg className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}