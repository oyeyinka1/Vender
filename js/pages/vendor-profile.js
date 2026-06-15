const VENDOR_REVIEWS = {
  TG: [
    { reviewer: 'Ada I.', text: 'TechGuru Lagos delivered exactly what I ordered and the phone came sealed with warranty. Fast delivery and excellent customer service.', rating: 5, date: 'May 2026' },
    { reviewer: 'Samuel O.', text: 'They replied quickly and helped me choose the right model. No surprises, just smooth payment and fast escrow release.', rating: 5, date: 'April 2026' },
    { reviewer: 'Chinwe N.', text: 'I trusted the verified badge and they did not disappoint. The unit was original, and delivery was right on time.', rating: 5, date: 'March 2026' }
  ],
  CK: [
    { reviewer: 'Tomi E.', text: 'Beautiful Ankara pieces with quick tailoring. The seller answered my questions immediately and delivered as promised.', rating: 5, date: 'May 2026' },
    { reviewer: 'Nkechi U.', text: 'Quality is premium and the fit was perfect. The site escrow made me feel safe before paying.', rating: 5, date: 'April 2026' }
  ],
  FP: [
    { reviewer: 'Aisha K.', text: 'Fresh groceries delivered within hours. Excellent communication and the pricing was fair for fast delivery.', rating: 4.8, date: 'May 2026' },
    { reviewer: 'Bayo S.', text: 'FreshPick Foods made bulk ordering easy. Everything arrived in good condition and the payment held safely.', rating: 4.7, date: 'April 2026' }
  ]
};

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function getVendorDetails(id) {
  return VENDORS.find(v => v.id === id);
}

function buildStars(value) {
  return '<span class="review-stars">' + Array.from({ length: Math.round(value) }, () => '★').join('') + '</span>';
}

function renderVendorProfile() {
  const vendorId = getQueryParam('id');
  const vendor = getVendorDetails(vendorId);
  const nameEl = document.getElementById('vendor-name');
  const descEl = document.getElementById('vendor-desc');
  const categoryPill = document.getElementById('vendor-category-pill');
  const metricsEl = document.getElementById('vendor-metrics');
  const featuresEl = document.getElementById('vendor-features');
  const reviewsEl = document.getElementById('vendor-reviews');
  const productsEl = document.getElementById('vendor-products');
  const locationText = document.getElementById('vendor-location-text');
  const browseBtn = document.getElementById('vendor-browse-btn');
  const backBtn = document.getElementById('vendor-back-btn');

  if (!vendor) {
    nameEl.textContent = 'Vendor not found';
    descEl.textContent = 'The vendor you are looking for does not exist or has been removed.';
    categoryPill.textContent = '';
    metricsEl.innerHTML = '';
    featuresEl.innerHTML = '';
    reviewsEl.innerHTML = '';
    productsEl.innerHTML = '';
    browseBtn.style.display = 'none';
    locationText.textContent = '';
    return;
  }

  nameEl.textContent = vendor.name;
  descEl.textContent = vendor.desc;
  categoryPill.textContent = vendor.cat;
  locationText.textContent = `Delivers to: ${vendor.deliveryZones.join(', ')}`;
  browseBtn.onclick = () => window.location.href = `index.html?search=${encodeURIComponent(vendor.name)}`;
  backBtn.onclick = () => window.location.href = 'vendors.html';

  const trustBadge = vendor.verified ? '✓ Verified vendor' : 'Unverified vendor';
  const responseTime = vendor.source ? '24-48 hrs' : '6 hrs';

  metricsEl.innerHTML = `
    <div class="vendor-stat-card">
      <div class="vendor-stat-num">${vendor.rating}★</div>
      <div class="vendor-stat-label">Average rating</div>
    </div>
    <div class="vendor-stat-card">
      <div class="vendor-stat-num">${vendor.orders}</div>
      <div class="vendor-stat-label">Orders completed</div>
    </div>
    <div class="vendor-stat-card">
      <div class="vendor-stat-num">${vendor.completion}%</div>
      <div class="vendor-stat-label">On-time delivery</div>
    </div>
  `;

  featuresEl.innerHTML = `
    <div class="vendor-feature-item">
      <strong>${trustBadge}</strong>
      All buyers pay into escrow and the vendor receives funds only after delivery confirmation.
    </div>
    <div class="vendor-feature-item">
      <strong>Delivery zones</strong>
      ${vendor.deliveryZones.join(', ')}
    </div>
    <div class="vendor-feature-item">
      <strong>Response time</strong>
      ${responseTime} average seller reply.
    </div>
    <div class="vendor-feature-item">
      <strong>Safe buying guarantee</strong>
      If the vendor does not deliver within 48 hours, your payment is eligible for a full refund.
    </div>
  `;

  // RENDER VENDOR OPERATIONS
  const operationsEl = document.getElementById('vendor-operations');
  const operations = [
    {
      id: 'stock',
      name: 'Has stock available',
      icon: '📦',
      desc: 'Items are in stock and ready to ship immediately',
      active: vendor.operationMode === 'stock'
    },
    {
      id: 'source',
      name: 'Sources on order',
      icon: '🔍',
      desc: 'Fetches items from suppliers based on your specific order',
      active: vendor.operationMode === 'source'
    },
    {
      id: 'custom',
      name: 'Custom made',
      icon: '✨',
      desc: 'Creates custom items based on your specifications and preferences',
      active: vendor.operationMode === 'custom'
    }
  ];

  operationsEl.innerHTML = operations.map((op, idx) => `
    <div class="vendor-operation-card ${op.active ? 'active' : 'inactive'}">
      <div class="op-icon">${op.icon}</div>
      <div class="op-content">
        <h3>${op.name}</h3>
        <p>${op.desc}</p>
      </div>
      <div class="op-badge ${op.active ? 'op-active' : 'op-inactive'}">
        ${op.active ? '✓ Active' : '—'}
      </div>
    </div>
  `).join('');

  const reviews = VENDOR_REVIEWS[vendor.id] || [
    { reviewer: 'Amaka O.', text: 'Very responsive and reliable. My order arrived exactly as described.', rating: 4.8, date: 'May 2026' },
    { reviewer: 'Ife T.', text: 'Good communication and fast delivery. I felt safe paying with escrow.', rating: 4.7, date: 'April 2026' }
  ];

  reviewsEl.innerHTML = reviews.map(review => `
    <div class="review-card">
      <div class="review-meta">
        <strong>${review.reviewer}</strong>
        ${buildStars(review.rating)}
      </div>
      <p>“${review.text}”</p>
      <div class="review-meta"><span>${review.date}</span></div>
    </div>
  `).join('');

  const vendorProducts = PRODUCTS.filter(p => p.vendor === vendor.name).slice(0, 6);
  productsEl.innerHTML = vendorProducts.length > 0
    ? vendorProducts.map(product => `
      <div class="product-card">
        <div class="product-card-emoji">${product.img}</div>
        <h3>${product.name}</h3>
        <div class="product-meta"><span class="price">₦${product.price.toLocaleString()}</span><span>${product.rating}★</span></div>
        <div class="product-meta"><span>${product.cat}</span><span>${product.state}</span></div>
      </div>
    `).join('')
    : `<div class="product-card"><p>No featured products are available for this vendor yet.</p></div>`;
}

window.addEventListener('DOMContentLoaded', renderVendorProfile);