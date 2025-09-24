// File: src/services/resendEmailService.ts
import { Resend } from 'resend';
import { EmailService, type EmailOrder } from './emailService';

const resend = new Resend(process.env.RESEND_API_KEY);

export class ResendEmailService extends EmailService {
  /**
   * Send actual order confirmation email using Resend
   */
  static async sendOrderConfirmationEmail(order: EmailOrder): Promise<boolean> {
    try {
      // Generate email content using your existing templates
      const htmlContent = this.generateOrderConfirmationEmail(order);
      const textContent = this.generatePlainTextEmail(order);
      
      // Send email via Resend
      const { data, error } = await resend.emails.send({
        from: `QuantumGameware Orders <orders@${process.env.NEXT_PUBLIC_DOMAIN || 'yourdomain.com'}>`,
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
      console.log(`🛍️  Order: ${order.id}`);
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send order confirmation email:', error);
      return false;
    }
  }

  /**
   * Send shipping notification email
   */
  static async sendShippingNotification(
    order: EmailOrder, 
    trackingNumber: string, 
    carrier: string
  ): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: `QuantumGameware Shipping <shipping@${process.env.NEXT_PUBLIC_DOMAIN || 'yourdomain.com'}>`,
        to: [order.shipping.email],
        subject: `Your Order #${order.id} Has Shipped!`,
        html: this.generateShippingNotificationEmail(order, trackingNumber, carrier),
        tags: [
          { name: 'category', value: 'shipping_notification' },
          { name: 'order_id', value: order.id },
          { name: 'tracking_number', value: trackingNumber }
        ]
      });

      return !error;
    } catch (error) {
      console.error('Failed to send shipping notification:', error);
      return false;
    }
  }

  /**
   * Test email configuration
   */
  static async testEmailConfiguration(testEmail: string): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: `QuantumGameware Test <test@${process.env.NEXT_PUBLIC_DOMAIN || 'yourdomain.com'}>`,
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
                <li><strong>Domain:</strong> ${process.env.NEXT_PUBLIC_DOMAIN || 'yourdomain.com'}</li>
                <li><strong>Status:</strong> <span style="color: #38a169; font-weight: bold;">Active</span></li>
                <li><strong>Test Date:</strong> ${new Date().toLocaleString()}</li>
              </ul>
            </div>
            <p style="color: #718096;">Your order confirmation emails will be sent successfully.</p>
          </div>
        `,
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

  /**
   * Generate shipping notification email template
   */
  private static generateShippingNotificationEmail(
    order: EmailOrder, 
    trackingNumber: string, 
    carrier: string
  ): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Shipped!</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .tracking-box { background: #f0f9ff; border: 2px solid #0ea5e9; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .tracking-number { font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #0ea5e9; }
        .button { display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📦 Your Order Has Shipped!</h1>
            <p>Order #${order.id} is on its way to you</p>
        </div>
        <div class="content">
            <p>Hi ${order.shipping.firstName},</p>
            <p>Great news! Your order has been shipped and is on its way to you.</p>
            
            <div class="tracking-box">
                <h3>Track Your Package</h3>
                <p><strong>Carrier:</strong> ${carrier}</p>
                <div class="tracking-number">${trackingNumber}</div>
                <a href="https://www.${carrier.toLowerCase()}.com/tracking/${trackingNumber}" class="button">Track Package</a>
            </div>
            
            <p><strong>Shipping Address:</strong><br>
            ${order.shipping.firstName} ${order.shipping.lastName}<br>
            ${order.shipping.address}<br>
            ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}</p>
            
            <p>Thanks for choosing QuantumGameware!</p>
        </div>
    </div>
</body>
</html>
    `;
  }
}