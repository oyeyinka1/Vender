# Vender — Nigerian Marketplace

A trusted vendor marketplace built with HTML, CSS, and JavaScript.

## Project Structure

```
vender/
├── index.html              # Main entry point
├── pages/                  # Page templates
│   ├── become-vendor.html
│   ├── buyer-signup.html
│   ├── checkout.html
│   ├── login.html
│   ├── order-tracking.html
│   └── ...
├── css/                    # Stylesheets
│   ├── styles.css
│   ├── checkout.css
│   └── ...
├── js/                     # JavaScript modules
│   ├── main.js             # Main entry script
│   ├── pages/              # Page-specific logic
│   ├── utils/              # Shared utilities
│   ├── auth/               # Authentication logic
│   ├── payment/            # Payment processing
│   └── data/               # Data management
├── data/                   # Static data files
│   └── locations.js
├── config.example.js       # Configuration template
└── .gitignore              # Git ignore rules
```

## Setup Instructions

### 1. Secure API Keys

**NEVER commit API keys to git!**

1. Copy the config template:
   ```bash
   cp config.example.js config.js
   ```

2. Edit `config.js` and add your actual API keys:
   ```javascript
   const PAYSTACK_CONFIG = {
     publicKey: 'pk_live_YOUR_ACTUAL_KEY',
   };
   ```

3. Ensure `.gitignore` includes `config.js` (already added)

### 2. Load Configuration in HTML

Include `config.js` **before** your page scripts:

```html
<script src="config.js"></script>
<script src="js/pages/checkout.js"></script>
```

### 3. (Optional) Backend Integration

For production, use a backend API to serve the Paystack public key:

```javascript
async function loadPaystackKey() {
  const response = await fetch('/api/paystack-key');
  const data = await response.json();
  PAYSTACK_PUBLIC_KEY = data.publicKey;
}
```

## Development

### Local Testing

1. Open `index.html` in your browser, or
2. Use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (with http-server package)
   npx http-server
   ```

Visit: `http://localhost:8000`

## Security Best Practices

✅ **DO:**
- Store API keys in `config.js` (git-ignored)
- Load public keys from backend in production
- Use environment variables for deployment
- Validate all user inputs
- Use HTTPS in production

❌ **DON'T:**
- Commit `config.js` to git
- Hardcode secret keys in frontend code
- Store sensitive data in localStorage without encryption
- Use test keys in production

## Deployment

### GitHub Pages / Static Hosting

1. Ensure all paths are correct (already done)
2. Configure API endpoints for your domain
3. Deploy to your hosting provider

### With Backend Server

1. Create backend endpoints for:
   - Getting Paystack public key
   - Verifying payments
   - Managing vendor/order data
2. Update `API_CONFIG` in `config.js`
3. Deploy both frontend and backend

## File Naming Convention

- **HTML files**: `kebab-case.html` (e.g., `checkout.html`)
- **CSS files**: `kebab-case.css` (e.g., `checkout.css`)
- **JS files**: `kebab-case.js` (e.g., `checkout.js`)
- **Folders**: `lowercase` (e.g., `pages/`, `js/utils/`)

## Contributing

When adding new pages or features:

1. Create page template in `pages/`
2. Create stylesheet in `css/` with matching name
3. Create logic file in `js/pages/` with matching name
4. Link them in the HTML file
5. Update this README if needed

## License

© 2026 Vender. All rights reserved.
