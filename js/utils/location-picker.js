// location-picker.js — Shared location picker modal functions for index.html and vendors.html

// Modal state variables
let locPickerStep = 1;
let locPickerState = null;
let locPickerZone = null;

function openLocModal() {
  // Ensure functions are available before opening modal
  if (typeof getAllStates === 'undefined' || typeof getZones === 'undefined' || typeof getNeighbourhoods === 'undefined') {
    console.error('Location helper functions not loaded yet. Retrying...');
    // Retry after a short delay
    setTimeout(openLocModal, 100);
    return;
  }
  
  document.getElementById('loc-modal-overlay').classList.add('open');
  hideLocNudge();
  locPickerStep = 1;
  locPickerState = null;
  locPickerZone = null;
  renderLocPicker();
}

function closeLocModal() {
  document.getElementById('loc-modal-overlay').classList.remove('open');
}

function closeLoc(e) {
  if (e.target === document.getElementById('loc-modal-overlay')) closeLocModal();
}

function renderLocPicker() {
  const container = document.getElementById('loc-grid');
  const modal = document.querySelector('.loc-modal');
  const mode = document.getElementById('loc-modal-overlay').getAttribute('data-mode');
  
  // Use vendorBrowseLocation if in vendor-browse mode, otherwise use userLocation
  const currentLoc = (mode === 'vendor-browse' && typeof vendorBrowseLocation !== 'undefined') 
    ? vendorBrowseLocation 
    : userLocation;

  if (locPickerStep === 1) {
    modal.querySelector('h3').textContent = 'Choose your state';
    try {
      const states = getAllStates();
      container.innerHTML = states.map(s =>
        `<div class="loc-opt${s === currentLoc.state ? ' sel' : ''}" onclick="selectLocState('${s}')">${s}</div>`
      ).join('');
    } catch(e) {
      console.error('Error loading states:', e);
      container.innerHTML = '<div style="padding:20px;color:red">Error loading locations. Please refresh.</div>';
    }
  } else if (locPickerStep === 2) {
    modal.querySelector('h3').textContent = `Choose zone in ${locPickerState}`;
    try {
      const zones = getZones(locPickerState);
      container.innerHTML =
        `<div class="loc-back" onclick="locPickerStep=1;renderLocPicker()">← Back to states</div>` +
        zones.map(z =>
          `<div class="loc-opt${z === currentLoc.zone ? ' sel' : ''}" onclick="selectLocZone('${z}')">${z}</div>`
        ).join('');
    } catch(e) {
      console.error('Error loading zones:', e);
      container.innerHTML = '<div style="padding:20px;color:red">Error loading zones. Please refresh.</div>';
    }
  } else if (locPickerStep === 3) {
    modal.querySelector('h3').textContent = `Choose neighbourhood in ${locPickerZone}`;
    try {
      const neighbourhoods = getNeighbourhoods(locPickerState, locPickerZone);
      container.innerHTML =
        `<div class="loc-back" onclick="locPickerStep=2;renderLocPicker()">← Back to zones</div>` +
        neighbourhoods.map(n =>
          `<div class="loc-opt${n === currentLoc.neighbourhood ? ' sel' : ''}" onclick="selectLocNeighbourhood('${n}')">${n}</div>`
        ).join('');
    } catch(e) {
      console.error('Error loading neighbourhoods:', e);
      container.innerHTML = '<div style="padding:20px;color:red">Error loading neighbourhoods. Please refresh.</div>';
    }
  }
}

function selectLocState(state) {
  locPickerState = state;
  locPickerStep = 2;
  renderLocPicker();
}

function selectLocZone(zone) {
  locPickerZone = zone;
  locPickerStep = 3;
  renderLocPicker();
}

function selectLocNeighbourhood(neighbourhood) {
  const mode = document.getElementById('loc-modal-overlay').getAttribute('data-mode');
  
  if (mode === 'vendor-browse') {
    // Vendor page browse location
    if (typeof selectVendorBrowseLocation === 'function') {
      selectVendorBrowseLocation(locPickerState, locPickerZone, neighbourhood);
    }
  } else if (mode === 'surprise') {
    // Surprise mode (home page)
    surpriseLocation = { state: locPickerState, zone: locPickerZone, neighbourhood };
    closeLocModal();
    if (typeof renderSurpriseMode === 'function') {
      renderSurpriseMode();
    }
  } else {
    // Default mode - update user location
    userLocation = { state: locPickerState, zone: locPickerZone, neighbourhood };
    localStorage.setItem('vender_location', JSON.stringify(userLocation));
    
    // Call page-specific update functions if they exist
    if (typeof updateLocLabel === 'function') updateLocLabel();
    if (typeof hideLocNudge === 'function') hideLocNudge();
    if (typeof render === 'function') render();
    if (typeof updateTags === 'function') updateTags();
    
    // Clean up
    document.getElementById('loc-modal-overlay').removeAttribute('data-mode');
    closeLocModal();
  }
}

function hideLocNudge() {
  const nudge = document.getElementById('loc-nudge');
  if (nudge) nudge.style.display = 'none';
}
