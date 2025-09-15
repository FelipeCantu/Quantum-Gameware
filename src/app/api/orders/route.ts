// File: src/app/api/orders/route.ts (NEW FILE)
// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const orderId = searchParams.get('orderId');

    // In a real app, this would query a database
    // For now, we'll return a mock response
    const mockOrders = [
      {
        id: 'ORD-ABC123',
        email: 'customer@example.com',
        status: 'shipped',
        items: [],
        total: 299.99,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    let filteredOrders = mockOrders;
    
    if (email) {
      filteredOrders = mockOrders.filter(order => order.email === email);
    }
    
    if (orderId) {
      filteredOrders = mockOrders.filter(order => order.id === orderId);
    }

    return NextResponse.json({ orders: filteredOrders });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.items || !orderData.shipping || !orderData.payment) {
      return NextResponse.json(
        { error: 'Missing required order data' },
        { status: 400 }
      );
    }

    // In a real app, this would save to a database
    const order = {
      id: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ...orderData,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // In a real app, this would query a database
    const mockOrder = {
      id: orderId,
      email: 'customer@example.com',
      status: 'shipped',
      items: [
        {
          id: '1',
          name: 'Gaming Mouse',
          price: 99.99,
          quantity: 1,
          image: '/images/mouse.jpg'
        }
      ],
      shipping: {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'USA'
      },
      payment: {
        last4: '1234',
        cardType: 'Visa',
        transactionId: 'TXN-ABC123'
      },
      totals: {
        subtotal: 99.99,
        tax: 8.00,
        shipping: 0,
        total: 107.99
      },
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json({ order: mockOrder });
  } catch (error) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
}

// src/app/api/payment/process/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json();
    
    // Validate payment data
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.amount) {
      return NextResponse.json(
        { error: 'Missing required payment data' },
        { status: 400 }
      );
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Basic validation (in real app, use payment processor like Stripe)
    const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
    
    // Simple card number validation
    if (!/^\d{13,19}$/.test(cardNumber)) {
      return NextResponse.json(
        { error: 'Invalid card number' },
        { status: 400 }
      );
    }

    // Simulate random payment failures (5% chance)
    if (Math.random() < 0.05) {
      return NextResponse.json(
        { error: 'Payment declined by bank' },
        { status: 402 }
      );
    }

    // Success
    const transactionId = 'TXN-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    return NextResponse.json({
      success: true,
      transactionId,
      amount: paymentData.amount
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

// src/app/api/tracking/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    // Mock tracking data
    const trackingData = {
      orderId,
      carrier: 'UPS',
      trackingNumber: 'UPS123456789',
      status: 'in_transit',
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      events: [
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'order_placed',
          description: 'Order placed and payment confirmed',
          location: 'Online'
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'shipped',
          description: 'Package shipped from fulfillment center',
          location: 'Los Angeles, CA'
        },
        {
          date: new Date().toISOString(),
          status: 'in_transit',
          description: 'Package in transit',
          location: 'Phoenix, AZ'
        }
      ]
    };

    return NextResponse.json({ tracking: trackingData });
  } catch (error) {
    return NextResponse.json(
      { error: 'Tracking information not found' },
      { status: 404 }
    );
  }
}