// src/app/api/orders/route.ts - Real database implementation
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';
import { client } from '@/sanity/lib/client';

// Must match the totals shown on the checkout page
const TAX_RATE = 0.08;
const SHIPPING_COST = 0;

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

    // Price the order server-side from Sanity; never trust client prices or totals
    const productIds: string[] = orderData.items.map((item: any) => String(item.productId || item.id));
    const products: Array<{ _id: string; price: number; inStock?: boolean }> = await client.fetch(
      `*[_type == "product" && _id in $ids]{ _id, price, inStock }`,
      { ids: productIds }
    );
    const productById = new Map(products.map(p => [p._id, p]));

    const pricedItems = [];
    for (const item of orderData.items) {
      const product = productById.get(String(item.productId || item.id));
      const quantity = Number(item.quantity);
      if (!product || product.inStock === false) {
        return NextResponse.json(
          { success: false, message: `Product unavailable: ${item.name || item.productId}` },
          { status: 400 }
        );
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return NextResponse.json(
          { success: false, message: 'Invalid item quantity' },
          { status: 400 }
        );
      }
      pricedItems.push({ ...item, productId: product._id, price: product.price, quantity });
    }

    const roundCents = (n: number) => Math.round(n * 100) / 100;
    const subtotal = roundCents(pricedItems.reduce((sum, item) => sum + item.price * item.quantity, 0));
    const shippingCost = SHIPPING_COST;
    const tax = roundCents(subtotal * TAX_RATE);
    const total = roundCents(subtotal + shippingCost + tax);

    // Calculate reward points (1 point per dollar spent)
    const rewardPointsEarned = Math.floor(total);

    const userId = new mongoose.Types.ObjectId(userPayload.userId as string);
    console.log('👤 Creating order for userId:', userId.toString());

    // Create real order in database
    const newOrder = await Order.create({
      userId: userId,
      items: pricedItems.map((item: any) => ({
        productId: item.productId,
        productSlug: item.productSlug || item.slug || '',
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variant: item.variant
      })),
      subtotal,
      shippingCost,
      tax,
      total,
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
        cost: shippingCost
      },
      // No payment processor is integrated yet, so payment is never marked
      // completed from client input. A verified payment webhook should do that.
      payment: {
        method: orderData.payment?.method || 'credit_card',
        status: 'pending'
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