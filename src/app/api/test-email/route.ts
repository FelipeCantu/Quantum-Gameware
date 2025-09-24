// File: src/app/api/test-email/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'test@example.com';
    
    console.log('🔍 Testing email service...');
    console.log('📧 Target email:', email);
    
    // Check environment variables
    const envCheck = {
      RESEND_API_KEY_SET: !!process.env.RESEND_API_KEY,
      RESEND_API_KEY_LENGTH: process.env.RESEND_API_KEY?.length || 0,
      RESEND_API_KEY_PREFIX: process.env.RESEND_API_KEY?.substring(0, 6) || 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN
    };
    
    console.log('🔧 Environment check:', envCheck);
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'RESEND_API_KEY is not set',
        envCheck
      }, { status: 500 });
    }
    
    // Import and test the email service
    const { ResendEmailService } = await import('@/services/resendEmailService');
    const success = await ResendEmailService.testEmailConfiguration(email);
    
    return NextResponse.json({ 
      success, 
      message: success ? 'Test email sent successfully!' : 'Failed to send test email',
      email,
      envCheck
    });
    
  } catch (error) {
    console.error('❌ Test email API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No details'
    }, { status: 500 });
  }
}