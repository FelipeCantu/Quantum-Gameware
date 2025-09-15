// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/orders/[id] - Fetch a specific order by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { id: orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // For demo purposes, return mock order data
    // In production, you would fetch from your database
    if (token.startsWith('demo_token_')) {
      // Mock order data
      const mockOrder = {
        id: orderId,
        orderNumber: 'QG-001',
        status: 'delivered',
        total: 299.99,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T15:45:00Z',
        items: [
          {
            id: 'item_1',
            name: 'Gaming Mechanical Keyboard',
            price: 149.99,
            quantity: 1,
            image: '/products/keyboard-1.jpg',
            sku: 'KB-001'
          },
          {
            id: 'item_2',
            name: 'Gaming Mouse',
            price: 79.99,
            quantity: 1,
            image: '/products/mouse-1.jpg',
            sku: 'MS-001'
          }
        ],
        shipping: {
          address: {
            street: '123 Gaming St',
            city: 'Tech City',
            state: 'TC',
            zipCode: '12345',
            country: 'US'
          },
          method: 'Standard Shipping',
          cost: 0,
          trackingNumber: 'TRK123456789'
        },
        payment: {
          method: 'Credit Card',
          last4: '4242',
          status: 'paid'
        },
        timeline: [
          {
            status: 'ordered',
            date: '2024-01-15T10:30:00Z',
            message: 'Order placed successfully'
          },
          {
            status: 'processing',
            date: '2024-01-15T12:00:00Z',
            message: 'Order is being processed'
          },
          {
            status: 'shipped',
            date: '2024-01-16T09:00:00Z',
            message: 'Order has been shipped'
          },
          {
            status: 'delivered',
            date: '2024-01-16T15:45:00Z',
            message: 'Order has been delivered'
          }
        ]
      };

      return NextResponse.json({
        order: mockOrder
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[id] - Update order status (admin only)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { id: orderId } = await context.params;
    const updateData = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // For demo purposes, simulate order update
    // In production, you would update your database
    if (token.startsWith('demo_token_')) {
      const updatedOrder = {
        id: orderId,
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json({
        order: updatedOrder,
        message: 'Order updated successfully'
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}