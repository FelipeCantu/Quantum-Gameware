// File: src/app/cart/checkout/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { EmailService, type EmailOrder } from '@/services/emailService';

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

// Payment method icons
const PayPalIcon = ({ className = "w-12 h-8" }: { className?: string }) => (
  <div className={`${className} bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center shadow-sm`}>
    <svg className="w-6 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a9.036 9.036 0 0 1-.77 3.292c-1.47 4.678-5.724 7.203-11.548 7.203H7.25l-.815 5.168a.641.641 0 0 0 .633.74h4.607c.524 0 .968-.382 1.05-.9l.042-.267.813-5.157.053-.288c.082-.518.526-.9 1.05-.9h.66c3.743 0 6.671-1.518 7.525-5.91.357-1.839.172-3.374-.65-4.581z"/>
    </svg>
  </div>
);

const ApplePayIcon = ({ className = "w-12 h-8" }: { className?: string }) => (
  <div className={`${className} bg-black rounded flex items-center justify-center shadow-sm`}>
    <svg className="w-6 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.5 2.25c1.36 0 2.6.8 3.4 2.1.7 1.2.6 2.7-.1 3.9-.8 1.4-2.1 2.3-3.6 2.3-1.4 0-2.6-.8-3.3-2.1-.7-1.2-.6-2.7.1-3.9.8-1.4 2.1-2.3 3.5-2.3zm-1.8 6.9c.9 0 1.8.5 2.3 1.3.4.6.4 1.4 0 2-.5.8-1.4 1.3-2.3 1.3s-1.8-.5-2.3-1.3c-.4-.6-.4-1.4 0-2 .5-.8 1.4-1.3 2.3-1.3z"/>
    </svg>
    <span className="text-white text-xs font-medium ml-1">Pay</span>
  </div>
);

const GooglePayIcon = ({ className = "w-12 h-8" }: { className?: string }) => (
  <div className={`${className} bg-white border border-gray-300 rounded flex items-center justify-center shadow-sm`}>
    <svg className="w-6 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  </div>
);

// Card type icons component
const CardIcon = ({ type, className = "w-8 h-5" }: { type: string; className?: string }) => {
  switch (type) {
    case 'visa':
      return (
        <div className={`${className} bg-blue-600 rounded flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">VISA</span>
        </div>
      );
    case 'mastercard':
      return (
        <div className={`${className} relative rounded overflow-hidden`}>
          <div className="absolute inset-0 flex">
            <div className="w-1/2 bg-red-500 rounded-l"></div>
            <div className="w-1/2 bg-yellow-500 rounded-r"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white rounded-full bg-transparent"></div>
          </div>
        </div>
      );
    case 'amex':
      return (
        <div className={`${className} bg-blue-500 rounded flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">AMEX</span>
        </div>
      );
    case 'discover':
      return (
        <div className={`${className} bg-orange-500 rounded flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">DISC</span>
        </div>
      );
    default:
      return (
        <div className={`${className} bg-gray-300 rounded flex items-center justify-center`}>
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      );
  }
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

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

        <div className="relative z-10 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
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

      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <nav className="flex items-center justify-center space-x-8">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}>
                  {currentStep > 1 ? '✓' : '1'}
                </div>
                <span className="ml-2 font-medium text-white">Shipping</span>
              </div>
              <div className={`h-px w-16 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-400' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}>
                  {currentStep > 2 ? '✓' : '2'}
                </div>
                <span className="ml-2 font-medium text-white">Payment</span>
              </div>
            </nav>
          </div>

          {/* Email Status Notification */}
          {isProcessing && (
            <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center text-white">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>Processing your order and preparing confirmation email...</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {currentStep === 1 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingForm.firstName}
                          onChange={(e) => setShippingForm({...shippingForm, firstName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingForm.lastName}
                          onChange={(e) => setShippingForm({...shippingForm, lastName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address * 
                        <span className="text-gray-500 text-sm">(for order confirmation)</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={shippingForm.email}
                        onChange={(e) => setShippingForm({...shippingForm, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="your.email@example.com"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        We'll send your order confirmation and tracking information to this email.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={shippingForm.phone}
                        onChange={(e) => setShippingForm({...shippingForm, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({...shippingForm, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        value={shippingForm.apartment}
                        onChange={(e) => setShippingForm({...shippingForm, apartment: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({...shippingForm, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <select
                          required
                          value={shippingForm.state}
                          onChange={(e) => setShippingForm({...shippingForm, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        >
                          <option value="">Select State</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="AR">Arkansas</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="CT">Connecticut</option>
                          <option value="DE">Delaware</option>
                          <option value="FL">Florida</option>
                          <option value="GA">Georgia</option>
                          <option value="HI">Hawaii</option>
                          <option value="ID">Idaho</option>
                          <option value="IL">Illinois</option>
                          <option value="IN">Indiana</option>
                          <option value="IA">Iowa</option>
                          <option value="KS">Kansas</option>
                          <option value="KY">Kentucky</option>
                          <option value="LA">Louisiana</option>
                          <option value="ME">Maine</option>
                          <option value="MD">Maryland</option>
                          <option value="MA">Massachusetts</option>
                          <option value="MI">Michigan</option>
                          <option value="MN">Minnesota</option>
                          <option value="MS">Mississippi</option>
                          <option value="MO">Missouri</option>
                          <option value="MT">Montana</option>
                          <option value="NE">Nebraska</option>
                          <option value="NV">Nevada</option>
                          <option value="NH">New Hampshire</option>
                          <option value="NJ">New Jersey</option>
                          <option value="NM">New Mexico</option>
                          <option value="NY">New York</option>
                          <option value="NC">North Carolina</option>
                          <option value="ND">North Dakota</option>
                          <option value="OH">Ohio</option>
                          <option value="OK">Oklahoma</option>
                          <option value="OR">Oregon</option>
                          <option value="PA">Pennsylvania</option>
                          <option value="RI">Rhode Island</option>
                          <option value="SC">South Carolina</option>
                          <option value="SD">South Dakota</option>
                          <option value="TN">Tennessee</option>
                          <option value="TX">Texas</option>
                          <option value="UT">Utah</option>
                          <option value="VT">Vermont</option>
                          <option value="VA">Virginia</option>
                          <option value="WA">Washington</option>
                          <option value="WV">West Virginia</option>
                          <option value="WI">Wisconsin</option>
                          <option value="WY">Wyoming</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingForm.zipCode}
                          onChange={(e) => setShippingForm({...shippingForm, zipCode: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Link
                        href="/cart"
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        ← Back to Cart
                      </Link>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Continue to Payment →
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                    
                    {/* Payment Method Options */}
                    <div className="space-y-3 mb-6">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentForm.paymentMethod === 'card'}
                          onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value as 'card'})}
                          className="w-4 h-4 text-blue-600 mr-3"
                        />
                        <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                            <CardIcon type="visa" className="w-8 h-5" />
                            <CardIcon type="mastercard" className="w-8 h-5" />
                            <CardIcon type="amex" className="w-8 h-5" />
                            <CardIcon type="discover" className="w-8 h-5" />
                          </div>
                          <span className="font-medium text-gray-900">Credit or Debit Card</span>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentForm.paymentMethod === 'paypal'}
                          onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value as 'paypal'})}
                          className="w-4 h-4 text-blue-600 mr-3"
                        />
                        <div className="flex items-center gap-3">
                          <PayPalIcon className="w-12 h-6" />
                          <span className="font-medium text-gray-900">PayPal</span>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="apple_pay"
                          checked={paymentForm.paymentMethod === 'apple_pay'}
                          onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value as 'apple_pay'})}
                          className="w-4 h-4 text-blue-600 mr-3"
                        />
                        <div className="flex items-center gap-3">
                          <ApplePayIcon className="w-12 h-6" />
                          <span className="font-medium text-gray-900">Apple Pay</span>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="google_pay"
                          checked={paymentForm.paymentMethod === 'google_pay'}
                          onChange={(e) => setPaymentForm({...paymentForm, paymentMethod: e.target.value as 'google_pay'})}
                          className="w-4 h-4 text-blue-600 mr-3"
                        />
                        <div className="flex items-center gap-3">
                          <GooglePayIcon className="w-12 h-6" />
                          <span className="font-medium text-gray-900">Google Pay</span>
                        </div>
                      </label>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm text-blue-800 font-medium">All payments are secured with 256-bit SSL encryption</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Shipping to:</h3>
                        <p className="text-gray-600 mt-1">
                          {shippingForm.firstName} {shippingForm.lastName}<br/>
                          {shippingForm.address}<br/>
                          {shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          📧 Confirmation email: {shippingForm.email}
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Card Details - Only show if card is selected */}
                    {paymentForm.paymentMethod === 'card' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              maxLength={19}
                              value={paymentForm.cardNumber}
                              onChange={(e) => setPaymentForm({
                                ...paymentForm, 
                                cardNumber: formatCardNumber(e.target.value)
                              })}
                              placeholder="1234 5678 9012 3456"
                              className="w-full px-4 py-3 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <CardIcon type={currentCardType} className="w-10 h-6" />
                            </div>
                          </div>
                          {paymentForm.cardNumber && (
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-sm text-gray-600">
                                {currentCardType === 'visa' && '💳 Visa Card'}
                                {currentCardType === 'mastercard' && '💳 Mastercard'}
                                {currentCardType === 'amex' && '💳 American Express'}
                                {currentCardType === 'discover' && '💳 Discover Card'}
                                {currentCardType === 'jcb' && '💳 JCB Card'}
                                {currentCardType === 'diners' && '💳 Diners Club'}
                                {currentCardType === 'unknown' && paymentForm.cardNumber.length > 4 && '❓ Card type not recognized'}
                              </p>
                              <div className="text-xs text-green-600 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                Secure
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Expiry Date *
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              value={paymentForm.expiryDate}
                              onChange={(e) => setPaymentForm({
                                ...paymentForm, 
                                expiryDate: formatExpiryDate(e.target.value)
                              })}
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              CVV *
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={4}
                              value={paymentForm.cvv}
                              onChange={(e) => setPaymentForm({
                                ...paymentForm, 
                                cvv: e.target.value.replace(/\D/g, '')
                              })}
                              placeholder="123"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name on Card *
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentForm.nameOnCard}
                            onChange={(e) => setPaymentForm({...paymentForm, nameOnCard: e.target.value})}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          />
                        </div>
                      </>
                    )}

                    {/* Alternative Payment Method Messages */}
                    {paymentForm.paymentMethod === 'paypal' && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <PayPalIcon className="w-16 h-10 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay with PayPal</h3>
                        <p className="text-gray-600 text-sm">
                          You'll be redirected to PayPal to complete your payment securely.
                        </p>
                      </div>
                    )}

                    {paymentForm.paymentMethod === 'apple_pay' && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                        <ApplePayIcon className="w-16 h-10 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay with Apple Pay</h3>
                        <p className="text-gray-600 text-sm">
                          Use Touch ID or Face ID to complete your payment instantly.
                        </p>
                      </div>
                    )}

                    {paymentForm.paymentMethod === 'google_pay' && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                        <GooglePayIcon className="w-16 h-10 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay with Google Pay</h3>
                        <p className="text-gray-600 text-sm">
                          Quick and secure payment with your saved Google Pay methods.
                        </p>
                      </div>
                    )}

                    {/* Security Features */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-blue-900 mb-1">Your payment is secure</h4>
                          <p className="text-sm text-blue-700">
                            We use 256-bit SSL encryption and never store your payment information.
                            You'll receive an email confirmation once your order is processed.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        ← Back to Shipping
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        {isProcessing ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Processing Order...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Complete Order - ${total.toFixed(2)}
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white/20 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Email Confirmation Notice */}
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-green-900">Email Confirmation</h4>
                      <p className="text-sm text-green-700 mt-1">
                        We'll send a detailed order confirmation and invoice to{' '}
                        <span className="font-medium">{shippingForm.email || 'your email address'}</span> 
                        {' '}immediately after payment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 space-y-3 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span>30-day money-back guarantee</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Free shipping worldwide</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Instant email confirmation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}