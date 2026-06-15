// location-helpers.js — Shared location picker modal for index.html and vendors.html
// This file contains all location picker logic that both pages need
// It runs without defer so it's ready before other scripts execute

// Modal state variables  
let locPickerStep = 1;
let locPickerState = null;
let locPickerZone = null;

// Initialize global location variables if they don't exist yet
// These will be overwritten by the page-specific scripts after they load
if (typeof window.userLocation === 'undefined') {
  window.userLocation = localStorage.getItem('vender_location') 
    ? JSON.parse(localStorage.getItem('vender_location'))
    : { state: 'Lagos', zone: 'Lagos Mainland', neighbourhood: 'Yaba' };
}
if (typeof window.vendorBrowseLocation === 'undefined') {
  window.vendorBrowseLocation = { state: 'Lagos', zone: 'Lagos Mainland', neighbourhood: 'Yaba' };
}
if (typeof window.activeVendor === 'undefined') {
  window.activeVendor = null;
}

function openLocModal() {
  // Ensure helper functions are available
  if (typeof getAllStates === 'undefined' || typeof getZones === 'undefined' || typeof getNeighbourhoods === 'undefined') {
    console.error('Location helper functions not loaded yet. Retrying...');
    setTimeout(openLocModal, 100);
    return;
  }
  
  const modal = document.getElementById('loc-modal-overlay');
  if (!modal) return;
  
  modal.classList.add('open');
  
  // Hide location nudge if it exists (home page only)
  if (typeof hideLocNudge === 'function') hideLocNudge();
  
  locPickerStep = 1;
  locPickerState = null;
  locPickerZone = null;
  renderLocPicker();
}

function closeLocModal() {
  const modal = document.getElementById('loc-modal-overlay');
  if (modal) modal.classList.remove('open');
}

function closeLoc(e) {
  if (e.target === document.getElementById('loc-modal-overlay')) {
    closeLocModal();
  }
}

function renderLocPicker() {
  const container = document.getElementById('loc-grid');
  const modal = document.querySelector('.loc-modal');
  if (!container || !modal) return;
  
  const mode = document.getElementById('loc-modal-overlay').getAttribute('data-mode');
  
  // Determine which location object to use for current selection
  let currentLoc = userLocation || { state: 'Lagos', zone: 'Lagos Mainland', neighbourhood: 'Yaba' };
  if (mode === 'vendor-browse' && typeof vendorBrowseLocation !== 'undefined') {
    currentLoc = vendorBrowseLocation;
  }

  if (locPickerStep === 1) {
    modal.querySelector('h3').textContent = 'Choose your state';
    try {
      const states = getAllStates();
      container.innerHTML = states.map(s =>
        `<div class="loc-opt${s === currentLoc.state ? ' sel' : ''}" onclick="selectLocState('${s}')">${s}</div>`
      ).join('');
    } catch(e) {
      console.error('Error loading states:', e);
      container.innerHTML = '<div style="padding:20px;color:red">Error loading locations</div>';
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
      container.innerHTML = '<div style="padding:20px;color:red">Error loading zones</div>';
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
      container.innerHTML = '<div style="padding:20px;color:red">Error loading neighbourhoods</div>';
    }
  }
}

function selectLocState(state) {
  locPickerState = state;
  locPickerZone = null;
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
    // Vendor page browse location mode
    if (typeof selectVendorBrowseLocation === 'function') {
      selectVendorBrowseLocation(locPickerState, locPickerZone, neighbourhood);
    }
  } else if (mode === 'surprise') {
    // Surprise mode (home page only)
    if (typeof selectSurpriseNeighbourhood === 'function') {
      selectSurpriseNeighbourhood(neighbourhood);
    }
  } else {
    // Default mode - update user location
    userLocation = { state: locPickerState, zone: locPickerZone, neighbourhood };
    localStorage.setItem('vender_location', JSON.stringify(userLocation));
    
    // Close any open vendor panel if it exists
    const vendorPanel = document.getElementById('vendor-panel');
    if (vendorPanel) {
      if (typeof window.activeVendor !== 'undefined') window.activeVendor = null;
      vendorPanel.className = 'vendor-panel';
    }
    
    // Update location label on this page
    const locLabel = document.getElementById('loc-label');
    if (locLabel) {
      locLabel.textContent = neighbourhood;
    }
    
    // Call page-specific functions if they exist
    if (typeof updateLocLabel === 'function') updateLocLabel();
    if (typeof hideLocNudge === 'function') hideLocNudge();
    
    // Re-render the vendors and products grids with the new location
    if (typeof renderVendors === 'function') renderVendors();
    if (typeof renderProducts === 'function') renderProducts();
    if (typeof render === 'function') render();
    if (typeof updateTags === 'function') updateTags();
  }
  
  // Clean up and close
  document.getElementById('loc-modal-overlay').removeAttribute('data-mode');
  closeLocModal();
}

// Update location label on page load (if location is already saved)
function initializeLocLabel() {
  const locLabel = document.getElementById('loc-label');
  if (!locLabel) return;
  
  const hasLocation = localStorage.getItem('vender_location');
  if (hasLocation) {
    const loc = JSON.parse(hasLocation);
    locLabel.textContent = loc.neighbourhood;
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLocLabel);
} else {
  // DOM already loaded
  initializeLocLabel();
}
