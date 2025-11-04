// File: src/app/api/returns/create/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      orderId,
      orderNumber,
      items,
      reason,
      reasonDetails,
      refundAmount,
      refundMethod = 'original_payment',
      images
    } = body;

    // Validate required fields
    if (!orderId || !orderNumber || !items || !reason || !refundAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item must be selected for return' },
        { status: 400 }
      );
    }

    // Create return request object
    const returnRequest = {
      orderId,
      orderNumber,
      items,
      reason,
      reasonDetails: reasonDetails || '',
      refundAmount,
      refundMethod,
      images: images || [],
    };

    // In a real app, you would:
    // 1. Verify the order exists and belongs to the user
    // 2. Check if items are eligible for return (within 30 days)
    // 3. Validate refund amount matches the items
    // 4. Save to database
    // 5. Send confirmation email
    // 6. Notify admin

    return NextResponse.json(
      {
        success: true,
        message: 'Return request submitted successfully',
        returnRequest: {
          ...returnRequest,
          id: `RET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'requested',
          createdAt: new Date().toISOString(),
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating return request:', error);
    return NextResponse.json(
      { error: 'Failed to create return request' },
      { status: 500 }
    );
  }
}
