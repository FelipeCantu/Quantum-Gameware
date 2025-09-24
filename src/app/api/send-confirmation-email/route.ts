// File: src/app/api/send-confirmation-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ResendEmailService } from '@/services/resendEmailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order } = body;

    // Validate required fields
    if (!order || !order.id || !order.shipping?.email) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required order data or email address' 
        },
        { status: 400 }
      );
    }

    // Convert date strings back to Date objects
    const orderWithDates = {
      ...order,
      createdAt: new Date(order.createdAt),
      estimatedDelivery: new Date(order.estimatedDelivery)
    };

    console.log(`📧 Attempting to send confirmation email for order: ${order.id}`);
    console.log(`📬 Recipient: ${order.shipping.email}`);

    // Send the confirmation email
    const emailSent = await ResendEmailService.sendOrderConfirmationEmail(orderWithDates);

    if (emailSent) {
      console.log(`✅ Email sent successfully for order: ${order.id}`);
      return NextResponse.json({ 
        success: true, 
        message: 'Confirmation email sent successfully' 
      });
    } else {
      console.error(`❌ Failed to send email for order: ${order.id}`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send email' 
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'Email service is running',
    timestamp: new Date().toISOString()
  });
}