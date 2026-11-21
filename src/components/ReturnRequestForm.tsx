// src/components/ReturnRequestForm.tsx: the return request dialog (DESIGN.md, "Account"). Selection, refund
// math and submission are unchanged. Items are real checkboxes (they were clickable divs a keyboard could
// not reach), reasons a radio group, and the dialog closes on Escape. Styles in styles/commerce.css.
'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Order } from '@/services/orderService';
import { ReturnReason, ReturnService, ReturnItem } from '@/services/returnService';
import { LinePlate } from '@/components/commerce/Shop';

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

  const detailsRequired = ['other', 'defective', 'damaged_in_shipping', 'not_as_described'].includes(reason);
  const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // A modal dialog: Escape cancels, focus starts in the dialog, the page behind does not scroll.
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancelRef.current(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Portalled to <body> so no stacking context in the page (the content wrapper) can sit it under the header.
  return createPortal(
    <div className="modal">
      <div className="modal__scrim" onClick={onCancel} aria-hidden="true" />
      <div ref={dialogRef} className="modal__panel" role="dialog" aria-modal="true" aria-labelledby="ret-title" tabIndex={-1}>
        <div className="drawer__head">
          <div>
            <h2 id="ret-title" className="drawer__title">Start a return</h2>
            <p className="field__hint mono">Order {order.id.substring(0, 12).toUpperCase()}</p>
          </div>
          <button type="button" className="drawer__close" onClick={onCancel}>
            Close
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 3 6 6M9 3 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </button>
        </div>

        <form id="return-form" onSubmit={handleSubmit} className="modal__body form">
          <fieldset className="choices">
            <legend>What is coming back?</legend>
            {order.items.map((item) => {
              const isSelected = selectedItems.has(item.id);
              const returnQty = selectedItems.get(item.id) || item.quantity;
              return (
                <div key={item.id} className="ret-item" data-selected={isSelected ? '' : undefined}>
                  <label className="ret-item__pick">
                    <input type="checkbox" checked={isSelected} onChange={() => handleItemToggle(item.id, item.quantity)} />
                    <LinePlate image={item.image} name={item.name} />
                    <span>
                      <span className="line__name" style={{ display: 'block' }}>{item.name}</span>
                      <span className="line__meta"><span className="mono">{money(item.price)}</span> × <span className="mono">{item.quantity}</span></span>
                    </span>
                  </label>
                  {isSelected && item.quantity > 1 && (
                    <label className="ret-item__qty">
                      <span className="field__hint">Return</span>
                      <select className="field__input" value={returnQty} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}>
                        {Array.from({ length: item.quantity }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>
              );
            })}
          </fieldset>

          <fieldset className="choices">
            <legend>Why?</legend>
            <div className="ret-reasons">
              {returnReasons.map((r) => (
                <label key={r.value} className="choice" data-on={reason === r.value ? "" : undefined}>
                  <input type="radio" name="return-reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} />
                  <span className="choice__label">{r.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="ret-details" className="field__label">
              Details {detailsRequired ? <span className="field__opt">Required for this reason</span> : <span className="field__opt">Optional</span>}
            </label>
            <textarea
              id="ret-details"
              className="field__input"
              value={reasonDetails}
              onChange={(e) => setReasonDetails(e.target.value)}
              rows={4}
              placeholder="What happened? Photos help with damage; reply to the confirmation email with them."
              required={detailsRequired}
            />
          </div>

          {selectedItems.size > 0 && (
            <div className="receipt">
              <dl className="receipt__rows">
                <div className="receipt__total"><dt>Estimated refund</dt><dd>{money(refundAmount)}</dd></div>
              </dl>
              <p className="receipt__note">Paid back to your original payment method within 5-10 business days after we receive and inspect the items.</p>
            </div>
          )}

          {error && (
            <div className="alert alert--error" role="alert">
              <p className="alert__text" style={{ color: 'var(--c-fg)' }}>{error}</p>
            </div>
          )}
        </form>

        <div className="drawer__foot" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" onClick={onCancel} className="linklike">Cancel</button>
          <button type="submit" form="return-form" disabled={isSubmitting || selectedItems.size === 0} aria-busy={isSubmitting} className="btn btn--solid">
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">{isSubmitting ? 'Sending…' : 'Send return request'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
