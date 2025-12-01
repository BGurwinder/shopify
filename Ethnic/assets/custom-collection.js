// Custom Collection Logic
document.addEventListener('DOMContentLoaded', () => {
  // Filter Toggle
  const filterBtn = document.querySelector('.filter-toggle-btn');
  const filterOverlay = document.querySelector('.filter-overlay');
  const closeFilterBtn = document.querySelector('.close-filter-btn');
  const filterDrawer = document.querySelector('.filter-drawer');

  if (filterBtn && filterOverlay) {
    filterBtn.addEventListener('click', () => {
      filterOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeFilter = () => {
      filterOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeFilterBtn?.addEventListener('click', closeFilter);
    filterOverlay.addEventListener('click', (e) => {
      if (e.target === filterOverlay) closeFilter();
    });
  }

  // Price Range Slider Logic (Basic)
  const priceInputs = document.querySelectorAll('.price-input-group input');
  priceInputs.forEach(input => {
    input.addEventListener('change', function() {
      // Ensure min <= max
      const minInput = document.getElementById('Filter-Price-GTE');
      const maxInput = document.getElementById('Filter-Price-LTE');
      
      if (minInput && maxInput) {
        const minVal = parseInt(minInput.value);
        const maxVal = parseInt(maxInput.value);
        
        if (minVal > maxVal) {
           // Simple swap or correction could go here
        }
      }
    });
  });


});
