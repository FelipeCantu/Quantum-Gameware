// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-16">
        <div className="max-w-lg mx-auto text-center px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            {/* 404 Number */}
            <div className="text-8xl lg:text-9xl font-bold text-white/30 mb-6 leading-none">
              404
            </div>
            
            {/* Error Icon */}
            <div className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Page Not Found
            </h1>
            <p className="text-white/80 mb-10 text-lg leading-relaxed">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </Link>
              
              <div className="flex space-x-4">
                <Link
                  href="/products"
                  className="flex-1 inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Shop Products
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Popular Links */}
            <div className="mt-10 pt-8 border-t border-white/20">
              <h3 className="text-white font-semibold mb-4">Popular Pages</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Link href="/categories" className="text-white/80 hover:text-white transition-colors">
                  Categories
                </Link>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
                <Link href="/cart" className="text-white/80 hover:text-white transition-colors">
                  Shopping Cart
                </Link>
                <Link href="/help" className="text-white/80 hover:text-white transition-colors">
                  Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}