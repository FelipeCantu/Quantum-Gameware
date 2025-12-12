// File: src/types/index.ts (ADD TO YOUR EXISTING TYPES OR CREATE NEW)

export interface CategoryAttributes {
  // Gaming Keyboards
  switchType?: string[];
  keyboardSize?: string;
  hotSwappable?: boolean;

  // Gaming Mice
  dpiRange?: number;
  weight?: number;
  sensorType?: string;
  handOrientation?: string;

  // Gaming Headsets
  driverSize?: number;
  surroundSound?: string[];
  noiseCancellation?: string;
  micType?: string[];

  // Gaming Monitors
  screenSize?: number;
  refreshRate?: number;
  resolution?: string[];
  panelType?: string[];
  responseTime?: string;
  curved?: boolean;
  hdr?: string[];

  // Gaming Controllers
  customizable?: boolean;
  controllerType?: string[];
  backButtons?: boolean;

  // Gaming Chairs
  material?: string[];
  maxWeight?: number;
  lumbarSupport?: string;
  armrestType?: string[];
  reclineAngle?: string;

  // Mouse Pads
  size?: string[];
  surfaceType?: string[];
  thickness?: number;
  stitchedEdges?: boolean;

  // Gaming Microphones
  polarPattern?: string[];
  sampleRate?: string[];
  mountType?: string[];

  // Gaming Speakers
  configuration?: string[];
  powerOutput?: number;
  features?: string[];

  // Common attributes
  connection?: string[];
  rgbLighting?: boolean;

  // Gaming Accessories
  accessoryType?: string[];
}

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
  categoryAttributes?: CategoryAttributes;
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