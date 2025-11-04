// File: src/services/returnService.ts
// Return request service for managing product returns

export interface ReturnItem {
  orderItemId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  returnQuantity: number; // How many units to return (in case of partial returns)
}

export type ReturnReason =
  | 'defective'
  | 'wrong_item'
  | 'not_as_described'
  | 'changed_mind'
  | 'damaged_in_shipping'
  | 'wrong_size'
  | 'other';

export type ReturnStatus =
  | 'requested'      // Customer submitted request
  | 'approved'       // Return approved, waiting for item
  | 'rejected'       // Return rejected
  | 'received'       // Item received at warehouse
  | 'inspecting'     // Under inspection
  | 'completed'      // Refund processed
  | 'cancelled';     // Return cancelled

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  userId?: string;
  items: ReturnItem[];
  reason: ReturnReason;
  reasonDetails: string;
  status: ReturnStatus;
  refundAmount: number;
  refundMethod: 'original_payment' | 'store_credit';
  trackingNumber?: string;
  images?: string[]; // For damaged/defective items
  createdAt: Date;
  updatedAt: Date;
  statusHistory: {
    status: ReturnStatus;
    timestamp: Date;
    note?: string;
  }[];
}

export class ReturnService {
  private static readonly STORAGE_KEY = 'userReturns';

  static getReturns(): ReturnRequest[] {
    try {
      const returnsJson = localStorage.getItem(this.STORAGE_KEY);
      if (!returnsJson) return [];

      const returns = JSON.parse(returnsJson);

      // Convert date strings back to Date objects
      return returns.map((returnReq: any) => ({
        ...returnReq,
        createdAt: new Date(returnReq.createdAt),
        updatedAt: new Date(returnReq.updatedAt),
        statusHistory: returnReq.statusHistory.map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Failed to load returns:', error);
      return [];
    }
  }

  static getReturnById(returnId: string): ReturnRequest | null {
    const returns = this.getReturns();
    return returns.find(ret => ret.id === returnId) || null;
  }

  static getReturnsByOrderId(orderId: string): ReturnRequest[] {
    const returns = this.getReturns();
    return returns.filter(ret => ret.orderId === orderId);
  }

  static createReturn(returnData: Omit<ReturnRequest, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>): ReturnRequest {
    const newReturn: ReturnRequest = {
      ...returnData,
      id: `RET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'requested',
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [{
        status: 'requested',
        timestamp: new Date(),
        note: 'Return request submitted'
      }]
    };

    this.saveReturn(newReturn);
    return newReturn;
  }

  static saveReturn(returnReq: ReturnRequest): void {
    try {
      const existingReturns = this.getReturns();
      const updatedReturns = [returnReq, ...existingReturns];

      // Keep only the last 100 returns
      const returnsToSave = updatedReturns.slice(0, 100);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(returnsToSave));
    } catch (error) {
      console.error('Failed to save return:', error);
    }
  }

  static updateReturnStatus(
    returnId: string,
    status: ReturnStatus,
    note?: string
  ): boolean {
    try {
      const returns = this.getReturns();
      const returnIndex = returns.findIndex(ret => ret.id === returnId);

      if (returnIndex === -1) return false;

      returns[returnIndex].status = status;
      returns[returnIndex].updatedAt = new Date();
      returns[returnIndex].statusHistory.push({
        status,
        timestamp: new Date(),
        note
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(returns));

      return true;
    } catch (error) {
      console.error('Failed to update return status:', error);
      return false;
    }
  }

  static canReturnOrder(orderDate: Date): boolean {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 30 day return window
    return diffDays <= 30;
  }

  static getReturnReasonLabel(reason: ReturnReason): string {
    const labels: Record<ReturnReason, string> = {
      'defective': 'Defective/Not Working',
      'wrong_item': 'Wrong Item Received',
      'not_as_described': 'Not as Described',
      'changed_mind': 'Changed Mind',
      'damaged_in_shipping': 'Damaged in Shipping',
      'wrong_size': 'Wrong Size/Fit',
      'other': 'Other'
    };
    return labels[reason];
  }

  static getStatusLabel(status: ReturnStatus): string {
    const labels: Record<ReturnStatus, string> = {
      'requested': 'Return Requested',
      'approved': 'Return Approved',
      'rejected': 'Return Rejected',
      'received': 'Item Received',
      'inspecting': 'Under Inspection',
      'completed': 'Refund Processed',
      'cancelled': 'Cancelled'
    };
    return labels[status];
  }

  static getStatusColor(status: ReturnStatus): string {
    const colors: Record<ReturnStatus, string> = {
      'requested': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'approved': 'bg-green-500/20 text-green-300 border-green-400/30',
      'rejected': 'bg-red-500/20 text-red-300 border-red-400/30',
      'received': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'inspecting': 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
      'completed': 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      'cancelled': 'bg-gray-500/20 text-gray-300 border-gray-400/30'
    };
    return colors[status];
  }

  static clearReturns(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear returns:', error);
    }
  }
}
