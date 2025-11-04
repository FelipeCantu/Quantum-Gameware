// File: src/components/ReturnRequestForm.tsx
'use client';

import { useState } from 'react';
import { Order } from '@/services/orderService';
import { ReturnReason, ReturnService, ReturnItem } from '@/services/returnService';

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

  const returnReasons: { value: ReturnReason; label: string }[] = [
    { value: 'defective', label: 'Defective/Not Working' },
    { value: 'wrong_item', label: 'Wrong Item Received' },
    { value: 'not_as_described', label: 'Not as Described' },
    { value: 'changed_mind', label: 'Changed Mind' },
    { value: 'damaged_in_shipping', label: 'Damaged in Shipping' },
    { value: 'wrong_size', label: 'Wrong Size/Fit' },
    { value: 'other', label: 'Other' },
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Return Request</h2>
            <button
              onClick={onCancel}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-white/60 mt-2">Order #{order.id.substring(0, 8).toUpperCase()}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Select Items */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Select Items to Return</h3>
            <div className="space-y-3">
              {order.items.map((item) => {
                const isSelected = selectedItems.has(item.id);
                const returnQty = selectedItems.get(item.id) || item.quantity;

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-400/30'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleItemToggle(item.id, item.quantity)}
                        className="mt-1 w-5 h-5 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500"
                      />
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <p className="text-sm text-white/60 mt-1">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                        {isSelected && item.quantity > 1 && (
                          <div className="mt-2 flex items-center gap-2">
                            <label className="text-sm text-white/80">Return Quantity:</label>
                            <select
                              value={returnQty}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
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
                      <div className="text-right">
                        <p className="font-semibold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Return Reason */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Reason for Return <span className="text-red-400">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReturnReason)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {returnReasons.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Additional Details
              {['other', 'defective', 'damaged_in_shipping', 'not_as_described'].includes(reason) && (
                <span className="text-red-400"> *</span>
              )}
            </label>
            <textarea
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              rows={4}
              placeholder="Please provide more details about your return..."
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required={['other', 'defective', 'damaged_in_shipping', 'not_as_described'].includes(reason)}
            />
          </div>

          {/* Refund Summary */}
          {selectedItems.size > 0 && (
            <div className="bg-green-500/10 border border-green-400/30 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Estimated Refund</span>
                <span className="text-2xl font-bold text-green-300">
                  ${refundAmount.toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-white/60 mt-2">
                Refund will be processed to your original payment method within 5-10 business days after we receive and inspect the item(s).
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedItems.size === 0}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-all"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
