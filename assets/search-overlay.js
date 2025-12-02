document.addEventListener("DOMContentLoaded", function () {
  const searchOverlay = document.querySelector(".mobile-search-overlay");
  const searchInput = document.querySelector(".mobile-search-input");
  const searchClose = document.querySelector(".mobile-search-close");
  const searchTriggers = document.querySelectorAll(
    '.search-trigger, [data-action="toggle-search"]'
  );

  const predictiveResultsContainer = document.querySelector(
    ".predictive-search-results"
  );
  const predictiveGrid = document.querySelector(".predictive-search-grid");
  const defaultContent = document.querySelector(".default-search-content");

  if (!searchOverlay || !searchInput) return;

  // Toggle Logic
  function toggleSearch(e) {
    if (e) e.preventDefault();
    const isActive = searchOverlay.classList.contains("active");

    if (isActive) {
      closeSearch();
    } else {
      openSearch();
    }
  }

  function openSearch() {
    searchOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeSearch() {
    searchOverlay.classList.remove("active");
    document.body.style.overflow = "";
    // Reset search on close
    searchInput.value = "";
    clearResults();
  }

  searchTriggers.forEach((trigger) => {
    trigger.addEventListener("click", toggleSearch);
  });

  if (searchClose) {
    searchClose.addEventListener("click", closeSearch);
  }

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
      closeSearch();
    }
  });

  // Predictive Search Logic
  let debounceTimer;

  searchInput.addEventListener("input", function () {
    const term = this.value.trim();

    clearTimeout(debounceTimer);

    if (term.length === 0) {
      clearResults();
      return;
    }

    debounceTimer = setTimeout(() => {
      fetchPredictiveResults(term);
    }, 300);
  });

  function fetchPredictiveResults(term) {
    fetch(
      `/search/suggest.json?q=${encodeURIComponent(
        term
      )}&resources[type]=product&resources[limit]=8`
    )
      .then((response) => response.json())
      .then((data) => {
        const products = data.resources.results.products;
        if (products && products.length > 0) {
          renderResults(products);
        } else {
          renderNoResults();
        }
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  }

  function renderResults(products) {
    predictiveGrid.innerHTML = "";

    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "search-product-card";

      // Handle image (if available)
      let imageHtml = "";
      if (product.image) {
        imageHtml = `<img src="${product.image}" alt="${product.title}" class="search-product-image" width="150" height="225" loading="lazy">`;
      } else {
        imageHtml = `<div class="search-product-image" style="background-color: #f4f4f4; display: flex; align-items: center; justify-content: center;"><span>No Image</span></div>`;
      }

      card.innerHTML = `
        <a href="${product.url}">
          ${imageHtml}
          <span class="search-product-title">${product.title}</span>
          <span class="search-product-price">${product.price}</span>
        </a>
      `;

      predictiveGrid.appendChild(card);
    });

    predictiveResultsContainer.classList.add("active");
    if (defaultContent) defaultContent.style.display = "none";
  }

  function renderNoResults() {
    predictiveGrid.innerHTML = "<p>No results found.</p>";
    predictiveResultsContainer.classList.add("active");
    if (defaultContent) defaultContent.style.display = "none";
  }

  function clearResults() {
    predictiveResultsContainer.classList.remove("active");
    if (defaultContent) defaultContent.style.display = "block";
    predictiveGrid.innerHTML = "";
  }
});
