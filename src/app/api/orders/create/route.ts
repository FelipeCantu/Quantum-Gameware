// src/app/api/orders/create/route.ts - Order Creation
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('📦 Order creation requested');
    
    await connectDB();

    // Verify authentication (optional for guest checkout)
    const authHeader = request.headers.get('authorization');
    let userId: string | null = null;
    let user = null;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
        const { payload } = await jwtVerify(token, secret);
        userId = payload.userId as string;
        user = await User.findById(userId);
        console.log('✅ Authenticated order for user:', user?.email);
      } catch (error) {
        console.log('⚠️ Authentication failed, proceeding as guest order');
      }
    }

    const body = await request.json();
    const {
      items,
      shipping,
      payment,
      totals,
      paymentIntentId,
      customerInfo
    } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!shipping || !shipping.email) {
      return NextResponse.json(
        { error: 'Shipping information is required' },
        { status: 400 }
      );
    }

    if (!totals || !totals.total) {
      return NextResponse.json(
        { error: 'Order totals are required' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = 'QG-' + Date.now().toString(36).toUpperCase();

    // Create order object
    const order = {
      id: 'order_' + Date.now().toString(36),
      orderNumber,
      userId: userId || null,
      status: 'processing',
      items: items.map((item: any) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || null,
        brand: item.brand || null
      })),
      shipping: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        email: shipping.email,
        phone: shipping.phone || null,
        address: {
          line1: shipping.address,
          line2: shipping.apartment || null,
          city: shipping.city,
          state: shipping.state,
          postalCode: shipping.zipCode,
          country: shipping.country || 'US'
        }
      },
      payment: {
        paymentIntentId: paymentIntentId || null,
        method: payment?.method || 'card',
        status: 'completed',
        transactionId: payment?.transactionId || null,
        ...(payment?.last4 && { last4: payment.last4 }),
        ...(payment?.cardBrand && { cardBrand: payment.cardBrand })
      },
      totals: {
        subtotal: totals.subtotal,
        shipping: totals.shipping || 0,
        tax: totals.tax || 0,
        total: totals.total
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      metadata: {
        customerInfo,
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      }
    };

    // In production, save to database
    // For demo, we'll just return the order
    console.log('✅ Order created:', orderNumber);

    // Send confirmation email (mock)
    console.log('📧 Sending confirmation email to:', shipping.email);

    // Update inventory (mock)
    console.log('📊 Updating inventory for', items.length, 'items');

    return NextResponse.json({
      order,
      message: 'Order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
