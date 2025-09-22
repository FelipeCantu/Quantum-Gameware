// src/app/api/payments/webhook/square/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Square webhook received');
    
    const body = await request.text();
    const signature = request.headers.get('x-square-signature');
    
    if (!signature) {
      console.error('❌ Missing Square signature');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    // In production, verify Square webhook signature
    // const isValid = verifySquareWebhookSignature(body, signature, process.env.SQUARE_WEBHOOK_SIGNATURE_KEY);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    // }

    let event;
    try {
      event = JSON.parse(body);
      console.log('📨 Square event type:', event.type);
    } catch (err) {
      console.error('❌ Invalid JSON payload');
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Handle Square events
    switch (event.type) {
      case 'payment.updated':
        await handleSquarePaymentUpdated(event.data.object.payment);
        break;
      
      case 'refund.updated':
        await handleSquareRefundUpdated(event.data.object.refund);
        break;
      
      case 'dispute.state.updated':
        await handleSquareDisputeUpdated(event.data.object.dispute);
        break;
      
      default:
        console.log('🤷 Unhandled Square event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Square webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSquarePaymentUpdated(payment: any) {
  console.log('🔄 Square payment updated:', payment.id, 'Status:', payment.status);
  
  try {
    switch (payment.status) {
      case 'COMPLETED':
        console.log('✅ Square payment completed');
        // Handle successful payment
        break;
      case 'FAILED':
        console.log('❌ Square payment failed');
        // Handle failed payment
        break;
      case 'CANCELED':
        console.log('⚠️ Square payment canceled');
        // Handle canceled payment
        break;
    }
  } catch (error) {
    console.error('❌ Error handling Square payment update:', error);
  }
}

async function handleSquareRefundUpdated(refund: any) {
  console.log('💰 Square refund updated:', refund.id, 'Status:', refund.status);
}

async function handleSquareDisputeUpdated(dispute: any) {
  console.log('⚠️ Square dispute updated:', dispute.id, 'State:', dispute.state);
}