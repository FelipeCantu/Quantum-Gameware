// src/services/paymentService.ts - Enhanced Payment Processing System
import { CartItem } from '@/types';

// Payment Provider Types
export type PaymentProvider = 'stripe' | 'paypal' | 'square' | 'mock';

// Payment Method Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer' | 'apple_pay' | 'google_pay';
  cardDetails?: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
    fingerprint: string;
  };
  paypalEmail?: string;
  isDefault: boolean;
  createdAt: Date;
}

// Payment Intent Interface
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled';
  clientSecret?: string;
  metadata?: Record<string, string>;
  created: Date;
}

// Enhanced Payment Data Interface
export interface PaymentData {
  amount: number;
  currency: string;
  paymentMethod: {
    type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
    card?: {
      number: string;
      expiryMonth: number;
      expiryYear: number;
      cvc: string;
      name: string;
    };
    billingAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  customer?: {
    id?: string;
    email: string;
    name: string;
    phone?: string;
  };
  shipping?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  description?: string;
  metadata?: Record<string, string>;
}

// Payment Result Interface
export interface PaymentResult {
  success: boolean;
  paymentIntent?: PaymentIntent;
  transactionId?: string;
  receiptUrl?: string;
  error?: {
    code: string;
    message: string;
    type: 'card_error' | 'validation_error' | 'api_error' | 'authentication_error';
  };
  requiresAction?: boolean;
  nextAction?: {
    type: 'redirect_to_url' | 'use_stripe_sdk';
    redirectToUrl?: string;
  };
}

// Enhanced Payment Processing Service
export class PaymentService {
  private static provider: PaymentProvider = 'mock'; // Default to mock for development
  private static apiKey: string = '';
  
  // Initialize payment service with provider
  static initialize(provider: PaymentProvider, apiKey?: string) {
    this.provider = provider;
    this.apiKey = apiKey || '';
  }

  // Create Payment Intent
  static async createPaymentIntent(data: {
    amount: number;
    currency: string;
    customer?: { email: string; name: string };
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent> {
    switch (this.provider) {
      case 'stripe':
        return this.createStripePaymentIntent(data);
      case 'paypal':
        return this.createPayPalOrder(data);
      case 'square':
        return this.createSquarePayment(data);
      default:
        return this.createMockPaymentIntent(data);
    }
  }

  // Process Payment
  static async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      // Validate payment data
      const validation = this.validatePaymentData(paymentData);
      if (!validation.isValid) {
        return {
          success: false,
          error: {
            code: 'validation_error',
            message: validation.error!,
            type: 'validation_error'
          }
        };
      }

      // Add processing delay for better UX
      await this.simulateProcessingDelay();

      switch (this.provider) {
        case 'stripe':
          return this.processStripePayment(paymentData);
        case 'paypal':
          return this.processPayPalPayment(paymentData);
        case 'square':
          return this.processSquarePayment(paymentData);
        default:
          return this.processMockPayment(paymentData);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: {
          code: 'api_error',
          message: 'An unexpected error occurred during payment processing',
          type: 'api_error'
        }
      };
    }
  }

  // Stripe Implementation
  private static async createStripePaymentIntent(data: {
    amount: number;
    currency: string;
    customer?: { email: string; name: string };
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent> {
    // In production, use actual Stripe API
    const response = await fetch('/api/payments/stripe/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        customer: data.customer,
        metadata: data.metadata
      })
    });

    const result = await response.json();
    
    return {
      id: result.id,
      amount: data.amount,
      currency: data.currency,
      status: result.status,
      clientSecret: result.client_secret,
      metadata: data.metadata,
      created: new Date()
    };
  }

  private static async processStripePayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Mock Stripe processing - replace with actual Stripe integration
    return this.processMockPayment(paymentData);
  }

  // PayPal Implementation
  private static async createPayPalOrder(data: {
    amount: number;
    currency: string;
    customer?: { email: string; name: string };
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent> {
    // Mock PayPal order creation
    return {
      id: 'paypal_' + this.generateId(),
      amount: data.amount,
      currency: data.currency,
      status: 'requires_confirmation',
      metadata: data.metadata,
      created: new Date()
    };
  }

  private static async processPayPalPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Mock PayPal processing - replace with actual PayPal SDK integration
    await this.simulateProcessingDelay();
    
    return {
      success: true,
      transactionId: 'PAYPAL_' + this.generateTransactionId(),
      paymentIntent: {
        id: 'paypal_intent_' + this.generateId(),
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'succeeded',
        created: new Date()
      }
    };
  }

  // Square Implementation
  private static async createSquarePayment(data: {
    amount: number;
    currency: string;
    customer?: { email: string; name: string };
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent> {
    return {
      id: 'square_' + this.generateId(),
      amount: data.amount,
      currency: data.currency,
      status: 'requires_payment_method',
      metadata: data.metadata,
      created: new Date()
    };
  }

  private static async processSquarePayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Mock Square processing
    await this.simulateProcessingDelay();
    
    return {
      success: true,
      transactionId: 'SQ_' + this.generateTransactionId(),
      paymentIntent: {
        id: 'square_intent_' + this.generateId(),
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'succeeded',
        created: new Date()
      }
    };
  }

  // Mock Implementation (for development/testing)
  private static async createMockPaymentIntent(data: {
    amount: number;
    currency: string;
    customer?: { email: string; name: string };
    metadata?: Record<string, string>;
  }): Promise<PaymentIntent> {
    return {
      id: 'pi_mock_' + this.generateId(),
      amount: data.amount,
      currency: data.currency,
      status: 'requires_payment_method',
      clientSecret: 'pi_mock_' + this.generateId() + '_secret',
      metadata: data.metadata,
      created: new Date()
    };
  }

  private static async processMockPayment(paymentData: PaymentData): Promise<PaymentResult> {
    await this.simulateProcessingDelay();

    // Simulate various scenarios
    const scenario = Math.random();
    
    if (scenario < 0.05) {
      // 5% chance of card decline
      return {
        success: false,
        error: {
          code: 'card_declined',
          message: 'Your card was declined. Please try a different payment method.',
          type: 'card_error'
        }
      };
    }
    
    if (scenario < 0.08) {
      // 3% chance of insufficient funds
      return {
        success: false,
        error: {
          code: 'insufficient_funds',
          message: 'Your card has insufficient funds.',
          type: 'card_error'
        }
      };
    }
    
    if (scenario < 0.10) {
      // 2% chance of requiring 3D Secure
      return {
        success: false,
        requiresAction: true,
        nextAction: {
          type: 'redirect_to_url',
          redirectToUrl: '/payments/3d-secure-mock'
        },
        error: {
          code: 'authentication_required',
          message: 'Payment requires additional authentication',
          type: 'authentication_error'
        }
      };
    }

    // Success case
    const transactionId = this.generateTransactionId();
    return {
      success: true,
      transactionId,
      receiptUrl: `https://your-domain.com/receipts/${transactionId}`,
      paymentIntent: {
        id: 'pi_success_' + this.generateId(),
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: 'succeeded',
        created: new Date()
      }
    };
  }

  // Payment Data Validation
  private static validatePaymentData(data: PaymentData): { isValid: boolean; error?: string } {
    if (!data.amount || data.amount <= 0) {
      return { isValid: false, error: 'Invalid payment amount' };
    }

    if (!data.currency || data.currency.length !== 3) {
      return { isValid: false, error: 'Invalid currency code' };
    }

    if (!data.paymentMethod) {
      return { isValid: false, error: 'Payment method is required' };
    }

    if (data.paymentMethod.type === 'card') {
      const card = data.paymentMethod.card;
      if (!card) {
        return { isValid: false, error: 'Card details are required' };
      }

      if (!this.validateCardNumber(card.number)) {
        return { isValid: false, error: 'Invalid card number' };
      }

      if (!this.validateExpiryDate(card.expiryMonth, card.expiryYear)) {
        return { isValid: false, error: 'Invalid expiry date' };
      }

      if (!this.validateCVC(card.cvc)) {
        return { isValid: false, error: 'Invalid security code' };
      }
    }

    if (!data.paymentMethod.billingAddress?.line1) {
      return { isValid: false, error: 'Billing address is required' };
    }

    return { isValid: true };
  }

  // Card Validation Methods
  private static validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (!/^\d{13,19}$/.test(cleaned)) {
      return false;
    }

    return this.luhnCheck(cleaned);
  }

  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  private static validateExpiryDate(month: number, year: number): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    if (month < 1 || month > 12) {
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  }

  private static validateCVC(cvc: string): boolean {
    return /^\d{3,4}$/.test(cvc);
  }

  // Utility Methods
  private static async simulateProcessingDelay(): Promise<void> {
    const delay = 1500 + Math.random() * 2000; // 1.5-3.5 seconds
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private static generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private static generateTransactionId(): string {
    return 'TXN_' + Date.now().toString(36).toUpperCase() + '_' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Card Brand Detection
  static getCardBrand(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6/.test(cleaned)) return 'discover';
    if (/^35/.test(cleaned)) return 'jcb';
    if (/^30[0-5]/.test(cleaned) || /^36/.test(cleaned) || /^38/.test(cleaned)) return 'diners';
    
    return 'unknown';
  }

  // Card Number Formatting
  static formatCardNumber(cardNumber: string, brand?: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (brand === 'amex') {
      return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    }
    
    return cleaned.replace(/(\d{4})/g, '$1 ').trim();
  }

  // Mask Card Number
  static maskCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 4) return cleaned;
    
    const lastFour = cleaned.slice(-4);
    const masked = '•'.repeat(cleaned.length - 4);
    return this.formatCardNumber(masked + lastFour);
  }
}

// Webhook Handler for Payment Updates
export class PaymentWebhookHandler {
  static async handleWebhook(provider: PaymentProvider, payload: any, signature: string): Promise<boolean> {
    try {
      // Verify webhook signature based on provider
      const isValid = await this.verifySignature(provider, payload, signature);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return false;
      }

      // Process webhook event
      switch (provider) {
        case 'stripe':
          return this.handleStripeWebhook(payload);
        case 'paypal':
          return this.handlePayPalWebhook(payload);
        case 'square':
          return this.handleSquareWebhook(payload);
        default:
          console.warn('Unsupported webhook provider:', provider);
          return false;
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return false;
    }
  }

  private static async verifySignature(provider: PaymentProvider, payload: any, signature: string): Promise<boolean> {
    // Implement signature verification for each provider
    // This is crucial for security
    switch (provider) {
      case 'stripe':
        // Use Stripe's webhook signature verification
        return true; // Placeholder
      case 'paypal':
        // Use PayPal's webhook signature verification
        return true; // Placeholder
      case 'square':
        // Use Square's webhook signature verification
        return true; // Placeholder
      default:
        return false;
    }
  }

  private static async handleStripeWebhook(payload: any): Promise<boolean> {
    const { type, data } = payload;
    
    switch (type) {
      case 'payment_intent.succeeded':
        await this.updatePaymentStatus(data.object.id, 'succeeded');
        break;
      case 'payment_intent.payment_failed':
        await this.updatePaymentStatus(data.object.id, 'failed');
        break;
      // Add more event handlers as needed
    }
    
    return true;
  }

  private static async handlePayPalWebhook(payload: any): Promise<boolean> {
    // Handle PayPal webhook events
    return true;
  }

  private static async handleSquareWebhook(payload: any): Promise<boolean> {
    // Handle Square webhook events
    return true;
  }

  private static async updatePaymentStatus(paymentId: string, status: string): Promise<void> {
    // Update payment status in database
    console.log(`Updating payment ${paymentId} status to ${status}`);
    // Implement database update logic
  }
}