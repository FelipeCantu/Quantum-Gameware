// src/app/products/[slug]/NotFound.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern - same as other pages */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen pt-20 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-8 md:p-12 border border-white/20 animate-fade-in">
            <div className="text-5xl md:text-6xl mb-4 md:mb-6">😕</div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">
              Product Not Found
            </h1>
            <p className="text-white/80 mb-6 md:mb-8 text-sm md:text-base">
              Sorry, we couldn&apos;t find the product you&apos;re looking for.
            </p>
            <div className="space-y-2 md:space-y-3">
              <Link
                href="/products"
                className="block w-full bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold transition-colors text-sm md:text-base"
              >
                Browse All Products
              </Link>
              <Link
                href="/categories"
                className="block w-full border-2 border-white/30 text-white hover:bg-white/10 px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold transition-colors text-sm md:text-base"
              >
                Shop by Category
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}