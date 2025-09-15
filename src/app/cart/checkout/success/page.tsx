// File: src/app/cart/checkout/success/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  const [orderNumber] = useState(() => 
    'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  );

  useEffect(() => {
    // Prevent back navigation to checkout
    const handlePopState = () => {
      router.replace('/products');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 pb-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto mb-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl font-bold text-white mb-4">
              Order Confirmed! 🎉
            </h1>
            <p className="text-white/80 mb-8 text-lg leading-relaxed">
              Thank you for your purchase! Your order has been successfully processed and is on its way.
            </p>

            {/* Order Details */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 text-left">
              <h2 className="text-xl font-semibold text-white mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Order Number:</span>
                  <span className="text-white font-mono font-bold">{orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Estimated Delivery:</span>
                  <span className="text-white font-semibold">
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Shipping Method:</span>
                  <span className="text-white font-semibold">Free Standard Shipping</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4 text-left bg-white/10 rounded-xl p-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Confirmation Email Sent</h3>
                  <p className="text-white/70 text-sm">Check your inbox for order confirmation and tracking details.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-left bg-white/10 rounded-xl p-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Order Processing</h3>
                  <p className="text-white/70 text-sm">We're preparing your items for shipment (1-2 business days).</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-left bg-white/10 rounded-xl p-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">On Its Way</h3>
                  <p className="text-white/70 text-sm">Track your package and get delivery updates via email and SMS.</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Continue Shopping
                </Link>
                
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border border-white/30 hover:border-white/50 backdrop-blur-sm text-lg"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Receipt
                </button>
              </div>
            </div>

            {/* Support Info */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-white/80 mb-4">Need help with your order?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a href="mailto:support@gamegear.com" className="text-white hover:text-green-300 transition-colors">
                  📧 support@gamegear.com
                </a>
                <a href="tel:+1-800-GAMEGEAR" className="text-white hover:text-green-300 transition-colors">
                  📞 1-800-GAMEGEAR
                </a>
                <Link href="/support" className="text-white hover:text-green-300 transition-colors">
                  💬 Live Chat Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}