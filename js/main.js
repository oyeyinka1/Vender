// script.js — Vender home page
// VENDORS and PRODUCTS arrays are loaded from shared-data.js

// ── STATE ──
const defaultLocation = { state: 'Lagos', zone: 'Lagos Mainland', neighbourhood: 'Yaba' };
let userLocation = defaultLocation;
try {
  const saved = localStorage.getItem('vender_location');
  if (saved) userLocation = JSON.parse(saved);
} catch(e) {}

let hasUserSetLocation = !!localStorage.getItem('vender_location');

let currentCat = 'All';
let currentSearch = '';
let currentSort = 'newest';
let minRating = 0;
let verifiedOnly = false;
let vendorTypeFilter = 'any'; // 'any', 'stock', 'source', 'custom'
let activeVendor = null;

let surpriseMode = false;
let surpriseLocation = null;

// Location picker state
let locPickerStep = 1;
let locPickerState = null;
let locPickerZone = null;

// ── HELPERS ──
function fmt(n) { return '₦' + n.toLocaleString(); }

function getActiveLocation() {
  return surpriseMode && surpriseLocation ? surpriseLocation : userLocation;
}

// ── AUTH ──
function isLoggedIn() {
  const user = localStorage.getItem('vender_user');
  if (!user) return false;
  try {
    const parsed = JSON.parse(user);
    return parsed && parsed.type ? true : false;
  } catch(e) { return false; }
}

function openAuthModal(message) {
  const overlay = document.getElementById('auth-modal-overlay');
  if (!overlay) return;
  if (message) document.getElementById('auth-modal-sub').textContent = message;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAuthModalDirect() {
  const overlay = document.getElementById('auth-modal-overlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ── LOCATION NUDGE ──
function showLocNudge() {
  const nudge = document.getElementById('loc-nudge');
  if (nudge) nudge.classList.add('show');
}

function hideLocNudge() {
  const nudge = document.getElementById('loc-nudge');
  if (nudge) nudge.classList.remove('show');
}

function updateLocLabel() {
  const label = document.getElementById('loc-label');
  if (!label) return;
  const hasLocation = localStorage.getItem('vender_location');
  label.textContent = hasLocation ? userLocation.neighbourhood : 'Choose your area';
}

// ── START SHOPPING ──
window.startShopping = function() {
  const searchSection = document.getElementById('search-section');
  if (searchSection) {
    searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // If no location set, open the modal directly
  if (!localStorage.getItem('vender_location')) {
    setTimeout(() => openLocModal(), 600);
  } else {
    // If location is set, focus the search input
    setTimeout(() => document.getElementById('search-input')?.focus(), 600);
  }
};

// ── ACCOUNT DROPDOWN ──
function toggleAccountMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById('account-menu');
  const btn = e.currentTarget;
  menu.classList.toggle('open');
  btn.classList.toggle('active');
}

// ── SURPRISE MODE ──
function openSurprisePicker() {
  locPickerStep = 1;
  locPickerState = null;
  locPickerZone = null;
  const modal = document.getElementById('loc-modal-overlay');
  modal.classList.add('open');
  modal.setAttribute('data-mode', 'surprise');
  renderLocPickerSurprise();
}

function renderLocPickerSurprise() {
  const container = document.getElementById('loc-grid');
  const modal = document.querySelector('.loc-modal');

  if (locPickerStep === 1) {
    modal.querySelector('h3').textContent = 'Which state are they in?';
    const states = getAllStates();
    container.innerHTML = states.map(s =>
      `<div class="loc-opt${surpriseLocation && s === surpriseLocation.state ? ' sel' : ''}" onclick="selectSurpriseState('${s}')">${s}</div>`
    ).join('');
  } else if (locPickerStep === 2) {
    modal.querySelector('h3').textContent = `Zone in ${locPickerState}`;
    const zones = getZones(locPickerState);
    container.innerHTML =
      `<div class="loc-back" onclick="locPickerStep=1;renderLocPickerSurprise()">← Back to states</div>` +
      zones.map(z =>
        `<div class="loc-opt${surpriseLocation && z === surpriseLocation.zone ? ' sel' : ''}" onclick="selectSurpriseZone('${z}')">${z}</div>`
      ).join('');
  } else if (locPickerStep === 3) {
    modal.querySelector('h3').textContent = `Neighbourhood in ${locPickerZone}`;
    const hoods = getNeighbourhoods(locPickerState, locPickerZone);
    container.innerHTML =
      `<div class="loc-back" onclick="locPickerStep=2;renderLocPickerSurprise()">← Back to zones</div>` +
      hoods.map(n =>
        `<div class="loc-opt${surpriseLocation && n === surpriseLocation.neighbourhood ? ' sel' : ''}" onclick="selectSurpriseNeighbourhood('${n}')">${n}</div>`
      ).join('');
  }}


function selectSurpriseState(state) {
  locPickerState = state;
  locPickerStep = 2;
  renderLocPickerSurprise();
}

function selectSurpriseZone(zone) {
  locPickerZone = zone;
  locPickerStep = 3;
  renderLocPickerSurprise();
}

function selectSurpriseNeighbourhood(neighbourhood) {
  surpriseLocation = { state: locPickerState, zone: locPickerZone, neighbourhood };
  sessionStorage.setItem('vender_shopping_for', JSON.stringify({
    mode: 'surprise',
    state: locPickerState,
    zone: locPickerZone,
    neighbourhood
  }));
  surpriseMode = true;
  closeLocModal();
  updateSurpriseBanner();
  activeVendor = null;
  document.getElementById('vendor-panel').className = 'vendor-panel';
  render();
  updateTags();
}

function cancelSurpriseMode() {
  surpriseMode = false;
  surpriseLocation = null;
  sessionStorage.removeItem('vender_shopping_for');
  updateSurpriseBanner();
  activeVendor = null;
  document.getElementById('vendor-panel').className = 'vendor-panel';
  render();
  updateTags();
}

function updateSurpriseBanner() {
  const banner = document.getElementById('surprise-banner');
  const btn = document.getElementById('surprise-btn');
  if (!banner || !btn) return;
  if (surpriseMode && surpriseLocation) {
    banner.style.display = 'flex';
    banner.querySelector('.surprise-loc').textContent =
      `${surpriseLocation.neighbourhood}, ${surpriseLocation.state}`;
    btn.classList.add('surprise-active');
    btn.querySelector('.surprise-btn-text').textContent =
      'Shopping for: ' + surpriseLocation.neighbourhood + ' ▾';
  } else {
    banner.style.display = 'none';
    btn.classList.remove('surprise-active');
    btn.querySelector('.surprise-btn-text').textContent = '🎁 Send to someone else?';
  }
}

// ── FILTERS ──
function setCategory(el, cat) {
  currentCat = cat;
  document.querySelectorAll('.fpill:not(.filter-dropdown .fpill)').forEach(p => p.classList.remove('on'));
  el.classList.add('on');
  activeVendor = null;
  document.getElementById('vendor-panel').className = 'vendor-panel';
  render(); updateTags();
}

function toggleRatingMenu() {
  document.getElementById('rating-menu').classList.toggle('open');
}

function toggleVendorTypeMenu() {
  document.getElementById('vendor-type-menu').classList.toggle('open');
}

function setVendorType(type, el) {
  vendorTypeFilter = type;
  document.querySelectorAll('.vendor-type-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('vendor-type-menu').classList.remove('open');
  const pill = document.getElementById('vendor-type-pill');
  pill.classList.toggle('filter-active', type !== 'any');
  render(); updateTags();
}

function setRating(val, el) {
  minRating = val;
  document.querySelectorAll('.rating-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('rating-menu').classList.remove('open');
  document.getElementById('rating-pill').classList.toggle('filter-active', val > 0);
  render(); updateTags();
}

function toggleVerified() {
  verifiedOnly = !verifiedOnly;
  document.getElementById('verified-pill').classList.toggle('filter-active', verifiedOnly);
  document.getElementById('verified-pill').classList.toggle('on', verifiedOnly);
  render(); updateTags();
}

function handleSearch(val) {
  currentSearch = val;
  document.getElementById('search-clear').style.display = val ? 'inline' : 'none';
  render(); updateTags();
}

function clearSearch() {
  currentSearch = '';
  document.getElementById('search-input').value = '';
  document.getElementById('search-clear').style.display = 'none';
  render(); updateTags();
}

function setSort(val) { currentSort = val; render(); }

function clearAllFilters() {
  currentSearch = ''; currentCat = 'All'; minRating = 0;
  verifiedOnly = false;
  document.getElementById('search-input').value = '';
  document.getElementById('search-clear').style.display = 'none';
  document.querySelectorAll('.fpill').forEach(p => p.classList.remove('on', 'filter-active'));
  document.querySelector('.fpill').classList.add('on');
  document.querySelectorAll('.rating-opt').forEach(o => o.classList.remove('sel'));
  document.querySelector('.rating-opt').classList.add('sel');
  render(); updateTags();
}

function updateTags() {
  const tags = [];
  if (currentCat !== 'All') tags.push(`<span class="atag" onclick="clearAllFilters()">${currentCat} ×</span>`);
  if (currentSearch) tags.push(`<span class="atag" onclick="clearSearch()">"${currentSearch}" ×</span>`);
  if (minRating > 0) tags.push(`<span class="atag" onclick="setRating(0,document.querySelector('.rating-opt'))">${minRating}★+ ×</span>`);
  if (vendorTypeFilter !== 'any') {
    const typeLabels = { stock: 'Stock available', source: 'Sourced on order', custom: 'Custom made' };
    tags.push(`<span class="atag" onclick="setVendorType('any',document.querySelector('.vendor-type-opt'))">${typeLabels[vendorTypeFilter]} ×</span>`);
  }
  if (verifiedOnly) tags.push(`<span class="atag" onclick="toggleVerified()">Verified only ×</span>`);
  const row = document.getElementById('active-tags');
  row.innerHTML = tags.join('');
  row.style.display = tags.length ? 'flex' : 'none';
}

// ── VENDOR RENDER ──
function renderVendors() {
  const grid = document.getElementById('vendor-grid');
  if (!grid) return; // Grid doesn't exist on this page
  
  const loc = getActiveLocation();

  let vendors = VENDORS.filter(v => {
    if (!v.deliveryZones.includes(loc.neighbourhood)) return false;
    if (currentCat !== 'All' && v.cat !== currentCat) return false;
    if (minRating > 0 && v.rating < minRating) return false;
    if (verifiedOnly && !v.verified) return false;
    if (vendorTypeFilter !== 'any' && v.operationMode !== vendorTypeFilter) return false;
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.cat.toLowerCase().includes(q);
    }
    return true;
  });

  const emptySection = document.getElementById('vendor-empty-state');

  if (vendors.length === 0) {
    grid.innerHTML = '';
    if (emptySection) {
      emptySection.classList.add('show');
      const emptyNeighbourhood = document.getElementById('empty-neighbourhood');
      if (emptyNeighbourhood) emptyNeighbourhood.textContent = loc.neighbourhood;
    }
    const nearbyGrid = document.getElementById('nearby-vendors-grid');
    if (nearbyGrid) {
      const nearbyVendors = VENDORS.filter(v => v.zone === loc.zone && v.state === loc.state);
      nearbyGrid.innerHTML = nearbyVendors.length === 0
        ? '<p style="font-size:13px;color:var(--text-3);grid-column:1/-1">No vendors in this zone yet.</p>'
        : nearbyVendors.map(v => `
            <div class="vcard" onclick="selectVendor('${v.id}')">
              <div class="vav" style="background:${v.bg};color:${v.tc}">${v.id}</div>
              <div class="vname">${v.name}</div>
              <div class="vmeta">${v.cat} · ${v.zone}</div>
              <div class="badges">
                <span class="badge ${v.verified ? 'badge-v' : 'badge-u'}">${v.verified ? '✓ Verified' : 'Unverified'}</span>
                ${v.source ? '<span class="badge badge-s">Sources on order</span>' : ''}
              </div>
              <div class="vstars"><span class="star">★</span>${v.rating} · ${v.orders} orders</div>
            </div>`).join('');
    }
    return;
  }

  if (emptySection) emptySection.classList.remove('show');
  grid.innerHTML = vendors.map(v => `
    <div class="vcard${activeVendor === v.id ? ' picked' : ''}" onclick="selectVendor('${v.id}')">
      <div class="vav" style="background:${v.bg};color:${v.tc}">${v.id}</div>
      <div class="vname">${v.name}</div>
      <div class="vmeta">${v.cat} · ${v.zone}</div>
      <div class="badges">
        <span class="badge ${v.verified ? 'badge-v' : 'badge-u'}">${v.verified ? '✓ Verified' : 'Unverified'}</span>
        ${v.source ? '<span class="badge badge-s">Sources on order</span>' : ''}
      </div>
      <div class="vstars"><span class="star">★</span>${v.rating} · ${v.orders} orders</div>
    </div>`).join('');
}

function selectVendor(id) {
  const v = VENDORS.find(x => x.id === id);
  if (!v) return;
  if (activeVendor === id) {
    activeVendor = null;
    document.getElementById('vendor-panel').className = 'vendor-panel';
    renderVendors(); return;
  }
  activeVendor = id;
  renderVendors();
  const panel = document.getElementById('vendor-panel');
  panel.className = 'vendor-panel open';
  panel.innerHTML = `
    <div class="vp-head">
      <div class="vav" style="background:${v.bg};color:${v.tc};width:52px;height:52px;font-size:17px">${v.id}</div>
      <div class="vp-info">
        <h3>${v.name}</h3>
        <p>${v.cat} · ${v.zone}</p>
        <div class="badges" style="margin-top:6px">
          <span class="badge ${v.verified ? 'badge-v' : 'badge-u'}">${v.verified ? '✓ Verified' : 'Not yet verified'}</span>
          ${v.source ? '<span class="badge badge-s">Sources on order</span>' : ''}
        </div>
      </div>
    </div>
    <div class="vp-stats">
      <div class="vpstat"><div class="vpstat-num">${v.orders}</div><div class="vpstat-label">Orders done</div></div>
      <div class="vpstat"><div class="vpstat-num">${v.completion}%</div><div class="vpstat-label">On-time delivery</div></div>
      <div class="vpstat"><div class="vpstat-num">${v.rating}★</div><div class="vpstat-label">Avg rating</div></div>
    </div>
    ${v.source ? `<div class="source-box"><strong>What "sources on order" means:</strong> This vendor doesn't hold stock. After you pay, they source your item from the market. Your money stays in escrow — if they don't deliver within 48 hours, you get a full automatic refund.</div>` : ''}
    <p class="vp-desc">${v.desc}</p>
    <div class="delivery-zones"><strong>Delivers to:</strong> ${v.deliveryZones.join(', ')}</div>
    <button class="vp-btn" onclick="filterByVendor('${v.name}')">See ${v.name.split(' ')[0]}'s products ↓</button>
  `;
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function filterByVendor(name) {
  currentSearch = name;
  document.getElementById('search-input').value = name;
  document.getElementById('search-clear').style.display = 'inline';
  renderProducts();
  updateTags();
  document.getElementById('prod-grid').scrollIntoView({ behavior: 'smooth' });
}

// ── PRODUCT RENDER ──
function renderProducts() {
  const grid = document.getElementById('prod-grid');
  if (!grid) return; // Only render on index page
  
  const loc = getActiveLocation();

  const availableVendors = VENDORS
    .filter(v => v.deliveryZones.includes(loc.neighbourhood))
    .map(v => v.name);

  let prods = PRODUCTS.filter(p => {
    if (!availableVendors.includes(p.vendor)) return false;
    if (currentCat !== 'All' && p.cat !== currentCat) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    if (verifiedOnly && !p.verified) return false;
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.vendor.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
    }
    return true;
  });

  if (currentSort === 'price-asc') prods.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price-desc') prods.sort((a, b) => b.price - a.price);
  else if (currentSort === 'rating') prods.sort((a, b) => b.rating - a.rating);

  const empty = document.getElementById('empty-state');
  const title = document.getElementById('prod-title');
  const count = document.getElementById('results-count');

  if (prods.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.classList.add('show');
    return;
  }
  if (empty) empty.classList.remove('show');

  const isFiltered = currentSearch || currentCat !== 'All';
  if (title) title.textContent = currentSearch
    ? `Results for "${currentSearch}"`
    : currentCat !== 'All'
    ? currentCat + ' products'
    : surpriseMode
    ? `Products delivering to ${loc.neighbourhood}`
    : 'Products for you';

  if (count) count.textContent = isFiltered
    ? `${prods.length} result${prods.length !== 1 ? 's' : ''} in ${loc.neighbourhood}`
    : '';

  grid.innerHTML = prods.map(p => `
    <div class="pcard" onclick="goToProduct('${p.name}', '${p.vendor}', ${p.price}, '${p.img}', ${p.source})">
      <div class="pimg" style="background:${p.bg}">${p.img}</div>
      <div class="pinfo">
        <div class="pname">${p.name}</div>
        <div class="pprice">${fmt(p.price)}</div>
        <div class="pvendor">
          <div class="pdot" style="background:${p.verified ? 'var(--green)' : 'var(--orange)'}"></div>
          ${p.vendor}${p.source ? ' · sources to order' : ''}
        </div>
        <div class="prating"><span class="star">★</span>${p.rating}</div>
      </div>
    </div>`).join('');
}

// ── GO TO PRODUCT PAGE ──
function goToProduct(name, vendor, price, img, isSource) {
  sessionStorage.setItem('vender_checkout_item', JSON.stringify({
    name, vendor, price, img,
    isSourceOnOrder: isSource
  }));
  if (surpriseMode && surpriseLocation) {
    sessionStorage.setItem('vender_shopping_for', JSON.stringify({
      mode: 'surprise',
      state: surpriseLocation.state,
      zone: surpriseLocation.zone,
      neighbourhood: surpriseLocation.neighbourhood
    }));
  } else {
    sessionStorage.removeItem('vender_shopping_for');
  }
  // Go to product page, NOT checkout
  window.location.href = 'product.html';
}

function render() { renderVendors(); renderProducts(); }

// ── LOAD VENDOR PRODUCTS ──
function loadVendorProducts() {
  // Get vendor products from localStorage
  const realProducts = getAllProducts(); // from vendor-data.js
  const realVendors = getAllVendors(); // from vendor-data.js

  if (realProducts.length === 0) {
    // No vendor products yet, use mock data
    return;
  }

  // Convert vendor products to VENDORS format
  const vendorMap = {};
  realProducts.forEach(prod => {
    if (!vendorMap[prod.vendorId]) {
      vendorMap[prod.vendorId] = {
        id: prod.vendorId,
        name: prod.vendorId.replace('V-', '').replace(/-/g, ' '),
        cat: prod.category,
        state: 'Lagos', // Default for now
        zone: 'Lagos Mainland',
        neighbourhood: 'Yaba',
        deliveryZones: ['Lagos Island','Victoria Island','Lekki Phase 1','Ajah','Ikoyi','Yaba','Surulere','Ikeja','Maryland','Oshodi','Mushin'],
        rating: prod.rating || 4.8,
        orders: prod.orders || 0,
        verified: true,
        source: false,
        bg: '#E6F1FB',
        tc: '#0C447C',
        desc: `Selling ${prod.category} products on Vender`,
        completion: 95
      };
    }
    // Update orders count
    vendorMap[prod.vendorId].orders += 1;
  });

  // Merge with existing vendors (real vendors take precedence)
  const mergedVendors = [];
  const processedIds = new Set();

  // Add real vendor products first
  Object.values(vendorMap).forEach(v => {
    mergedVendors.push(v);
    processedIds.add(v.id);
  });

  // Add mock vendors that don't conflict
  VENDORS.forEach(v => {
    if (!processedIds.has(v.id)) {
      mergedVendors.push(v);
    }
  });

  // Replace VENDORS array with merged data
  while (VENDORS.length) VENDORS.pop();
  VENDORS.push(...mergedVendors);

  // Convert vendor products to PRODUCTS format
  const mergedProducts = [];
  const processedProdIds = new Set();

  realProducts.forEach(prod => {
    if (prod.status === 'active') {
      mergedProducts.push({
        name: prod.name,
        price: prod.price,
        cat: prod.category,
        vendor: vendorMap[prod.vendorId]?.name || prod.vendorId,
        state: 'Lagos',
        img: prod.image || '📦',
        bg: '#EBF4FF',
        rating: prod.rating || 4.8,
        verified: true,
        source: false,
        id: prod.id,
        vendorId: prod.vendorId
      });
      processedProdIds.add(prod.id);
    }
  });

  // Add mock products that don't conflict
  PRODUCTS.forEach(p => {
    if (!processedProdIds.has(p.id)) {
      mergedProducts.push(p);
    }
  });

  // Replace PRODUCTS array with merged data
  while (PRODUCTS.length) PRODUCTS.pop();
  PRODUCTS.push(...mergedProducts);
}

// ── INIT ──
// Moved to end of file

document.addEventListener('click', e => {
  // Close rating menu
  if (!e.target.closest('.filter-dropdown')) {
    const rm = document.getElementById('rating-menu');
    const vtm = document.getElementById('vendor-type-menu');
    if (rm) rm.classList.remove('open');
    if (vtm) vtm.classList.remove('open');
  }
  // Close account menu
  const dropdown = document.querySelector('.account-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    const menu = document.getElementById('account-menu');
    if (menu) menu.classList.remove('open');
    const signinBtn = document.querySelector('.btn-signin');
    if (signinBtn) signinBtn.classList.remove('active');
  }
  // Close auth modal on overlay click
  const authOverlay = document.getElementById('auth-modal-overlay');
  if (authOverlay && e.target === authOverlay) {
    authOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const menu = document.getElementById('account-menu');
    if (menu) menu.classList.remove('open');
    const signinBtn = document.querySelector('.btn-signin');
    if (signinBtn) signinBtn.classList.remove('active');
  });
});

// Only run render on explore page (not on vendors page)
if (document.getElementById('prod-grid')) {
  updateLocLabel();
  loadVendorProducts(); // Load real vendor products on page init
  render();
}
