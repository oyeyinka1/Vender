// checkout.js — Vender checkout page
// Depends on: data/locations.js (loaded before this in HTML)

// ── PAYSTACK CONFIG ──
// Public key should be loaded from a backend API endpoint
// Secret key should NEVER be exposed in frontend code
let PAYSTACK_PUBLIC_KEY = null;

// ── STATE ──
let deliveryMode = 'me'; // 'me' or 'someone'
let selectedPayment = 'card'
let orderData = {};
let isProcessingPayment = false;

const DELIVERY_FEE = 1500;
const SERVICE_RATE = 0.06;

// ── INIT ──
document.addEventListener('DOMContentLoaded', function () {
  // Load Paystack public key from backend (you need to create this endpoint)
  // For now, fetch from a secure location or backend API
  loadPaystackKey();
  loadOrderFromStorage();
  loadSavedAddress();
  updateTotals();
});

// ── LOAD PAYSTACK KEY ──
// In production, this should fetch from your backend API
// DO NOT hardcode API keys in frontend code
async function loadPaystackKey() {
  try {
    // Option 1: Fetch from your backend API
    // const response = await fetch('/api/paystack-key');
    // const data = await response.json();
    // PAYSTACK_PUBLIC_KEY = data.publicKey;
    
    // Option 2: For development, store in a separate config file not committed to git
    // Create a config.js file (add to .gitignore) with: const PAYSTACK_PUBLIC_KEY = 'your_key_here';
    
    // Option 3: Use environment variables if you have a build process
    // PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_KEY;
    
    if (!PAYSTACK_PUBLIC_KEY) {
      console.error('Paystack key not loaded. Payment will fail.');
    }
  } catch (error) {
    console.error('Failed to load Paystack key:', error);
  }
}

// ── LOAD ORDER ──
// In production this comes from a product page via sessionStorage
// For now we use mock data or whatever was saved
// function loadOrderFromStorage() {
//   const saved = sessionStorage.getItem('vender_checkout_item');
//   if (saved) {
//     orderData = JSON.parse(saved);
//   } else {
//     // Fallback mock data
//     orderData = {
//       name: 'Fresh Tomatoes — 5kg box',
//       vendor: 'FreshPick Foods · Verified',
//       price: 3200,
//       img: '🍅',
//       isSourceOnOrder: true
//     };
//   }

//   document.getElementById('order-name').textContent = orderData.name;
//   document.getElementById('order-vendor').textContent = orderData.vendor;
//   document.getElementById('order-img').textContent = orderData.img || '📦';
//   document.getElementById('order-price').textContent = fmt(orderData.price);

//   if (orderData.isSourceOnOrder) {
//     document.getElementById('order-mode').textContent = '⏱ Order on demand';
//     document.getElementById('order-mode').style.display = 'inline-flex';
//     // Disable pay on delivery for source-on-order vendors
//     document.getElementById('pay-delivery').style.opacity = '.4';
//     document.getElementById('pay-delivery').style.pointerEvents = 'none';
//     document.getElementById('pod-note').style.display = 'block';
//   }

//   updateTotals();
// }

// ── ADD THIS TO YOUR checkout.js ──
// Replace your existing loadOrderFromStorage function with this one
// It now also reads the surprise shopping context automatically

function loadOrderFromStorage() {
  // Load item
  const saved = sessionStorage.getItem('vender_checkout_item');
  if (saved) {
    orderData = JSON.parse(saved);
  } else {
    orderData = {
      name: 'Fresh Tomatoes — 5kg box',
      vendor: 'FreshPick Foods · Verified',
      price: 3200,
      img: '🍅',
      isSourceOnOrder: true
    };
  }

  document.getElementById('order-name').textContent = orderData.name;
  document.getElementById('order-vendor').textContent = orderData.vendor;
  document.getElementById('order-img').textContent = orderData.img || '📦';
  document.getElementById('order-price').textContent = fmt(orderData.price);

  if (orderData.isSourceOnOrder) {
    document.getElementById('order-mode').textContent = '⏱ Order on demand';
    document.getElementById('order-mode').style.display = 'inline-flex';
    document.getElementById('pay-delivery').style.opacity = '.4';
    document.getElementById('pay-delivery').style.pointerEvents = 'none';
    document.getElementById('pod-note').style.display = 'block';
  }

  // ── CHECK IF COMING FROM SURPRISE MODE ──
  const shoppingFor = sessionStorage.getItem('vender_shopping_for');
  if (shoppingFor) {
    const sf = JSON.parse(shoppingFor);
    if (sf.mode === 'surprise') {
      // Auto switch to surprise tab
      switchDelivery('someone');

      // Pre-fill the state dropdown and trigger cascade
      const stateSelect = document.getElementById('surp-state');
      if (stateSelect) {
        stateSelect.value = sf.state;
        loadSurpZones(); // populate zones

        // Wait for zones to populate then set zone
        setTimeout(() => {
          const zoneSelect = document.getElementById('surp-zone');
          if (zoneSelect) {
            zoneSelect.value = sf.zone;
            loadSurpHoods(); // populate neighbourhoods

            // Wait for hoods to populate then set neighbourhood
            setTimeout(() => {
              const hoodSelect = document.getElementById('surp-hood');
              if (hoodSelect) {
                hoodSelect.value = sf.neighbourhood;
              }
            }, 50);
          }
        }, 50);
      }

      // Show the different state note if applicable
      const userLocation = JSON.parse(localStorage.getItem('vender_location') || '{}');
      if (userLocation.state && sf.state !== userLocation.state) {
        const note = document.getElementById('diff-state-note');
        const text = document.getElementById('diff-state-text');
        if (note && text) {
          text.textContent = `This delivery is going to ${sf.state} — different from your location. The vendor will deliver there.`;
          note.style.display = 'flex';
        }
      }
    }
  }

  updateTotals();
}

// ── LOAD SAVED ADDRESS ──
function loadSavedAddress() {
  const user = JSON.parse(localStorage.getItem('vender_user') || '{}');
  const location = JSON.parse(localStorage.getItem('vender_location') || '{}');

  if (location.neighbourhood && location.state) {
    const addressEl = document.getElementById('saved-addr-1');
    if (addressEl) {
      addressEl.textContent = `${location.neighbourhood}, ${location.zone}, ${location.state}`;
    }
  } else {
    const addressEl = document.getElementById('saved-addr-1');
    if (addressEl) {
      addressEl.textContent = 'No address saved — please add one below';
    }
  }
}

// ── FORMAT PRICE ──
function fmt(n) {
  return '₦' + Number(n).toLocaleString();
}

// ── UPDATE TOTALS ──
function updateTotals() {
  const item = orderData.price || 0;
  const delivery = DELIVERY_FEE;
  const service = Math.round(item * SERVICE_RATE);
  const total = item + delivery + service;

  document.getElementById('sum-item').textContent = fmt(item);
  document.getElementById('sum-delivery').textContent = fmt(delivery);
  document.getElementById('sum-service').textContent = fmt(service);
  document.getElementById('sum-total').textContent = fmt(total);
  document.getElementById('pay-btn-amount').textContent = fmt(total);
}

// ── SWITCH DELIVERY MODE ──
function switchDelivery(mode) {
  deliveryMode = mode;

  document.getElementById('tab-me').classList.toggle('active', mode === 'me');
  document.getElementById('tab-someone').classList.toggle('active', mode === 'someone');
  document.getElementById('panel-me').style.display = mode === 'me' ? 'block' : 'none';
  document.getElementById('panel-someone').style.display = mode === 'someone' ? 'block' : 'none';

  // Disable pay on delivery for surprise orders
  const podOpt = document.getElementById('pay-delivery');
  if (mode === 'someone') {
    podOpt.style.opacity = '.4';
    podOpt.style.pointerEvents = 'none';
    if (selectedPayment === 'delivery') selectPay('card');
    document.getElementById('pod-note').style.display = 'block';
  } else if (!orderData.isSourceOnOrder) {
    podOpt.style.opacity = '1';
    podOpt.style.pointerEvents = 'auto';
    document.getElementById('pod-note').style.display = 'none';
  }
}

// ── ADDRESS SELECTION ──
function selectAddr(el) {
  document.querySelectorAll('.addr-item').forEach(a => a.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleNewAddr() {
  const form = document.getElementById('new-addr-form');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// ── NEW ADDRESS LOCATION CASCADE ──
function loadNewZones() {
  const state = document.getElementById('new-state').value;
  const zoneField = document.getElementById('new-zone-field');
  const hoodField = document.getElementById('new-hood-field');
  const zoneSelect = document.getElementById('new-zone');

  hoodField.style.display = 'none';
  document.getElementById('new-hood').innerHTML = '<option value="">Select neighbourhood</option>';
  zoneSelect.innerHTML = '<option value="">Select zone</option>';

  if (!state || !LOCATION_DATA[state]) {
    zoneField.style.display = 'none';
    return;
  }

  Object.keys(LOCATION_DATA[state]).forEach(z => {
    const opt = document.createElement('option');
    opt.value = z; opt.textContent = z;
    zoneSelect.appendChild(opt);
  });
  zoneField.style.display = 'block';
}

function loadNewHoods() {
  const state = document.getElementById('new-state').value;
  const zone  = document.getElementById('new-zone').value;
  const hoodField = document.getElementById('new-hood-field');
  const hoodSelect = document.getElementById('new-hood');

  hoodSelect.innerHTML = '<option value="">Select neighbourhood</option>';

  if (!state || !zone || !LOCATION_DATA[state]?.[zone]) {
    hoodField.style.display = 'none';
    return;
  }

  LOCATION_DATA[state][zone].forEach(h => {
    const opt = document.createElement('option');
    opt.value = h; opt.textContent = h;
    hoodSelect.appendChild(opt);
  });
  hoodField.style.display = 'block';
}

function saveNewAddr() {
  const state  = document.getElementById('new-state').value;
  const zone   = document.getElementById('new-zone').value;
  const hood   = document.getElementById('new-hood').value;
  const street = document.getElementById('new-street').value.trim();

  if (!state || !zone || !hood || !street) {
    alert('Please fill in all address fields');
    return;
  }

  const fullAddr = `${street}, ${hood}, ${zone}, ${state}`;

  // Add to address list
  const list = document.getElementById('addr-list');
  const newItem = document.createElement('div');
  newItem.className = 'addr-item';
  newItem.onclick = function () { selectAddr(this); };
  newItem.innerHTML = `
    <div class="addr-radio"><div class="addr-radio-dot"></div></div>
    <div class="addr-body">
      <div class="addr-name">New address</div>
      <div class="addr-detail">${fullAddr}</div>
    </div>
  `;
  list.appendChild(newItem);

  // Auto select the new address
  selectAddr(newItem);

  // Save to localStorage
  const savedAddrs = JSON.parse(localStorage.getItem('vender_addresses') || '[]');
  savedAddrs.push({ state, zone, hood, street, full: fullAddr });
  localStorage.setItem('vender_addresses', JSON.stringify(savedAddrs));

  // Hide form
  toggleNewAddr();

  // Reset form
  document.getElementById('new-state').value = '';
  document.getElementById('new-zone-field').style.display = 'none';
  document.getElementById('new-hood-field').style.display = 'none';
  document.getElementById('new-street').value = '';
}

// ── SURPRISE DELIVERY LOCATION CASCADE ──
function loadSurpZones() {
  const state = document.getElementById('surp-state').value;
  const zoneField = document.getElementById('surp-zone-field');
  const hoodField = document.getElementById('surp-hood-field');
  const zoneSelect = document.getElementById('surp-zone');
  const diffNote = document.getElementById('diff-state-note');

  hoodField.style.display = 'none';
  document.getElementById('surp-hood').innerHTML = '<option value="">Select neighbourhood</option>';
  zoneSelect.innerHTML = '<option value="">Select zone</option>';

  if (!state || !LOCATION_DATA[state]) {
    zoneField.style.display = 'none';
    diffNote.style.display = 'none';
    return;
  }

  Object.keys(LOCATION_DATA[state]).forEach(z => {
    const opt = document.createElement('option');
    opt.value = z; opt.textContent = z;
    zoneSelect.appendChild(opt);
  });
  zoneField.style.display = 'block';

  // Show different state note
  const userLocation = JSON.parse(localStorage.getItem('vender_location') || '{}');
  if (userLocation.state && state !== userLocation.state) {
    document.getElementById('diff-state-text').textContent =
      `This delivery is going to ${state} — different from your location. We'll find vendors that deliver there.`;
    diffNote.style.display = 'flex';
  } else {
    diffNote.style.display = 'none';
  }
}

function loadSurpHoods() {
  const state = document.getElementById('surp-state').value;
  const zone  = document.getElementById('surp-zone').value;
  const hoodField = document.getElementById('surp-hood-field');
  const hoodSelect = document.getElementById('surp-hood');

  hoodSelect.innerHTML = '<option value="">Select neighbourhood</option>';

  if (!state || !zone || !LOCATION_DATA[state]?.[zone]) {
    hoodField.style.display = 'none';
    return;
  }

  LOCATION_DATA[state][zone].forEach(h => {
    const opt = document.createElement('option');
    opt.value = h; opt.textContent = h;
    hoodSelect.appendChild(opt);
  });
  hoodField.style.display = 'block';
}

function toggleSurpriseCheck() {
  const cb = document.getElementById('hide-sender');
  cb.checked = !cb.checked;
}

// ── PAYMENT SELECTION ──
function selectPay(type) {
  selectedPayment = type;
  document.querySelectorAll('.pay-opt').forEach(o => o.classList.remove('selected'));
  document.getElementById('pay-' + type).classList.add('selected');
}

// ── VALIDATE BEFORE PAY ──
function validateCheckout() {
  // Check if logged in
  const user = JSON.parse(localStorage.getItem('vender_user') || '{}');
  if (!user.type) {
    if (confirm('You need to sign in before placing an order. Go to sign in page?')) {
      window.location.href = 'login.html';
    }
    return false;
  }

  if (deliveryMode === 'someone') {
    const name   = document.getElementById('recipient-name').value.trim();
    const phone  = document.getElementById('recipient-phone').value.trim();
    const state  = document.getElementById('surp-state').value;
    const zone   = document.getElementById('surp-zone').value;
    const hood   = document.getElementById('surp-hood').value;
    const street = document.getElementById('surp-street').value.trim();

    let ok = true;

    if (!name) { document.getElementById('recipient-name-err').classList.add('show'); ok = false; }
    else document.getElementById('recipient-name-err').classList.remove('show');

    if (!phone || phone.length < 10) { document.getElementById('recipient-phone-err').classList.add('show'); ok = false; }
    else document.getElementById('recipient-phone-err').classList.remove('show');

    if (!street) { document.getElementById('surp-street-err').classList.add('show'); ok = false; }
    else document.getElementById('surp-street-err').classList.remove('show');

    if (!state || !zone || !hood) {
      alert('Please complete the recipient location fields');
      ok = false;
    }

    if (!ok) return false;
  }

  return true;
}

// ── HANDLE PAY ──
function handlePay() {
  if (!validateCheckout()) return;

  const btn = document.getElementById('pay-btn');
  btn.textContent = 'Processing...';
  btn.disabled = true;
  btn.style.opacity = '.7';

  // Get buyer info
  const buyer = JSON.parse(localStorage.getItem('vender_user') || '{}');
  const buyerName = buyer.name || 'Buyer';
  const buyerPhone = buyer.phone || '';
  const buyerId = buyer.id || 'BUYER-' + Date.now();

  // Get delivery info
  let deliveryAddress, deliveryNeighbourhood, deliveryZone, deliveryState, recipientName;
  
  if (deliveryMode === 'me') {
    // Delivery to self
    const location = JSON.parse(localStorage.getItem('vender_location') || '{}');
    deliveryAddress = location.address || 'Address not set';
    deliveryNeighbourhood = location.neighbourhood || '';
    deliveryZone = location.zone || '';
    deliveryState = location.state || '';
    recipientName = buyerName;
  } else {
    // Delivery to someone else (surprise/gift)
    deliveryAddress = document.getElementById('surp-street').value.trim();
    deliveryNeighbourhood = document.getElementById('surp-hood').value;
    deliveryZone = document.getElementById('surp-zone').value;
    deliveryState = document.getElementById('surp-state').value;
    recipientName = document.getElementById('recipient-name').value.trim();
  }

  // Parse vendor from orderData (format: "Vendor Name · Verified")
  const vendorFull = (orderData.vendor || '').split('·')[0].trim();
  const vendorId = orderData.vendorId || 'V-' + vendorFull.replace(/\s+/g, '-').toLowerCase();

  // Create order using orderManager
  const orderId = orderManager.createOrder({
    itemName: orderData.name,
    itemPrice: orderData.price,
    itemImg: orderData.img,
    vendor: vendorFull,
    vendorId: vendorId,
    buyerId: buyerId,
    buyerName: buyerName,
    buyerPhone: buyerPhone,
    deliveryAddress: deliveryAddress,
    deliveryNeighbourhood: deliveryNeighbourhood,
    deliveryZone: deliveryZone,
    deliveryState: deliveryState,
    deliveryMode: deliveryMode,
    paymentMethod: selectedPayment
  });

  // Calculate total (item + delivery fee)
  const deliveryFee = deliveryMode === 'me' ? DELIVERY_FEE : 0;
  const totalAmount = orderData.price + deliveryFee;
  
  // Store order ID in session for order tracking page
  sessionStorage.setItem('vender_order_id', orderId);

  // Handle based on payment method
  if (selectedPayment === 'card') {
    isProcessingPayment = true;
    // Use real Paystack for card payment
    processPaystackPayment({
      btn: btn,
      orderId: orderId,
      totalAmount: totalAmount,
      buyerId: buyerId,
      buyerName: buyerName,
      buyerPhone: buyerPhone,
      vendorFull: vendorFull,
      vendorId: vendorId
    });
  } else if (selectedPayment === 'transfer') {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.textContent = 'Proceed to Transfer';
    showBankTransferModal();
  } else if (selectedPayment === 'delivery') {
    // Pay on delivery - mark as pending payment
    setTimeout(() => {
      orderManager.updateOrderStatus(orderId, 'pending_payment');
      window.location.href = 'order-tracking.html?order=' + orderId;
    }, 1000);
  }
}