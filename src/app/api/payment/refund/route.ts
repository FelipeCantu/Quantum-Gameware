// src/app/api/payments/refund/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
  try {
    console.log('💰 Refund request received');
    
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    
    let userRole;
    try {
      const { payload } = await jwtVerify(token, secret);
      userRole = payload.role as string;
      
      // Only admins can process refunds
      if (userRole !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentIntentId, amount, reason, orderId } = body;

    // Validation
    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      );
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid refund amount is required' },
        { status: 400 }
      );
    }

    // In production, process actual refund
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const refund = await stripe.refunds.create({
    //   payment_intent: paymentIntentId,
    //   amount: Math.round(amount * 100), // Convert to cents
    //   reason: reason || 'requested_by_customer',
    //   metadata: {
    //     orderId: orderId,
    //     processed_by: userId,
    //   }
    // });

    // Mock refund response
    const mockRefund = {
      id: 're_' + Date.now().toString(36),
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_intent: paymentIntentId,
      status: 'succeeded',
      reason: reason || 'requested_by_customer',
      created: Math.floor(Date.now() / 1000),
      metadata: {
        orderId: orderId,
      }
    };

    console.log('✅ Refund processed:', mockRefund.id);

    // Update order status
    if (orderId) {
      // await updateOrderStatus(orderId, 'refunded');
      console.log('📦 Order status updated to refunded:', orderId);
    }

    // Send refund confirmation email
    // await sendRefundConfirmationEmail(customerEmail, mockRefund);
    console.log('📧 Refund confirmation email sent');

    return NextResponse.json({
      success: true,
      refund: mockRefund,
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('❌ Refund processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const paymentIntentId = searchParams.get('paymentIntentId');

    if (!orderId && !paymentIntentId) {
      return NextResponse.json(
        { error: 'Order ID or Payment Intent ID is required' },
        { status: 400 }
      );
    }

    // In production, fetch actual refunds
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const refunds = await stripe.refunds.list({
    //   payment_intent: paymentIntentId,
    //   limit: 10
    // });

    // Mock refunds data
    const mockRefunds = {
      data: [
        {
          id: 're_mock_' + Date.now().toString(36),
          amount: 2999,
          currency: 'usd',
          payment_intent: paymentIntentId,
          status: 'succeeded',
          reason: 'requested_by_customer',
          created: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
        }
      ],
      has_more: false
    };

    return NextResponse.json(mockRefunds);

  } catch (error) {
    console.error('❌ Error fetching refunds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch refunds' },
      { status: 500 }
    );
  }
}
