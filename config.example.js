/**
 * Configuration Example
 * 
 * IMPORTANT: This is a template file. Do NOT commit your actual config.js to git.
 * 
 * Steps to use:
 * 1. Copy this file: cp config.example.js config.js
 * 2. Add config.js to your .gitignore (already done)
 * 3. Fill in your actual API keys and configuration values
 * 4. Load this config in your pages (see example below)
 */

// ── PAYSTACK CONFIGURATION ──
// Get your keys from: https://dashboard.paystack.com
const PAYSTACK_CONFIG = {
  publicKey: 'pk_live_your_production_public_key_here',
  // Secret key should ONLY be on your backend, never in frontend code
  environment: 'production', // 'test' or 'production'
};

// ── EXAMPLE: How to load config in your pages ──
/*
  In your HTML, load config BEFORE other scripts:
  
  <script src="config.js"></script>
  <script src="js/pages/checkout.js"></script>
  
  Then in checkout.js, use:
  const PAYSTACK_PUBLIC_KEY = PAYSTACK_CONFIG.publicKey;
*/

// ── BACKEND API ENDPOINTS ──
// If you have a backend server, configure endpoints here
const API_CONFIG = {
  baseUrl: 'https://api.yourdomain.com',
  paystack_key_endpoint: '/api/paystack-key', // Endpoint to get public key from backend
};

// ── OTHER CONFIGURATIONS ──
// Add your other configuration values here as needed
