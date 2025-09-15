// src/app/api/tracking/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET /api/tracking/[orderId] - Get order tracking information
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // For demo purposes, return mock tracking data
    // In production, you would fetch from your shipping provider's API
    const mockTrackingData = {
      orderId,
      trackingNumber: `TRK${orderId.slice(-8).toUpperCase()}`,
      status: 'in_transit',
      carrier: 'FedEx',
      estimatedDelivery: '2024-01-20T17:00:00Z',
      currentLocation: 'Distribution Center - Tech City, TC',
      timeline: [
        {
          status: 'order_placed',
          date: '2024-01-15T10:30:00Z',
          location: 'Quantum Gameware Warehouse',
          description: 'Order has been placed and is being prepared'
        },
        {
          status: 'processing',
          date: '2024-01-15T14:15:00Z',
          location: 'Quantum Gameware Warehouse',
          description: 'Order is being processed and packaged'
        },
        {
          status: 'shipped',
          date: '2024-01-16T09:00:00Z',
          location: 'Quantum Gameware Warehouse',
          description: 'Package has been shipped via FedEx'
        },
        {
          status: 'in_transit',
          date: '2024-01-17T08:30:00Z',
          location: 'Distribution Center - Tech City, TC',
          description: 'Package is in transit to destination'
        },
        {
          status: 'out_for_delivery',
          date: null,
          location: 'Local Delivery Facility',
          description: 'Package will be out for delivery soon'
        },
        {
          status: 'delivered',
          date: null,
          location: 'Delivery Address',
          description: 'Package will be delivered'
        }
      ],
      shippingAddress: {
        street: '123 Gaming Street',
        city: 'Tech City',
        state: 'TC',
        zipCode: '12345',
        country: 'US'
      },
      packageInfo: {
        weight: '2.5 lbs',
        dimensions: '12" x 8" x 4"',
        packageType: 'Box'
      }
    };

    return NextResponse.json({
      success: true,
      tracking: mockTrackingData
    });
  } catch (error) {
    console.error('Tracking fetch error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tracking information' },
      { status: 500 }
    );
  }
}

// POST /api/tracking/[orderId] - Update tracking information (for webhooks)
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const updateData = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // For demo purposes, acknowledge the update
    // In production, you would update your database with webhook data
    const updatedTracking = {
      orderId,
      status: updateData.status || 'updated',
      updatedAt: new Date().toISOString(),
      ...updateData
    };

    return NextResponse.json({
      success: true,
      message: 'Tracking information updated',
      tracking: updatedTracking
    });
  } catch (error) {
    console.error('Tracking update error:', error);
    return NextResponse.json(
      { message: 'Failed to update tracking information' },
      { status: 500 }
    );
  }
}