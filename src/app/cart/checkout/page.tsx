// src/app/cart/checkout/page.tsx: checkout, steps 2 and 3 (DESIGN.md, "Cart and checkout"). The order and
// payment logic is unchanged; the markup moved to the system: the step strip, contact and address
// sections, payment methods as radio rows, and a sticky receipt (folded into a disclosure on phones).
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { EmailService, type EmailOrder } from '@/services/emailService';
import { StepsStrip, SummaryLine, Totals, money } from '@/components/commerce/Shop';

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  billingAddress: {
    sameAsShipping: boolean;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Card type detection function
const detectCardType = (cardNumber: string): string => {
  const number = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(number)) return 'visa';
  if (/^5[1-5]/.test(number) || /^2[2-7]/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  if (/^6/.test(number)) return 'discover';
  if (/^35/.test(number)) return 'jcb';
  if (/^30[0-5]/.test(number) || /^36/.test(number) || /^38/.test(number)) return 'diners';
  
  return 'unknown';
};


export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    paymentMethod: 'card',
    billingAddress: {
      sameAsShipping: true,
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Handle different payment methods
      if (paymentForm.paymentMethod === 'paypal') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Processing PayPal payment...');
      } else if (paymentForm.paymentMethod === 'apple_pay') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Processing Apple Pay payment...');
      } else if (paymentForm.paymentMethod === 'google_pay') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Processing Google Pay payment...');
      } else {
        // Card payment validation
        if (!paymentForm.cardNumber || paymentForm.cardNumber.replace(/\s/g, '').length < 13) {
          throw new Error('Invalid card number');
        }

        if (!paymentForm.expiryDate || !paymentForm.expiryDate.match(/^\d{2}\/\d{2}$/)) {
          throw new Error('Invalid expiry date');
        }

        if (!paymentForm.cvv || paymentForm.cvv.length < 3) {
          throw new Error('Invalid CVV');
        }

        if (!paymentForm.nameOnCard || paymentForm.nameOnCard.trim().length < 2) {
          throw new Error('Invalid name on card');
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Check for test failure scenarios
        const cardNumber = paymentForm.cardNumber.replace(/\s/g, '');
        
        if (cardNumber.startsWith('4000000000000002')) {
          throw new Error('Card declined');
        }
        
        if (cardNumber.startsWith('4000000000000341')) {
          throw new Error('Insufficient funds');
        }
      }

      // Generate transaction ID
      const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const orderId = 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      // Create order
      const order = {
        id: orderId,
        items: items.map(item => ({
          id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shipping: shippingForm,
        payment: {
          last4: paymentForm.paymentMethod === 'card' ? paymentForm.cardNumber.replace(/\s/g, '').slice(-4) : '****',
          cardType: paymentForm.paymentMethod === 'card' ? 
                   (detectCardType(paymentForm.cardNumber) === 'visa' ? 'Visa' : 
                    detectCardType(paymentForm.cardNumber) === 'mastercard' ? 'Mastercard' :
                    detectCardType(paymentForm.cardNumber) === 'amex' ? 'American Express' :
                    detectCardType(paymentForm.cardNumber) === 'discover' ? 'Discover' : 'Unknown') :
                   paymentForm.paymentMethod === 'paypal' ? 'PayPal' :
                   paymentForm.paymentMethod === 'apple_pay' ? 'Apple Pay' :
                   paymentForm.paymentMethod === 'google_pay' ? 'Google Pay' : 'Unknown',
          transactionId: transactionId
        },
        totals: {
          subtotal,
          tax,
          shipping,
          total
        },
        status: 'confirmed' as const,
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      };

      // Save order to database (for authenticated users) and localStorage (for all users)
      let savedOrderId = order.id;

      try {
        // Check if user is authenticated
        const authToken = localStorage.getItem('authToken');

        if (authToken) {
          // User is authenticated - save to database
          console.log('💾 Saving order to database for authenticated user...');

          const orderData = {
            items: items.map(item => ({
              productId: item._id,
              productSlug: item.slug || '',
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              variant: item.variant || null
            })),
            subtotal: subtotal,
            shippingCost: shipping,
            tax: tax,
            total: total,
            shipping: {
              firstName: shippingForm.firstName,
              lastName: shippingForm.lastName,
              name: `${shippingForm.firstName} ${shippingForm.lastName}`,
              email: shippingForm.email,
              phone: shippingForm.phone,
              address: {
                street: shippingForm.address,
                city: shippingForm.city,
                state: shippingForm.state,
                zipCode: shippingForm.zipCode,
                country: shippingForm.country
              },
              method: 'Standard Shipping',
              cost: shipping
            },
            payment: {
              method: paymentForm.paymentMethod === 'card' ? 'credit_card' : paymentForm.paymentMethod,
              status: 'completed',
              transactionId: transactionId,
              paidAt: new Date().toISOString()
            }
          };

          console.log('📤 Sending order data to API:', {
            itemsCount: items.length,
            total: total,
            subtotal: subtotal,
            tax: tax,
            shipping: shipping,
            hasAuth: !!authToken,
            shippingAddress: {
              city: shippingForm.city,
              state: shippingForm.state,
              country: shippingForm.country
            }
          });
          console.log('📦 Full order data structure:', JSON.stringify(orderData, null, 2));

          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(orderData)
          });

          console.log('📡 API Response Status:', response.status);

          // Clone the response so we can read it twice if needed
          const responseClone = response.clone();

          let result;
          try {
            result = await response.json();
          } catch (jsonError) {
            console.error('❌ Failed to parse API response as JSON:', jsonError);
            try {
              const textResponse = await responseClone.text();
              console.error('📄 Raw response text:', textResponse);
            } catch (textError) {
              console.error('❌ Could not read response as text either');
            }
            throw new Error('Invalid API response');
          }

          console.log('📦 Order API response:', response.status, result);

          if (response.ok) {
            console.log('✅ Order saved to database:', result.order?.orderNumber);
            // Use the database order ID for the success page
            if (result.order && result.order.id) {
              savedOrderId = result.order.id;
              // Update local order with database ID
              order.id = result.order.id;
            }
          } else {
            console.error('❌ Failed to save order to database:', result);
            console.error('❌ Error details:', {
              status: response.status,
              message: result.message,
              error: result.error
            });
            console.warn('⚠️ Continuing with checkout using localStorage');
          }
        } else {
          console.log('👤 Guest checkout - order saved to localStorage only');
        }

        // Always save to localStorage as backup
        const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        const updatedOrders = [order, ...existingOrders].slice(0, 50);
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

      } catch (storageError) {
        console.error('Failed to save order:', storageError);
        // Continue with checkout even if save fails
      }

      // Send confirmation email
      let emailSuccess = false;
      try {
        const emailOrder: EmailOrder = {
          id: order.id,
          items: order.items,
          shipping: order.shipping,
          payment: order.payment,
          totals: order.totals,
          status: order.status,
          createdAt: order.createdAt,
          estimatedDelivery: order.estimatedDelivery
        };

        emailSuccess = await EmailService.sendOrderConfirmationEmail(emailOrder);
        setEmailSent(emailSuccess);

        if (emailSuccess) {
          console.log('✅ Order confirmation email sent successfully from checkout');
        } else {
          console.warn('⚠️ Failed to send confirmation email, but order was processed');
        }
      } catch (emailError) {
        console.error('Email service error:', emailError);
        emailSuccess = false;
      }

      // Clear cart and redirect to success page with email status
      clearCart();
      const emailParam = emailSuccess ? 'emailSent=true' : 'emailFailed=true';
      router.push(`/cart/checkout/success?order=${savedOrderId}&${emailParam}`);
      
    } catch (error) {
      console.error('Payment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const currentCardType = detectCardType(paymentForm.cardNumber);

  const brandLabel: Record<string, string> = {
    visa: 'Visa', mastercard: 'Mastercard', amex: 'Amex', discover: 'Discover', jcb: 'JCB', diners: 'Diners',
  };

  const methods = [
    { value: 'card' as const, label: 'Card', hint: 'Visa · Mastercard · Amex · Discover' },
    { value: 'paypal' as const, label: 'PayPal', hint: 'Continue to PayPal' },
    { value: 'apple_pay' as const, label: 'Apple Pay', hint: 'Touch ID or Face ID' },
    { value: 'google_pay' as const, label: 'Google Pay', hint: 'Saved Google Pay methods' },
  ];

  const methodNote: Record<string, string> = {
    paypal: "You'll be redirected to PayPal to complete your payment.",
    apple_pay: 'Confirm with Touch ID or Face ID to complete your payment.',
    google_pay: 'Pay with a method saved in your Google account.',
  };

  if (items.length === 0) {
    return (
      <div className="void">
        <h1 className="void__title">Nothing to check out.</h1>
        <p className="void__text">Your cart is empty. Add something first and come back.</p>
        <div className="void__ctas">
          <Link href="/products" className="btn btn--solid" data-fill>
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Shop all gear</span>
          </Link>
        </div>
      </div>
    );
  }

  const itemCount = items.reduce((n, item) => n + item.quantity, 0);
  const set = (field: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setShippingForm({ ...shippingForm, [field]: e.target.value });

  const summary = (
    <div className="receipt">
      <h2 className="receipt__title">Your order</h2>
      <ul className="lines">
        {items.map((item) => (
          <SummaryLine key={item._id} name={item.name} image={item.image} quantity={item.quantity} lineTotal={item.price * item.quantity} />
        ))}
      </ul>
      <Totals subtotal={subtotal} shipping={shipping} tax={tax} total={total} count={itemCount} />
      <p className="receipt__note">
        The confirmation and invoice go to <strong>{shippingForm.email || 'your email'}</strong> right after payment.
      </p>
      <ul className="receipt__trust">
        <li>Free shipping on every order</li>
        <li><Link href="/returns">30-day returns</Link> on most items</li>
        <li>Card numbers are not stored, only the last 4 digits</li>
      </ul>
    </div>
  );

  return (
    <>
      <header className="shop-head">
        <StepsStrip current={currentStep === 1 ? 2 : 3} />
        <h1 className="shop-head__title">{currentStep === 1 ? 'Where to?' : 'Payment'}</h1>
        <p className="shop-head__meta">
          {currentStep === 1 ? 'Shipping is free on every order.' : <>Total <span className="mono">{money(total)}</span>, nothing added after this.</>}
        </p>
      </header>

      <div className="shop">
        <div className="shop__main">
          <details className="sum-fold" style={{ marginBottom: 'calc(var(--u) * 3)' }}>
            <summary>
              <span>Show summary</span>
              <span className="mono">{money(total)}</span>
            </summary>
            {summary}
          </details>

          {isProcessing && (
            <div className="alert" role="status" style={{ marginBottom: '1.5rem' }}>
              <p className="alert__title co-busy">Processing your order and preparing the confirmation email…</p>
            </div>
          )}

          {currentStep === 1 && (
            <form onSubmit={handleShippingSubmit} className="form">
              <section className="co-sec" aria-labelledby="co-contact">
                <h2 id="co-contact" className="co-sec__title">Contact</h2>
                <div className="field">
                  <label htmlFor="co-email" className="field__label">Email</label>
                  <input id="co-email" type="email" required autoComplete="email" inputMode="email" className="field__input" value={shippingForm.email} onChange={set('email')} placeholder="you@example.com" aria-describedby="co-email-hint" />
                  <p id="co-email-hint" className="field__hint">Your confirmation and tracking go here.</p>
                </div>
                <div className="field">
                  <label htmlFor="co-phone" className="field__label">Phone <span className="field__opt">Optional</span></label>
                  <input id="co-phone" type="tel" autoComplete="tel" className="field__input" value={shippingForm.phone} onChange={set('phone')} />
                </div>
              </section>

              <section className="co-sec" aria-labelledby="co-ship">
                <h2 id="co-ship" className="co-sec__title">Shipping address</h2>
                <div className="form__row form__row--2">
                  <div className="field">
                    <label htmlFor="co-first" className="field__label">First name</label>
                    <input id="co-first" type="text" required autoComplete="given-name" className="field__input" value={shippingForm.firstName} onChange={set('firstName')} />
                  </div>
                  <div className="field">
                    <label htmlFor="co-last" className="field__label">Last name</label>
                    <input id="co-last" type="text" required autoComplete="family-name" className="field__input" value={shippingForm.lastName} onChange={set('lastName')} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="co-address" className="field__label">Address</label>
                  <input id="co-address" type="text" required autoComplete="address-line1" className="field__input" value={shippingForm.address} onChange={set('address')} />
                </div>
                <div className="field">
                  <label htmlFor="co-apt" className="field__label">Apartment, suite, unit <span className="field__opt">Optional</span></label>
                  <input id="co-apt" type="text" autoComplete="address-line2" className="field__input" value={shippingForm.apartment} onChange={set('apartment')} />
                </div>
                <div className="form__row form__row--3">
                  <div className="field">
                    <label htmlFor="co-city" className="field__label">City</label>
                    <input id="co-city" type="text" required autoComplete="address-level2" className="field__input" value={shippingForm.city} onChange={set('city')} />
                  </div>
                  <div className="field">
                    <label htmlFor="co-state" className="field__label">State</label>
                    <select id="co-state" required autoComplete="address-level1" className="field__input" value={shippingForm.state} onChange={set('state')}>
                      <option value="">Choose</option>
                      {US_STATES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="co-zip" className="field__label">ZIP code</label>
                    <input id="co-zip" type="text" required autoComplete="postal-code" inputMode="numeric" className="field__input mono" value={shippingForm.zipCode} onChange={set('zipCode')} />
                  </div>
                </div>
              </section>

              <div className="co-actions">
                <Link href="/cart" className="linklike">Back to cart</Link>
                <button type="submit" className="btn btn--solid" data-fill>
                  <span className="btn__fill" aria-hidden="true" />
                  <span className="btn__label">Continue to payment</span>
                </button>
              </div>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={handlePaymentSubmit} className="form">
              <div className="ship-to">
                <p>
                  <span className="ship-to__k">Shipping to</span>
                  {shippingForm.firstName} {shippingForm.lastName}<br />
                  {shippingForm.address}{shippingForm.apartment ? `, ${shippingForm.apartment}` : ''}<br />
                  {shippingForm.city}, {shippingForm.state} <span className="mono">{shippingForm.zipCode}</span><br />
                  <span className="mono" style={{ color: 'var(--c-muted)' }}>{shippingForm.email}</span>
                </p>
                <button type="button" className="text-link" style={{ fontSize: 'var(--t-s)' }} onClick={() => setCurrentStep(1)}>Edit</button>
              </div>

              <section className="co-sec" aria-labelledby="co-pay">
                <h2 id="co-pay" className="co-sec__title">Pay with</h2>
                <fieldset className="choices">
                  <legend className="sr-only">Payment method</legend>
                  {methods.map((m) => (
                    <label key={m.value} className="choice">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.value}
                        checked={paymentForm.paymentMethod === m.value}
                        onChange={() => setPaymentForm({ ...paymentForm, paymentMethod: m.value })}
                      />
                      <span className="choice__label">{m.label}</span>
                      <span className="choice__hint">{m.hint}</span>
                    </label>
                  ))}
                </fieldset>

                {paymentForm.paymentMethod === 'card' ? (
                  <>
                    <div className="field">
                      <label htmlFor="co-card" className="field__label">Card number</label>
                      <div className="field__control">
                        <input
                          id="co-card"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          required
                          maxLength={19}
                          className="field__input mono"
                          style={{ paddingRight: '6rem' }}
                          value={paymentForm.cardNumber}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: formatCardNumber(e.target.value) })}
                          placeholder="1234 5678 9012 3456"
                          aria-describedby="co-card-brand"
                        />
                        <span id="co-card-brand" className="card-brand" aria-live="polite">
                          {paymentForm.cardNumber ? (brandLabel[currentCardType] ?? (paymentForm.cardNumber.length > 4 ? 'Unknown' : '')) : ''}
                        </span>
                      </div>
                    </div>
                    <div className="form__row form__row--2">
                      <div className="field">
                        <label htmlFor="co-exp" className="field__label">Expiry</label>
                        <input
                          id="co-exp"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          required
                          maxLength={5}
                          className="field__input mono"
                          value={paymentForm.expiryDate}
                          onChange={(e) => setPaymentForm({ ...paymentForm, expiryDate: formatExpiryDate(e.target.value) })}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="co-cvv" className="field__label">Security code</label>
                        <input
                          id="co-cvv"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          required
                          maxLength={4}
                          className="field__input mono"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value.replace(/\D/g, '') })}
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="co-name" className="field__label">Name on card</label>
                      <input
                        id="co-name"
                        type="text"
                        autoComplete="cc-name"
                        required
                        className="field__input"
                        value={paymentForm.nameOnCard}
                        onChange={(e) => setPaymentForm({ ...paymentForm, nameOnCard: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <p className="note-box">{methodNote[paymentForm.paymentMethod]}</p>
                )}
              </section>

              <div className="co-actions">
                <button type="button" className="linklike" onClick={() => setCurrentStep(1)}>Back to shipping</button>
                <button type="submit" disabled={isProcessing} aria-busy={isProcessing} className="btn btn--solid" data-fill>
                  <span className="btn__fill" aria-hidden="true" />
                  <span className="btn__label">{isProcessing ? 'Placing your order…' : <>Pay <span className="mono">{money(total)}</span></>}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="shop__side shop__side--fold" aria-label="Order summary">
          {summary}
        </aside>
      </div>
    </>
  );
}

const US_STATES: [string, string][] = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'], ['CO', 'Colorado'],
  ['CT', 'Connecticut'], ['DE', 'Delaware'], ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'],
  ['IL', 'Illinois'], ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'], ['MS', 'Mississippi'],
  ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'], ['NH', 'New Hampshire'], ['NJ', 'New Jersey'],
  ['NM', 'New Mexico'], ['NY', 'New York'], ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'],
  ['OR', 'Oregon'], ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'], ['TN', 'Tennessee'],
  ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'], ['WA', 'Washington'], ['WV', 'West Virginia'],
  ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
];
