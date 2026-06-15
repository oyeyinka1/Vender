// product.js — Vender product detail page
// Reads product from sessionStorage, handles all 3 vendor modes
console.log('product.js is loading...');

// ── VENDOR DATA ──
// Note: VENDORS and PRODUCTS are already defined in shared-data.js
// We just use them here instead of redefining


// ── STATE ──
let currentProduct = null;
let currentVendor = null;
let cart = JSON.parse(localStorage.getItem('vender_cart') || '[]');

// ── INIT ──
window.initializeProduct = function() {
  try {
    // Load vendor products from localStorage (via vendor-data.js)
    if (typeof getAllProducts === 'function') {
      const realProducts = getAllProducts(); // from vendor-data.js
      if (realProducts.length > 0) {
        // Update PRODUCTS with real vendor products
        realProducts.forEach(prod => {
          if (prod.status === 'active') {
            // Check if not already in PRODUCTS
            if (!PRODUCTS.find(p => p.name === prod.name)) {
              PRODUCTS.push({
                name: prod.name,
                price: prod.price,
                cat: prod.category,
                vendor: prod.vendorId.replace('V-', ''),
                state: 'Lagos',
                img: prod.image || '📦',
                bg: '#EBF4FF',
                rating: prod.rating || 4.8,
                verified: true,
                source: false,
                custom: false,
                desc: prod.description,
                vendorId: prod.vendorId,
                productId: prod.id
              });
            }
          }
        });
      }
    }
    
    loadProduct();
    updateCartCount();
  } catch(e) {
    console.error('Error initializing product:', e);
  }
};

document.addEventListener('DOMContentLoaded', window.initializeProduct);

// ── LOAD PRODUCT ──
function loadProduct() {
  // Try sessionStorage first (set when clicking from home page)
  const saved = sessionStorage.getItem('vender_checkout_item');
  if (saved) {
    const item = JSON.parse(saved);
    // Use the item from sessionStorage directly - it has all the info we need
    currentProduct = {
      name: item.name,
      price: item.price,
      vendor: item.vendor,
      img: item.img,
      source: item.isSourceOnOrder,
      cat: 'General', // Default category
      bg: '#EBF4FF', // Default background
      rating: 4.5, // Default rating
      verified: true,
      custom: false,
      desc: `${item.name} from ${item.vendor}` // Default description
    };
    
    // Try to enhance with full product data if available in PRODUCTS
    const fullProduct = PRODUCTS.find(p => p.name === item.name);
    if (fullProduct) {
      currentProduct = { ...fullProduct, ...item };
    }
  }

  // Fallback — use first product if nothing in sessionStorage
  if (!currentProduct) {
    currentProduct = PRODUCTS.length > 0 ? PRODUCTS[0] : {name: 'Product', price: 0, vendor: 'Unknown', img: '📦', cat: 'General', desc: ''};
  }

  // Find the vendor
  currentVendor = VENDORS.find(v => v.name === currentProduct.vendor);

  // Render everything
  renderProduct();
  renderVendorCard();
  renderModeBanner();
  renderTimeline();
  renderRelated();
  updateBreadcrumb();
}

// ── RENDER PRODUCT ──
function renderProduct() {
  const p = currentProduct;

  document.title = p.name + ' — Vender';
  document.getElementById('p-name').textContent = p.name;
  document.getElementById('p-price').textContent = fmt(p.price);
  document.getElementById('btn-price').textContent = fmt(p.price);
  document.getElementById('p-cat-tag').textContent = p.cat;
  document.getElementById('p-desc').textContent = p.desc || 'No description available.';
  document.getElementById('bc-product').textContent = p.name;
  document.getElementById('bc-category').textContent = p.cat;
  document.getElementById('more-cat-title').textContent = 'More in ' + p.cat;

  // Image
  const imgMain = document.getElementById('p-img-main');
  imgMain.textContent = p.img || '📦';
  imgMain.style.background = p.bg || 'var(--bg)';

  // Thumbs
  document.querySelectorAll('.p-thumb').forEach(t => t.textContent = p.img || '📦');

  // Stars
  renderStars(p.rating);
  document.getElementById('p-rating-num').textContent = p.rating;
  document.getElementById('p-review-count').textContent = `(${currentVendor ? currentVendor.orders : 0} orders)`;

  // Stock status
  const stockEl = document.getElementById('p-stock');
  if (p.source) {
    stockEl.innerHTML = '<div class="stock-dot" style="background:var(--orange)"></div><span>Sources on order</span>';
  } else if (p.custom) {
    stockEl.innerHTML = '<div class="stock-dot" style="background:var(--purple)"></div><span>Made to order</span>';
  } else {
    stockEl.innerHTML = '<div class="stock-dot"></div><span>In stock</span>';
  }

  // Show custom form for custom products
  if (p.custom || (currentVendor && currentVendor.custom)) {
    document.getElementById('custom-form').style.display = 'block';
  }
}

// ── RENDER STARS ──
function renderStars(rating) {
  const container = document.getElementById('p-stars');
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += '<span class="p-star filled">★</span>';
    } else {
      html += '<span class="p-star empty">★</span>';
    }
  }
  container.innerHTML = html;
}

// ── RENDER VENDOR CARD ──
function renderVendorCard() {
  if (!currentVendor) return;
  const v = currentVendor;

  document.getElementById('vc-avatar').textContent = v.id;
  document.getElementById('vc-avatar').style.background = v.bg;
  document.getElementById('vc-avatar').style.color = v.tc;
  document.getElementById('vc-name').textContent = v.name;
  document.getElementById('vc-meta').textContent = v.cat + ' · ' + v.zone;

  // Badges
  let badges = '';
  if (v.verified) badges += '<span class="badge badge-v">✓ Verified</span>';
  if (v.source) badges += '<span class="badge badge-s">Sources on order</span>';
  if (v.custom) badges += '<span class="badge badge-c">Custom orders</span>';
  if (!v.verified) badges += '<span class="badge badge-u">Unverified</span>';
  document.getElementById('vc-badges').innerHTML = badges;

  // Stats
  document.getElementById('vc-stats').innerHTML = `
    <div class="vc-stat-num">${v.rating}★</div>
    <div class="vc-stat-label">${v.orders} orders</div>
  `;

  // Delivery zones
  document.getElementById('di-zones').innerHTML =
    v.deliveryZones.map(z => `<div class="di-zone">${z}</div>`).join('');

  // Save vendor to sessionStorage for vendor.html
  sessionStorage.setItem('vender_current_vendor', JSON.stringify(v));
}

// ── RENDER MODE BANNER ──
function renderModeBanner() {
  const p = currentProduct;
  const v = currentVendor;
  const container = document.getElementById('mode-banner');

  if (p.source || (v && v.source)) {
    container.innerHTML = `
      <div class="mode-banner mode-source">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="8" cy="8" r="6"/><path d="M8 5v3.5L10 9.5"/>
        </svg>
        <div>
          <div class="mode-banner-title">Order on demand</div>
          <div class="mode-banner-text">This vendor sources this item after you pay. Your money is held in escrow — if they don't deliver within 48 hours, you get a full automatic refund. No questions asked.</div>
        </div>
      </div>`;

    // Update escrow text for source mode
    document.getElementById('escrow-text').textContent =
      'You pay → Vender holds your money → vendor confirms they found the item (6hrs) → vendor dispatches (48hrs) → you confirm delivery → vendor gets paid. Miss any deadline = automatic full refund.';

  } else if (p.custom || (v && v.custom)) {
    container.innerHTML = `
      <div class="mode-banner mode-custom">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 14l3-1 8-8-2-2-8 8-1 3zM11 3l2 2"/>
        </svg>
        <div>
          <div class="mode-banner-title">Made to order</div>
          <div class="mode-banner-text">This vendor creates or customises this item specifically for you. Describe what you want below. The vendor will confirm they can fulfil your request before any payment is taken.</div>
        </div>
      </div>`;

  } else {
    container.innerHTML = `
      <div class="mode-banner mode-stock">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M2 8l4 4 8-8"/>
        </svg>
        <div>
          <div class="mode-banner-title">In stock — ready to ship</div>
          <div class="mode-banner-text">This vendor has this item ready. Expect dispatch within 24 hours of your order.</div>
        </div>
      </div>`;
  }
}

// ── RENDER TIMELINE ── 
function renderTimeline() {
  const p = currentProduct;
  const v = currentVendor;
  const container = document.getElementById('timeline-section');

  if (p.source || (v && v.source)) {
    // Source on order timeline
    container.innerHTML = `
      <div class="tl-title">What happens after you pay</div>
      <div class="tl-steps">
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-green">1</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">You pay — money held in escrow</div>
            <div class="tl-sub">Your ${fmt(currentProduct.price)} goes to Vender escrow. Not to the vendor yet.</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-orange">2</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">Vendor confirms they found the item</div>
            <div class="tl-sub">They have 6 hours to confirm. If they can't find it, you're refunded immediately.</div>
            <div class="tl-deadline">⏱ 6 hour deadline</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-orange">3</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">Vendor dispatches your item</div>
            <div class="tl-sub">Must dispatch within 48 hours of confirmation. You get SMS updates.</div>
            <div class="tl-deadline">⏱ 48 hour deadline</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-green">4</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">You receive and confirm</div>
            <div class="tl-sub">Confirm the item arrived as described. Vendor gets paid instantly.</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-gray">5</div>
          </div>
          <div class="tl-content">
            <div class="tl-label">Rate your experience</div>
            <div class="tl-sub">Your review helps other buyers trust this vendor.</div>
          </div>
        </div>
      </div>`;

  } else if (p.custom || (v && v.custom)) {
    // Custom order timeline
    container.innerHTML = `
      <div class="tl-title">How custom orders work</div>
      <div class="tl-steps">
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-purple">1</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">Describe what you want</div>
            <div class="tl-sub">Fill in your requirements below. Be specific — measurements, colours, materials.</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-purple">2</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">Vendor confirms they can do it</div>
            <div class="tl-sub">Vendor reviews your request and confirms within 12 hours. No payment yet.</div>
            <div class="tl-deadline">⏱ 12 hour response</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-green">3</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">You pay — escrow holds your money</div>
            <div class="tl-sub">Only pay after vendor confirms. Your money is protected throughout.</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-purple">4</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">Vendor creates your item</div>
            <div class="tl-sub">Production time is set by the vendor per listing. You'll see updates in your orders.</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-green">5</div>
          </div>
          <div class="tl-content">
            <div class="tl-label">Delivery and confirmation</div>
            <div class="tl-sub">Confirm item matches your request. Vendor gets paid. Rate your experience.</div>
          </div>
        </div>
      </div>`;

  } else {
    // In stock timeline — simple
    container.innerHTML = `
      <div class="tl-title">What to expect</div>
      <div class="tl-steps">
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-green">1</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">You pay — escrow holds your money</div>
            <div class="tl-sub">Secure payment through Vender. Your money is protected.</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-green">2</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">Vendor packs and dispatches</div>
            <div class="tl-sub">Item is packed and dispatched within 24 hours of your order.</div>
            <div class="tl-deadline">⏱ Within 24 hours</div>
          </div>
        </div>
        <div class="tl-step">
          <div class="tl-left">
            <div class="tl-dot tl-dot-green">3</div>
            <div class="tl-line"></div>
          </div>
          <div class="tl-content">
            <div class="tl-label">You receive and confirm</div>
            <div class="tl-sub">Confirm it arrived as described. Vendor gets paid. Rate your experience.</div>
          </div>
        </div>
      </div>`;
  }
}

// ── RENDER RELATED ──
function renderRelated() {
  const p = currentProduct;
  const v = currentVendor;

  // More from this vendor
  const vendorProducts = PRODUCTS
    .filter(pr => pr.vendor === p.vendor && pr.name !== p.name)
    .slice(0, 4);

  const relatedGrid = document.getElementById('related-grid');
  if (vendorProducts.length === 0) {
    relatedGrid.innerHTML = '<p style="font-size:13px;color:var(--text-3);grid-column:1/-1">No other products from this vendor yet.</p>';
  } else {
    relatedGrid.innerHTML = vendorProducts.map(pr => buildRelatedCard(pr)).join('');
  }

  // More in category
  const catProducts = PRODUCTS
    .filter(pr => pr.cat === p.cat && pr.name !== p.name)
    .slice(0, 6);

  const catGrid = document.getElementById('more-cat-grid');
  if (catProducts.length === 0) {
    catGrid.innerHTML = '<p style="font-size:13px;color:var(--text-3);grid-column:1/-1">No other products in this category yet.</p>';
  } else {
    catGrid.innerHTML = catProducts.map(pr => buildRelatedCard(pr)).join('');
  }
}

function buildRelatedCard(pr) {
  return `
    <div class="r-card" onclick="loadNewProduct('${pr.name}')">
      <div class="r-img" style="background:${pr.bg}">${pr.img}</div>
      <div class="r-info">
        <div class="r-name">${pr.name}</div>
        <div class="r-price">${fmt(pr.price)}</div>
        <div class="r-vendor">${pr.vendor}</div>
      </div>
    </div>`;
}

function loadNewProduct(name) {
  const product = PRODUCTS.find(p => p.name === name);
  if (!product) return;
  sessionStorage.setItem('vender_checkout_item', JSON.stringify(product));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  currentProduct = null;
  currentVendor = null;
  loadProduct();
}

// ── BREADCRUMB ──
function updateBreadcrumb() {
  document.getElementById('bc-category').textContent = currentProduct.cat;
  document.getElementById('bc-product').textContent =
    currentProduct.name.length > 30
      ? currentProduct.name.slice(0, 30) + '...'
      : currentProduct.name;
}

// ── FORMAT ──
function fmt(n) { return '₦' + Number(n).toLocaleString(); }

// ── BUY NOW ──
function buyNow() {
  // Check if custom and requirements are filled
  const customForm = document.getElementById('custom-form');
  if (customForm.style.display !== 'none') {
    const req = document.getElementById('custom-requirements').value.trim();
    if (!req) {
      document.getElementById('custom-requirements').focus();
      document.getElementById('custom-requirements').style.borderColor = '#7C3AED';
      document.getElementById('custom-requirements').placeholder = 'Please describe what you want before proceeding...';
      return;
    }
    // Save custom requirements
    sessionStorage.setItem('vender_custom_requirements', req);
  }

  // Save item to sessionStorage for checkout
  sessionStorage.setItem('vender_checkout_item', JSON.stringify({
    name: currentProduct.name,
    vendor: currentProduct.vendor,
    vendorId: currentProduct.vendorId,
    productId: currentProduct.productId,
    price: currentProduct.price,
    img: currentProduct.img,
    isSourceOnOrder: currentProduct.source || (currentVendor && currentVendor.source),
    isCustomOrder: currentProduct.custom || (currentVendor && currentVendor.custom),
    cat: currentProduct.cat
  }));

  // Keep surprise mode if active
  const shoppingFor = sessionStorage.getItem('vender_shopping_for');

  window.location.href = 'checkout.html';
}

// ── ADD TO CART ──
function addToCart() {
  const btn = document.getElementById('btn-cart');
  const existing = cart.find(i => i.name === currentProduct.name);

  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({
      name: currentProduct.name,
      vendor: currentProduct.vendor,
      price: currentProduct.price,
      img: currentProduct.img,
      qty: 1
    });
  }

  localStorage.setItem('vender_cart', JSON.stringify(cart));
  updateCartCount();

  // Button feedback
  btn.textContent = '✓ Added to cart';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = 'Add to cart';
    btn.classList.remove('added');
  }, 2000);
}

// ── CART COUNT ──
function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + (i.qty || 1), 0);
  const badge = document.getElementById('cart-count');
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';
}

// ── EXPOSE FUNCTIONS TO GLOBAL SCOPE ──
// This ensures onclick handlers in HTML can access these functions
(function() {
  // Assign immediately
  window.buyNow = buyNow;
  window.addToCart = addToCart;
  window.loadNewProduct = loadNewProduct;
  window.updateCartCount = updateCartCount;
  
  // Also make sure they're available after DOM loads
  document.addEventListener('DOMContentLoaded', function() {
    if (typeof buyNow === 'function') window.buyNow = buyNow;
    if (typeof addToCart === 'function') window.addToCart = addToCart;
    if (typeof loadNewProduct === 'function') window.loadNewProduct = loadNewProduct;
    if (typeof updateCartCount === 'function') window.updateCartCount = updateCartCount;
  });
})();