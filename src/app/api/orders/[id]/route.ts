// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

// GET /api/orders/[id] - Get single order details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('📦 Fetching order details for ID:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Verify authentication
    const userPayload = await verifyAuthToken(request);
    console.log('✅ User authenticated:', userPayload.email);

    // Connect to database
    await connectDB();

    // Find order by ID or order number
    let order;

    // Check if it's a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findOne({
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userPayload.userId as string)
      }).lean();
    }

    // If not found, try to find by order number
    if (!order) {
      order = await Order.findOne({
        orderNumber: id,
        userId: new mongoose.Types.ObjectId(userPayload.userId as string)
      }).lean();
    }

    if (!order) {
      console.log('❌ Order not found for ID:', id);
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order found:', order.orderNumber);

    // Transform order to match expected format
    const transformedOrder = {
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
        cost: order.shipping.cost
      },
      payment: {
        method: order.payment.method,
        last4: order.payment.transactionId?.slice(-4) || '****'
      }
    };

    return NextResponse.json({
      success: true,
      order: transformedOrder
    });

  } catch (error) {
    console.error('❌ Order fetch error:', error);

    if (error instanceof Error && (error.message.includes('authorization') || error.message.includes('Invalid token'))) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}