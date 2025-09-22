
// src/app/api/payments/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event,
      paymentMethod,
      amount,
      currency = 'USD',
      userId,
      sessionId,
      metadata = {}
    } = body;

    // Validate required fields
    if (!event) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      );
    }

    // Create analytics event
    const analyticsEvent = {
      id: 'evt_' + Date.now().toString(36),
      event,
      paymentMethod: paymentMethod || 'unknown',
      amount: amount || 0,
      currency: currency.toUpperCase(),
      userId: userId || null,
      sessionId: sessionId || null,
      metadata,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    // In production, send to analytics services
    // await sendToGoogleAnalytics(analyticsEvent);
    // await sendToMixpanel(analyticsEvent);
    // await saveToDatabase(analyticsEvent);

    console.log('📊 Payment analytics event recorded:', {
      event,
      paymentMethod,
      amount,
      userId: userId || 'guest'
    });

    // Process different event types
    switch (event) {
      case 'payment_initiated':
        console.log('🎯 Payment flow started for amount:', amount);
        break;
      case 'payment_method_selected':
        console.log('💳 Payment method selected:', paymentMethod);
        break;
      case 'payment_succeeded':
        console.log('✅ Payment completed successfully:', amount);
        break;
      case 'payment_failed':
        console.log('❌ Payment failed for amount:', amount);
        break;
      case 'payment_abandoned':
        console.log('🚪 Payment abandoned at step:', metadata.step);
        break;
      case 'checkout_started':
        console.log('🛒 Checkout process started');
        break;
      case 'checkout_completed':
        console.log('🎉 Checkout completed successfully');
        break;
    }

    return NextResponse.json({
      success: true,
      eventId: analyticsEvent.id,
      recorded: true
    });

  } catch (error) {
    console.error('❌ Analytics event error:', error);
    return NextResponse.json(
      { error: 'Failed to record analytics event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication for analytics access
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
    const timeframe = searchParams.get('timeframe') || '7d';
    const event = searchParams.get('event');

    // Mock analytics data
    const mockAnalytics = {
      timeframe,
      metrics: {
        totalPayments: 1247,
        totalRevenue: 89450.23,
        averageOrderValue: 71.78,
        conversionRate: 3.42,
        topPaymentMethods: [
          { method: 'card', count: 892, percentage: 71.5 },
          { method: 'paypal', count: 245, percentage: 19.6 },
          { method: 'apple_pay', count: 110, percentage: 8.9 }
        ],
        failureReasons: [
          { reason: 'card_declined', count: 45, percentage: 60.0 },
          { reason: 'insufficient_funds', count: 18, percentage: 24.0 },
          { reason: 'expired_card', count: 12, percentage: 16.0 }
        ]
      },
      trends: {
        dailyRevenue: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 15000) + 5000,
          orders: Math.floor(Math.random() * 50) + 20
        }))
      }
    };

    return NextResponse.json(mockAnalytics);

  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
