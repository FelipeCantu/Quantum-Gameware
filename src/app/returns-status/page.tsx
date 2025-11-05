// File: src/app/returns-status/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Link from 'next/link';
import { ReturnService, ReturnRequest } from '@/services/returnService';

function ReturnsStatusContent() {
  const { user } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load returns from localStorage
    const loadReturns = () => {
      const allReturns = ReturnService.getReturns();
      setReturns(allReturns);
      setLoading(false);
    };

    loadReturns();
  }, []);

  const getStatusProgress = (status: string): number => {
    const progressMap: Record<string, number> = {
      'requested': 20,
      'approved': 40,
      'received': 60,
      'inspecting': 80,
      'completed': 100,
      'rejected': 100,
      'cancelled': 100
    };
    return progressMap[status] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your returns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-white/80 mb-6 sm:mb-8 text-xs sm:text-sm overflow-x-auto">
          <Link href="/" className="hover:text-white transition-colors whitespace-nowrap">Home</Link>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/account" className="hover:text-white transition-colors whitespace-nowrap">Account</Link>
          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white font-medium whitespace-nowrap">My Returns</span>
        </nav>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">My Returns</h1>
          <p className="text-white/80 text-sm sm:text-base lg:text-lg">Track your return requests and refund status</p>
          {user && (
            <p className="text-white/60 text-sm mt-2">Signed in as: {user.email}</p>
          )}
        </div>

        {returns.length === 0 ? (
          /* Empty State */
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 p-8 sm:p-12 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">No Returns Yet</h3>
            <p className="text-white/70 text-sm sm:text-base mb-8 max-w-md mx-auto">
              You haven't requested any returns. If you need to return an item, you can do so from your orders page.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              View My Orders
            </Link>
          </div>
        ) : (
          /* Returns List */
          <div className="space-y-4 sm:space-y-6">
            {returns.map((returnReq) => {
              const progress = getStatusProgress(returnReq.status);

              return (
                <div
                  key={returnReq.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 p-4 sm:p-6 hover:bg-white/15 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white font-mono mb-2 break-all">
                        {returnReq.id}
                      </h3>
                      <p className="text-white/60 text-sm">
                        Order: {returnReq.orderNumber}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium border ${ReturnService.getStatusColor(returnReq.status)} w-fit`}>
                      {ReturnService.getStatusLabel(returnReq.status)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          returnReq.status === 'completed' ? 'bg-green-500' :
                          returnReq.status === 'rejected' ? 'bg-red-500' :
                          returnReq.status === 'cancelled' ? 'bg-gray-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Return Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/60 text-xs sm:text-sm mb-1">Return Reason</p>
                      <p className="text-white font-medium text-sm sm:text-base">
                        {ReturnService.getReturnReasonLabel(returnReq.reason)}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-white/60 text-xs sm:text-sm mb-1">Refund Amount</p>
                      <p className="text-white font-medium text-lg sm:text-xl">
                        ${returnReq.refundAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 sm:col-span-2 lg:col-span-1">
                      <p className="text-white/60 text-xs sm:text-sm mb-1">Requested On</p>
                      <p className="text-white font-medium text-sm sm:text-base">
                        {new Date(returnReq.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Items Being Returned */}
                  <div className="bg-white/5 rounded-2xl p-3 sm:p-4 mb-6">
                    <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Items Being Returned</h4>
                    <div className="space-y-3">
                      {returnReq.items.map((item, index) => (
                        <div key={index} className="flex items-start sm:items-center justify-between gap-3 bg-white/5 rounded-lg p-3">
                          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-xs sm:text-sm truncate">{item.name}</p>
                              <p className="text-white/60 text-xs">
                                Qty: {item.returnQuantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="text-white font-semibold text-sm sm:text-base flex-shrink-0">
                            ${(item.price * item.returnQuantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="text-white font-semibold mb-3 text-sm sm:text-base">Status Timeline</h4>
                    <div className="space-y-3">
                      {returnReq.statusHistory.map((history, index) => (
                        <div key={index} className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm sm:text-base font-medium">
                              {ReturnService.getStatusLabel(history.status)}
                            </p>
                            <p className="text-white/60 text-xs">
                              {new Date(history.timestamp).toLocaleString()}
                            </p>
                            {history.note && (
                              <p className="text-white/70 text-xs sm:text-sm mt-1">{history.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Details */}
                  {returnReq.reasonDetails && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-white/60 text-xs sm:text-sm mb-2">Additional Details</p>
                      <p className="text-white text-sm sm:text-base bg-white/5 rounded-lg p-3">{returnReq.reasonDetails}</p>
                    </div>
                  )}

                  {/* Tracking Number */}
                  {returnReq.trackingNumber && (
                    <div className="mt-4 bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                      <p className="text-blue-300 text-xs sm:text-sm mb-2">Return Tracking Number</p>
                      <p className="text-white font-mono font-semibold text-sm sm:text-base break-all">{returnReq.trackingNumber}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 sm:mt-12 bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-white/20 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Need Help with Your Return?</h2>
          <p className="text-white/80 text-sm sm:text-base mb-6">
            Our customer support team is here to assist you with your return request.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </Link>
            <Link
              href="/returns"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base"
            >
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReturnsStatusPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ReturnsStatusContent />
    </AuthGuard>
  );
}
