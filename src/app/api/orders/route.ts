// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/orders - Fetch all orders for a user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // For demo purposes, return mock orders
    // In production, you would fetch from your database
    if (token.startsWith('demo_token_')) {
      const mockOrders = [
        {
          id: 'order_1',
          orderNumber: 'QG-001',
          status: 'delivered',
          total: 299.99,
          createdAt: '2024-01-15T10:30:00Z',
          items: [
            {
              id: 'item_1',
              name: 'Gaming Mechanical Keyboard',
              price: 149.99,
              quantity: 1,
              image: '/products/keyboard-1.jpg'
            },
            {
              id: 'item_2',
              name: 'Gaming Mouse',
              price: 79.99,
              quantity: 1,
              image: '/products/mouse-1.jpg'
            }
          ],
          shipping: {
            address: '123 Gaming St, Tech City, TC 12345',
            method: 'Standard Shipping',
            cost: 0
          }
        },
        {
          id: 'order_2',
          orderNumber: 'QG-002',
          status: 'processing',
          total: 199.99,
          createdAt: '2024-01-20T14:15:00Z',
          items: [
            {
              id: 'item_3',
              name: 'Gaming Headset',
              price: 199.99,
              quantity: 1,
              image: '/products/headset-1.jpg'
            }
          ],
          shipping: {
            address: '123 Gaming St, Tech City, TC 12345',
            method: 'Express Shipping',
            cost: 15.99
          }
        }
      ];

      return NextResponse.json({
        orders: mockOrders,
        total: mockOrders.length
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const orderData = await request.json();

    // Validate required fields
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { message: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!orderData.shipping || !orderData.shipping.address) {
      return NextResponse.json(
        { message: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // For demo purposes, create a mock order
    // In production, you would save to your database
    if (token.startsWith('demo_token_')) {
      const newOrder = {
        id: 'order_' + Date.now(),
        orderNumber: 'QG-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        status: 'processing',
        total: orderData.total || 0,
        createdAt: new Date().toISOString(),
        items: orderData.items,
        shipping: orderData.shipping,
        payment: orderData.payment || {},
        userId: 'user_demo'
      };

      return NextResponse.json({
        order: newOrder,
        message: 'Order created successfully'
      }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}