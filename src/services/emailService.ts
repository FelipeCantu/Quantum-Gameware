// File: src/services/emailService.ts
export interface EmailOrder {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    last4: string;
    cardType: string;
    transactionId: string;
  };
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  status: string;
  createdAt: Date;
  estimatedDelivery: Date;
}

export class EmailService {
  private static readonly COMPANY_INFO = {
    name: "Quantum Gameware",
    email: "support@quantumgameware.com",
    phone: "1-800-QUANTUM",
    website: "https://quantumgameware.com",
    address: {
      street: "123 Gaming Street",
      city: "Tech Valley",
      state: "CA",
      zipCode: "94000",
      country: "United States"
    }
  };

  /**
   * Generate HTML email template for order confirmation
   */
  static generateOrderConfirmationEmail(order: EmailOrder): string {
    const formattedDate = order.createdAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedDelivery = order.estimatedDelivery.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - ${order.id}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .order-summary {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 30px;
            border: 1px solid #e2e8f0;
        }
        
        .order-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .detail-item {
            padding: 15px 0;
        }
        
        .detail-label {
            font-weight: 600;
            color: #4a5568;
            font-size: 14px;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .detail-value {
            font-size: 16px;
            color: #2d3748;
            font-weight: 500;
        }
        
        .order-number {
            font-family: 'Courier New', monospace;
            background-color: #edf2f7;
            padding: 8px 12px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
        }
        
        .items-section {
            margin: 30px 0;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .item {
            display: flex;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .item:last-child {
            border-bottom: none;
        }
        
        .item-image {
            width: 80px;
            height: 80px;
            background-color: #f7fafc;
            border-radius: 12px;
            margin-right: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #e2e8f0;
            flex-shrink: 0;
        }
        
        .item-details {
            flex: 1;
        }
        
        .item-name {
            font-weight: 600;
            font-size: 16px;
            color: #2d3748;
            margin-bottom: 5px;
        }
        
        .item-meta {
            color: #718096;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .item-price {
            font-weight: 700;
            font-size: 16px;
            color: #2d3748;
        }
        
        .totals-section {
            background-color: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
        }
        
        .total-row.final {
            border-top: 2px solid #e2e8f0;
            padding-top: 15px;
            margin-top: 15px;
            font-size: 18px;
            font-weight: 700;
        }
        
        .shipping-section {
            background-color: #f0fff4;
            border-left: 4px solid #48bb78;
            padding: 20px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .shipping-title {
            font-weight: 600;
            color: #2f855a;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .shipping-address {
            color: #2d3748;
            line-height: 1.5;
        }
        
        .next-steps {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
        }
        
        .next-steps h3 {
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 15px;
        }
        
        .step-number {
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            margin-right: 12px;
            flex-shrink: 0;
        }
        
        .step-content {
            flex: 1;
        }
        
        .step-title {
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .step-description {
            opacity: 0.9;
            font-size: 14px;
        }
        
        .cta-section {
            text-align: center;
            margin: 30px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 0 10px 10px 0;
            transition: transform 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .cta-button.secondary {
            background: #f7fafc;
            color: #4a5568;
            border: 2px solid #e2e8f0;
        }
        
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-content {
            margin-bottom: 20px;
        }
        
        .contact-info {
            color: #718096;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .contact-info a {
            color: #4299e1;
            text-decoration: none;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 10px;
            color: #718096;
            text-decoration: none;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                box-shadow: none;
            }
            
            .content {
                padding: 20px;
            }
            
            .order-details {
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .item {
                flex-direction: column;
                text-align: center;
            }
            
            .item-image {
                margin: 0 0 15px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                <tr>
                    <td style="vertical-align: middle; padding-right: 12px;">
                        <table cellpadding="0" cellspacing="0" border="0" style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 12px;">
                            <tr>
                                <td style="padding: 6px;">
                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 36px; height: 36px; background: white; border-radius: 6px;">
                                        <tr>
                                            <td style="text-align: center; vertical-align: middle;">
                                                <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 24px; height: 24px; display: block; margin: 0 auto;" />
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="vertical-align: middle;">
                        <div style="color: white; font-size: 24px; font-weight: bold; line-height: 1; margin-bottom: 2px;">
                            Quantum
                        </div>
                        <div style="color: rgba(255, 255, 255, 0.8); font-size: 12px;">
                            Gameware
                        </div>
                    </td>
                </tr>
            </table>
            <h1>🎮 Order Confirmed!</h1>
            <p>Thank you for your purchase, ${order.shipping.firstName}!</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <!-- Order Summary -->
            <div class="order-summary">
                <div class="order-details">
                    <div class="detail-item">
                        <div class="detail-label">Order Number</div>
                        <div class="detail-value">
                            <div class="order-number">${order.id}</div>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Order Date</div>
                        <div class="detail-value">${formattedDate}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Payment Method</div>
                        <div class="detail-value">${order.payment.cardType} ending in ${order.payment.last4}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Estimated Delivery</div>
                        <div class="detail-value">${formattedDelivery}</div>
                    </div>
                </div>
            </div>
            
            <!-- Items Ordered -->
            <div class="items-section">
                <h2 class="section-title">Items Ordered</h2>
                ${order.items.map(item => `
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px;">
                        <tr>
                            <td style="width: 80px; vertical-align: top; padding-right: 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" style="width: 80px; height: 80px; background-color: #f7fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                                    <tr>
                                        <td style="text-align: center; vertical-align: middle;">
                                            ${item.image && item.image !== '' ? 
                                                `<img src="${item.image.includes('://') ? item.image : 'https://quantumgameware.com' + (item.image.startsWith('/') ? item.image : '/' + item.image)}" alt="${item.name}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; display: block;" />` :
                                                `<div style="color: #a0aec0; font-size: 24px;">📦</div>`
                                            }
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td style="vertical-align: top;">
                                <div style="font-weight: 600; font-size: 16px; color: #2d3748; margin-bottom: 5px;">${item.name}</div>
                                <div style="color: #718096; font-size: 14px; margin-bottom: 8px;">Quantity: ${item.quantity}</div>
                                <div style="font-weight: 700; font-size: 16px; color: #2d3748;">${(item.price * item.quantity).toFixed(2)}</div>
                            </td>
                        </tr>
                    </table>
                `).join('')}
            </div>
            
            <!-- Order Totals -->
            <div class="totals-section">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>$${order.totals.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Shipping</span>
                    <span>${order.totals.shipping === 0 ? 'FREE' : `$${order.totals.shipping.toFixed(2)}`}</span>
                </div>
                <div class="total-row">
                    <span>Tax</span>
                    <span>$${order.totals.tax.toFixed(2)}</span>
                </div>
                <div class="total-row final">
                    <span>Total</span>
                    <span>$${order.totals.total.toFixed(2)}</span>
                </div>
            </div>
            
            <!-- Shipping Information -->
            <div class="shipping-section">
                <div class="shipping-title">
                    📦 Shipping Address
                </div>
                <div class="shipping-address">
                    <strong>${order.shipping.firstName} ${order.shipping.lastName}</strong><br>
                    ${order.shipping.address}<br>
                    ${order.shipping.apartment ? `${order.shipping.apartment}<br>` : ''}
                    ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}<br>
                    ${order.shipping.country}
                    ${order.shipping.phone ? `<br>Phone: ${order.shipping.phone}` : ''}
                </div>
            </div>
            
            <!-- What's Next -->
            <div class="next-steps">
                <h3>What happens next?</h3>
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%;">
                                <tr>
                                    <td style="text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 12px;">
                                        1
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="vertical-align: top; padding-bottom: 15px;">
                            <div style="font-weight: 600; margin-bottom: 4px; color: white;">Order Confirmation</div>
                            <div style="opacity: 0.9; font-size: 14px; color: white;">We've received your order and will send you tracking information once it ships.</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%;">
                                <tr>
                                    <td style="text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 12px;">
                                        2
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="vertical-align: top; padding-bottom: 15px;">
                            <div style="font-weight: 600; margin-bottom: 4px; color: white;">Processing (1-2 days)</div>
                            <div style="opacity: 0.9; font-size: 14px; color: white;">We're preparing your gaming gear with care and attention to detail.</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%;">
                                <tr>
                                    <td style="text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 12px;">
                                        3
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="vertical-align: top;">
                            <div style="font-weight: 600; margin-bottom: 4px; color: white;">Shipping & Tracking</div>
                            <div style="opacity: 0.9; font-size: 14px; color: white;">Your order will be shipped with tracking information sent to this email.</div>
                        </td>
                    </tr>
                </table>
            </div>
            
            <!-- Call to Action -->
            <div class="cta-section">
                <a href="${this.COMPANY_INFO.website}/cart/orders" class="cta-button">Track Your Order</a>
                <a href="${this.COMPANY_INFO.website}/products" class="cta-button secondary">Continue Shopping</a>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                    <tr>
                        <td style="vertical-align: middle; padding-right: 8px;">
                            <table cellpadding="0" cellspacing="0" border="0" style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 8px;">
                                <tr>
                                    <td style="padding: 4px;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: white; border-radius: 4px;">
                                            <tr>
                                                <td style="text-align: center; vertical-align: middle;">
                                                    <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 16px; height: 16px; display: block; margin: 0 auto;" />
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="vertical-align: middle;">
                            <div style="color: #4a5568; font-size: 16px; font-weight: bold;">Quantum Gameware</div>
                        </td>
                    </tr>
                </table>
                
                <div class="contact-info">
                    <strong>${this.COMPANY_INFO.name}</strong><br>
                    ${this.COMPANY_INFO.address.street}<br>
                    ${this.COMPANY_INFO.address.city}, ${this.COMPANY_INFO.address.state} ${this.COMPANY_INFO.address.zipCode}<br>
                    <br>
                    Questions? Contact us:<br>
                    Email: <a href="mailto:${this.COMPANY_INFO.email}">${this.COMPANY_INFO.email}</a><br>
                    Phone: <a href="tel:${this.COMPANY_INFO.phone.replace(/\D/g, '')}">${this.COMPANY_INFO.phone}</a>
                </div>
                
                <div class="social-links">
                    <a href="#">Facebook</a>
                    <a href="#">Twitter</a>
                    <a href="#">Instagram</a>
                    <a href="#">Support</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate plain text email for accessibility and backup
   */
  static generatePlainTextEmail(order: EmailOrder): string {
    const formattedDate = order.createdAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedDelivery = order.estimatedDelivery.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
🎮 ORDER CONFIRMATION - Quantum Gameware

Hi ${order.shipping.firstName},

Thank you for your order! Your premium gaming gear is on its way.

ORDER DETAILS
=============
Order Number: ${order.id}
Order Date: ${formattedDate}
Payment Method: ${order.payment.cardType} ending in ${order.payment.last4}
Estimated Delivery: ${formattedDelivery}

ITEMS ORDERED
=============
${order.items.map(item => `
• ${item.name}
  Quantity: ${item.quantity}
  Price: $${(item.price * item.quantity).toFixed(2)}
`).join('')}

ORDER SUMMARY
=============
Subtotal: $${order.totals.subtotal.toFixed(2)}
Shipping: ${order.totals.shipping === 0 ? 'FREE' : `$${order.totals.shipping.toFixed(2)}`}
Tax: $${order.totals.tax.toFixed(2)}
Total: $${order.totals.total.toFixed(2)}

SHIPPING ADDRESS
================
${order.shipping.firstName} ${order.shipping.lastName}
${order.shipping.address}
${order.shipping.apartment ? `${order.shipping.apartment}\n` : ''}${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}
${order.shipping.country}
${order.shipping.phone ? `Phone: ${order.shipping.phone}` : ''}

WHAT'S NEXT?
============
1. Order Confirmation - We've received your order (Complete!)
2. Processing (1-2 days) - We're preparing your premium gaming gear
3. Shipping & Tracking - You'll receive tracking information

NEED HELP?
==========
Track your order: ${this.COMPANY_INFO.website}/cart/orders
Contact us: ${this.COMPANY_INFO.email} or ${this.COMPANY_INFO.phone}

Thanks for choosing Quantum Gameware!

Quantum Gameware
${this.COMPANY_INFO.address.street}
${this.COMPANY_INFO.address.city}, ${this.COMPANY_INFO.address.state} ${this.COMPANY_INFO.address.zipCode}
    `;
  }

  /**
   * Send email via Resend
   */
  private static async sendEmail(
    to: string,
    subject: string,
    html: string,
    text: string
  ): Promise<boolean> {
    try {
      const resendApiKey = process.env.RESEND_API_KEY;

      if (!resendApiKey) {
        console.error('⚠️  RESEND_API_KEY not configured, logging email instead');
        console.log('📧 Email would be sent to:', to);
        console.log('Subject:', subject);
        console.log('HTML length:', html.length);
        return true; // Return true for dev mode
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${this.COMPANY_INFO.name} <${this.COMPANY_INFO.email}>`,
          to: [to],
          subject: subject,
          html: html,
          text: text,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('❌ Resend API error:', error);
        return false;
      }

      const data = await response.json();
      console.log('✅ Email sent successfully via Resend:', data.id);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmationEmail(order: EmailOrder): Promise<boolean> {
    try {
      const htmlContent = this.generateOrderConfirmationEmail(order);
      const textContent = this.generatePlainTextEmail(order);

      return await this.sendEmail(
        order.shipping.email,
        `Your Quantum Gameware Order Confirmation - Order #${order.id}`,
        htmlContent,
        textContent
      );
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  /**
   * Generate email verification email with 6-digit code
   */
  static generateEmailVerificationEmail(userName: string, verificationCode: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Quantum Gameware</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 12px;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 6px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 36px; height: 36px; background: white; border-radius: 6px;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle;">
                                                                <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 24px; height: 24px; display: block; margin: 0 auto;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="color: white; font-size: 24px; font-weight: bold; line-height: 1; margin-bottom: 2px;">
                                            Quantum
                                        </div>
                                        <div style="color: rgba(255, 255, 255, 0.8); font-size: 12px;">
                                            Gameware
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div style="font-size: 48px; margin-bottom: 10px;">✉️</div>
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Verify Your Email</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Welcome to Quantum Gameware!</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="font-size: 16px; color: #2d3748; margin: 0 0 20px 0;">Hi ${userName},</p>
                            <p style="font-size: 16px; color: #2d3748; margin: 0 0 30px 0; line-height: 1.6;">
                                Thanks for signing up! We're excited to have you join the Quantum Gameware community. Please verify your email address by entering the verification code below:
                            </p>
                            <!-- Verification Code Box -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                                        <p style="margin: 0 0 10px 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Your Verification Code
                                        </p>
                                        <div style="font-size: 42px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${verificationCode}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size: 14px; color: #718096; margin: 20px 0; text-align: center; font-weight: 500;">
                                ⏱️ This code will expire in <strong style="color: #4a5568;">30 minutes</strong>
                            </p>

                            <!-- Welcome Section -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700; color: #2d3748;">
                                            🎮 What's next?
                                        </p>
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 12px;">
                                                                1
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="vertical-align: top; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-weight: 600; color: #2d3748; font-size: 14px;">Enter your verification code</p>
                                                    <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.5;">Copy the 6-digit code above and paste it on the verification page</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 12px;">
                                                                2
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <p style="margin: 0 0 4px 0; font-weight: 600; color: #2d3748; font-size: 14px;">Start shopping for gaming gear</p>
                                                    <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.5;">Browse our collection of premium gaming accessories</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Notice -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                                            <strong>ℹ️ Didn't sign up?</strong> If you didn't create an account with Quantum Gameware, you can safely ignore this email. No account will be created without verification.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Support CTA -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto 0 auto;">
                                <tr>
                                    <td style="background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px 30px; text-align: center;">
                                        <a href="mailto:${this.COMPANY_INFO.email}" style="color: #4a5568; text-decoration: none; font-weight: 600; font-size: 14px;">
                                            Need Help? Contact Support →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 8px;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 4px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: white; border-radius: 4px;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle;">
                                                                <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 16px; height: 16px; display: block; margin: 0 auto;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="color: #4a5568; font-size: 16px; font-weight: bold;">Quantum Gameware</div>
                                    </td>
                                </tr>
                            </table>
                            <div style="color: #718096; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                                <strong>${this.COMPANY_INFO.name}</strong><br>
                                ${this.COMPANY_INFO.address.street}<br>
                                ${this.COMPANY_INFO.address.city}, ${this.COMPANY_INFO.address.state} ${this.COMPANY_INFO.address.zipCode}
                            </div>
                            <p style="margin: 0; color: #718096; font-size: 12px;">
                                Questions? Email us at <a href="mailto:${this.COMPANY_INFO.email}" style="color: #4299e1; text-decoration: none;">${this.COMPANY_INFO.email}</a><br>
                                or call <a href="tel:${this.COMPANY_INFO.phone.replace(/\D/g, '')}" style="color: #4299e1; text-decoration: none;">${this.COMPANY_INFO.phone}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }

  /**
   * Generate password change confirmation email
   */
  static generatePasswordChangeEmail(userName: string, userEmail: string): string {
    const formattedDate = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed Successfully</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 12px;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 6px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 36px; height: 36px; background: white; border-radius: 6px;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle;">
                                                                <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 24px; height: 24px; display: block; margin: 0 auto;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="color: white; font-size: 24px; font-weight: bold; line-height: 1; margin-bottom: 2px;">
                                            Quantum
                                        </div>
                                        <div style="color: rgba(255, 255, 255, 0.8); font-size: 12px;">
                                            Gameware
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div style="width: 64px; height: 64px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                                <div style="font-size: 36px;">✓</div>
                            </div>
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Password Changed</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Your account is now more secure</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="font-size: 16px; color: #2d3748; margin: 0 0 20px 0;">Hi ${userName},</p>
                            <p style="font-size: 16px; color: #2d3748; margin: 0 0 30px 0; line-height: 1.6;">
                                This is a confirmation that your password for your Quantum Gameware account (<strong>${userEmail}</strong>) has been successfully changed.
                            </p>

                            <!-- Change Details -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #f0fff4; border-left: 4px solid #48bb78; border-radius: 0 8px 8px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding-bottom: 10px;">
                                                    <p style="margin: 0; color: #2f855a; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Security Update Details
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #c6f6d5;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="color: #2f855a; font-size: 14px; font-weight: 600;">Account:</td>
                                                            <td align="right" style="color: #276749; font-size: 14px;">${userEmail}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                        <tr>
                                                            <td style="color: #2f855a; font-size: 14px; font-weight: 600;">Changed On:</td>
                                                            <td align="right" style="color: #276749; font-size: 14px;">${formattedDate}</td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Tips Section -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700; color: #2d3748;">
                                            🔒 Keep Your Account Secure
                                        </p>
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                                                        • Use a unique password that you don't use elsewhere
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                                                        • Never share your password with anyone
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0;">
                                                    <p style="margin: 0; color: #4a5568; font-size: 14px; line-height: 1.6;">
                                                        • Update your password regularly for added security
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Warning -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 10px 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                                            ⚠️ Didn't make this change?
                                        </p>
                                        <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                                            If you did not change your password, please contact our support team immediately to secure your account.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Support CTA -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto 0 auto;">
                                <tr>
                                    <td style="padding-right: 10px;">
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 15px 30px;">
                                                    <a href="mailto:${this.COMPANY_INFO.email}" style="color: white; text-decoration: none; font-weight: 600; font-size: 14px; display: block;">
                                                        Contact Support
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td>
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px 30px;">
                                                    <a href="${this.COMPANY_INFO.website}/account" style="color: #4a5568; text-decoration: none; font-weight: 600; font-size: 14px; display: block;">
                                                        View Account
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 8px;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 4px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: white; border-radius: 4px;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle;">
                                                                <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 16px; height: 16px; display: block; margin: 0 auto;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="color: #4a5568; font-size: 16px; font-weight: bold;">Quantum Gameware</div>
                                    </td>
                                </tr>
                            </table>
                            <div style="color: #718096; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                                <strong>${this.COMPANY_INFO.name}</strong><br>
                                ${this.COMPANY_INFO.address.street}<br>
                                ${this.COMPANY_INFO.address.city}, ${this.COMPANY_INFO.address.state} ${this.COMPANY_INFO.address.zipCode}
                            </div>
                            <p style="margin: 0; color: #718096; font-size: 12px;">
                                Questions? Email us at <a href="mailto:${this.COMPANY_INFO.email}" style="color: #4299e1; text-decoration: none;">${this.COMPANY_INFO.email}</a><br>
                                or call <a href="tel:${this.COMPANY_INFO.phone.replace(/\D/g, '')}" style="color: #4299e1; text-decoration: none;">${this.COMPANY_INFO.phone}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }

  /**
   * Generate email change verification email with 6-digit code
   */
  static generateEmailChangeVerificationEmail(
    userName: string,
    newEmail: string,
    verificationCode: string
  ): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your New Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 12px;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 6px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 36px; height: 36px; background: white; border-radius: 6px;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle;">
                                                                <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 24px; height: 24px; display: block; margin: 0 auto;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="color: white; font-size: 24px; font-weight: bold; line-height: 1; margin-bottom: 2px;">
                                            Quantum
                                        </div>
                                        <div style="color: rgba(255, 255, 255, 0.8); font-size: 12px;">
                                            Gameware
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div style="font-size: 48px; margin-bottom: 10px;">📧</div>
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Verify New Email</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Confirm your email change</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="font-size: 16px; color: #2d3748; margin: 0 0 20px 0;">Hi ${userName},</p>
                            <p style="font-size: 16px; color: #2d3748; margin: 0 0 30px 0; line-height: 1.6;">
                                You requested to change your email address to <strong>${newEmail}</strong>. Please verify this new email address by entering the verification code below:
                            </p>
                            <!-- Verification Code Box -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                                        <p style="margin: 0 0 10px 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Your Verification Code
                                        </p>
                                        <div style="font-size: 42px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${verificationCode}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size: 14px; color: #718096; margin: 20px 0; text-align: center; font-weight: 500;">
                                ⏱️ This code will expire in <strong style="color: #4a5568;">30 minutes</strong>
                            </p>

                            <!-- New Email Info -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                                            📬 New Email Address
                                        </p>
                                        <p style="margin: 0; color: #1e3a8a; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">
                                            ${newEmail}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- What's Next Section -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700; color: #2d3748;">
                                            What happens next?
                                        </p>
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 12px;">
                                                                1
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="vertical-align: top; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-weight: 600; color: #2d3748; font-size: 14px;">Enter the verification code</p>
                                                    <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.5;">Copy the 6-digit code above and enter it on the verification page</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 12px;">
                                                                2
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <p style="margin: 0 0 4px 0; font-weight: 600; color: #2d3748; font-size: 14px;">Your email will be updated</p>
                                                    <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.5;">You'll use this new email to sign in to your account</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Warning -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #fff7ed; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">
                                            ⚠️ Security Notice
                                        </p>
                                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                            If you did not request this email change, please ignore this email and contact our support team immediately to secure your account.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Support CTA -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto 0 auto;">
                                <tr>
                                    <td style="background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px 30px; text-align: center;">
                                        <a href="mailto:${this.COMPANY_INFO.email}" style="color: #4a5568; text-decoration: none; font-weight: 600; font-size: 14px;">
                                            Need Help? Contact Support →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 8px;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 4px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: white; border-radius: 4px;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle;">
                                                                <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 16px; height: 16px; display: block; margin: 0 auto;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="color: #4a5568; font-size: 16px; font-weight: bold;">Quantum Gameware</div>
                                    </td>
                                </tr>
                            </table>
                            <div style="color: #718096; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                                <strong>${this.COMPANY_INFO.name}</strong><br>
                                ${this.COMPANY_INFO.address.street}<br>
                                ${this.COMPANY_INFO.address.city}, ${this.COMPANY_INFO.address.state} ${this.COMPANY_INFO.address.zipCode}
                            </div>
                            <p style="margin: 0; color: #718096; font-size: 12px;">
                                Questions? Email us at <a href="mailto:${this.COMPANY_INFO.email}" style="color: #4299e1; text-decoration: none;">${this.COMPANY_INFO.email}</a><br>
                                or call <a href="tel:${this.COMPANY_INFO.phone.replace(/\D/g, '')}" style="color: #4299e1; text-decoration: none;">${this.COMPANY_INFO.phone}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }

  /**
   * Send email verification code
   */
  static async sendEmailVerificationCode(
    userEmail: string,
    userName: string,
    verificationCode: string
  ): Promise<boolean> {
    try {
      const htmlContent = this.generateEmailVerificationEmail(userName, verificationCode);
      const textContent = `Hi ${userName},\n\nThanks for signing up! Please verify your email address by entering this code:\n\n${verificationCode}\n\nThis code will expire in 30 minutes.\n\nIf you didn't create an account with Quantum Gameware, you can safely ignore this email.\n\nBest regards,\nQuantum Gameware Team`;

      return await this.sendEmail(
        userEmail,
        'Verify Your Email - Quantum Gameware',
        htmlContent,
        textContent
      );
    } catch (error) {
      console.error('Failed to send email verification:', error);
      return false;
    }
  }

  /**
   * Send password change confirmation
   */
  static async sendPasswordChangeConfirmation(
    userEmail: string,
    userName: string
  ): Promise<boolean> {
    try {
      const htmlContent = this.generatePasswordChangeEmail(userName, userEmail);
      const textContent = `Hi ${userName},\n\nThis is a confirmation that your password for your Quantum Gameware account (${userEmail}) has been successfully changed.\n\nChanged on: ${new Date().toLocaleString()}\n\nIf you did not make this change, please contact our support team immediately at ${this.COMPANY_INFO.email}.\n\nBest regards,\nQuantum Gameware Team`;

      return await this.sendEmail(
        userEmail,
        'Password Changed - Quantum Gameware',
        htmlContent,
        textContent
      );
    } catch (error) {
      console.error('Failed to send password change confirmation:', error);
      return false;
    }
  }

  /**
   * Send email change verification code
   */
  static async sendEmailChangeVerificationCode(
    newEmail: string,
    userName: string,
    verificationCode: string
  ): Promise<boolean> {
    try {
      const htmlContent = this.generateEmailChangeVerificationEmail(userName, newEmail, verificationCode);
      const textContent = `Hi ${userName},\n\nYou requested to change your email address to ${newEmail}. Please verify this new email address by entering this code:\n\n${verificationCode}\n\nThis code will expire in 30 minutes.\n\nIf you did not request this email change, please ignore this email and contact our support team immediately.\n\nBest regards,\nQuantum Gameware Team`;

      return await this.sendEmail(
        newEmail,
        'Verify Your New Email - Quantum Gameware',
        htmlContent,
        textContent
      );
    } catch (error) {
      console.error('Failed to send email change verification:', error);
      return false;
    }
  }

  /**
   * Generate password reset email with 6-digit code
   */
  static generatePasswordResetEmail(userName: string, resetCode: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 40px 0;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 12px;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 48px; height: 48px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 12px;">
                                            <tr>
                                                <td style="padding: 6px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 36px; height: 36px; background: white; border-radius: 6px;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle;">
                                                                <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 24px; height: 24px; display: block; margin: 0 auto;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="color: white; font-size: 24px; font-weight: bold; line-height: 1; margin-bottom: 2px;">
                                            Quantum
                                        </div>
                                        <div style="color: rgba(255, 255, 255, 0.8); font-size: 12px;">
                                            Gameware
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Reset Your Password</h1>
                            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Secure password reset request</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="font-size: 16px; color: #2d3748; margin: 0 0 20px 0;">Hi ${userName},</p>
                            <p style="font-size: 16px; color: #2d3748; margin: 0 0 30px 0; line-height: 1.6;">
                                We received a request to reset your password. Enter the verification code below to create a new password for your account:
                            </p>
                            <!-- Reset Code Box -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                                        <p style="margin: 0 0 10px 0; color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Your Verification Code
                                        </p>
                                        <div style="font-size: 42px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${resetCode}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size: 14px; color: #718096; margin: 20px 0; text-align: center; font-weight: 500;">
                                ⏱️ This code will expire in <strong style="color: #4a5568;">15 minutes</strong>
                            </p>

                            <!-- What's Next Section -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700; color: #2d3748;">
                                            What happens next?
                                        </p>
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 12px;">
                                                                1
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="vertical-align: top; padding-bottom: 15px;">
                                                    <p style="margin: 0 0 4px 0; font-weight: 600; color: #2d3748; font-size: 14px;">Enter the verification code</p>
                                                    <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.5;">Copy the 6-digit code above and paste it on the password reset page</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="width: 36px; vertical-align: top; padding-right: 12px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle; color: white; font-weight: bold; font-size: 12px;">
                                                                2
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <p style="margin: 0 0 4px 0; font-weight: 600; color: #2d3748; font-size: 14px;">Create your new password</p>
                                                    <p style="margin: 0; color: #718096; font-size: 14px; line-height: 1.5;">Choose a strong, unique password to secure your account</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Security Warning -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 0 8px 8px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                                            <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email and ensure your account is secure. Consider changing your password if you suspect unauthorized access attempts.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Support CTA -->
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto 0 auto;">
                                <tr>
                                    <td style="background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px 30px; text-align: center;">
                                        <a href="mailto:${this.COMPANY_INFO.email}" style="color: #4a5568; text-decoration: none; font-weight: 600; font-size: 14px;">
                                            Need Help? Contact Support →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto;">
                                <tr>
                                    <td style="vertical-align: middle; padding-right: 8px;">
                                        <table cellpadding="0" cellspacing="0" border="0" style="width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%); border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 4px;">
                                                    <table cellpadding="0" cellspacing="0" border="0" style="width: 24px; height: 24px; background: white; border-radius: 4px;">
                                                        <tr>
                                                            <td style="text-align: center; vertical-align: middle;">
                                                                <img src="https://quantumgameware.com/nextgens-logo.png" alt="QG" style="width: 16px; height: 16px; display: block; margin: 0 auto;" />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="color: #4a5568; font-size: 16px; font-weight: bold;">Quantum Gameware</div>
                                    </td>
                                </tr>
                            </table>
                            <div style="color: #718096; font-size: 14px; line-height: 1.6; margin-bottom: 15px;">
                                <strong>${this.COMPANY_INFO.name}</strong><br>
                                ${this.COMPANY_INFO.address.street}<br>
                                ${this.COMPANY_INFO.address.city}, ${this.COMPANY_INFO.address.state} ${this.COMPANY_INFO.address.zipCode}
                            </div>
                            <p style="margin: 0; color: #718096; font-size: 12px;">
                                Questions? Email us at <a href="mailto:${this.COMPANY_INFO.email}" style="color: #4299e1; text-decoration: none;">${this.COMPANY_INFO.email}</a><br>
                                or call <a href="tel:${this.COMPANY_INFO.phone.replace(/\D/g, '')}" style="color: #4299e1; text-decoration: none;">${this.COMPANY_INFO.phone}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
  }

  /**
   * Send password reset code
   */
  static async sendPasswordResetCode(
    userEmail: string,
    userName: string,
    resetCode: string
  ): Promise<boolean> {
    try {
      const htmlContent = this.generatePasswordResetEmail(userName, resetCode);
      const textContent = `Hi ${userName},\n\nWe received a request to reset your password. Enter this code to create a new password:\n\n${resetCode}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request a password reset, please ignore this email and ensure your account is secure.\n\nBest regards,\nQuantum Gameware Team`;

      return await this.sendEmail(
        userEmail,
        'Reset Your Password - Quantum Gameware',
        htmlContent,
        textContent
      );
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  /**
   * Integration example for popular email services
   */
  static getIntegrationExamples() {
    return {
      sendgrid: `
// SendGrid integration example
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: order.shipping.email,
  from: '${this.COMPANY_INFO.email}',
  subject: 'Your GameGear Order Confirmation - Order #' + order.id,
  text: EmailService.generatePlainTextEmail(order),
  html: EmailService.generateOrderConfirmationEmail(order),
};

await sgMail.send(msg);
      `,
      
      nodemailer: `
// Nodemailer integration example
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: '${this.COMPANY_INFO.email}',
  to: order.shipping.email,
  subject: 'Your GameGear Order Confirmation - Order #' + order.id,
  text: EmailService.generatePlainTextEmail(order),
  html: EmailService.generateOrderConfirmationEmail(order),
};

await transporter.sendMail(mailOptions);
      `,
      
      resend: `
// Resend integration example
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: '${this.COMPANY_INFO.email}',
  to: order.shipping.email,
  subject: 'Your GameGear Order Confirmation - Order #' + order.id,
  text: EmailService.generatePlainTextEmail(order),
  html: EmailService.generateOrderConfirmationEmail(order),
});
      `
    };
  }
}