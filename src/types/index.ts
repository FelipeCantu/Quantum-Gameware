// File: src/types/index.ts (ADD TO YOUR EXISTING TYPES OR CREATE NEW)

export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  brand: string;
  category: string;
  slug: string;
  description: string;
  features?: string[];
  compatibility?: string[];
  inStock: boolean;
  isNew?: boolean;
  rating?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingAddress {
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
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  billingAddress?: ShippingAddress;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingAddress;
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
  status: 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDelivery: Date;
}