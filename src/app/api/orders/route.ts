// src/app/api/orders/route.ts - Real database implementation
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

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

    // Connect to database
    await connectDB();

    // Get real orders from database, filtered by user
    const userId = new mongoose.Types.ObjectId(userPayload.userId as string);
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Transform orders to match expected format
    const transformedOrders = orders.map(order => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shipping: {
        address: `${order.shipping.address.street}, ${order.shipping.address.city}, ${order.shipping.address.state} ${order.shipping.address.zipCode}`,
        method: order.shipping.method,
        cost: order.shipping.cost,
        trackingNumber: order.shipping.trackingNumber
      }
    }));

    console.log(`📋 Returning ${transformedOrders.length} orders for user`);

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      total: transformedOrders.length
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

    // Connect to database
    await connectDB();

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

    // Calculate reward points (1 point per dollar spent)
    const rewardPointsEarned = Math.floor(orderData.total || 0);

    const userId = new mongoose.Types.ObjectId(userPayload.userId as string);
    console.log('👤 Creating order for userId:', userId.toString());

    // Create real order in database
    const newOrder = await Order.create({
      userId: userId,
      items: orderData.items.map((item: any) => ({
        productId: item.productId || item.id,
        productSlug: item.productSlug || item.slug || '',
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variant: item.variant
      })),
      subtotal: orderData.subtotal || orderData.total || 0,
      shippingCost: orderData.shippingCost || orderData.shipping?.cost || 0,
      tax: orderData.tax || 0,
      total: orderData.total,
      status: 'confirmed',
      shipping: {
        address: {
          name: orderData.shipping.name || `${orderData.shipping.firstName || ''} ${orderData.shipping.lastName || ''}`.trim(),
          street: orderData.shipping.address.street || orderData.shipping.address,
          city: orderData.shipping.address.city || orderData.shipping.city,
          state: orderData.shipping.address.state || orderData.shipping.state,
          zipCode: orderData.shipping.address.zipCode || orderData.shipping.zipCode,
          country: orderData.shipping.address.country || orderData.shipping.country || 'US',
          phone: orderData.shipping.phone
        },
        method: orderData.shipping.method || 'Standard Shipping',
        cost: orderData.shippingCost || orderData.shipping?.cost || 0
      },
      payment: {
        method: orderData.payment?.method || 'credit_card',
        status: orderData.payment?.status || 'completed',
        transactionId: orderData.payment?.transactionId,
        paidAt: orderData.payment?.paidAt ? new Date(orderData.payment.paidAt) : new Date()
      },
      rewardPointsEarned,
      notes: orderData.notes
    });

    console.log('✅ Order created in database:', newOrder.orderNumber);
    console.log('📦 Order ID:', newOrder._id.toString());
    console.log('👤 Order userId:', newOrder.userId.toString());

    // Award reward points to user if they have a loyalty system
    try {
      const { User } = await import('@/models/User');
      const user = await User.findById(userPayload.userId);
      if (user && user.addRewardPoints) {
        await user.addRewardPoints(rewardPointsEarned);
        console.log(`✅ Awarded ${rewardPointsEarned} points to user`);
      }
    } catch (error) {
      console.error('⚠️ Failed to award points:', error);
      // Don't fail the order if points award fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: newOrder._id.toString(),
        orderNumber: newOrder.orderNumber,
        status: newOrder.status,
        total: newOrder.total,
        createdAt: newOrder.createdAt,
        rewardPointsEarned
      },
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
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}