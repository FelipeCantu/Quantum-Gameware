// src/app/api/payments/create-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
  try {
    console.log('💳 Payment intent creation requested');
    
    // Optional: Verify user authentication
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
        const { payload } = await jwtVerify(token, secret);
        userId = payload.userId as string;
        console.log('✅ Authenticated user:', userId);
      } catch (error) {
        console.log('⚠️ Authentication failed, proceeding as guest');
      }
    }

    const body = await request.json();
    const { amount, currency = 'usd', customer, metadata } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (amount > 999999) { // $9,999.99 limit
      return NextResponse.json(
        { error: 'Amount exceeds maximum limit' },
        { status: 400 }
      );
    }

    // Create payment intent (mock implementation)
    const paymentIntent = {
      id: 'pi_' + Date.now().toString(36) + Math.random().toString(36).substring(2),
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      status: 'requires_payment_method',
      client_secret: 'pi_' + Math.random().toString(36) + '_secret_' + Math.random().toString(36),
      customer: customer?.email || null,
      metadata: {
        ...metadata,
        userId,
        created_at: new Date().toISOString()
      },
      created: Math.floor(Date.now() / 1000)
    };

    console.log('✅ Payment intent created:', paymentIntent.id);

    return NextResponse.json(paymentIntent);
  } catch (error) {
    console.error('❌ Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}