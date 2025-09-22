// src/config/payment.ts - Payment System Configuration
export const PAYMENT_CONFIG = {
  // Payment Providers
  PROVIDERS: {
    STRIPE: {
      name: 'Stripe',
      enabled: true,
      publicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
      apiVersion: '2023-10-16' as const,
    },
    PAYPAL: {
      name: 'PayPal',
      enabled: true,
      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
      environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'production' | 'sandbox',
    },
    SQUARE: {
      name: 'Square',
      enabled: false,
      applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID || '',
      accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
      environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'production' | 'sandbox',
    }
  },

  // Payment Methods
  PAYMENT_METHODS: {
    CARD: {
      enabled: true,
      acceptedBrands: ['visa', 'mastercard', 'amex', 'discover'],
      requireCVC: true,
      requirePostalCode: true,
    },
    PAYPAL: {
      enabled: true,
      requireShippingAddress: true,
    },
    APPLE_PAY: {
      enabled: true,
      merchantId: process.env.APPLE_PAY_MERCHANT_ID || '',
    },
    GOOGLE_PAY: {
      enabled: true,
      merchantId: process.env.GOOGLE_PAY_MERCHANT_ID || '',
    },
  },

  // Security & Compliance
  SECURITY: {
    // PCI Compliance
    pciCompliant: true,
    
    // 3D Secure
    threeDSecure: {
      enabled: true,
      required: false, // Set to true to require for all payments
    },
    
    // Fraud Detection
    fraudDetection: {
      enabled: true,
      riskThreshold: 0.7, // 0.0 - 1.0
    },
    
    // Rate Limiting
    rateLimiting: {
      enabled: true,
      maxAttempts: 3,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
  },

  // Currency & Localization
  CURRENCY: {
    default: 'USD',
    supported: ['USD', 'CAD', 'EUR', 'GBP'],
    decimalPlaces: {
      USD: 2,
      CAD: 2,
      EUR: 2,
      GBP: 2,
    },
  },

  // Order Limits
  ORDER_LIMITS: {
    minimum: 1.00,
    maximum: 9999.99,
    guestCheckout: {
      enabled: true,
      maximum: 500.00,
    },
  },

  // Shipping
  SHIPPING: {
    freeShippingThreshold: 100.00,
    methods: {
      standard: {
        name: 'Standard Shipping',
        cost: 9.99,
        estimatedDays: 5,
      },
      express: {
        name: 'Express Shipping',
        cost: 19.99,
        estimatedDays: 2,
      },
      overnight: {
        name: 'Overnight Shipping',
        cost: 39.99,
        estimatedDays: 1,
      },
    },
  },

  // Tax Configuration
  TAX: {
    enabled: true,
    defaultRate: 0.08, // 8%
    stateRates: {
      CA: 0.1025, // California
      NY: 0.08, // New York
      TX: 0.0625, // Texas
      FL: 0.06, // Florida
      // Add more states as needed
    },
  },

  // Webhook Configuration
  WEBHOOKS: {
    endpoints: {
      stripe: '/api/payments/webhook/stripe',
      paypal: '/api/payments/webhook/paypal',
      square: '/api/payments/webhook/square',
    },
    retries: 3,
    timeout: 10000, // 10 seconds
  },

  // Analytics & Tracking
  ANALYTICS: {
    enabled: true,
    events: {
      paymentInitiated: 'payment_initiated',
      paymentMethodSelected: 'payment_method_selected',
      paymentSucceeded: 'payment_succeeded',
      paymentFailed: 'payment_failed',
      paymentAbandoned: 'payment_abandoned',
    },
  },
};

// Environment Variables Template for .env.local
export const ENV_TEMPLATE = `
# Payment Configuration Environment Variables
# Copy these to your .env.local file and fill in your actual values

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Square Configuration (Optional)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_application_id
SQUARE_ACCESS_TOKEN=your_square_access_token

# Apple Pay (Optional)
APPLE_PAY_MERCHANT_ID=merchant.your.domain.com

# Google Pay (Optional)
GOOGLE_PAY_MERCHANT_ID=your_google_pay_merchant_id

# Payment Security
PAYMENT_ENCRYPTION_KEY=your_32_character_encryption_key_here

# Email Configuration (for receipts)
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXXX
MIXPANEL_TOKEN=your_mixpanel_token
`;

// Setup Instructions
export const SETUP_INSTRUCTIONS = `
# Payment System Setup Guide

## 1. Environment Variables
Copy the environment variables from ENV_TEMPLATE above to your .env.local file.

## 2. Stripe Setup (Recommended)
1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Configure webhooks:
   - Endpoint: https://yourdomain.com/api/payments/webhook/stripe
   - Events: payment_intent.succeeded, payment_intent.payment_failed

## 3. PayPal Setup (Optional)
1. Create a PayPal Developer account
2. Create a new app in the PayPal Developer Console
3. Get your Client ID and Client Secret
4. Configure webhooks if needed

## 4. Database Schema
Add these tables to your database:

### Orders Table
- id (string, primary key)
- order_number (string, unique)
- user_id (string, nullable, foreign key)
- status (enum: processing, confirmed, shipped, delivered, cancelled)
- payment_intent_id (string, nullable)
- items (json)
- shipping_address (json)
- billing_address (json)
- totals (json)
- created_at (timestamp)
- updated_at (timestamp)

### Payment_Methods Table (for saved cards)
- id (string, primary key)
- user_id (string, foreign key)
- provider_id (string) // Stripe customer ID
- type (enum: card, paypal)
- last_four (string, nullable)
- brand (string, nullable)
- is_default (boolean)
- created_at (timestamp)

## 5. Security Checklist
- [ ] Enable HTTPS in production
- [ ] Validate webhook signatures
- [ ] Implement rate limiting
- [ ] Use secure environment variables
- [ ] Enable PCI compliance mode
- [ ] Implement fraud detection
- [ ] Set up monitoring and alerting

## 6. Testing
1. Use Stripe test cards for testing payments
2. Test all payment flows (success, failure, 3D Secure)
3. Test webhooks with ngrok for local development
4. Verify email notifications work
5. Test guest and authenticated checkout

## 7. Production Deployment
1. Switch to production API keys
2. Configure production webhooks
3. Set up monitoring (Stripe Dashboard, logs)
4. Enable fraud detection
5. Test with small real transactions first

## 8. Monitoring & Analytics
- Set up payment success/failure monitoring
- Track conversion rates
- Monitor for fraud
- Set up alerts for failed payments
- Regular security audits
`;

// Helper functions for payment processing
export class PaymentConfigHelper {
  static getEnabledProviders() {
    return Object.entries(PAYMENT_CONFIG.PROVIDERS)
      .filter(([_, config]) => config.enabled)
      .map(([key, config]) => ({ key: key.toLowerCase(), ...config }));
  }

  static getEnabledPaymentMethods() {
    return Object.entries(PAYMENT_CONFIG.PAYMENT_METHODS)
      .filter(([_, config]) => config.enabled)
      .map(([key, config]) => ({ key: key.toLowerCase(), ...config }));
  }

  static isValidCurrency(currency: string): boolean {
    return PAYMENT_CONFIG.CURRENCY.supported.includes(currency.toUpperCase());
  }

  static formatAmount(amount: number, currency: string = PAYMENT_CONFIG.CURRENCY.default): string {
    const decimalPlaces = PAYMENT_CONFIG.CURRENCY.decimalPlaces[currency.toUpperCase()] || 2;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(amount);
  }

  static calculateTax(amount: number, state?: string): number {
    const rate = state && PAYMENT_CONFIG.TAX.stateRates[state] 
      ? PAYMENT_CONFIG.TAX.stateRates[state]
      : PAYMENT_CONFIG.TAX.defaultRate;
    
    return amount * rate;
  }

  static calculateShipping(subtotal: number, method: string = 'standard'): number {
    if (subtotal >= PAYMENT_CONFIG.SHIPPING.freeShippingThreshold) {
      return 0;
    }

    const shippingMethod = PAYMENT_CONFIG.SHIPPING.methods[method as keyof typeof PAYMENT_CONFIG.SHIPPING.methods];
    return shippingMethod ? shippingMethod.cost : PAYMENT_CONFIG.SHIPPING.methods.standard.cost;
  }

  static validateOrderAmount(amount: number, isGuest: boolean = false): { valid: boolean; error?: string } {
    if (amount < PAYMENT_CONFIG.ORDER_LIMITS.minimum) {
      return {
        valid: false,
        error: `Minimum order amount is ${this.formatAmount(PAYMENT_CONFIG.ORDER_LIMITS.minimum)}`
      };
    }

    if (amount > PAYMENT_CONFIG.ORDER_LIMITS.maximum) {
      return {
        valid: false,
        error: `Maximum order amount is ${this.formatAmount(PAYMENT_CONFIG.ORDER_LIMITS.maximum)}`
      };
    }

    if (isGuest && PAYMENT_CONFIG.ORDER_LIMITS.guestCheckout.enabled && 
        amount > PAYMENT_CONFIG.ORDER_LIMITS.guestCheckout.maximum) {
      return {
        valid: false,
        error: `Guest checkout maximum is ${this.formatAmount(PAYMENT_CONFIG.ORDER_LIMITS.guestCheckout.maximum)}. Please create an account for larger orders.`
      };
    }

    return { valid: true };
  }

  static generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `QG-${timestamp}-${random}`;
  }

  static getWebhookUrl(provider: string): string {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const endpoint = PAYMENT_CONFIG.WEBHOOKS.endpoints[provider as keyof typeof PAYMENT_CONFIG.WEBHOOKS.endpoints];
    return `${baseUrl}${endpoint}`;
  }
}

export default PAYMENT_CONFIG;