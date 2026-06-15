let currentStep = 1;
let vendorData = {};

// ── NAVIGATION ──
function goStep(n) {
  document.getElementById('step-' + currentStep).classList.remove('active');
  currentStep = n;
  document.getElementById('step-' + n).classList.add('active');
  updateProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress(n) {
  const pct = (n / 6) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('step-counter').textContent = n < 6 ? `Step ${n} of 6` : 'All done!';
  for (let i = 1; i <= 6; i++) {
    const lbl = document.getElementById('pl-' + i);
    if (!lbl) continue;
    lbl.classList.remove('active', 'done');
    if (i < n) lbl.classList.add('done');
    else if (i === n) lbl.classList.add('active');
  }
}

// ── GO TO VENDOR DASHBOARD ──
function goToDashboard() {
  // Get the vendor from localStorage (saved during registration in step 5)
  const vendorData = JSON.parse(localStorage.getItem('vender_vendor') || '{}');
  
  if (!vendorData.storeName) {
    alert('Registration data not found. Please complete registration first.');
    return;
  }

  // Store vendor in sessionStorage for the dashboard to read
  const firstName = (vendorData.storeName || 'Vendor').split(' ')[0];
  
  sessionStorage.setItem('vender_vendor', JSON.stringify({
    id: 'V-' + vendorData.phone,
    name: vendorData.storeName,
    avatar: firstName.charAt(0).toUpperCase(),
    phone: vendorData.phone,
    category: vendorData.category,
    state: vendorData.state,
    zone: vendorData.zone,
    neighbourhood: vendorData.neighbourhood
  }));

  // Redirect to vendor orders dashboard
  window.location.href = 'vendor-orders.html';
}

// ── STEP 1: PHONE + OTP ──
function sendOTP() {
  const phone = document.getElementById('phone-input').value.trim();
  const err = document.getElementById('phone-err');
  if (phone.length < 10) {
    err.classList.add('show');
    return;
  }
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
  document.querySelectorAll('.otp-input')[0].focus();
}

function otpMove(input, index) {
  const val = input.value.toString();
  if (val.length > 1) input.value = val[val.length - 1];
  const inputs = document.querySelectorAll('.otp-input');
  if (input.value && index < 5) inputs[index + 1].focus();
}

function verifyOTP() {
  const inputs = document.querySelectorAll('.otp-input');
  const code = Array.from(inputs).map(i => i.value).join('');
  const err = document.getElementById('otp-err');

  if (code !== '123456') {
    err.classList.add('show');
    return;
  }

  err.classList.remove('show');
  vendorData.phone = document.getElementById('phone-input').value;

  // Show password section instead of going to step 2 immediately
  document.getElementById('password-section').classList.add('show');

  // Scroll to password section
  document.getElementById('password-section').scrollIntoView({ 
    behavior: 'smooth', block: 'center' 
  });
}

// ADD these new functions
function toggleVendorPass(inputId, btn) {
  const input = document.getElementById(inputId);
  input.type = input.type === 'password' ? 'text' : 'password';
}

function validateStep1Password() {
  const password = document.getElementById('vendor-password').value;
  const confirm  = document.getElementById('vendor-password-confirm').value;
  let ok = true;

  if (!password || password.length < 8) {
    document.getElementById('vendor-pass-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('vendor-pass-err').classList.remove('show');
  }

  if (password !== confirm) {
    document.getElementById('vendor-confirm-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('vendor-confirm-err').classList.remove('show');
  }

  if (!ok) return;

  // Save password and move to step 2
  vendorData.password = password;
  goStep(2);
}

// ── STEP 2: STORE INFO ──
document.addEventListener('DOMContentLoaded', function () {
  const descInput = document.getElementById('store-desc');
  if (descInput) {
    descInput.addEventListener('input', function () {
      document.getElementById('desc-count').textContent = this.value.length + ' / 200 characters';
    });
  }
});

function previewPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      const preview = document.getElementById('photo-preview');
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById('photo-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function validateStep2() {
  const name = document.getElementById('store-name').value.trim();
  const cat = document.getElementById('store-cat').value;
  const desc = document.getElementById('store-desc').value.trim();
  let ok = true;

  if (!name) {
    document.getElementById('store-name-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('store-name-err').classList.remove('show');
  }

  if (!cat) {
    document.getElementById('store-cat-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('store-cat-err').classList.remove('show');
  }

  if (desc.length < 30) {
    document.getElementById('store-desc-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('store-desc-err').classList.remove('show');
  }

  if (ok) {
    vendorData.storeName = name;
    vendorData.category = cat;
    vendorData.description = desc;
    goStep(3);
  }
}


// ── STEP 3: LOCATION ──



function loadZones() {
  const state = document.getElementById('vendor-state').value;
  const zoneField = document.getElementById('zone-field');
  const hoodField = document.getElementById('hood-field');
  const deliverySec = document.getElementById('delivery-zones-section');
  const zoneSelect = document.getElementById('vendor-zone');

  // Reset everything below state
  hoodField.style.display = 'none';
  deliverySec.style.display = 'none';
  document.getElementById('vendor-zone').innerHTML = '<option value="">Select your zone</option>';
  document.getElementById('vendor-hood').innerHTML = '<option value="">Select your neighbourhood</option>';
  document.getElementById('loc-err').classList.remove('show');
  document.getElementById('loc-err').textContent = '';

  if (!state || !LOCATION_DATA[state]) {
    zoneField.style.display = 'none';
    return;
  }

  // Populate zones for selected state
  const zones = Object.keys(LOCATION_DATA[state]);
  zones.forEach(z => {
    const option = document.createElement('option');
    option.value = z;
    option.textContent = z;
    zoneSelect.appendChild(option);
  });

  zoneField.style.display = 'block';
}

function loadNeighbourhoods() {
  const state = document.getElementById('vendor-state').value;
  const zone = document.getElementById('vendor-zone').value;
  const hoodField = document.getElementById('hood-field');
  const deliverySec = document.getElementById('delivery-zones-section');
  const hoodSelect = document.getElementById('vendor-hood');

  // Reset everything below zone
  hoodField.style.display = 'none';
  deliverySec.style.display = 'none';
  hoodSelect.innerHTML = '<option value="">Select your neighbourhood</option>';
  document.getElementById('loc-err').classList.remove('show');
  document.getElementById('loc-err').textContent = '';

  if (!state || !zone || !LOCATION_DATA[state] || !LOCATION_DATA[state][zone]) return;

  // Populate neighbourhoods for selected zone
  const hoods = LOCATION_DATA[state][zone];
  hoods.forEach(h => {
    const option = document.createElement('option');
    option.value = h;
    option.textContent = h;
    hoodSelect.appendChild(option);
  });

  hoodField.style.display = 'block';
}

function showDeliveryZones() {
  const state = document.getElementById('vendor-state').value;
  const zone = document.getElementById('vendor-zone').value;
  const hood = document.getElementById('vendor-hood').value;
  const deliverySec = document.getElementById('delivery-zones-section');
  const zonesWrap = document.getElementById('zones-wrap');

  // Only show delivery zones once neighbourhood is selected
  if (!hood) {
    deliverySec.style.display = 'none';
    return;
  }

  // Build checklist of ALL neighbourhoods in the state
  // grouped by zone — vendor ticks where they can deliver
  let html = `
    <div class="select-all-row">
      <span id="zones-selected-count">0 areas selected</span>
      <span class="select-all-btn" onclick="selectAllZones()">Select all</span>
    </div>
  `;

  Object.entries(LOCATION_DATA[state]).forEach(([zoneName, neighbourhoods]) => {
    html += `<div class="zone-group-title">${zoneName}</div>`;
    neighbourhoods.forEach(h => {
      // Pre-tick all neighbourhoods in the vendor's own zone
      const preChecked = zoneName === zone ? 'checked' : '';
      const safeId = 'zone-' + h.replace(/[\s()\/\.]/g, '-');
      html += `
        <div class="zone-check">
          <input 
            type="checkbox" 
            id="${safeId}" 
            value="${h}" 
            ${preChecked} 
            onchange="updateZoneCount()"
          >
          <label for="${safeId}">${h}</label>
        </div>
      `;
    });
  });

  zonesWrap.innerHTML = html;
  deliverySec.style.display = 'block';
  updateZoneCount();
}

function updateZoneCount() {
  const count = document.querySelectorAll('#zones-wrap input[type="checkbox"]:checked').length;
  const el = document.getElementById('zones-selected-count');
  if (el) el.textContent = count + ' area' + (count !== 1 ? 's' : '') + ' selected';
}

function selectAllZones() {
  const checks = document.querySelectorAll('#zones-wrap input[type="checkbox"]');
  const allChecked = Array.from(checks).every(c => c.checked);
  checks.forEach(c => c.checked = !allChecked);
  updateZoneCount();
}

function validateStep3() {
  const state = document.getElementById('vendor-state').value;
  const zone = document.getElementById('vendor-zone').value;
  const hood = document.getElementById('vendor-hood').value;
  const err = document.getElementById('loc-err');

  // Check state
  if (!state) {
    err.textContent = 'Please select your state';
    err.classList.add('show');
    return;
  }

  // Check zone
  if (!zone) {
    err.textContent = 'Please select your zone';
    err.classList.add('show');
    return;
  }

  // Check neighbourhood
  if (!hood) {
    err.textContent = 'Please select your neighbourhood';
    err.classList.add('show');
    return;
  }

  // Check at least one delivery zone is ticked
  const checked = document.querySelectorAll('#zones-wrap input[type="checkbox"]:checked');
  if (checked.length === 0) {
    err.textContent = 'Please select at least one area you deliver to';
    err.classList.add('show');
    return;
  }

  // All good — save and move on
  err.classList.remove('show');
  err.textContent = '';

  vendorData.state = state;
  vendorData.zone = zone;
  vendorData.neighbourhood = hood;
  vendorData.deliveryZones = Array.from(checked).map(c => c.value);

  goStep(4);
}

// ── STEP 4: OPERATION MODES ──
const selectedModes = new Set();
let stockFiles = [];
let customFiles = [];

function toggleMode(type) {
  const card = document.getElementById('op-' + type);
  const isSelected = selectedModes.has(type);
  if (isSelected) {
    selectedModes.delete(type);
    card.classList.remove('selected');
  } else {
    selectedModes.add(type);
    card.classList.add('selected');
  }
  document.getElementById('op-err').classList.remove('show');
}

function handleStockPhotos(input) {
  const newFiles = Array.from(input.files);
  newFiles.forEach(newFile => {
    const isDuplicate = stockFiles.some(
      f => f.name === newFile.name && f.size === newFile.size
    );
    if (!isDuplicate) stockFiles.push(newFile);
  });
  input.value = '';
  renderThumbs(stockFiles, 'stock-thumbs', 'stock-photo-err', 3, 'stock');
}

function handleCustomPhotos(input) {
  const newFiles = Array.from(input.files);
  newFiles.forEach(newFile => {
    const isDuplicate = customFiles.some(
      f => f.name === newFile.name && f.size === newFile.size
    );
    if (!isDuplicate) customFiles.push(newFile);
  });
  input.value = '';
  renderThumbs(customFiles, 'custom-thumbs', 'custom-proof-err', 3, 'custom');
}

function removePhoto(type, index) {
  if (type === 'stock') {
    stockFiles.splice(index, 1);
    renderThumbs(stockFiles, 'stock-thumbs', 'stock-photo-err', 3, 'stock');
  } else {
    customFiles.splice(index, 1);
    renderThumbs(customFiles, 'custom-thumbs', 'custom-proof-err', 3, 'custom');
  }
}

function renderThumbs(files, thumbsId, errId, minCount, type) {
  const container = document.getElementById(thumbsId);
  container.innerHTML = '';
  if (files.length === 0) return;

  const metMin = files.length >= minCount;

  const countDiv = document.createElement('div');
  countDiv.className = 'proof-thumb-count';
  countDiv.innerHTML = `
    <svg viewBox="0 0 12 12" fill="none" stroke="${metMin ? 'var(--green)' : '#DC2626'}" stroke-width="2" width="12" height="12">
      <path d="${metMin ? 'M2 6l3 3 5-5' : 'M2 2l8 8M10 2l-8 8'}"/>
    </svg>
    ${files.length} photo${files.length !== 1 ? 's' : ''} added
    ${metMin
      ? '<span style="color:var(--green)"> — good to go ✓</span>'
      : `<span style="color:#DC2626"> — add ${minCount - files.length} more</span>`
    }
  `;
  container.appendChild(countDiv);

  const thumbsRow = document.createElement('div');
  thumbsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-top:8px';

  files.forEach((file, index) => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:relative;width:64px;height:64px;';

    const img = document.createElement('img');
    img.style.cssText = 'width:64px;height:64px;border-radius:8px;object-fit:cover;border:2px solid var(--green-mid);display:block;';

    const reader = new FileReader();
    reader.onload = e => { img.src = e.target.result; };
    reader.readAsDataURL(file);

    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '×';
    removeBtn.title = 'Remove';
    removeBtn.style.cssText = `
      position:absolute;top:-6px;right:-6px;
      width:18px;height:18px;border-radius:50%;
      background:#DC2626;color:#fff;border:none;
      font-size:13px;font-weight:700;line-height:1;
      cursor:pointer;display:flex;align-items:center;
      justify-content:center;padding:0;
    `;
    removeBtn.onclick = (e) => { e.stopPropagation(); removePhoto(type, index); };

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    thumbsRow.appendChild(wrapper);
  });

  const addMore = document.createElement('div');
  addMore.style.cssText = `
    width:64px;height:64px;border-radius:8px;
    border:2px dashed var(--border);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    cursor:pointer;color:var(--text-3);font-size:10px;
    font-weight:500;gap:3px;transition:all .15s;
  `;
  addMore.innerHTML = `
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
      <path d="M8 3v10M3 8h10"/>
    </svg>
    Add more
  `;
  addMore.onmouseenter = () => { addMore.style.borderColor = 'var(--green)'; addMore.style.color = 'var(--green)'; };
  addMore.onmouseleave = () => { addMore.style.borderColor = 'var(--border)'; addMore.style.color = 'var(--text-3)'; };
  addMore.onclick = (e) => { e.stopPropagation(); document.getElementById(type === 'stock' ? 'stock-photos' : 'custom-portfolio').click(); };
  thumbsRow.appendChild(addMore);

  container.appendChild(thumbsRow);
  if (metMin) document.getElementById(errId).classList.remove('show');
}

function toggleAgree4() {
  const cb = document.getElementById('agree-check-4');
  cb.checked = !cb.checked;
}

function validateStep4() {
  let ok = true;

  if (selectedModes.size === 0) {
    document.getElementById('op-err').classList.add('show');
    ok = false;
  }

  if (selectedModes.has('stock') && stockFiles.length < 3) {
    document.getElementById('stock-photo-err').classList.add('show');
    ok = false;
  } else if (selectedModes.has('stock')) {
    document.getElementById('stock-photo-err').classList.remove('show');
  }

  if (selectedModes.has('custom') && customFiles.length < 3) {
    document.getElementById('custom-proof-err').classList.add('show');
    ok = false;
  } else if (selectedModes.has('custom')) {
    document.getElementById('custom-proof-err').classList.remove('show');
  }

  if (!document.getElementById('agree-check-4').checked) {
    document.getElementById('agree4-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('agree4-err').classList.remove('show');
  }

  if (ok) {
    const modeLabels = {
      stock: 'Sells from stock',
      source: 'Sources on order',
      custom: 'Custom / made to order'
    };
    vendorData.operationModes = Array.from(selectedModes);
    vendorData.operationSummary = vendorData.operationModes.map(m => modeLabels[m]).join(', ');
    goStep(5);
  }
}

// ── STEP 5: KYC + BANK ──
function checkAccount() {
  const bank = document.getElementById('bank-select').value;
  const acc = document.getElementById('account-number').value;
  const verifyEl = document.getElementById('account-verify');
  if (bank && acc.length === 10) {
    document.getElementById('account-name').textContent = vendorData.storeName + ' — ' + bank;
    verifyEl.classList.add('show');
  } else {
    verifyEl.classList.remove('show');
  }
}

function toggleAgree() {
  const cb = document.getElementById('agree-check');
  cb.checked = !cb.checked;
}

function validateStep5() {
  const bvn = document.getElementById('bvn-input').value.trim();
  const bank = document.getElementById('bank-select').value;
  const acc = document.getElementById('account-number').value.trim();
  const agreed = document.getElementById('agree-check').checked;
  let ok = true;

  if (bvn.length !== 11) {
    document.getElementById('bvn-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('bvn-err').classList.remove('show');
  }

  if (!bank || acc.length !== 10) {
    document.getElementById('bank-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('bank-err').classList.remove('show');
  }

  if (!agreed) {
    document.getElementById('agree-err').classList.add('show');
    ok = false;
  } else {
    document.getElementById('agree-err').classList.remove('show');
  }

  if (ok) {
    vendorData.bvn = bvn;
    vendorData.bank = bank;
    vendorData.accountNumber = acc;

    const firstName = (vendorData.storeName || 'Vendor').split(' ')[0];
    document.getElementById('vendor-firstname').textContent = firstName;

    localStorage.setItem('vender_vendor', JSON.stringify(vendorData));
    localStorage.setItem('vender_user', JSON.stringify({
      type: 'vendor',
      storeName: vendorData.storeName,
        phone: vendorData.phone,
        password: vendorData.password,
      status: 'pending',
      state: vendorData.state,
      zone: vendorData.zone,
      neighbourhood: vendorData.neighbourhood,
      operationModes: vendorData.operationModes
    }));

    goStep(6);
  }
}