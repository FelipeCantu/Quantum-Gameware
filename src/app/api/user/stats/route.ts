// src/app/api/user/stats/route.ts - Get user statistics
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { User } from '@/models/User';
import mongoose from 'mongoose';

// GET /api/user/stats - Get user statistics for account page
export async function GET(request: NextRequest) {
  try {
    console.log('📊 User stats API called');

    // Verify authentication
    const userPayload = await verifyAuthToken(request);
    console.log('✅ User authenticated:', userPayload.email);

    // Connect to database
    await connectDB();

    const userId = new mongoose.Types.ObjectId(userPayload.userId as string);
    console.log('🔍 Looking for orders with userId:', userId.toString());

    // Get user data with loyalty info
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get order statistics using the static method
    const orderStats = await Order.getUserStats(userId);
    console.log('📊 Order stats from getUserStats:', orderStats);

    // Get recent orders
    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    console.log('📦 Found recent orders:', recentOrders.length);

    // Also check total order count in database
    const totalOrdersInDb = await Order.countDocuments({ userId });
    console.log('🔢 Total orders in database for this user:', totalOrdersInDb);

    // Transform recent orders
    const transformedOrders = recentOrders.map(order => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      date: order.createdAt,
      total: order.total,
      status: order.status,
      items: order.items.length
    }));

    // Calculate member since date
    const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    }) : 'Recently';

    // Get loyalty tier
    const loyaltyTier = user.loyalty?.tier || 'bronze';
    const rewardPoints = user.loyalty?.points || 0;

    const stats = {
      totalOrders: orderStats.totalOrders,
      totalSpent: parseFloat(orderStats.totalSpent.toFixed(2)),
      rewardPoints,
      memberSince,
      loyaltyTier,
      recentOrders: transformedOrders
    };

    console.log('✅ Stats calculated:', stats);

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ User stats error:', error);

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
