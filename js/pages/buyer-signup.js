// buyerSignup.js — Vender buyer signup
// Depends on: locations.js (must load before this file)

let currentStep = 1;
let buyerData = {};

// ── NAVIGATION ──
function goStep(n) {
  document.getElementById('step-' + currentStep).classList.remove('active');
  currentStep = n;
  document.getElementById('step-' + n).classList.add('active');
  updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(n) {
  const total = 4;
  const pct = (n / total) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('step-counter').textContent =
    n <= total ? `Step ${n} of ${total}` : 'All done!';
  for (let i = 1; i <= total; i++) {
    const lbl = document.getElementById('pl-' + i);
    if (!lbl) continue;
    lbl.classList.remove('active', 'done');
    if (i < n) lbl.classList.add('done');
    else if (i === n) lbl.classList.add('active');
  }
}

// ── STEP 1: PHONE + OTP ──
function sendOTP() {
  const phone = document.getElementById('phone-input').value.trim();
  const err = document.getElementById('phone-err');
  if (phone.length < 10) { err.classList.add('show'); return; }
  err.classList.remove('show');
  document.getElementById('phone-display').textContent = '+234' + phone;
  document.getElementById('sending-otp').classList.add('show');
  setTimeout(() => {
    document.getElementById('sending-otp').classList.remove('show');
    document.getElementById('otp-section').classList.add('show');
    document.querySelectorAll('.otp-input')[0].focus();
  }, 1500);
}

function resendOTP() {
  document.querySelectorAll('.otp-input').forEach(i => i.value = '');
  document.getElementById('otp-err').classList.remove('show');
  document.querySelectorAll('.otp-input')[0].focus();
}

function otpMove(input, index) {
  if (input.value.length > 1) input.value = input.value.slice(-1);
  const inputs = document.querySelectorAll('.otp-input');
  if (input.value && index < 5) inputs[index + 1].focus();
}

function verifyOTP() {
  const inputs = document.querySelectorAll('.otp-input');
  const code = Array.from(inputs).map(i => i.value).join('');
  const err = document.getElementById('otp-err');
  if (code !== '123456') { err.classList.add('show'); return; }
  err.classList.remove('show');
  buyerData.phone = document.getElementById('phone-input').value.trim();
  goStep(2);
}

// ── STEP 2: NAME + EMAIL ──
function validateStep2() {
  const firstName = document.getElementById('first-name').value.trim();
  const lastName  = document.getElementById('last-name').value.trim();
  const email     = document.getElementById('email').value.trim();
  let ok = true;

  if (!firstName) { document.getElementById('firstname-err').classList.add('show'); ok = false; }
  else document.getElementById('firstname-err').classList.remove('show');

  if (!lastName) { document.getElementById('lastname-err').classList.add('show'); ok = false; }
  else document.getElementById('lastname-err').classList.remove('show');

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { document.getElementById('email-err').classList.add('show'); ok = false; }
    else document.getElementById('email-err').classList.remove('show');
  } else {
    document.getElementById('email-err').classList.remove('show');
  }

  if (!ok) return;
  buyerData.firstName = firstName;
  buyerData.lastName  = lastName;
  buyerData.fullName  = firstName + ' ' + lastName;
  buyerData.email     = email;
  document.getElementById('buyer-firstname').textContent = firstName;
  goStep(3);
}

// ── STEP 3: PASSWORD ──
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  btn.querySelector('.eye-open').style.display  = isPass ? 'none'  : 'block';
  btn.querySelector('.eye-closed').style.display = isPass ? 'block' : 'none';
}

function validateStep3() {
  const password = document.getElementById('password-input').value;
  const confirm  = document.getElementById('confirm-password').value;
  let ok = true;

  if (!password || password.length < 8) {
    document.getElementById('password-err').classList.add('show'); ok = false;
  } else {
    document.getElementById('password-err').classList.remove('show');
  }

  if (password !== confirm) {
    document.getElementById('confirm-err').classList.add('show'); ok = false;
  } else {
    document.getElementById('confirm-err').classList.remove('show');
  }

  if (!ok) return;
  buyerData.password = password;
  goStep(4);
}

// ── STEP 4: LOCATION ──
function loadBuyerZones() {
  const state = document.getElementById('buyer-state').value;
  const zoneSelect = document.getElementById('buyer-zone');
  const zoneField  = document.getElementById('zone-field');
  const hoodField  = document.getElementById('hood-field');

  zoneSelect.innerHTML = '<option value="">Select your zone</option>';
  document.getElementById('buyer-hood').innerHTML = '<option value="">Select your neighbourhood</option>';
  hoodField.style.display = 'none';
  clearLocErr();

  if (!state || !LOCATION_DATA[state]) { zoneField.style.display = 'none'; return; }

  Object.keys(LOCATION_DATA[state]).forEach(zone => {
    const opt = document.createElement('option');
    opt.value = zone; opt.textContent = zone;
    zoneSelect.appendChild(opt);
  });
  zoneField.style.display = 'block';
}

function loadBuyerNeighbourhoods() {
  const state = document.getElementById('buyer-state').value;
  const zone  = document.getElementById('buyer-zone').value;
  const hoodSelect = document.getElementById('buyer-hood');
  const hoodField  = document.getElementById('hood-field');

  hoodSelect.innerHTML = '<option value="">Select your neighbourhood</option>';
  clearLocErr();

  if (!state || !zone || !LOCATION_DATA[state] || !LOCATION_DATA[state][zone]) {
    hoodField.style.display = 'none'; return;
  }

  LOCATION_DATA[state][zone].forEach(hood => {
    const opt = document.createElement('option');
    opt.value = hood; opt.textContent = hood;
    hoodSelect.appendChild(opt);
  });
  hoodField.style.display = 'block';
}

function clearLocErr() {
  const err = document.getElementById('loc-err');
  err.textContent = '';
  err.classList.remove('show');
}

function validateStep4() {
  const state = document.getElementById('buyer-state').value;
  const zone  = document.getElementById('buyer-zone').value;
  const hood  = document.getElementById('buyer-hood').value;
  const err   = document.getElementById('loc-err');

  if (!state) { err.textContent = 'Please select your state'; err.classList.add('show'); return; }
  if (!zone)  { err.textContent = 'Please select your zone';  err.classList.add('show'); return; }
  if (!hood)  { err.textContent = 'Please select your neighbourhood'; err.classList.add('show'); return; }

  clearLocErr();
  buyerData.state        = state;
  buyerData.zone         = zone;
  buyerData.neighbourhood = hood;

  document.getElementById('location-display').textContent = hood + ', ' + state;

  const user = {
    type: 'buyer', name: buyerData.fullName,
    firstName: buyerData.firstName, phone: buyerData.phone,
    email: buyerData.email, state, zone, neighbourhood: hood
  };

  localStorage.setItem('vender_user',     JSON.stringify(user));
  localStorage.setItem('vender_location', JSON.stringify({ state, zone, neighbourhood: hood }));
  localStorage.setItem('vender_buyer_' + buyerData.phone, JSON.stringify({ ...user, password: buyerData.password }));

  goStep(5);
}

// ── PASSWORD STRENGTH ──
document.addEventListener('DOMContentLoaded', function () {
  const passInput = document.getElementById('password-input');
  if (!passInput) return;
  passInput.addEventListener('input', function () {
    const bar = document.getElementById('pass-strength');
    bar.className = 'password-strength';
    if (!this.value) return;
    const score = [/[A-Z]/.test(this.value), /[a-z]/.test(this.value),
                   /[0-9]/.test(this.value), this.value.length >= 8].filter(Boolean).length;
    if (score <= 2) bar.classList.add('strength-weak');
    else if (score === 3) bar.classList.add('strength-ok');
    else bar.classList.add('strength-strong');
  });
});