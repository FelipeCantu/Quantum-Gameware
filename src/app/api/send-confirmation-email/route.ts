// File: src/app/api/send-confirmation-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { escapeHtmlDeep } from '@/lib/escapeHtml';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API route called');

    // Unauthenticated (guest checkout uses it), so cap how often one client can send
    const limited = rateLimit(request, 'send-confirmation-email', 3, 60 * 60 * 1000);
    if (limited) return limited;
    
    // Check environment variables first
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY is not set');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email service not configured' 
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('📦 Request body received:', { orderId: body.order?.id, email: body.order?.shipping?.email });
    
    // Order data comes from the client, so escape it before it reaches the HTML template
    const order = escapeHtmlDeep(body.order);

    // Validate required fields
    if (!order || !order.id || !order.shipping?.email) {
      console.error('❌ Missing required order data');
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

    // Import the service dynamically to avoid import issues
    const { ResendEmailService } = await import('@/services/resendEmailService');
    
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
    console.error('❌ API route error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
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