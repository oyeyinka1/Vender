// vendors.js — Vendors page specific script

// Wait for VENDORS to be available if not already defined
function ensureVendorsLoaded(callback) {
  if (typeof VENDORS !== 'undefined') {
    callback();
    return;
  }
  
  let attempts = 0;
  const waitInterval = setInterval(() => {
    attempts++;
    if (typeof VENDORS !== 'undefined') {
      clearInterval(waitInterval);
      callback();
    } else if (attempts > 50) {
      // Timeout after 5 seconds
      clearInterval(waitInterval);
      console.error('VENDORS failed to load');
      callback();
    }
  }, 100);
}

let vendorCurrentCat = 'All';
let vendorCurrentSearch = '';
let vendorCurrentSort = 'rating';
let vendorMinRating = 0;
let vendorVerifiedOnly = false;
let vendorActiveVendor = null;

// Separate browse location from delivery location
// Always initialized from userLocation (delivery location)
let vendorBrowseLocation = userLocation ? JSON.parse(JSON.stringify(userLocation)) : { state: 'Lagos', zone: 'Lagos Mainland', neighbourhood: 'Yaba' };
let userSelectedVendorLocation = false; // Track if user explicitly changed browse location during this session

function renderVendorsPage() {
  let vendors = VENDORS.filter(v => {
    if (!v.deliveryZones.includes(vendorBrowseLocation.neighbourhood)) return false;
    if (vendorCurrentCat !== 'All' && v.cat !== vendorCurrentCat) return false;
    if (vendorMinRating > 0 && v.rating < vendorMinRating) return false;
    if (vendorVerifiedOnly && !v.verified) return false;
    if (vendorCurrentSearch) {
      const q = vendorCurrentSearch.toLowerCase();
      return v.name.toLowerCase().includes(q) || v.cat.toLowerCase().includes(q);
    }
    return true;
  });

  if (vendorCurrentSort === 'name') vendors.sort((a,b) => a.name.localeCompare(b.name));
  else if (vendorCurrentSort === 'rating') vendors.sort((a,b) => b.rating - a.rating);
  else if (vendorCurrentSort === 'orders') vendors.sort((a,b) => b.orders - a.orders);

  const grid = document.getElementById('vendor-grid');
  const empty = document.getElementById('empty-state');
  const title = document.getElementById('vendors-title');
  const count = document.getElementById('results-count');

  if (vendors.length === 0) {
    grid.innerHTML = '';
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  title.textContent = vendorCurrentCat !== 'All' ? vendorCurrentCat + ' Vendors' : 'All Vendors';
  count.textContent = `${vendors.length} vendor${vendors.length !== 1 ? 's' : ''} in ${vendorBrowseLocation.neighbourhood}`;

  grid.innerHTML = vendors.map(v => `
    <div class="vcard" onclick="window.location.href='vendor-profile.html?id=${v.id}'">
      <div class="vav" style="background:${v.bg};color:${v.tc}">${v.id}</div>
      <div class="vname">${v.name}</div>
      <div class="vmeta">${v.cat} · ${v.zone}</div>
      <div class="badges">
        <span class="badge ${v.verified?'badge-v':'badge-u'}">${v.verified?'✓ Verified':'Unverified'}</span>
        ${v.source?'<span class="badge badge-s">Sources on order</span>':''}
      </div>
      <div class="vstars">
        <span class="star">★</span>${v.rating} · ${v.orders} orders
      </div>
    </div>`).join('');
}

function setVendorCategory(el, cat) {
  vendorCurrentCat = cat;
  document.querySelectorAll('.fpill:not(.filter-dropdown .fpill)').forEach(p => p.classList.remove('on'));
  el.classList.add('on');
  vendorActiveVendor = null;
  renderVendorsPage();
  updateVendorTags();
}

function handleVendorSearch(val) {
  vendorCurrentSearch = val;
  document.getElementById('search-clear').style.display = val ? 'inline' : 'none';
  renderVendorsPage();
  updateVendorTags();
}

function setVendorRating(r, el) {
  vendorMinRating = r;
  document.querySelectorAll('.rating-opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  renderVendorsPage();
  updateVendorTags();
}

function toggleVendorRatingMenu() {
  const menu = document.getElementById('rating-menu');
  const pill = document.getElementById('rating-pill');
  menu.classList.toggle('open');
  pill.classList.toggle('open');
}

function toggleVendorVerified() {
  vendorVerifiedOnly = !vendorVerifiedOnly;
  document.getElementById('verified-pill').classList.toggle('on', vendorVerifiedOnly);
  renderVendorsPage();
  updateVendorTags();
}

function clearVendorSearch() {
  vendorCurrentSearch = '';
  document.getElementById('search-input').value = '';
  document.getElementById('search-clear').style.display = 'none';
  renderVendorsPage();
  updateVendorTags();
}

function setVendorSort(val) {
  vendorCurrentSort = val;
  renderVendorsPage();
}

function clearAllVendorFilters() {
  vendorCurrentCat = 'All';
  vendorCurrentSearch = '';
  vendorCurrentSort = 'rating';
  vendorMinRating = 0;
  vendorVerifiedOnly = false;
  
  document.getElementById('search-input').value = '';
  document.getElementById('search-clear').style.display = 'none';
  document.getElementById('sort-select').value = 'rating';
  document.querySelectorAll('.fpill').forEach(p => p.classList.remove('on'));
  document.querySelector('.fpill').classList.add('on'); // First pill (All)
  document.getElementById('verified-pill').classList.remove('on');
  
  renderVendorsPage();
  updateVendorTags();
}

function updateVendorTags() {
  let tags = [];
  if (vendorCurrentCat !== 'All') tags.push(vendorCurrentCat);
  if (vendorMinRating > 0) tags.push(vendorMinRating + '★');
  if (vendorVerifiedOnly) tags.push('Verified');
  if (vendorCurrentSearch) tags.push(`"${vendorCurrentSearch}"`);
  
  const tagContainer = document.getElementById('active-tags');
  if (tagContainer) {
    tagContainer.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
  }
}

function openVendorLocModal() {
  // Similar to main location modal but may have vendor-specific logic
  document.getElementById('loc-modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  ensureVendorsLoaded(() => {
    renderVendorsPage();
    updateLocLabel();
  });
});
