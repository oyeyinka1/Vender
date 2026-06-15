// order-tracking.js — Buyer order tracking page

// Get order ID from URL or session
function getOrderIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('order') || sessionStorage.getItem('vender_order_id');
}

let currentOrder = null;

function initOrderTracking() {
  const orderId = getOrderIdFromUrl();
  
  if (!orderId) {
    showError('Order not found. Please start a new order.');
    return;
  }

  currentOrder = orderManager.getOrder(orderId);
  
  if (!currentOrder) {
    showError('Order not found. Invalid order ID: ' + orderId);
    return;
  }

  renderOrder();
  setInterval(refreshOrder, 5000); // Refresh every 5 seconds
}

function refreshOrder() {
  currentOrder = orderManager.getOrder(currentOrder.id);
  renderOrder();
}

function renderOrder() {
  // Header
  document.getElementById('ot-order-id').textContent = currentOrder.id;

  // Status badge
  const status = getStatusDisplay(currentOrder.status);
  document.getElementById('ot-status-icon').textContent = status.icon;
  document.getElementById('ot-status-text').textContent = status.text;
  document.querySelector('.ot-status-badge').style.background = 
    status.color.includes('#') ? status.color + '20' : 'var(--green-light)';

  // Item info
  document.getElementById('ot-item-img').textContent = currentOrder.itemImg;
  document.getElementById('ot-item-name').textContent = currentOrder.itemName;
  document.getElementById('ot-item-vendor').textContent = currentOrder.vendor + ' · Verified';
  document.getElementById('ot-item-category').textContent = 'Category';
  document.getElementById('ot-item-zone').textContent = currentOrder.deliveryZone;
  document.getElementById('ot-item-price').textContent = formatCurrency(currentOrder.itemPrice);

  // Pricing
  document.getElementById('ot-price').textContent = formatCurrency(currentOrder.itemPrice);
  document.getElementById('ot-fee').textContent = formatCurrency(currentOrder.commission);
  document.getElementById('ot-total').textContent = formatCurrency(currentOrder.itemPrice);

  // Delivery address
  document.getElementById('ot-delivery-address').innerHTML = `
    <strong>${currentOrder.deliveryNeighbourhood}, ${currentOrder.deliveryZone}</strong><br>
    ${currentOrder.deliveryAddress}<br>
    ${currentOrder.deliveryState}
  `;

  // Timeline
  updateTimeline();

  // Action buttons
  updateActionButtons();
}

function updateTimeline() {
  const step = getStatusStep(currentOrder.status);
  
  document.querySelectorAll('.ot-step').forEach((el, idx) => {
    el.classList.remove('active', 'completed');
    
    if (idx < step) {
      el.classList.add('completed');
    } else if (idx === step) {
      el.classList.add('active');
    }
  });

  // Update timeline status text
  const lastStatus = currentOrder.statusHistory[currentOrder.statusHistory.length - 1];
  if (lastStatus) {
    // Parse which step and show timestamp
    const stepMap = {
      'pending_payment': 0,
      'escrow_held': 0,
      'vendor_confirmed': 1,
      'shipped': 1,
      'delivered': 2,
      'completed': 3
    };
    
    const stepNum = stepMap[currentOrder.status] || 0;
    const subEl = document.getElementById(`ot-step-sub-${stepNum}`);
    if (subEl && lastStatus.timestamp) {
      const date = new Date(lastStatus.timestamp);
      subEl.textContent = date.toLocaleDateString('en-NG');
    }
  }
}

function updateActionButtons() {
  const confirmBtn = document.getElementById('ot-confirm-btn');
  const disputeBtn = document.getElementById('ot-dispute-btn');

  // Show confirm/dispute buttons only when shipped
  if (currentOrder.status === ORDER_STATUS.SHIPPED) {
    confirmBtn.style.display = 'flex';
    disputeBtn.style.display = 'flex';
  } else {
    confirmBtn.style.display = 'none';
    disputeBtn.style.display = 'none';
  }

  // Disable if already resolved
  if ([ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED, ORDER_STATUS.DISPUTED, ORDER_STATUS.REFUNDED].includes(currentOrder.status)) {
    confirmBtn.disabled = true;
    disputeBtn.disabled = true;
  }
}

function openConfirmModal() {
  document.getElementById('confirm-modal').classList.add('open');
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').classList.remove('open');
}

function confirmDelivery() {
  orderManager.confirmDelivery(currentOrder.id);
  currentOrder = orderManager.getOrder(currentOrder.id);
  renderOrder();
  closeConfirmModal();
  showSuccess('Delivery confirmed! Vendor will receive their payment immediately.');
}

function openDisputeModal() {
  document.getElementById('dispute-modal').classList.add('open');
}

function closeDisputeModal() {
  document.getElementById('dispute-modal').classList.remove('open');
}

function submitDispute() {
  const reason = document.getElementById('dispute-reason').value;
  if (!reason.trim()) {
    alert('Please describe the issue');
    return;
  }
  
  orderManager.disputeDelivery(currentOrder.id, reason);
  currentOrder = orderManager.getOrder(currentOrder.id);
  renderOrder();
  closeDisputeModal();
  showSuccess('Dispute submitted. Full refund of ₦' + currentOrder.itemPrice.toLocaleString() + ' will be processed within 24 hours.');
}

function showError(msg) {
  document.body.innerHTML = `
    <nav>
      <div class="nav-inner">
        <a class="logo" href="index.html">Ven<span>der</span></a>
      </div>
    </nav>
    <div style="max-width: 900px; margin: 40px auto; padding: 0 24px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
      <h1 style="font-size: 24px; margin-bottom: 12px; font-weight: 700;">Order Not Found</h1>
      <p style="color: var(--text-2); margin-bottom: 24px;">${msg}</p>
      <a href="index.html" style="display: inline-block; padding: 12px 24px; background: var(--green); color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">Back to home</a>
    </div>
  `;
}

function showSuccess(msg) {
  const msgEl = document.createElement('div');
  msgEl.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--green);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 9999;
    animation: slideDown 0.3s ease;
  `;
  msgEl.textContent = msg;
  document.body.appendChild(msgEl);
  
  setTimeout(() => msgEl.remove(), 4000);
}

// Init on page load
document.addEventListener('DOMContentLoaded', initOrderTracking);
