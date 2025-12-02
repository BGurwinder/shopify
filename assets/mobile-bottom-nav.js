document.addEventListener("DOMContentLoaded", function () {
  const mobileNav = document.querySelector(".mobile-bottom-nav");
  if (!mobileNav) return;

  // Menu Toggle Logic
  const menuBtn = mobileNav.querySelector('[data-action="toggle-menu"]');
  const drawer = document.querySelector(".mobile-menu-drawer");
  const overlay = document.querySelector(".mobile-menu-overlay");

  if (menuBtn && drawer && overlay) {
    menuBtn.addEventListener("click", function (e) {
      e.preventDefault();
      drawer.classList.toggle("active");
      overlay.classList.toggle("active");
      document.body.style.overflow = drawer.classList.contains("active")
        ? "hidden"
        : "";
    });
  }

  /* Search Toggle Logic - Moved to search-overlay.js
  const searchBtn = mobileNav.querySelector('[data-action="toggle-search"]');
  const searchOverlay = document.querySelector('.mobile-search-overlay');
  const searchClose = document.querySelector('.mobile-search-close');
  const searchInput = document.querySelector('.mobile-search-input');

  if (searchBtn && searchOverlay) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const isActive = searchOverlay.classList.contains('active');
      
      if (isActive) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
      } else {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (searchInput) setTimeout(() => searchInput.focus(), 100);
      }
    });

    if (searchClose) {
      searchClose.addEventListener('click', function() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }
  */

  // Highlight active link based on current URL
  const links = mobileNav.querySelectorAll(".mobile-nav-item");
  const currentPath = window.location.pathname;

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    }
  });
});
