// src/app/api/payments/test-cards/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Return test card numbers for development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Test cards only available in development' },
      { status: 403 }
    );
  }

  const testCards = {
    stripe: {
      success: [
        { number: '4242424242424242', brand: 'visa', description: 'Visa - Success' },
        { number: '5555555555554444', brand: 'mastercard', description: 'Mastercard - Success' },
        { number: '378282246310005', brand: 'amex', description: 'American Express - Success' },
        { number: '6011111111111117', brand: 'discover', description: 'Discover - Success' }
      ],
      decline: [
        { number: '4000000000000002', brand: 'visa', description: 'Card declined' },
        { number: '4000000000009995', brand: 'visa', description: 'Insufficient funds' },
        { number: '4000000000009987', brand: 'visa', description: 'Lost card' },
        { number: '4000000000009979', brand: 'visa', description: 'Stolen card' }
      ],
      authentication: [
        { number: '4000000000003220', brand: 'visa', description: '3D Secure required' },
        { number: '4000000000003238', brand: 'visa', description: '3D Secure required (fail)' }
      ]
    },
    paypal: {
      test: [
        { email: 'buyer@example.com', password: 'password', description: 'PayPal Test Account' }
      ]
    },
    general: {
      expiry: '12/25',
      cvc: '123',
      name: 'Test User',
      address: {
        line1: '123 Test Street',
        city: 'Test City',
        state: 'CA',
        postal_code: '12345',
        country: 'US'
      }
    }
  };

  return NextResponse.json(testCards);
}