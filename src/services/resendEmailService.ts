// File: src/services/resendEmailService.ts
import { EmailService, type EmailOrder } from './emailService';

// Simple Resend API client without the full SDK to avoid dependencies
class SimpleResendClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(emailData: {
    from: string;
    to: string[];
    subject: string;
    html: string;
    text: string;
    headers?: Record<string, string>;
    tags?: Array<{ name: string; value: string }>;
  }) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: result };
      }

      return { data: result, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

const resend = new SimpleResendClient(process.env.RESEND_API_KEY || '');

export class ResendEmailService extends EmailService {
  /**
   * Send actual order confirmation email using Resend
   */
  static async sendOrderConfirmationEmail(order: EmailOrder): Promise<boolean> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        return false;
      }

      // Generate email content using your existing templates
      const htmlContent = this.generateOrderConfirmationEmail(order);
      const textContent = this.generatePlainTextEmail(order);
      
      // Send email via Resend
      const { data, error } = await resend.send({
        from: `QuantumGameware Orders <orders@${process.env.NEXT_PUBLIC_DOMAIN || 'quantumgameware.com'}>`,
        to: [order.shipping.email],
        subject: `Order Confirmed! #${order.id} - Your Gaming Gear is On Its Way`,
        html: htmlContent,
        text: textContent,
        headers: {
          'X-Entity-Ref-ID': order.id,
          'X-Priority': '1',
        },
        tags: [
          { name: 'category', value: 'order_confirmation' },
          { name: 'order_id', value: order.id },
          { name: 'customer_email', value: order.shipping.email },
          { name: 'order_total', value: order.totals.total.toString() }
        ]
      });

      if (error) {
        console.error('Resend API error:', error);
        return false;
      }

      console.log(`✅ Order confirmation email sent successfully!`);
      console.log(`📧 Email ID: ${data?.id}`);
      console.log(`📬 Sent to: ${order.shipping.email}`);
      console.log(`🛍️ Order: ${order.id}`);
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      return false;
    }
  }

  /**
   * Test email configuration
   */
  static async testEmailConfiguration(testEmail: string): Promise<boolean> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        return false;
      }

      const { data, error } = await resend.send({
        from: `QuantumGameware Test <test@${process.env.NEXT_PUBLIC_DOMAIN || 'quantumgameware.com'}>`,
        to: [testEmail],
        subject: 'Email Configuration Test - QuantumGameware',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4299e1;">✅ Email Configuration Test</h2>
            <p>Congratulations! Your Resend email configuration is working perfectly.</p>
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #2d3748;">Test Details:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Service:</strong> Resend</li>
                <li><strong>Domain:</strong> ${process.env.NEXT_PUBLIC_DOMAIN || 'quantumgameware.com'}</li>
                <li><strong>Status:</strong> <span style="color: #38a169; font-weight: bold;">Active</span></li>
                <li><strong>Test Date:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            <p style="color: #718096;">Your order confirmation emails will be sent successfully.</p>
          </div>
        `,
        text: `Email Configuration Test - QuantumGameware\n\nCongratulations! Your Resend email configuration is working perfectly.\n\nTest Details:\n- Service: Resend\n- Domain: ${process.env.NEXT_PUBLIC_DOMAIN || 'quantumgameware.com'}\n- Status: Active\n- Test Date: ${new Date().toLocaleString()}\n\nYour order confirmation emails will be sent successfully.`,
        tags: [{ name: 'category', value: 'configuration_test' }]
      });

      if (error) {
        console.error('Test email failed:', error);
        return false;
      }

      console.log('✅ Test email sent successfully:', data?.id);
      return true;
    } catch (error) {
      console.error('Test email error:', error);
      return false;
    }
  }
}