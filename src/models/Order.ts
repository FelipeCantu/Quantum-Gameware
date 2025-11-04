// src/models/Order.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface OrderItem {
  productId: string;
  productSlug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface ShippingInfo {
  address: ShippingAddress;
  method: string;
  cost: number;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: Date;
}

export interface PaymentInfo {
  method: string; // 'credit_card', 'paypal', 'stripe', etc.
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: Date;
}

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  shipping: ShippingInfo;
  payment: PaymentInfo;
  notes?: string;
  rewardPointsEarned?: number;
  rewardPointsUsed?: number;
  statusHistory: Array<{
    status: string;
    date: Date;
    note?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>({
  productId: { type: String, required: true },
  productSlug: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  variant: { type: String }
});

const shippingAddressSchema = new Schema<ShippingAddress>({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String }
});

const shippingInfoSchema = new Schema<ShippingInfo>({
  address: { type: shippingAddressSchema, required: true },
  method: { type: String, required: true },
  cost: { type: Number, required: true, default: 0 },
  trackingNumber: { type: String },
  carrier: { type: String },
  estimatedDelivery: { type: Date }
});

const paymentInfoSchema = new Schema<PaymentInfo>({
  method: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: { type: String },
  paidAt: { type: Date }
});

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    orderNumber: {
      type: String,
      unique: true,
      index: true
      // Note: Not required here because it's auto-generated in pre-save hook
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function(items: OrderItem[]) {
          return items && items.length > 0;
        },
        message: 'Order must have at least one item'
      }
    },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, default: 0, min: 0 },
    tax: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
      index: true
    },
    shipping: { type: shippingInfoSchema, required: true },
    payment: { type: paymentInfoSchema, required: true },
    notes: { type: String },
    rewardPointsEarned: { type: Number, default: 0, min: 0 },
    rewardPointsUsed: { type: Number, default: 0, min: 0 },
    statusHistory: [{
      status: { type: String, required: true },
      date: { type: Date, required: true, default: Date.now },
      note: { type: String }
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for efficient querying
orderSchema.index({ userId: 1, createdAt: -1 });
// Note: orderNumber index is already defined in the schema with "index: true"
orderSchema.index({ 'payment.status': 1 });

// Pre-save middleware to generate order number if not exists
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    this.orderNumber = `ORD-${year}${month}-${String(count + 1).padStart(5, '0')}`;
  }

  // Add initial status to history if new order
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      note: 'Order created'
    });
  }

  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus: IOrder['status'], note?: string) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    date: new Date(),
    note: note || `Order status changed to ${newStatus}`
  });
  return this.save();
};

// Static method to get user's order stats
orderSchema.statics.getUserStats = async function(userId: mongoose.Types.ObjectId) {
  const orders = await this.find({ userId, status: { $nin: ['cancelled', 'refunded'] } });

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const totalRewardPoints = orders.reduce((sum, order) => sum + (order.rewardPointsEarned || 0), 0);

  return {
    totalOrders,
    totalSpent,
    totalRewardPoints
  };
};

// Prevent model overwrite during hot reload in development
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
