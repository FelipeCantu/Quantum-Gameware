// src/app/api/payments/disputes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(request: NextRequest) {
  try {
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
    
    try {
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role as string;
      
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    // In production, fetch actual disputes
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const disputes = await stripe.disputes.list({ limit });

    // Mock disputes data
    const mockDisputes = {
      data: [
        {
          id: 'dp_' + Date.now().toString(36),
          amount: 2999,
          currency: 'usd',
          charge: 'ch_' + Date.now().toString(36),
          status: 'warning_needs_response',
          reason: 'fraudulent',
          created: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
          evidence_due_by: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days from now
          metadata: {
            orderId: 'order_123',
            customerEmail: 'customer@example.com'
          }
        }
      ],
      has_more: false
    };

    return NextResponse.json(mockDisputes);

  } catch (error) {
    console.error('❌ Error fetching disputes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch disputes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle dispute evidence submission
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { disputeId, evidence } = body;

    if (!disputeId || !evidence) {
      return NextResponse.json(
        { error: 'Dispute ID and evidence are required' },
        { status: 400 }
      );
    }

    // In production, submit evidence to Stripe
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const updatedDispute = await stripe.disputes.update(disputeId, {
    //   evidence: evidence
    // });

    console.log('📋 Dispute evidence submitted for:', disputeId);

    return NextResponse.json({
      success: true,
      message: 'Dispute evidence submitted successfully',
      disputeId
    });

  } catch (error) {
    console.error('❌ Error submitting dispute evidence:', error);
    return NextResponse.json(
      { error: 'Failed to submit evidence' },
      { status: 500 }
    );
  }
}