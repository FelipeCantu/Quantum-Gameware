// File: src/services/paymentService.ts (NEW FILE)
// src/services/paymentService.ts

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  amount: number;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Simulate payment processing
export class PaymentService {
  static async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Basic validation
    if (!this.validateCardNumber(paymentData.cardNumber)) {
      return { success: false, error: 'Invalid card number' };
    }

    if (!this.validateExpiryDate(paymentData.expiryDate)) {
      return { success: false, error: 'Invalid expiry date' };
    }

    if (!this.validateCVV(paymentData.cvv)) {
      return { success: false, error: 'Invalid CVV' };
    }

    // Simulate random payment failures (5% chance)
    if (Math.random() < 0.05) {
      return { success: false, error: 'Payment declined by bank' };
    }

    // Success case
    const transactionId = this.generateTransactionId();
    return { 
      success: true, 
      transactionId 
    };
  }

  private static validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    // Check if it's all digits and has valid length
    if (!/^\d{13,19}$/.test(cleaned)) {
      return false;
    }

    // Luhn algorithm check
    return this.luhnCheck(cleaned);
  }

  private static luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    // Loop through values starting from the rightmost
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  private static validateExpiryDate(expiryDate: string): boolean {
    const [month, year] = expiryDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expMonth < 1 || expMonth > 12) {
      return false;
    }

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }

    return true;
  }

  private static validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  private static generateTransactionId(): string {
    return 'TXN-' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
  }

  // Card type detection
  static getCardType(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6/.test(cleaned)) return 'Discover';
    
    return 'Unknown';
  }

  // Format card number for display
  static formatCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
  }

  // Mask card number for security
  static maskCardNumber(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.length < 4) return cleaned;
    
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    return this.formatCardNumber(masked + lastFour);
  }
}

// Order management
export interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
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
  status: 'processing' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
  estimatedDelivery: Date;
}

export class OrderService {
  static createOrder(orderData: Partial<Order>): Order {
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
    const createdAt = new Date();
    const estimatedDelivery = new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

    return {
      id: orderId,
      items: orderData.items || [],
      shipping: orderData.shipping || {} as any,
      payment: orderData.payment || {} as any,
      totals: orderData.totals || {} as any,
      status: 'processing',
      createdAt,
      estimatedDelivery,
      ...orderData
    };
  }

  static saveOrder(order: Order): void {
    try {
      const existingOrders = this.getOrders();
      existingOrders.push(order);
      localStorage.setItem('gamegear-orders', JSON.stringify(existingOrders));
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  }

  static getOrders(): Order[] {
    try {
      const orders = localStorage.getItem('gamegear-orders');
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error('Failed to retrieve orders:', error);
      return [];
    }
  }

  static getOrder(orderId: string): Order | null {
    const orders = this.getOrders();
    return orders.find(order => order.id === orderId) || null;
  }
}