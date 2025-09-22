// File: src/services/orderService.ts
// Simple order service for localStorage management

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    apartment: string;
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
  private static readonly STORAGE_KEY = 'userOrders';

  static getOrders(): Order[] {
    try {
      const ordersJson = localStorage.getItem(this.STORAGE_KEY);
      if (!ordersJson) return [];
      
      const orders = JSON.parse(ordersJson);
      
      // Convert date strings back to Date objects
      return orders.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        estimatedDelivery: new Date(order.estimatedDelivery)
      }));
    } catch (error) {
      console.error('Failed to load orders:', error);
      return [];
    }
  }

  static getOrderById(orderId: string): Order | null {
    const orders = this.getOrders();
    return orders.find(order => order.id === orderId) || null;
  }

  static saveOrder(order: Order): void {
    try {
      const existingOrders = this.getOrders();
      const updatedOrders = [order, ...existingOrders];
      
      // Keep only the last 50 orders to prevent localStorage overflow
      const ordersToSave = updatedOrders.slice(0, 50);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ordersToSave));
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  }

  static updateOrderStatus(orderId: string, status: Order['status']): boolean {
    try {
      const orders = this.getOrders();
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) return false;
      
      orders[orderIndex].status = status;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
      
      return true;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  }

  static clearOrders(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear orders:', error);
    }
  }
}