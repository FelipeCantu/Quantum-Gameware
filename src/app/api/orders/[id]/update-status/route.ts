// src/app/api/orders/[id]/update-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import mongoose from 'mongoose';

// PATCH /api/orders/[id]/update-status - Update order status
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('📦 Updating order status for ID:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Verify authentication
    const userPayload = await verifyAuthToken(request);
    console.log('✅ User authenticated:', userPayload.email);

    // Only admins may change order status. Outside production, owners may
    // update their own orders so returns can be tested end to end.
    const isAdmin = userPayload.role === 'admin';
    if (!isAdmin && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, message: 'Not authorized to update order status' },
        { status: 403 }
      );
    }
    const ownerFilter = isAdmin
      ? {}
      : { userId: new mongoose.Types.ObjectId(userPayload.userId) };

    // Get the new status from request body
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      );
    }

    // Validate status value
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find and update order
    let order;

    // Check if it's a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      order = await Order.findOne({
        _id: new mongoose.Types.ObjectId(id),
        ...ownerFilter
      });
    }

    // If not found, try to find by order number
    if (!order) {
      order = await Order.findOne({
        orderNumber: id,
        ...ownerFilter
      });
    }

    if (!order) {
      console.log('❌ Order not found for ID:', id);
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Update the order status using the model method
    await order.updateStatus(status, `Status changed to ${status}`);

    console.log('✅ Order status updated:', order.orderNumber, '->', status);

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        status: order.status
      }
    });

  } catch (error) {
    console.error('❌ Order status update error:', error);

    if (error instanceof Error && (error.message.includes('authorization') || error.message.includes('Invalid token'))) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
