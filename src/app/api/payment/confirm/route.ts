// src/app/api/payments/confirm/route.ts
export async function PUT(request: NextRequest) {
  try {
    console.log('🔒 Payment confirmation requested');
    
    const body = await request.json();
    const { paymentIntentId, paymentMethod } = body;

    if (!paymentIntentId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Simulate different payment outcomes
    const random = Math.random();
    
    if (random < 0.05) {
      // 5% failure rate
      return NextResponse.json({
        id: paymentIntentId,
        status: 'requires_payment_method',
        last_payment_error: {
          type: 'card_error',
          code: 'card_declined',
          message: 'Your card was declined.'
        }
      });
    }
    
    if (random < 0.08) {
      // 3% requires authentication
      return NextResponse.json({
        id: paymentIntentId,
        status: 'requires_action',
        next_action: {
          type: 'redirect_to_url',
          redirect_to_url: {
            url: `/payments/authenticate?payment_intent=${paymentIntentId}`,
            return_url: `${request.nextUrl.origin}/checkout/success`
          }
        }
      });
    }

    // Success case
    const confirmedIntent = {
      id: paymentIntentId,
      status: 'succeeded',
      amount: Math.round(Math.random() * 50000 + 5000), // Random amount for demo
      currency: 'usd',
      charges: {
        data: [{
          id: 'ch_' + Date.now().toString(36),
          receipt_url: `https://pay.stripe.com/receipts/${paymentIntentId}`,
          billing_details: paymentMethod.billing_details
        }]
      },
      created: Math.floor(Date.now() / 1000)
    };

    console.log('✅ Payment confirmed:', paymentIntentId);

    return NextResponse.json(confirmedIntent);
  } catch (error) {
    console.error('❌ Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
}