// src/app/api/payments/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Subscription creation requested');
    
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const body = await request.json();
    const { priceId, paymentMethodId, customerInfo } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // In production, create actual subscription with Stripe
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const subscription = await stripe.subscriptions.create({
    //   customer: customerId,
    //   items: [{ price: priceId }],
    //   payment_behavior: 'default_incomplete',
    //   expand: ['latest_invoice.payment_intent'],
    // });

    // Mock subscription creation
    const mockSubscription = {
      id: 'sub_' + Date.now().toString(36),
      status: 'incomplete',
      customer: 'cus_' + userId.slice(-8),
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      items: {
        data: [{
          id: 'si_' + Date.now().toString(36),
          price: {
            id: priceId,
            unit_amount: 999, // $9.99
            currency: 'usd',
            recurring: {
              interval: 'month'
            }
          }
        }]
      },
      latest_invoice: {
        payment_intent: {
          id: 'pi_' + Date.now().toString(36),
          client_secret: 'pi_' + Math.random().toString(36) + '_secret',
          status: 'requires_payment_method'
        }
      }
    };

    console.log('✅ Subscription created:', mockSubscription.id);

    return NextResponse.json({
      subscription: mockSubscription,
      message: 'Subscription created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
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

    const token = authHeader.substring(7);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // In production, fetch user's subscriptions
    // const subscriptions = await stripe.subscriptions.list({
    //   customer: customerId,
    //   limit: 10
    // });

    // Mock user subscriptions
    const mockSubscriptions = {
      data: [
        {
          id: 'sub_active_' + Date.now().toString(36),
          status: 'active',
          current_period_start: Math.floor(Date.now() / 1000) - (10 * 24 * 60 * 60), // 10 days ago
          current_period_end: Math.floor(Date.now() / 1000) + (20 * 24 * 60 * 60), // 20 days from now
          items: {
            data: [{
              price: {
                id: 'price_premium',
                unit_amount: 1999, // $19.99
                currency: 'usd',
                recurring: { interval: 'month' },
                product: {
                  name: 'Premium Gaming Subscription'
                }
              }
            }]
          }
        }
      ],
      has_more: false
    };

    return NextResponse.json(mockSubscriptions);

  } catch (error) {
    console.error('❌ Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Handle subscription updates (pause, cancel, etc.)
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subscriptionId, action } = body;

    if (!subscriptionId || !action) {
      return NextResponse.json(
        { error: 'Subscription ID and action are required' },
        { status: 400 }
      );
    }
 // In production, update subscription
    let updatedSubscription;
    switch (action) {
      case 'cancel':
        // updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        //   cancel_at_period_end: true
        // });
        console.log('📝 Subscription marked for cancellation:', subscriptionId);
        break;
      
      case 'pause':
        // updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        //   pause_collection: { behavior: 'void' }
        // });
        console.log('⏸️ Subscription paused:', subscriptionId);
        break;
      
      case 'resume':
        // updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        //   pause_collection: null
        // });
        console.log('▶️ Subscription resumed:', subscriptionId);
        break;
    }

    // Mock updated subscription
    const mockUpdatedSubscription = {
      id: subscriptionId,
      status: action === 'cancel' ? 'active' : action === 'pause' ? 'paused' : 'active',
      cancel_at_period_end: action === 'cancel',
      updated: Math.floor(Date.now() / 1000)
    };

    return NextResponse.json({
      subscription: mockUpdatedSubscription,
      message: `Subscription ${action}${action === 'cancel' ? 'led' : action === 'pause' ? 'd' : 'd'} successfully`
    });

  } catch (error) {
    console.error('❌ Subscription update error:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}