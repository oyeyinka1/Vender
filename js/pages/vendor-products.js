// vendor-products.js — Vendor product management

// ── PRODUCT MANAGER ──
class Product {
  constructor(data) {
    this.id = data.id || 'PROD-' + Date.now();
    this.vendorId = data.vendorId;
    this.name = data.name;
    this.category = data.category;
    this.price = Number(data.price);
    this.description = data.description;
    this.image = data.image; // base64 or emoji
    this.status = data.status || 'active'; // active or draft
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.orders = data.orders || 0;
    this.rating = data.rating || 0;
  }

  toJSON() {
    return {
      id: this.id,
      vendorId: this.vendorId,
      name: this.name,
      category: this.category,
      price: this.price,
      description: this.description,
      image: this.image,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      orders: this.orders,
      rating: this.rating
    };
  }
}

class ProductManager {
  constructor() {
    this.storageKey = 'vender_vendor_products';
  }

  createProduct(vendorId, productData) {
    const product = new Product({
      ...productData,
      vendorId: vendorId
    });

    const products = this.getVendorProducts(vendorId);
    products.push(product.toJSON());
    this.saveProducts(products);

    return product;
  }

  getVendorProducts(vendorId) {
    const allProducts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return allProducts.filter(p => p.vendorId === vendorId);
  }

  getProduct(productId) {
    const allProducts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return allProducts.find(p => p.id === productId);
  }

  updateProduct(productId, updates) {
    const allProducts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const index = allProducts.findIndex(p => p.id === productId);

    if (index === -1) return null;

    allProducts[index] = {
      ...allProducts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveProducts(allProducts);
    return allProducts[index];
  }

  deleteProduct(productId) {
    const allProducts = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const filtered = allProducts.filter(p => p.id !== productId);
    this.saveProducts(filtered);
  }

  saveProducts(products) {
    localStorage.setItem(this.storageKey, JSON.stringify(products));
  }
}

// ── GLOBAL STATE ──
const productManager = new ProductManager();
let currentVendor = null;
let currentTab = 'active';
let editingProductId = null;
let deletingProductId = null;
let selectedImage = null;

// ── INIT ──
document.addEventListener('DOMContentLoaded', function() {
  initProductsPage();
});

function initProductsPage() {
  // Load vendor from session
  const vendorSession = sessionStorage.getItem('vender_vendor');
  if (!vendorSession) {
    window.location.href = 'vendor-orders.html';
    return;
  }

  currentVendor = JSON.parse(vendorSession);
  loadProducts();
  renderProducts();

  // Auto-refresh every 5 seconds
  setInterval(() => {
    loadProducts();
    renderProducts();
  }, 5000);
}

let vendorProducts = [];

function loadProducts() {
  vendorProducts = productManager.getVendorProducts(currentVendor.id);
}

function renderProducts() {
  const filtered = filterProducts();
  const tableBody = document.getElementById('vp-table-body');

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <div style="padding: 60px 20px; text-align: center; color: var(--text-2);">
        <div style="font-size: 48px; margin-bottom: 16px;">📦</div>
        <div class="vp-empty-title">No products yet</div>
        <p style="margin-top: 8px;">
          ${currentTab === 'all' ? 
            'You haven\'t added any products yet.' :
            `No ${currentTab} products yet.`}
        </p>
      </div>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(product => `
    <div class="vp-table-row">
      <div class="vp-product-item">
        <div class="vp-product-img">
          ${product.image ? (product.image.startsWith('data:') ? `<img src="${product.image}">` : product.image) : '📦'}
        </div>
        <div class="vp-product-info">
          <div class="vp-product-name">${product.name}</div>
          <div class="vp-product-id">${product.id}</div>
        </div>
      </div>
      <div>
        <div class="vp-price">${formatCurrency(product.price)}</div>
      </div>
      <div>
        <div style="font-size: 13px; color: var(--text-2); font-weight: 500;">
          ${product.category}
        </div>
      </div>
      <div>
        <span class="vp-status ${product.status === 'active' ? 'active' : 'draft'}">
          ${product.status === 'active' ? '✓ Active' : '○ Draft'}
        </span>
      </div>
      <div class="vp-actions">
        <button class="vp-action-btn" onclick="openEditProductModal('${product.id}')">Edit</button>
        <button class="vp-action-btn delete" onclick="openDeleteModal('${product.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function filterProducts() {
  if (currentTab === 'all') {
    return vendorProducts;
  }
  return vendorProducts.filter(p => p.status === currentTab);
}

function switchTab(tab) {
  currentTab = tab;

  // Update active tab styling
  document.querySelectorAll('.vp-tab').forEach(el => {
    el.classList.remove('active');
  });
  event.target.classList.add('active');

  renderProducts();
}

// ── MODAL MANAGEMENT ──
function openAddProductModal() {
  editingProductId = null;
  selectedImage = null;
  clearProductForm();
  document.getElementById('modal-title').textContent = 'Add Product';
  document.getElementById('product-modal').classList.add('open');
}

function openEditProductModal(productId) {
  editingProductId = productId;
  const product = productManager.getProduct(productId);

  if (!product) {
    alert('Product not found');
    return;
  }

  // Populate form
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-description').value = product.description;
  
  selectedImage = product.image;
  if (selectedImage && selectedImage.startsWith('data:')) {
    showImagePreview(selectedImage);
  }

  document.getElementById('modal-title').textContent = 'Edit Product';
  document.getElementById('product-modal').classList.add('open');
}

function closeProductModal() {
  document.getElementById('product-modal').classList.remove('open');
  editingProductId = null;
  selectedImage = null;
  clearProductForm();
}

function clearProductForm() {
  document.getElementById('product-name').value = '';
  document.getElementById('product-category').value = '';
  document.getElementById('product-price').value = '';
  document.getElementById('product-description').value = '';
  document.getElementById('product-photo').value = '';
  document.getElementById('photo-preview-container').innerHTML = '';
  
  document.querySelectorAll('.vp-form-error').forEach(el => {
    el.classList.remove('show');
  });
}

// ── FORM VALIDATION & SAVE ──
function validateProductForm() {
  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value;
  const price = document.getElementById('product-price').value;
  const description = document.getElementById('product-description').value.trim();

  let ok = true;

  if (!name) {
    document.getElementById('name-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('name-err').classList.remove('show');
  }

  if (!category) {
    document.getElementById('category-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('category-err').classList.remove('show');
  }

  if (!price || price <= 0) {
    document.getElementById('price-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('price-err').classList.remove('show');
  }

  if (!description || description.length < 10) {
    document.getElementById('desc-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('desc-err').classList.remove('show');
  }

  return ok;
}

function saveProduct() {
  if (!validateProductForm()) return;

  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value;
  const price = document.getElementById('product-price').value;
  const description = document.getElementById('product-description').value.trim();

  const productData = {
    name,
    category,
    price: Number(price),
    description,
    image: selectedImage || '📦',
    status: 'active'
  };

  if (editingProductId) {
    // Update existing
    productManager.updateProduct(editingProductId, productData);
    showNotification('Product updated successfully');
  } else {
    // Create new
    productManager.createProduct(currentVendor.id, productData);
    showNotification('Product added successfully');
  }

  loadProducts();
  renderProducts();
  closeProductModal();
}

// ── IMAGE UPLOAD ──
document.addEventListener('DOMContentLoaded', function() {
  const photoInput = document.getElementById('product-photo');
  if (photoInput) {
    photoInput.addEventListener('change', handlePhotoUpload);
  }
});

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    selectedImage = e.target.result;
    showImagePreview(selectedImage);
  };
  reader.readAsDataURL(file);
}

function showImagePreview(src) {
  const container = document.getElementById('photo-preview-container');
  container.innerHTML = `
    <div class="vp-photo-preview">
      <img src="${src}">
      <button class="vp-photo-remove" onclick="removeImage()">×</button>
    </div>
  `;
}

function removeImage() {
  selectedImage = null;
  document.getElementById('product-photo').value = '';
  document.getElementById('photo-preview-container').innerHTML = '';
}

// ── DELETE ──
function openDeleteModal(productId) {
  deletingProductId = productId;
  document.getElementById('delete-modal').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.remove('open');
  deletingProductId = null;
}

function confirmDelete() {
  if (deletingProductId) {
    productManager.deleteProduct(deletingProductId);
    loadProducts();
    renderProducts();
    closeDeleteModal();
    showNotification('Product deleted');
  }
}

// ── UTILS ──
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
