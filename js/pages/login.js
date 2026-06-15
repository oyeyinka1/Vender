let currentRole = 'buyer';
let loginMethod = 'password'; // 'password' or 'otp'

// ── ROLE SELECTION ──
function selectRole(role, el) {
  currentRole = role;
  document.querySelectorAll('.role-tab').forEach(tab => tab.classList.remove('active'));
  el.classList.add('active');
  
  // Update subtitle and toggle OTP button
  const sub = document.getElementById('login-sub');
  const otpBtn = document.getElementById('otp-btn');
  const divider = document.querySelector('.divider');
  
  if (role === 'buyer') {
    sub.textContent = 'Sign in to your buyer account and continue shopping';
    document.getElementById('signup-link').textContent = 'Sign up as buyer';
    otpBtn.style.display = 'none'; // Hide OTP for buyers
    divider.style.display = 'none';
  } else {
    sub.textContent = 'Sign in to your vendor dashboard and manage your store';
    document.getElementById('signup-link').textContent = 'Become a vendor';
    otpBtn.style.display = 'block'; // Show OTP for vendors
    divider.style.display = 'flex';
  }
}

// ── PASSWORD LOGIN ──
function handleSignIn() {
  const emailOrPhone = document.getElementById('email-input').value.trim();
  const password = document.getElementById('password-input').value.trim();
  let ok = true;

  // Validate email/phone
  if (!emailOrPhone) {
    document.getElementById('email-err').classList.add('show');
    ok = false;
  } else {
    // Simple email or phone validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,}$/;
    const isValidEmail = emailRegex.test(emailOrPhone);
    const isValidPhone = phoneRegex.test(emailOrPhone.replace(/\D/g, ''));
    
    if (!isValidEmail && !isValidPhone) {
      document.getElementById('email-err').classList.add('show');
      ok = false;
    } else {
      document.getElementById('email-err').classList.remove('show');
    }
  }

  // Validate password
  if (!password) {
    document.getElementById('password-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('password-err').classList.remove('show');
  }

  if (!ok) return;

  // For BUYER: Check against saved signup data
  if (currentRole === 'buyer') {
    // Extract phone from email/phone input
    let phoneToCheck = emailOrPhone.replace(/\D/g, '');
    if (phoneToCheck.length === 10) {
      phoneToCheck = phoneToCheck; // already without country code
    }
    
    const buyerKey = 'vender_buyer_' + phoneToCheck;
    const savedBuyer = localStorage.getItem(buyerKey);
    
    if (!savedBuyer) {
      // Also try with email
      let foundBuyer = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('vender_buyer_')) {
          const buyer = JSON.parse(localStorage.getItem(key));
          if (buyer.email === emailOrPhone) {
            foundBuyer = buyer;
            break;
          }
        }
      }
      
      if (!foundBuyer) {
        document.getElementById('email-err').classList.add('show');
        return;
      }
      
      // Check password
      if (foundBuyer.password !== password) {
        document.getElementById('password-err').classList.add('show');
        return;
      }
      
      // Success
      localStorage.setItem('vender_user', JSON.stringify({
        type: 'buyer',
        name: foundBuyer.name,
        email: foundBuyer.email,
        phone: foundBuyer.phone,
        loggedIn: true
      }));
      window.location.href = 'index.html';
    } else {
      const buyer = JSON.parse(savedBuyer);
      if (buyer.password !== password) {
        document.getElementById('password-err').classList.add('show');
        return;
      }
      
      // Success
      localStorage.setItem('vender_user', JSON.stringify({
        type: 'buyer',
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
        loggedIn: true
      }));
      window.location.href = 'index.html';
    }
  } else {
    // For VENDOR: Use demo credentials
    if (password !== 'password123') {
      document.getElementById('password-err').classList.add('show');
      return;
    }
    
    localStorage.setItem('vender_user', JSON.stringify({
      type: 'vendor',
      email: emailOrPhone,
      loggedIn: true
    }));
    window.location.href = 'vendor-dash.html';
  }
}

// ── PASSWORD VISIBILITY TOGGLE ──
function togglePassword() {
  const input = document.getElementById('password-input');
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  
  // Optional: change icon appearance
  const toggle = document.querySelector('.password-toggle');
  toggle.classList.toggle('visible', !isPassword);
}

// ── FORGOT PASSWORD ──
function showForgotPassword(e) {
  e.preventDefault();
  document.querySelector('.login-card').style.display = 'none';
  document.getElementById('forgot-section').style.display = 'block';
}

function sendResetLink() {
  const email = document.getElementById('forgot-email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    document.getElementById('forgot-email-err').classList.add('show');
    return;
  }

  document.getElementById('forgot-email-err').classList.remove('show');
  
  // Show success message
  document.getElementById('reset-email-display').textContent = email;
  document.getElementById('reset-sent').style.display = 'block';
  document.getElementById('forgot-email').style.display = 'none';
  
  // In real app, this would call your backend to send email
}

// ── OTP METHOD (Vendors only) ──
function showOTPMethod() {
  if (currentRole === 'buyer') {
    alert('Buyers sign in with phone/email and password. If you forgot your password, use the "Forgot password?" option.');
    return;
  }
  document.querySelector('.login-card').style.display = 'none';
  document.getElementById('otp-section').style.display = 'block';
  loginMethod = 'otp';
}

function sendOTPCode() {
  const phone = document.getElementById('otp-phone-input').value.trim();
  
  if (phone.length < 10) {
    document.getElementById('otp-phone-err').classList.add('show');
    return;
  }

  document.getElementById('otp-phone-err').classList.remove('show');
  document.getElementById('otp-phone-display').textContent = '+234' + phone;
  document.getElementById('otp-phone-input').style.display = 'none';
  
  document.getElementById('sending-otp').style.display = 'block';
  setTimeout(() => {
    document.getElementById('sending-otp').style.display = 'none';
    document.getElementById('otp-input-section').style.display = 'block';
    document.querySelectorAll('.otp-input')[0].focus();
  }, 1500);
}

function resendOTP() {
  document.querySelectorAll('.otp-input').forEach(i => i.value = '');
  document.querySelectorAll('.otp-input')[0].focus();
}

function otpMove(input, index) {
  const val = input.value.toString();
  if (val.length > 1) input.value = val[val.length - 1];
  const inputs = document.querySelectorAll('.otp-input');
  if (input.value && index < 5) inputs[index + 1].focus();
}

function verifyOTPCode() {
  const inputs = document.querySelectorAll('.otp-input');
  const code = Array.from(inputs).map(i => i.value).join('');
  const err = document.getElementById('otp-err');

  // Demo: accept 123456
  if (code !== '123456') {
    err.classList.add('show');
    return;
  }

  err.classList.remove('show');
  
  // Success
  if (currentRole === 'buyer') {
    localStorage.setItem('vender_user', JSON.stringify({
      type: 'buyer',
      phone: document.getElementById('otp-phone-input').value,
      loggedIn: true
    }));
    window.location.href = 'index.html';
  } else {
    localStorage.setItem('vender_user', JSON.stringify({
      type: 'vendor',
      phone: document.getElementById('otp-phone-input').value,
      loggedIn: true
    }));
    window.location.href = 'vendor-dash.html';
  }
}

// ── BACK BUTTONS ──
function backToPassword() {
  document.querySelector('.login-card').style.display = 'block';
  document.getElementById('otp-section').style.display = 'none';
  document.getElementById('forgot-section').style.display = 'none';
  
  // Reset OTP section
  document.getElementById('otp-phone-input').style.display = 'block';
  document.getElementById('otp-input-section').style.display = 'none';
  document.getElementById('sending-otp').style.display = 'none';
  document.getElementById('otp-phone-input').value = '';
  document.querySelectorAll('.otp-input').forEach(i => i.value = '');
  
  // Reset forgot section
  document.getElementById('forgot-email').style.display = 'block';
  document.getElementById('reset-sent').style.display = 'none';
  document.getElementById('forgot-email').value = '';
  
  loginMethod = 'password';
}

// ── SIGN UP NAVIGATION ──
function goToSignUp(e) {
  e.preventDefault();
  if (currentRole === 'buyer') {
    window.location.href = 'buyerSignUp.html';
  } else {
    window.location.href = 'BecomeVendor.html';
  }
}

// ── CHECK URL PARAM FOR ROLE ──
document.addEventListener('DOMContentLoaded', function() {
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  if (role === 'vendor') {
    const vendorTab = document.querySelectorAll('.role-tab')[1];
    selectRole('vendor', vendorTab);
  }
});
