// File: src/components/ReturnRequestForm.tsx
'use client';

import { useState } from 'react';
import { Order } from '@/services/orderService';
import { ReturnReason, ReturnService, ReturnItem } from '@/services/returnService';
import Image from 'next/image';

interface ReturnRequestFormProps {
  order: Order;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReturnRequestForm({ order, onSuccess, onCancel }: ReturnRequestFormProps) {
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [reason, setReason] = useState<ReturnReason>('changed_mind');
  const [reasonDetails, setReasonDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const returnReasons: { value: ReturnReason; label: string; icon: string }[] = [
    { value: 'defective', label: 'Defective/Not Working', icon: '⚠️' },
    { value: 'wrong_item', label: 'Wrong Item Received', icon: '📦' },
    { value: 'not_as_described', label: 'Not as Described', icon: '📝' },
    { value: 'changed_mind', label: 'Changed Mind', icon: '💭' },
    { value: 'damaged_in_shipping', label: 'Damaged in Shipping', icon: '📮' },
    { value: 'wrong_size', label: 'Wrong Size/Fit', icon: '📏' },
    { value: 'other', label: 'Other', icon: '✏️' },
  ];

  const handleItemToggle = (itemId: string, maxQuantity: number) => {
    const newSelected = new Map(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.set(itemId, maxQuantity);
    }
    setSelectedItems(newSelected);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    const newSelected = new Map(selectedItems);
    if (quantity > 0) {
      newSelected.set(itemId, quantity);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const calculateRefundAmount = () => {
    let total = 0;
    selectedItems.forEach((quantity, itemId) => {
      const item = order.items.find(i => i.id === itemId);
      if (item) {
        total += item.price * quantity;
      }
    });
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedItems.size === 0) {
      setError('Please select at least one item to return');
      return;
    }

    if (!reasonDetails.trim() && (reason === 'other' || ['defective', 'damaged_in_shipping', 'not_as_described'].includes(reason))) {
      setError('Please provide details about the issue');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build return items array
      const returnItems: ReturnItem[] = Array.from(selectedItems.entries()).map(([itemId, quantity]) => {
        const orderItem = order.items.find(i => i.id === itemId)!;
        return {
          orderItemId: itemId,
          productId: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          returnQuantity: quantity,
          image: orderItem.image,
        };
      });

      const refundAmount = calculateRefundAmount();

      // Create return request
      const returnRequest = ReturnService.createReturn({
        orderId: order.id,
        orderNumber: order.id.substring(0, 8).toUpperCase(),
        items: returnItems,
        reason,
        reasonDetails,
        refundAmount,
        refundMethod: 'original_payment',
      });

      // Call API to create return
      const response = await fetch('/api/returns/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.id.substring(0, 8).toUpperCase(),
          items: returnItems,
          reason,
          reasonDetails,
          refundAmount,
          refundMethod: 'original_payment',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit return request');
      }

      onSuccess();
    } catch (err) {
      console.error('Error submitting return:', err);
      setError('Failed to submit return request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const refundAmount = calculateRefundAmount();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[9999] flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-2xl sm:rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-slideUp">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-orange-600/20 to-red-600/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">Return Request</h2>
                  <p className="text-white/60 text-sm sm:text-base mt-1">Order #{order.id.substring(0, 12).toUpperCase()}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 flex items-center justify-center flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Select Items Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📦</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Select Items to Return</h3>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  const returnQty = selectedItems.get(item.id) || item.quantity;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleItemToggle(item.id, item.quantity)}
                      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Checkbox */}
                        <div className="flex items-center pt-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 border-white/30 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer transition-all"
                          />
                        </div>

                        {/* Image */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-lg sm:rounded-xl flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-sm sm:text-base mb-1 truncate">{item.name}</h4>
                          <p className="text-xs sm:text-sm text-white/60 mb-2">
                            ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × {item.quantity}
                          </p>

                          {/* Quantity Selector */}
                          {isSelected && item.quantity > 1 && (
                            <div className="mt-3 flex items-center gap-2 animate-fadeIn">
                              <label className="text-xs sm:text-sm text-white/80 font-medium">Qty:</label>
                              <select
                                value={returnQty}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(item.id, parseInt(e.target.value));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-sm hover:bg-white/20 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                              >
                                {Array.from({ length: item.quantity }, (_, i) => i + 1).map((num) => (
                                  <option key={num} value={num}>
                                    {num}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-white text-sm sm:text-base">
                            ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Return Reason */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">💭</span>
                </div>
                <label className="text-lg sm:text-xl font-semibold text-white">
                  Reason for Return <span className="text-red-400">*</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {returnReasons.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setReason(r.value)}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                      reason === r.value
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/50 shadow-lg shadow-purple-500/20'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{r.icon}</span>
                      <span className={`font-medium text-sm sm:text-base ${reason === r.value ? 'text-white' : 'text-white/80'}`}>
                        {r.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">✏️</span>
                </div>
                <label className="text-lg sm:text-xl font-semibold text-white">
                  Additional Details
                  {['other', 'defective', 'damaged_in_shipping', 'not_as_described'].includes(reason) && (
                    <span className="text-red-400"> *</span>
                  )}
                </label>
              </div>

              <textarea
                value={reasonDetails}
                onChange={(e) => setReasonDetails(e.target.value)}
                rows={4}
                placeholder="Please provide more details about your return request..."
                className="w-full bg-white/10 border-2 border-white/20 rounded-xl sm:rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all text-sm sm:text-base"
                required={['other', 'defective', 'damaged_in_shipping', 'not_as_described'].includes(reason)}
              />
            </div>

            {/* Refund Summary */}
            {selectedItems.size > 0 && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 shadow-lg shadow-green-500/20 animate-fadeIn">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-white font-semibold text-base sm:text-lg">Estimated Refund</span>
                  </div>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-300">
                    ${refundAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-start gap-2 bg-black/20 rounded-lg p-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs sm:text-sm text-green-200/90 leading-relaxed">
                    Refund will be processed to your original payment method within <strong>5-10 business days</strong> after we receive and inspect the returned item(s).
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border-2 border-red-400/40 rounded-xl sm:rounded-2xl p-4 animate-shake">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-200 text-sm sm:text-base">{error}</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/10 bg-black/20">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/30 text-white font-semibold transition-all duration-300 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting || selectedItems.size === 0}
              className="flex-1 px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-600 disabled:hover:to-red-600 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Return Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
