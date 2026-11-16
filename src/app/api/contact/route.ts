// src/app/api/contact/route.ts
//
// Email sender and recipient come from src/config/site.ts (EMAIL_FROM / ADMIN_EMAIL env vars).
//
import { NextRequest, NextResponse } from 'next/server';
import { emailFrom, ADMIN_EMAIL, SITE_URL } from '@/config/site';
import { rateLimit } from '@/lib/rateLimit';
import { escapeHtml } from '@/lib/escapeHtml';

const MAX_LENGTHS = { name: 100, email: 254, subject: 200, message: 5000 };

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, 'contact', 5, 60 * 60 * 1000);
    if (limited) return limited;

    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    for (const [field, max] of Object.entries(MAX_LENGTHS)) {
      if (typeof body[field] !== 'string' || body[field].length > max) {
        return NextResponse.json(
          { success: false, message: `${field} must be text of at most ${max} characters` },
          { status: 400 }
        );
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Escape everything interpolated into the HTML emails below
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('⚠️  RESEND_API_KEY not configured');
      return NextResponse.json(
        { success: false, message: 'Email service not configured' },
        { status: 500 }
      );
    }

    if (!ADMIN_EMAIL) {
      console.error('⚠️  ADMIN_EMAIL not configured');
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
        from: emailFrom(),
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `Contact Form: ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: #3B82F6; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
              <h2 style="color: #374151; font-size: 18px; margin: 0 0 10px 0;">Contact Information</h2>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Name:</strong> ${safeName}</p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #3B82F6; text-decoration: none;">${safeEmail}</a></p>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Subject:</strong> ${safeSubject}</p>
            </div>

            <div style="margin-top: 20px;">
              <h2 style="color: #374151; font-size: 18px; margin: 0 0 10px 0;">Message</h2>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; color: #374151; line-height: 1.6;">
                ${safeMessage}
              </div>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 14px;">
              <p>This message was sent from the Quantum Gameware contact form</p>
              <p style="margin-top: 10px;">
                <a href="mailto:${safeEmail}" style="color: #3B82F6; text-decoration: none; font-weight: bold;">Reply to ${safeName}</a>
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
        from: emailFrom(),
        to: [email],
        subject: 'Thank you for contacting Quantum Gameware!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: #3B82F6; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hi <strong>${safeName}</strong>,
            </p>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for reaching out to us! We've received your message and our team will get back to you within 24 hours.
            </p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #374151; font-size: 18px; margin: 0 0 15px 0;">Your Message:</h2>
              <p style="margin: 5px 0; color: #6b7280;"><strong>Subject:</strong> ${safeSubject}</p>
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb; color: #6b7280; line-height: 1.6;">
                ${safeMessage}
              </div>
            </div>

            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 20px;">
              In the meantime, feel free to:
            </p>

            <ul style="color: #6b7280; font-size: 15px; line-height: 1.8; margin-top: 10px;">
              <li>Browse our <a href="${SITE_URL}/products" style="color: #3B82F6; text-decoration: none;">latest products</a></li>
              <li>Check out our <a href="${SITE_URL}/help" style="color: #3B82F6; text-decoration: none;">help center</a></li>
              <li>Follow us on social media for updates</li>
            </ul>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
              <p style="color: #374151; font-weight: bold; margin-bottom: 10px;">Best regards,</p>
              <p style="color: #3B82F6; font-size: 18px; font-weight: bold; margin: 0;">Quantum Gameware Team</p>
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
