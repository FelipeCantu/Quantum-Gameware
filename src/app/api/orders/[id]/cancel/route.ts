// src/app/api/orders/[id]/cancel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

// POST /api/orders/[id]/cancel - Cancel an order
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('🚫 Cancelling order ID:', id);

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

    // Find order
    let order;

    // Check if it's a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findOne({
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userPayload.userId as string)
      });
    }

    // If not found, try to find by order number
    if (!order) {
      order = await Order.findOne({
        orderNumber: id,
        userId: new mongoose.Types.ObjectId(userPayload.userId as string)
      });
    }

    if (!order) {
      console.log('❌ Order not found for ID:', id);
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order can be cancelled
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    const cancellationWindow = 30 * 60 * 1000; // 30 minutes in milliseconds

    if (orderAge > cancellationWindow) {
      console.log('❌ Order cancellation window expired');
      return NextResponse.json(
        { success: false, message: 'Order cancellation window has expired (30 minutes)' },
        { status: 400 }
      );
    }

    // Check if order status allows cancellation
    if (!['pending', 'confirmed'].includes(order.status)) {
      console.log('❌ Order cannot be cancelled, status:', order.status);
      return NextResponse.json(
        { success: false, message: `Order cannot be cancelled (status: ${order.status})` },
        { status: 400 }
      );
    }

    // Cancel the order
    await order.updateStatus('cancelled', 'Cancelled by customer within 30-minute window');

    console.log('✅ Order cancelled:', order.orderNumber);

    // TODO: In production, you'd also want to:
    // - Refund the payment
    // - Send cancellation confirmation email
    // - Update inventory
    // - Revoke reward points

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status
      }
    });

  } catch (error) {
    console.error('❌ Order cancellation error:', error);

    if (error instanceof Error && (error.message.includes('authorization') || error.message.includes('Invalid token'))) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
