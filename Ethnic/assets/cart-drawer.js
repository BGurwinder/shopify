class CartDrawer {
  constructor() {
    this.drawer = document.querySelector('.cart-drawer');
    this.overlay = document.querySelector('.cart-drawer-overlay');
    this.closeBtn = document.querySelector('.cart-drawer__close');
    this.itemsContainer = document.querySelector('.cart-drawer__items');
    this.countBubble = document.querySelector('.cart-count-bubble');
    this.totalPrice = document.querySelector('.cart-total-price');
    
    this.bindEvents();
  }

  bindEvents() {
    // Open drawer on cart icon click
    document.querySelectorAll('a[href="/cart"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Close events
    this.closeBtn?.addEventListener('click', () => this.close());
    this.overlay?.addEventListener('click', () => this.close());

    // Delegate events for dynamic content
    this.drawer?.addEventListener('click', (e) => {
      if (e.target.closest('.qty-btn')) {
        this.updateQuantity(e);
      }
      if (e.target.closest('.cart-item__remove')) {
        this.removeItem(e);
      }
    });

    this.drawer?.addEventListener('change', (e) => {
      if (e.target.classList.contains('qty-input')) {
        this.updateQuantityInput(e);
      }
    });
    this.bindProductForm();
  }

  bindProductForm() {
    const productForm = document.querySelector('form[action="/cart/add"]');
    if (!productForm) return;

    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(productForm);
      const config = {
        method: 'POST',
        headers: {
          'Accept': 'application/javascript',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
      };

      try {
        const response = await fetch('/cart/add.js', config);
        const res = await response.json();

        if (response.ok) {
          await this.fetchCart();
          this.open();
        } else {
          console.error('Error adding to cart:', res.description);
          alert(res.description); // Simple error feedback
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }

  open() {
    this.drawer.classList.add('active');
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.fetchCart(); // Refresh cart on open
  }

  close() {
    this.drawer.classList.remove('active');
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  async fetchCart() {
    try {
      const res = await fetch('/?section_id=cart-drawer');
      const text = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      const newDrawer = doc.querySelector('.cart-drawer');
      if (newDrawer) {
        this.drawer.innerHTML = newDrawer.innerHTML;
        // Re-bind close button since it was replaced
        this.closeBtn = this.drawer.querySelector('.cart-drawer__close');
        this.closeBtn?.addEventListener('click', () => this.close());

        // Sync header cart count from drawer
        const drawerCount = newDrawer.querySelector('.cart-count-bubble')?.textContent;
        if (drawerCount) {
          const headerCartLinks = document.querySelectorAll('a[href="/cart"]');
          headerCartLinks.forEach(link => {
            let bubble = link.querySelector('.cart-count-bubble, .mobile-cart-count');
            if (!bubble) {
              bubble = document.createElement('span');
              if (link.closest('.mobile-bottom-nav')) {
                bubble.classList.add('mobile-cart-count');
              } else {
                bubble.classList.add('cart-count-bubble');
              }
              link.appendChild(bubble);
            }
            bubble.textContent = drawerCount;
            bubble.style.display = 'flex';
          });
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }

  async updateQuantity(e) {
    const btn = e.target.closest('.qty-btn');
    const input = btn.parentElement.querySelector('.qty-input');
    const key = btn.dataset.key;
    let quantity = parseInt(input.value);

    if (btn.classList.contains('plus')) {
      quantity++;
    } else if (btn.classList.contains('minus')) {
      quantity--;
    }

    if (quantity < 0) return;

    await this.updateCartItem(key, quantity);
  }

  async updateQuantityInput(e) {
    const input = e.target;
    const key = input.dataset.key;
    const quantity = parseInt(input.value);
    
    if (quantity < 0) return;
    await this.updateCartItem(key, quantity);
  }

  async removeItem(e) {
    const btn = e.target.closest('.cart-item__remove');
    const key = btn.dataset.key;
    await this.updateCartItem(key, 0);
  }

  async updateCartItem(key, quantity) {
    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: key,
          quantity: quantity
        })
      });

      const cart = await res.json();
      await this.fetchCart(); // Re-render drawer
      
      // Update header cart count
      const headerCartLinks = document.querySelectorAll('a[href="/cart"]');
      headerCartLinks.forEach(link => {
        let bubble = link.querySelector('.cart-count-bubble, .mobile-cart-count');
        
        if (cart.item_count > 0) {
          if (!bubble) {
            bubble = document.createElement('span');
            if (link.closest('.mobile-bottom-nav')) {
              bubble.classList.add('mobile-cart-count');
            } else {
              bubble.classList.add('cart-count-bubble');
            }
            link.appendChild(bubble);
          }
          bubble.textContent = cart.item_count;
          bubble.style.display = 'flex'; // Ensure it's visible
        } else if (bubble) {
          bubble.remove(); // Or hide it
        }
      });

      // Update drawer bubble specifically if needed (though usually re-fetched)
      const drawerBubble = document.querySelector('.cart-drawer .cart-count-bubble');
      if (drawerBubble) drawerBubble.textContent = cart.item_count;

    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cartDrawer = new CartDrawer();
});
