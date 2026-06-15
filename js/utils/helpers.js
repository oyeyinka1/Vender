// helpers.js — Shared utilities for order tracking and vendor dashboard

/**
 * Format number as Nigerian Naira currency
 */
function formatCurrency(amount) {
  return '₦' + Number(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

/**
 * Get status display info (icon, text, color)
 */
function getStatusDisplay(status) {
  const displays = {
    [ORDER_STATUS.PENDING_PAYMENT]: {
      icon: '⏳',
      text: 'Awaiting payment',
      color: '#F59E0B'
    },
    [ORDER_STATUS.ESCROW_HELD]: {
      icon: '🔒',
      text: 'Money secured',
      color: '#10B981'
    },
    [ORDER_STATUS.VENDOR_CONFIRMED]: {
      icon: '✓',
      text: 'Vendor confirmed',
      color: '#10B981'
    },
    [ORDER_STATUS.SHIPPED]: {
      icon: '📦',
      text: 'On the way',
      color: '#3B82F6'
    },
    [ORDER_STATUS.DELIVERED]: {
      icon: '✓',
      text: 'Delivered',
      color: '#10B981'
    },
    [ORDER_STATUS.COMPLETED]: {
      icon: '✓',
      text: 'Completed',
      color: '#10B981'
    },
    [ORDER_STATUS.DISPUTED]: {
      icon: '⚠',
      text: 'Disputed',
      color: '#EF4444'
    },
    [ORDER_STATUS.REFUNDED]: {
      icon: '↩',
      text: 'Refunded',
      color: '#6B7280'
    }
  };

  return displays[status] || {
    icon: '?',
    text: status,
    color: '#6B7280'
  };
}

/**
 * Get which timeline step an order status is at
 * 0 = Payment, 1 = Shipped, 2 = Delivery, 3 = Complete
 */
function getStatusStep(status) {
  const stepMap = {
    [ORDER_STATUS.PENDING_PAYMENT]: 0,
    [ORDER_STATUS.ESCROW_HELD]: 0,
    [ORDER_STATUS.VENDOR_CONFIRMED]: 1,
    [ORDER_STATUS.SHIPPED]: 1,
    [ORDER_STATUS.DELIVERED]: 2,
    [ORDER_STATUS.COMPLETED]: 3,
    [ORDER_STATUS.DISPUTED]: 2,
    [ORDER_STATUS.REFUNDED]: 3
  };

  return stepMap[status] || 0;
}

/**
 * Get readable status text
 */
function getStatusText(status) {
  return getStatusDisplay(status).text;
}

/**
 * Check if order is in a final state (no more changes)
 */
function isOrderFinal(status) {
  return [
    ORDER_STATUS.COMPLETED,
    ORDER_STATUS.REFUNDED
  ].includes(status);
}

/**
 * Get CSS class name for status badge styling
 */
function getStatusClass(status) {
  const classes = {
    [ORDER_STATUS.PENDING_PAYMENT]: 'status-pending',
    [ORDER_STATUS.ESCROW_HELD]: 'status-secured',
    [ORDER_STATUS.VENDOR_CONFIRMED]: 'status-secured',
    [ORDER_STATUS.SHIPPED]: 'status-shipped',
    [ORDER_STATUS.DELIVERED]: 'status-delivered',
    [ORDER_STATUS.COMPLETED]: 'status-completed',
    [ORDER_STATUS.DISPUTED]: 'status-disputed',
    [ORDER_STATUS.REFUNDED]: 'status-refunded'
  };
  return classes[status] || '';
}

/**
 * Parse date and format nicely
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get time ago string (e.g., "2 hours ago")
 */
function getTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
  
  return date.toLocaleDateString('en-NG');
}
