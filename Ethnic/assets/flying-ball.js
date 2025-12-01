document.addEventListener('DOMContentLoaded', () => {
  // Add to Cart Animation & Logic (Event Delegation)
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.add-to-cart-icon-btn, .add-to-cart-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    // Handle both data-product-id and form input
    let productId = btn.dataset.productId;
    if (!productId) {
      const form = btn.closest('form');
      if (form) {
        const idInput = form.querySelector('input[name="id"]');
        if (idInput) productId = idInput.value;
      }
    }
    
    if (!productId) return;

    let cartIcon = document.getElementById('cart-icon-bubble');
    const mobileCartIcon = document.getElementById('mobile-cart-icon');

    // Prefer mobile icon if visible
    if (mobileCartIcon && mobileCartIcon.offsetParent !== null) {
      cartIcon = mobileCartIcon;
    }

    // 1. Create Flying Ball
    const rect = btn.getBoundingClientRect();
    const ball = document.createElement('div');
    ball.classList.add('flying-ball');
    
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    ball.style.top = `${startY}px`;
    ball.style.left = `${startX}px`;
    document.body.appendChild(ball);

    // 2. Animate to Cart Icon
    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();
      const endX = cartRect.left + cartRect.width / 2;
      const endY = cartRect.top + cartRect.height / 2;
      
      const xDiff = endX - startX;
      const yDiff = endY - startY;

      // Force reflow
      ball.getBoundingClientRect();

      ball.style.transform = `translate(${xDiff}px, ${yDiff}px) scale(0.1)`;
      ball.style.opacity = '0';
    }

    // 3. AJAX Add to Cart
    const animationDuration = 800; // Match CSS transition time
    const startTime = Date.now();

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: [{
            id: productId,
            quantity: 1
          }]
        })
      });

      if (response.ok) {
        // 4. Update Cart Drawer & Count
        if (window.cartDrawer) {
          await window.cartDrawer.fetchCart();
          
          // Calculate remaining time to wait for animation
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, animationDuration - elapsed);

          // Open drawer after animation completes
          setTimeout(() => {
            window.cartDrawer.open();
          }, remaining);
        }
      } else {
        console.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }

    // Cleanup ball after animation
    setTimeout(() => {
      ball.remove();
    }, animationDuration);
  });
});
