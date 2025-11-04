// src/app/returns/page.tsx
import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
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

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">Returns & Exchanges</span>
          </nav>

          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden mb-8">
            <div className="p-8 lg:p-12 text-center text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Returns & Exchanges
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Not completely satisfied? We offer hassle-free returns within 30 days of delivery for most items.
              </p>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl border border-green-400/30 p-6 text-center">
              <div className="w-16 h-16 bg-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">30-Day Returns</h3>
              <p className="text-green-200 text-sm">Full refund on unused items</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-3xl border border-blue-400/30 p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Free Exchanges</h3>
              <p className="text-blue-200 text-sm">Size or color not right?</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl border border-purple-400/30 p-6 text-center">
              <div className="w-16 h-16 bg-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Quick Process</h3>
              <p className="text-purple-200 text-sm">Get your return label instantly</p>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">📋 How to Return an Item</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-300">
                  1
                </div>
                <h3 className="font-semibold text-white mb-2">Start Your Return</h3>
                <p className="text-white/80 text-sm">Visit our returns portal or contact support to begin the process.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 border border-purple-400/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-purple-300">
                  2
                </div>
                <h3 className="font-semibold text-white mb-2">Print Your Label</h3>
                <p className="text-white/80 text-sm">We'll email you a prepaid return shipping label within minutes.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 border border-green-400/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-green-300">
                  3
                </div>
                <h3 className="font-semibold text-white mb-2">Pack & Ship</h3>
                <p className="text-white/80 text-sm">Pack your item securely and drop it off at any carrier location.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-400/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-yellow-300">
                  4
                </div>
                <h3 className="font-semibold text-white mb-2">Get Your Refund</h3>
                <p className="text-white/80 text-sm">Refunds processed within 5-10 business days after we receive your return.</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                Start a Return
              </button>
            </div>
          </div>

          {/* Return Policy Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">✅ Return Eligibility Requirements</h2>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Items must be unused and in original condition with all tags attached
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All original packaging, accessories, manuals, and cables must be included
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Return initiated within 30 days of delivery date
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Valid proof of purchase (order number or receipt)
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Customer responsible for return shipping costs (unless item is defective or incorrect)
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Items must pass inspection upon return to our facility
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">❌ Non-Returnable Items</h2>
              <ul className="space-y-3 text-white/90">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Customized or personalized items
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Digital downloads and software licenses
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Items damaged by misuse or normal wear
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Items returned after 30 days
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Items without original packaging
                </li>
              </ul>
            </div>
          </div>

          {/* Exchange Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">🔄 Exchanges</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Free Exchanges For:</h3>
                <ul className="space-y-3 text-white/90">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Different size or color
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Defective or damaged items
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Wrong item received
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Exchange Process:</h3>
                <ol className="space-y-3 text-white/90">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">1</span>
                    Contact us within 30 days
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">2</span>
                    We'll send a prepaid return label
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">3</span>
                    Ship the original item back to us
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 flex-shrink-0">4</span>
                    We'll send your replacement item
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">💰 Refund Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 border border-green-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Processing Time</h3>
                <p className="text-white/80 text-sm">5-10 business days after we receive and inspect your return</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Refund Method</h3>
                <p className="text-white/80 text-sm">Issued to your original payment method (allow 3-5 additional business days for bank processing)</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-2">Refund Amount</h3>
                <p className="text-white/80 text-sm">Product price refunded. Original shipping fees are non-refundable unless the item is defective</p>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Need Help with Your Return?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our customer support team is ready to assist you with returns, exchanges, or any questions you may have.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat with Support
              </Link>
              
              <a
                href="mailto:returns@quantumgameware.com"
                className="inline-flex items-center border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Returns Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}