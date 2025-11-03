// src/app/api/contact/route.ts
//
// Email configuration: Using verified domain support@quantumgameware.com
// If emails are not being delivered, verify DNS records at https://resend.com/domains
//
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('⚠️  RESEND_API_KEY not configured');
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Send email to admin
    const adminResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Quantum Gameware <support@quantumgameware.com>',
        to: [process.env.ADMIN_EMAIL || 'felipe@quantumgameware.com'],
        subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
              <h2 style="color: #374151; font-size: 18px; margin: 0 0 10px 0;">Contact Information</h2>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Subject:</strong> ${subject}</p>
            </div>

            <div style="margin-top: 20px;">
              <h2 style="color: #374151; font-size: 18px; margin: 0 0 10px 0;">Message</h2>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; color: #374151; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 14px;">
              <p>This message was sent from the Quantum Gameware contact form</p>
              <p style="margin-top: 10px;">
                <a href="mailto:${email}" style="color: #667eea; text-decoration: none; font-weight: bold;">Reply to ${name}</a>
              </p>
            </div>
          </div>
        </div>
      `,
      }),
    });

    if (!adminResponse.ok) {
      const error = await adminResponse.text();
      console.error('❌ Resend API error (admin):', error);
      return NextResponse.json(
        { success: false, message: 'Failed to send email' },
        { status: 500 }
      );
    }

    const adminData = await adminResponse.json();
    console.log('✅ Admin notification sent:', adminData.id);

    // Send confirmation email to user
    console.log('📧 Attempting to send confirmation to:', email);
    const confirmationResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Quantum Gameware <support@quantumgameware.com>',
        to: [email],
        subject: 'Thank you for contacting Quantum Gameware!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong>${name}</strong>,
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for reaching out to us! We've received your message and our team will get back to you within 24 hours.
            </p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">Your Message:</h2>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Subject:</strong> ${subject}</p>
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb; color: #6b7280; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 20px;">
              In the meantime, feel free to:
            </p>

            <ul style="color: #6b7280; font-size: 15px; line-height: 1.8; margin-top: 10px;">
              <li>Browse our <a href="https://quantumgameware.com/products" style="color: #667eea; text-decoration: none;">latest products</a></li>
              <li>Check out our <a href="https://quantumgameware.com/help" style="color: #667eea; text-decoration: none;">help center</a></li>
              <li>Follow us on social media for updates</li>
            </ul>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
              <p style="color: #374151; font-weight: bold; margin-bottom: 10px;">Best regards,</p>
              <p style="color: #667eea; font-size: 18px; font-weight: bold; margin: 0;">Quantum Gameware Team</p>
            </div>

            <div style="margin-top: 30px; padding: 15px; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                <strong>💡 Tip:</strong> Add support@quantumgameware.com to your contacts to ensure our emails don't go to spam!
              </p>
            </div>
          </div>
        </div>
      `,
      }),
    });

    if (!confirmationResponse.ok) {
      const error = await confirmationResponse.text();
      console.error('❌ Resend API error (confirmation):', error);
      // Don't fail if confirmation email fails, admin email was sent
    } else {
      const confirmData = await confirmationResponse.json();
      console.log('✅ Confirmation email sent:', confirmData.id);
    }

    console.log('✅ Contact form submission processed successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully! Check your email for confirmation.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
