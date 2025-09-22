// src/app/api/payments/methods/route.ts - Saved Payment Methods
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

    // In production, fetch from database
    // For demo, return mock saved payment methods
    const savedMethods = [
      {
        id: 'pm_1234567890',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        },
        billing_details: {
          name: 'John Doe'
        },
        created: Date.now() - 86400000 // 1 day ago
      }
    ];

    return NextResponse.json({
      data: savedMethods,
      has_more: false
    });
  } catch (error) {
    console.error('❌ Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { paymentMethod, setAsDefault = false } = body;

    // Validate payment method data
    if (!paymentMethod || !paymentMethod.type) {
      return NextResponse.json(
        { error: 'Invalid payment method data' },
        { status: 400 }
      );
    }

    // In production, save to database and payment provider
    // For demo, return mock saved payment method
    const savedMethod = {
      id: 'pm_' + Date.now().toString(36),
      type: paymentMethod.type,
      ...(paymentMethod.type === 'card' && {
        card: {
          brand: paymentMethod.card.brand || 'visa',
          last4: paymentMethod.card.number.slice(-4),
          exp_month: paymentMethod.card.exp_month,
          exp_year: paymentMethod.card.exp_year
        }
      }),
      billing_details: paymentMethod.billing_details,
      created: Date.now()
    };

    console.log('💾 Payment method saved for user:', userId);

    return NextResponse.json(savedMethod, { status: 201 });
  } catch (error) {
    console.error('❌ Error saving payment method:', error);
    return NextResponse.json(
      { error: 'Failed to save payment method' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const methodId = searchParams.get('id');

    if (!methodId) {
      return NextResponse.json(
        { error: 'Payment method ID required' },
        { status: 400 }
      );
    }

    // In production, delete from database and payment provider
    console.log('🗑️ Payment method deleted:', methodId, 'for user:', userId);

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('❌ Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}