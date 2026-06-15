// orders.js — Order Management System for Vender
// Handles: Order creation, commission calculation, status tracking, payments

// ── COMMISSION CONFIG ──
const COMMISSION_RATE = 0.06; // 6% commission from vendor
const VENDER_FEE_DISPLAY = 'Vender marketplace fee'; // What we show to buyers

// ── ORDER STATUS ENUM ──
const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  ESCROW_HELD: 'escrow_held',
  VENDOR_CONFIRMED: 'vendor_confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  DISPUTED: 'disputed',
  REFUNDED: 'refunded',
  COMPLETED: 'completed'
};

// ── ORDER OBJECT MODEL ──
class Order {
  constructor(data) {
    this.id = this.generateOrderId();
    this.createdAt = new Date().toISOString();
    
    // Item info
    this.itemName = data.itemName;
    this.itemPrice = data.itemPrice;
    this.itemImg = data.itemImg;
    this.vendor = data.vendor;
    this.vendorId = data.vendorId;
    
    // Buyer info
    this.buyerId = data.buyerId || 'guest';
    this.buyerName = data.buyerName || 'Anonymous';
    this.buyerPhone = data.buyerPhone || '';
    
    // Delivery info
    this.deliveryAddress = data.deliveryAddress;
    this.deliveryState = data.deliveryState;
    this.deliveryZone = data.deliveryZone;
    this.deliveryNeighbourhood = data.deliveryNeighbourhood;
    
    // Financial
    this.status = ORDER_STATUS.PENDING_PAYMENT;
    this.commission = this.calculateCommission();
    this.vendorReceives = this.itemPrice - this.commission;
    this.paymentMethod = data.paymentMethod || 'bank_transfer';
    
    // Timeline
    this.statusHistory = [{
      status: ORDER_STATUS.PENDING_PAYMENT,
      timestamp: this.createdAt,
      note: 'Order created, awaiting payment'
    }];
  }

  generateOrderId() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  calculateCommission() {
    return Math.round(this.itemPrice * COMMISSION_RATE);
  }

  updateStatus(newStatus, note = '') {
    if (Object.values(ORDER_STATUS).includes(newStatus)) {
      this.status = newStatus;
      this.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note
      });
    }
  }

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      itemName: this.itemName,
      itemPrice: this.itemPrice,
      itemImg: this.itemImg,
      vendor: this.vendor,
      vendorId: this.vendorId,
      buyerId: this.buyerId,
      buyerName: this.buyerName,
      buyerPhone: this.buyerPhone,
      deliveryAddress: this.deliveryAddress,
      deliveryState: this.deliveryState,
      deliveryZone: this.deliveryZone,
      deliveryNeighbourhood: this.deliveryNeighbourhood,
      status: this.status,
      commission: this.commission,
      vendorReceives: this.vendorReceives,
      paymentMethod: this.paymentMethod,
      statusHistory: this.statusHistory
    };
  }
}

// ── ORDER MANAGER ──
class OrderManager {
  constructor() {
    this.orders = this.loadOrders();
  }

  loadOrders() {
    const stored = localStorage.getItem('vender_orders');
    return stored ? JSON.parse(stored) : [];
  }

  saveOrders() {
    localStorage.setItem('vender_orders', JSON.stringify(this.orders));
  }

  createOrder(data) {
    const order = new Order(data);
    this.orders.push(order.toJSON());
    this.saveOrders();
    return order.id;
  }

  getOrder(orderId) {
    return this.orders.find(o => o.id === orderId);
  }

  getOrdersByBuyer(buyerId) {
    return this.orders.filter(o => o.buyerId === buyerId);
  }

  getOrdersByVendor(vendorId) {
    return this.orders.filter(o => o.vendorId === vendorId);
  }

  updateOrderStatus(orderId, newStatus, note = '') {
    const order = this.getOrder(orderId);
    if (order) {
      order.status = newStatus;
      order.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note
      });
      this.saveOrders();
      return true;
    }
    return false;
  }

  confirmPayment(orderId) {
    return this.updateOrderStatus(
      orderId,
      ORDER_STATUS.ESCROW_HELD,
      'Payment received - money held securely by Vender'
    );
  }

  vendorConfirmsOrder(orderId) {
    return this.updateOrderStatus(
      orderId,
      ORDER_STATUS.VENDOR_CONFIRMED,
      'Vendor confirmed - preparing to ship'
    );
  }

  markAsShipped(orderId, trackingNumber = '') {
    const note = trackingNumber 
      ? `Item shipped - Tracking: ${trackingNumber}`
      : 'Item shipped';
    return this.updateOrderStatus(orderId, ORDER_STATUS.SHIPPED, note);
  }

  confirmDelivery(orderId) {
    const order = this.getOrder(orderId);
    if (order) {
      // Update to delivered
      this.updateOrderStatus(
        orderId,
        ORDER_STATUS.DELIVERED,
        'Delivery confirmed by buyer'
      );
      // Then complete and release payment
      this.updateOrderStatus(
        orderId,
        ORDER_STATUS.COMPLETED,
        `Vendor receives ₦${order.vendorReceives.toLocaleString()} - Payment released`
      );
      return true;
    }
    return false;
  }

  disputeDelivery(orderId, reason = '') {
    const order = this.getOrder(orderId);
    if (order) {
      this.updateOrderStatus(orderId, ORDER_STATUS.DISPUTED, `Dispute: ${reason}`);
      // Immediately refund
      this.updateOrderStatus(
        orderId,
        ORDER_STATUS.REFUNDED,
        `Full refund processed - ₦${order.itemPrice.toLocaleString()} returned to buyer`
      );
      return true;
    }
    return false;
  }

  getVendorStats(vendorId) {
    const vendorOrders = this.getOrdersByVendor(vendorId);
    const completed = vendorOrders.filter(o => o.status === ORDER_STATUS.COMPLETED);
    const pending = vendorOrders.filter(o => o.status === ORDER_STATUS.ESCROW_HELD || o.status === ORDER_STATUS.VENDOR_CONFIRMED);
    const shipped = vendorOrders.filter(o => o.status === ORDER_STATUS.SHIPPED);
    
    const totalEarnings = completed.reduce((sum, o) => sum + o.vendorReceives, 0);
    const pendingEarnings = pending.reduce((sum, o) => sum + o.vendorReceives, 0);

    return {
      totalOrders: vendorOrders.length,
      completedOrders: completed.length,
      pendingOrders: pending.length,
      shippedOrders: shipped.length,
      totalEarnings,
      pendingEarnings,
      disputedOrders: vendorOrders.filter(o => o.status === ORDER_STATUS.DISPUTED).length,
      refundedOrders: vendorOrders.filter(o => o.status === ORDER_STATUS.REFUNDED).length
    };
  }

  getMonthlyRevenue() {
    const completed = this.orders.filter(o => o.status === ORDER_STATUS.COMPLETED);
    const totalRevenue = completed.reduce((sum, o) => sum + o.commission, 0);
    const thisMonthRevenue = completed
      .filter(o => {
        const orderDate = new Date(o.createdAt);
        const now = new Date();
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, o) => sum + o.commission, 0);

    return {
      totalRevenue,
      thisMonthRevenue,
      totalOrders: this.orders.length,
      completedOrders: completed.length
    };
  }
}

// ── GLOBAL INSTANCE ──
const orderManager = new OrderManager();

// ── HELPER FUNCTIONS ──
function formatCurrency(amount) {
  return '₦' + Math.round(amount).toLocaleString();
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStatusDisplay(status) {
  const displays = {
    pending_payment: { text: 'Pending Payment', icon: '⏳', color: '#F59E0B' },
    escrow_held: { text: 'Payment Held', icon: '🔒', color: '#1D9E75' },
    vendor_confirmed: { text: 'Confirmed', icon: '✓', color: '#1D9E75' },
    shipped: { text: 'Shipped', icon: '📦', color: '#3B82F6' },
    delivered: { text: 'Delivered', icon: '✅', color: '#10B981' },
    disputed: { text: 'Disputed', icon: '⚠️', color: '#EF4444' },
    refunded: { text: 'Refunded', icon: '↩️', color: '#6B7280' },
    completed: { text: 'Completed', icon: '🎉', color: '#10B981' }
  };
  return displays[status] || { text: status, icon: '•', color: '#999' };
}

function getStatusStep(status) {
  const steps = {
    pending_payment: 0,
    escrow_held: 1,
    vendor_confirmed: 1,
    shipped: 2,
    delivered: 3,
    completed: 3,
    disputed: -1,
    refunded: -1
  };
  return steps[status] || 0;
}
