// Categories page specific script
const CATEGORIES = [
  {name:'Electronics',icon:'📱',count:0,color:'#E6F1FB'},
  {name:'Fashion',icon:'👗',count:0,color:'#FFF0F5'},
  {name:'Food',icon:'🍅',count:0,color:'#EDFFF4'},
  {name:'Phones',icon:'📞',count:0,color:'#FFF4EB'},
  {name:'Beauty',icon:'💄',count:0,color:'#FFF0F5'},
  {name:'Home',icon:'🏠',count:0,color:'#FFFAEB'},
];

function renderCategories() {
  // Count products per category
  CATEGORIES.forEach(cat => {
    cat.count = PRODUCTS.filter(p => p.cat === cat.name).length;
  });

  const grid = document.getElementById('categories-grid');
  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="cat-card" onclick="goToCategory('${cat.name}')" style="background:${cat.color};border:1px solid var(--border);border-radius:var(--card-radius);padding:24px;cursor:pointer;text-align:center;transition:all .2s">
      <div style="font-size:48px;margin-bottom:12px">${cat.icon}</div>
      <h3 style="font-family:var(--font-head);font-size:16px;font-weight:700;color:var(--text);margin-bottom:4px">${cat.name}</h3>
      <p style="font-size:13px;color:var(--text-2)">${cat.count} products</p>
    </div>
  `).join('');

  grid.style.cursor = 'pointer';
  // Hover effect
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
      this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'none';
      this.style.boxShadow = 'none';
    });
  });
}

function goToCategory(catName) {
  // Redirect to products filtered by category
  window.location.href = `index.html?category=${catName}`;
}

// Update header location
function updateHeaderLocation() {
  document.getElementById('header-location').textContent = userLocation.neighbourhood;
}

// On page load
document.addEventListener('DOMContentLoaded', function() {
  renderCategories();
  updateHeaderLocation();
});

// Re-render when location changes
const originalSelectLocNeighbourhood = selectLocNeighbourhood;
selectLocNeighbourhood = function(neighbourhood) {
  originalSelectLocNeighbourhood.call(this, neighbourhood);
  updateHeaderLocation();
};
