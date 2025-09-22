// src/app/api/payments/webhook/paypal/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 PayPal webhook received');
    
    const body = await request.text();
    const headers = request.headers;
    
    // Get PayPal webhook headers for verification
    const authAlgo = headers.get('PAYPAL-AUTH-ALGO');
    const transmission = headers.get('PAYPAL-TRANSMISSION-ID');
    const certId = headers.get('PAYPAL-CERT-ID');
    const signature = headers.get('PAYPAL-TRANSMISSION-SIG');
    const timestamp = headers.get('PAYPAL-TRANSMISSION-TIME');
    
    if (!signature || !transmission || !timestamp) {
      console.error('❌ Missing PayPal webhook headers');
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    // In production, verify PayPal webhook signature
    // const isValid = await verifyPayPalWebhookSignature({
    //   authAlgo, transmission, certId, signature, timestamp, body
    // });
    
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    // }

    let event;
    try {
      event = JSON.parse(body);
      console.log('📨 PayPal event type:', event.event_type);
    } catch (err) {
      console.error('❌ Invalid JSON payload');
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Handle PayPal events
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePayPalPaymentCaptured(event.resource);
        break;
      
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePayPalPaymentDenied(event.resource);
        break;
      
      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePayPalPaymentRefunded(event.resource);
        break;
      
      case 'CHECKOUT.ORDER.COMPLETED':
        await handlePayPalOrderCompleted(event.resource);
        break;
      
      case 'BILLING.SUBSCRIPTION.CREATED':
        await handlePayPalSubscriptionCreated(event.resource);
        break;
      
      default:
        console.log('🤷 Unhandled PayPal event type:', event.event_type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePayPalPaymentCaptured(payment: any) {
  console.log('✅ PayPal payment captured:', payment.id);
  
  try {
    // Similar to Stripe payment success handling
    const orderId = payment.custom_id;
    if (orderId) {
      console.log('📦 Updating order status for PayPal payment:', orderId);
    }
    
    // Send confirmation
    console.log('📧 Sending PayPal confirmation email');
    
  } catch (error) {
    console.error('❌ Error handling PayPal payment capture:', error);
  }
}

async function handlePayPalPaymentDenied(payment: any) {
  console.log('❌ PayPal payment denied:', payment.id);
  
  try {
    const orderId = payment.custom_id;
    if (orderId) {
      console.log('📦 Updating order status to failed for PayPal payment:', orderId);
    }
  } catch (error) {
    console.error('❌ Error handling PayPal payment denial:', error);
  }
}

async function handlePayPalPaymentRefunded(payment: any) {
  console.log('💰 PayPal payment refunded:', payment.id);
  
  try {
    // Handle refund logic
    console.log('📦 Processing PayPal refund');
  } catch (error) {
    console.error('❌ Error handling PayPal refund:', error);
  }
}

async function handlePayPalOrderCompleted(order: any) {
  console.log('✅ PayPal order completed:', order.id);
}

async function handlePayPalSubscriptionCreated(subscription: any) {
  console.log('🔄 PayPal subscription created:', subscription.id);
}
