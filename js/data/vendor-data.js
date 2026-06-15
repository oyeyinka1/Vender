// vendor-data.js — Shared vendor and product data integration

/**
 * Get all registered vendors from localStorage
 */
function getAllVendors() {
  const allProducts = JSON.parse(localStorage.getItem('vender_vendor_products') || '[]');
  const vendorIds = [...new Set(allProducts.map(p => p.vendorId))];
  
  // For each vendorId, try to find vendor data
  return vendorIds.map(vendorId => {
    // Vendor data is stored when they register in localStorage as vender_vendor
    // But that gets overwritten, so we need to get it from products metadata
    return {
      id: vendorId,
      name: vendorId.replace('V-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      verified: true,
      rating: 4.8
    };
  });
}

/**
 * Get all products from all vendors
 */
function getAllProducts() {
  return JSON.parse(localStorage.getItem('vender_vendor_products') || '[]');
}

/**
 * Get products by category
 */
function getProductsByCategory(category) {
  const allProducts = getAllProducts();
  return allProducts.filter(p => p.category === category && p.status === 'active');
}

/**
 * Get products by vendor ID
 */
function getProductsByVendor(vendorId) {
  const allProducts = getAllProducts();
  return allProducts.filter(p => p.vendorId === vendorId && p.status === 'active');
}

/**
 * Get single product by ID
 */
function getProductById(productId) {
  const allProducts = getAllProducts();
  return allProducts.find(p => p.id === productId);
}

/**
 * Get vendor info by ID (construct from product data)
 */
function getVendorById(vendorId) {
  const vendorProducts = getProductsByVendor(vendorId);
  if (vendorProducts.length === 0) return null;

  // Count total orders across all products
  const totalOrders = vendorProducts.reduce((sum, p) => sum + (p.orders || 0), 0);

  return {
    id: vendorId,
    name: vendorId.replace('V-', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    category: vendorProducts[0]?.category || 'General',
    verified: true,
    rating: vendorProducts[0]?.rating || 4.8,
    orders: totalOrders,
    productCount: vendorProducts.length
  };
}

/**
 * Check if we have vendor products (used to show mock or real data)
 */
function hasVendorProducts() {
  const products = getAllProducts();
  return products.length > 0;
}

/**
 * Get mock product (fallback when no vendor products)
 */
function getMockProductsByCategory(category) {
  const mockData = {
    'Electronics': [
      { id: 'MOCK-E1', name: 'Samsung Galaxy A53', vendor: 'TechHub', category: 'Electronics', price: 189000, img: '📱', rating: 4.9, orders: 1200, verified: true },
      { id: 'MOCK-E2', name: 'Wireless Headphones', vendor: 'AudioPro', category: 'Electronics', price: 45000, img: '🎧', rating: 4.7, orders: 890, verified: true }
    ],
    'Fashion': [
      { id: 'MOCK-F1', name: 'Premium Cotton Shirt', vendor: 'StyleHub', category: 'Fashion', price: 12500, img: '👔', rating: 4.8, orders: 2100, verified: true },
      { id: 'MOCK-F2', name: 'Classic Blue Jeans', vendor: 'DenimCo', category: 'Fashion', price: 28000, img: '👖', rating: 4.6, orders: 1500, verified: true }
    ],
    'Food': [
      { id: 'MOCK-FO1', name: 'Fresh Tomatoes - 5kg', vendor: 'FreshPick', category: 'Food', price: 3200, img: '🍅', rating: 4.9, orders: 3200, verified: true },
      { id: 'MOCK-FO2', name: 'Organic Rice - 10kg', vendor: 'GrainCo', category: 'Food', price: 8500, img: '🍚', rating: 4.7, orders: 1900, verified: true }
    ],
    'Phones': [
      { id: 'MOCK-P1', name: 'iPhone 13 Pro', vendor: 'AppleStore', category: 'Phones', price: 550000, img: '📲', rating: 4.9, orders: 800, verified: true },
      { id: 'MOCK-P2', name: 'OnePlus 10 Pro', vendor: 'TechHub', category: 'Phones', price: 380000, img: '📱', rating: 4.8, orders: 620, verified: true }
    ],
    'Beauty': [
      { id: 'MOCK-B1', name: 'Luxury Face Cream', vendor: 'BeautyMax', category: 'Beauty', price: 18000, img: '💄', rating: 4.7, orders: 1400, verified: true },
      { id: 'MOCK-B2', name: 'Moisturizing Lotion', vendor: 'SkinCare+', category: 'Beauty', price: 12000, img: '💅', rating: 4.6, orders: 980, verified: true }
    ],
    'Home': [
      { id: 'MOCK-H1', name: 'LED Ceiling Light', vendor: 'HomeLights', category: 'Home', price: 22000, img: '💡', rating: 4.8, orders: 1100, verified: true },
      { id: 'MOCK-H2', name: 'Smart Door Lock', vendor: 'SecureHome', category: 'Home', price: 89000, img: '🔒', rating: 4.9, orders: 750, verified: true }
    ]
  };

  return mockData[category] || [];
}
