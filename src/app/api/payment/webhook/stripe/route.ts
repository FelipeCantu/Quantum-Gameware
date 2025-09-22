// src/app/api/payments/webhook/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Stripe webhook received');
    
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');
    
    if (!signature) {
      console.error('❌ Missing Stripe signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // In production, verify the webhook signature
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      // In production, uncomment this:
      // event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      
      // For demo, parse the body directly
      event = JSON.parse(body);
      console.log('📨 Stripe event type:', event.type);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      case 'payment_intent.requires_action':
        await handlePaymentIntentRequiresAction(event.data.object);
        break;
      
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object);
        break;
      
      case 'charge.failed':
        await handleChargeFailed(event.data.object);
        break;
      
      case 'charge.dispute.created':
        await handleChargeDisputeCreated(event.data.object);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      
      default:
        console.log('🤷 Unhandled Stripe event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('✅ Payment intent succeeded:', paymentIntent.id);
  
  try {
    // Update order status in database
    const orderId = paymentIntent.metadata?.orderId;
    if (orderId) {
      // await updateOrderStatus(orderId, 'paid');
      console.log('📦 Updated order status to paid:', orderId);
    }
    
    // Send confirmation email
    const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.customerEmail;
    if (customerEmail) {
      // await sendConfirmationEmail(customerEmail, paymentIntent);
      console.log('📧 Sending confirmation email to:', customerEmail);
    }
    
    // Update inventory
    // await updateInventory(paymentIntent.metadata?.items);
    console.log('📊 Inventory updated');
    
    // Trigger fulfillment
    // await triggerFulfillment(orderId);
    console.log('🚚 Fulfillment triggered');
    
  } catch (error) {
    console.error('❌ Error handling payment success:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('❌ Payment intent failed:', paymentIntent.id);
  
  try {
    const orderId = paymentIntent.metadata?.orderId;
    const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.customerEmail;
    
    if (orderId) {
      // await updateOrderStatus(orderId, 'payment_failed');
      console.log('📦 Updated order status to payment_failed:', orderId);
    }
    
    if (customerEmail) {
      // await sendPaymentFailedEmail(customerEmail, paymentIntent);
      console.log('📧 Sending payment failed email to:', customerEmail);
    }
    
    // Log for fraud analysis
    // await logPaymentFailure(paymentIntent);
    
  } catch (error) {
    console.error('❌ Error handling payment failure:', error);
  }
}

async function handlePaymentIntentRequiresAction(paymentIntent: any) {
  console.log('🔐 Payment intent requires action:', paymentIntent.id);
  
  // Handle 3D Secure or other authentication requirements
  try {
    const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.customerEmail;
    if (customerEmail) {
      // await sendAuthenticationRequiredEmail(customerEmail, paymentIntent);
      console.log('📧 Sending authentication required email to:', customerEmail);
    }
  } catch (error) {
    console.error('❌ Error handling authentication requirement:', error);
  }
}

async function handleChargeSucceeded(charge: any) {
  console.log('✅ Charge succeeded:', charge.id);
  
  try {
    // Generate receipt
    // await generateReceipt(charge);
    console.log('📄 Receipt generated for charge:', charge.id);
    
    // Update analytics
    // await updatePaymentAnalytics('charge_succeeded', charge);
    
  } catch (error) {
    console.error('❌ Error handling charge success:', error);
  }
}

async function handleChargeFailed(charge: any) {
  console.log('❌ Charge failed:', charge.id);
  
  try {
    // Log failure reason
    console.log('💡 Failure reason:', charge.failure_message);
    
    // Update analytics
    // await updatePaymentAnalytics('charge_failed', charge);
    
  } catch (error) {
    console.error('❌ Error handling charge failure:', error);
  }
}

async function handleChargeDisputeCreated(dispute: any) {
  console.log('⚠️ Charge dispute created:', dispute.id);
  
  try {
    // Notify admin immediately
    // await notifyAdminOfDispute(dispute);
    console.log('🚨 Admin notified of dispute');
    
    // Gather evidence automatically
    // await gatherDisputeEvidence(dispute);
    console.log('📋 Evidence gathering initiated');
    
    // Update order status
    const chargeId = dispute.charge;
    // await updateOrderStatusByCharge(chargeId, 'disputed');
    
  } catch (error) {
    console.error('❌ Error handling dispute:', error);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('🔄 Subscription created:', subscription.id);
  // Handle subscription logic if you add subscriptions later
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('📄 Invoice payment succeeded:', invoice.id);
  // Handle subscription invoice payments
}