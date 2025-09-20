// src/app/api/orders/route.ts - Fixed to work with your auth system
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Mock orders data - replace with real database calls
const getMockOrders = () => [
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
  },
  {
    id: 'order_3',
    orderNumber: 'QG-003',
    status: 'shipped',
    total: 89.99,
    createdAt: '2024-01-25T09:20:00Z',
    items: [
      {
        id: 'item_4',
        name: 'Gaming Controller',
        price: 89.99,
        quantity: 1,
        image: '/products/controller-1.jpg'
      }
    ],
    shipping: {
      address: '123 Gaming St, Tech City, TC 12345',
      method: 'Standard Shipping',
      cost: 0
    }
  }
];

async function verifyAuthToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);
  
  // Handle demo tokens
  if (token.startsWith('demo_token_')) {
    return {
      userId: 'demo_user',
      email: 'demo@quantumgameware.com',
      role: 'customer'
    };
  }

  // Verify JWT tokens
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    );
    
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid token');
  }
}

// GET /api/orders - Fetch all orders for a user
export async function GET(request: NextRequest) {
  try {
    console.log('📦 Orders API called');
    
    // Verify authentication
    const userPayload = await verifyAuthToken(request);
    console.log('✅ User authenticated:', userPayload.email);

    // Get mock orders (in production, filter by user)
    const orders = getMockOrders();
    
    console.log(`📋 Returning ${orders.length} orders for user`);

    return NextResponse.json({
      success: true,
      orders: orders,
      total: orders.length
    });

  } catch (error) {
    console.error('❌ Orders API error:', error);
    
    if (error instanceof Error && error.message.includes('authorization')) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Authentication required',
          error: 'Missing or invalid authorization token'
        },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes('Invalid token')) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid authentication token',
          error: 'Token verification failed'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error',
        error: 'Failed to fetch orders'
      },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    console.log('📦 Create order API called');
    
    // Verify authentication
    const userPayload = await verifyAuthToken(request);
    console.log('✅ User authenticated for order creation:', userPayload.email);

    const orderData = await request.json();

    // Validate required fields
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Order must contain at least one item' 
        },
        { status: 400 }
      );
    }

    if (!orderData.shipping || !orderData.shipping.address) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Shipping address is required' 
        },
        { status: 400 }
      );
    }

    // Create mock order
    const newOrder = {
      id: 'order_' + Date.now(),
      orderNumber: 'QG-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      status: 'processing',
      total: orderData.total || 0,
      createdAt: new Date().toISOString(),
      items: orderData.items,
      shipping: orderData.shipping,
      payment: orderData.payment || {},
      userId: userPayload.userId
    };

    console.log('✅ Order created:', newOrder.orderNumber);

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Create order error:', error);
    
    if (error instanceof Error && (error.message.includes('authorization') || error.message.includes('Invalid token'))) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}