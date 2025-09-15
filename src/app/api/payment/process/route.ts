// src/app/api/payment/process/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  orderId: string;
}

// POST /api/payment/process - Process a payment
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const paymentData = await request.json() as PaymentRequest;

    // Validate required fields
    if (!paymentData.amount || !paymentData.currency || !paymentData.paymentMethod) {
      return NextResponse.json(
        { message: 'Amount, currency, and payment method are required' },
        { status: 400 }
      );
    }

    if (paymentData.amount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // For demo purposes, simulate payment processing
    // In production, you would integrate with Stripe, PayPal, etc.
    if (token.startsWith('demo_token_')) {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful payment
      const paymentResult = {
        paymentId: 'pay_' + Date.now(),
        status: 'succeeded',
        amount: paymentData.amount,
        currency: paymentData.currency,
        paymentMethod: paymentData.paymentMethod,
        orderId: paymentData.orderId,
        transactionId: 'txn_' + Math.random().toString(36).substring(7),
        processedAt: new Date().toISOString(),
        receipt: {
          receiptId: 'rcpt_' + Date.now(),
          receiptUrl: `https://quantumgameware.com/receipts/rcpt_${Date.now()}`
        }
      };

      return NextResponse.json({
        success: true,
        payment: paymentResult,
        message: 'Payment processed successfully'
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { message: 'Payment processing failed', error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/payment/process - Get payment status (for webhooks or status checks)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json(
        { message: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // For demo purposes, return mock payment status
    const mockPaymentStatus = {
      paymentId,
      status: 'succeeded',
      amount: 299.99,
      currency: 'USD',
      processedAt: new Date().toISOString(),
      paymentMethod: 'card'
    };

    return NextResponse.json({
      payment: mockPaymentStatus
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { message: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}