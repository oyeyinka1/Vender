// vendor-orders.js — Vendor order management dashboard

let currentVendor = {
  id: 'CK',
  name: 'ChiChi Konnect',
  avatar: 'C'
};

let filterStatus = 'all';
let vendorOrders = [];

function initVendorDashboard() {
  // Load vendor from session/localStorage
  const vendorSession = sessionStorage.getItem('vender_vendor');
  if (vendorSession) {
    currentVendor = JSON.parse(vendorSession);
  }

  // Update UI
  document.getElementById('vd-vendor-name').textContent = currentVendor.name;
  document.getElementById('vd-avatar').textContent = currentVendor.avatar;

  // Load orders
  loadVendorOrders();
  renderOrders();
  updateStats();

  // Refresh every 3 seconds
  setInterval(() => {
    loadVendorOrders();
    renderOrders();
    updateStats();
  }, 3000);
}

function loadVendorOrders() {
  vendorOrders = orderManager.getOrdersByVendor(currentVendor.id);
}

function updateStats() {
  const stats = orderManager.getVendorStats(currentVendor.id);
  
  document.getElementById('stat-total').textContent = stats.totalOrders;
  document.getElementById('stat-pending').textContent = stats.pendingOrders;
  document.getElementById('stat-shipped').textContent = stats.shippedOrders;
  document.getElementById('stat-earnings').textContent = formatCurrency(stats.totalEarnings);
}

function renderOrders() {
  const filtered = filterOrdersByStatus(vendorOrders, filterStatus);
  const tableBody = document.getElementById('vd-table-body');

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <div style="padding: 60px 20px; text-align: center; color: var(--text-2);">
        <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
        <div class="vd-empty-title">No ${filterStatus !== 'all' ? filterStatus : ''} orders</div>
        <p style="margin-top: 8px;">
          ${filterStatus === 'all' ? 
            'Once buyers start purchasing, they\'ll appear here.' :
            `No orders with ${filterStatus} status yet.`}
        </p>
      </div>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(order => `
    <div class="vd-table-row">
      <div class="vd-order-item">
        <div class="vd-order-img">${order.itemImg}</div>
        <div class="vd-order-info">
          <div class="vd-order-name">${order.itemName}</div>
          <div class="vd-order-id">${order.id}</div>
        </div>
      </div>
      <div>
        <div class="vd-status ${getStatusClass(order.status)}">
          <span>${getStatusDisplay(order.status).icon}</span>
          ${getStatusDisplay(order.status).text}
        </div>
      </div>
      <div style="font-size: 13px; color: var(--text-2);">
        <div style="font-weight: 600; color: var(--text);">${order.buyerName}</div>
        <div>${order.buyerPhone || 'N/A'}</div>
      </div>
      <div>
        <div style="font-weight: 700; color: var(--green); font-size: 14px;">
          ${formatCurrency(order.vendorReceives)}
        </div>
        <div style="font-size: 12px; color: var(--text-3);">
          ${getEarningStatus(order.status)}
        </div>
      </div>
      <div>
        ${getActionButton(order)}
      </div>
    </div>
  `).join('');
}

function filterOrdersByStatus(orders, status) {
  if (status === 'all') return orders;
  
  const statusMap = {
    'pending': [ORDER_STATUS.ESCROW_HELD, ORDER_STATUS.VENDOR_CONFIRMED],
    'shipped': [ORDER_STATUS.SHIPPED],
    'completed': [ORDER_STATUS.COMPLETED],
    'disputed': [ORDER_STATUS.DISPUTED, ORDER_STATUS.REFUNDED]
  };

  return orders.filter(o => statusMap[status]?.includes(o.status));
}

function getStatusClass(status) {
  const classes = {
    [ORDER_STATUS.ESCROW_HELD]: 'vd-status-pending',
    [ORDER_STATUS.VENDOR_CONFIRMED]: 'vd-status-pending',
    [ORDER_STATUS.SHIPPED]: 'vd-status-shipped',
    [ORDER_STATUS.DELIVERED]: 'vd-status-delivered',
    [ORDER_STATUS.COMPLETED]: 'vd-status-earned',
    [ORDER_STATUS.DISPUTED]: 'vd-status-disputed',
    [ORDER_STATUS.REFUNDED]: 'vd-status-disputed'
  };
  return classes[status] || '';
}

function getEarningStatus(status) {
  const statuses = {
    [ORDER_STATUS.ESCROW_HELD]: 'Held',
    [ORDER_STATUS.VENDOR_CONFIRMED]: 'Held',
    [ORDER_STATUS.SHIPPED]: 'Held',
    [ORDER_STATUS.DELIVERED]: 'Processing',
    [ORDER_STATUS.COMPLETED]: 'Earned',
    [ORDER_STATUS.DISPUTED]: 'Disputed',
    [ORDER_STATUS.REFUNDED]: 'Refunded'
  };
  return statuses[status] || '';
}

function getActionButton(order) {
  if (order.status === ORDER_STATUS.ESCROW_HELD) {
    return `<button class="vd-action-btn" onclick="openShipModal('${order.id}')">Ship Now</button>`;
  } else if (order.status === ORDER_STATUS.VENDOR_CONFIRMED) {
    return `<button class="vd-action-btn" onclick="openShipModal('${order.id}')">Ship Now</button>`;
  } else if (order.status === ORDER_STATUS.SHIPPED) {
    return `<button class="vd-action-btn" disabled>Shipped</button>`;
  } else if (order.status === ORDER_STATUS.COMPLETED) {
    return `<button class="vd-action-btn" disabled>Complete</button>`;
  } else {
    return `<button class="vd-action-btn" disabled>—</button>`;
  }
}

function filterOrders(status) {
  filterStatus = status;
  
  document.querySelectorAll('.vd-filter').forEach(el => {
    el.classList.remove('active');
  });
  event.target.classList.add('active');

  renderOrders();
}

let shipingOrderId = null;

function openShipModal(orderId) {
  shipingOrderId = orderId;
  document.getElementById('tracking-input').value = '';
  document.getElementById('ship-modal').classList.add('open');
}

function closeShipModal() {
  document.getElementById('ship-modal').classList.remove('open');
  shipingOrderId = null;
}

function confirmShip() {
  if (!shipingOrderId) return;
  
  const tracking = document.getElementById('tracking-input').value;
  orderManager.markAsShipped(shipingOrderId, tracking);
  
  loadVendorOrders();
  renderOrders();
  updateStats();
  closeShipModal();
  
  showNotification('Order marked as shipped! Buyer has been notified.');
}

function logout() {
  sessionStorage.removeItem('vender_vendor');
  window.location.href = 'index.html';
}

function showNotification(msg) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--green);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  notif.textContent = msg;
  document.body.appendChild(notif);
  
  setTimeout(() => notif.remove(), 3000);
}

// Init on page load
document.addEventListener('DOMContentLoaded', initVendorDashboard);
