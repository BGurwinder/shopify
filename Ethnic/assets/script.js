document.addEventListener('DOMContentLoaded', function() {
  // Product Slider Logic
  const sliders = document.querySelectorAll('.product-slider-container');

  sliders.forEach(slider => {
    const container = slider;
    const prevBtn = slider.parentElement.querySelector('.slider-prev');
    const nextBtn = slider.parentElement.querySelector('.slider-next');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        container.scrollBy({
          left: -320, // slide width + gap
          behavior: 'smooth'
        });
      });

      nextBtn.addEventListener('click', () => {
        container.scrollBy({
          left: 320,
          behavior: 'smooth'
        });
      });
    }
  });

  // Product Gallery Logic
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.querySelector('.product-main-image img');
  const prevBtn = document.querySelector('.gallery-nav.prev');
  const nextBtn = document.querySelector('.gallery-nav.next');
  let currentImageIndex = 0;

  function updateGallery(index) {
    if (thumbnails.length === 0) return;
    
    // Wrap index
    if (index < 0) index = thumbnails.length - 1;
    if (index >= thumbnails.length) index = 0;
    
    currentImageIndex = index;
    const thumb = thumbnails[currentImageIndex];
    
    // Update main image
    const newSrc = thumb.querySelector('img').src;
    // Replace size to get high res image. 
    // Note: Shopify adds size like _200x.jpg. We want to replace it with _1000x.jpg or remove it for original.
    // Regex to find size pattern like _200x, _small, etc before extension
    const highResSrc = newSrc.replace(/_\d+x/, '_1000x'); 
    
    if (mainImage) {
      mainImage.src = highResSrc;
      // Also update srcset if it exists to prevent browser from using cached small image
      if (mainImage.srcset) {
        mainImage.srcset = highResSrc; 
      }
    }

    // Update active state
    thumbnails.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  }

  if (thumbnails.length > 0 && mainImage) {
    // Thumbnail Clicks
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', function() {
        updateGallery(index);
      });
    });

    // Arrow Clicks
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateGallery(currentImageIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateGallery(currentImageIndex + 1);
      });
    }

    // Drag to Change Logic
    const galleryContainer = document.querySelector('.product-main-image');
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    if (galleryContainer) {
      galleryContainer.style.cursor = 'grab';

      // Touch Events
      galleryContainer.addEventListener('touchstart', touchStart);
      galleryContainer.addEventListener('touchend', touchEnd);
      galleryContainer.addEventListener('touchmove', touchMove);

      // Mouse Events
      galleryContainer.addEventListener('mousedown', touchStart);
      galleryContainer.addEventListener('mouseup', touchEnd);
      galleryContainer.addEventListener('mouseleave', () => {
        if (isDragging) touchEnd();
      });
      galleryContainer.addEventListener('mousemove', touchMove);

      // Prevent context menu on long press/right click
      galleryContainer.addEventListener('contextmenu', e => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }

    // Prevent default browser drag behavior on the image itself
    const imgElement = galleryContainer.querySelector('img');
    if (imgElement) {
      imgElement.addEventListener('dragstart', (e) => e.preventDefault());
    }

    function touchStart(event) {
      isDragging = true;
      startPos = getPositionX(event);
      galleryContainer.style.cursor = 'grabbing';
      animationID = requestAnimationFrame(animation);
    }

    function touchEnd() {
      isDragging = false;
      cancelAnimationFrame(animationID);
      galleryContainer.style.cursor = 'grab';

      const movedBy = currentTranslate - prevTranslate;

      // Threshold to change image (e.g., 50px)
      if (movedBy < -50) {
        updateGallery(currentImageIndex + 1);
      } else if (movedBy > 50) {
        updateGallery(currentImageIndex - 1);
      }

      // Reset position
      currentTranslate = 0;
      prevTranslate = 0;
    }

    function touchMove(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }

    function getPositionX(event) {
      return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
      if (isDragging) requestAnimationFrame(animation);
    }
  }


  // Quantity Selector Logic
  const qtyInputs = document.querySelectorAll('.quantity-selector');
  
  qtyInputs.forEach(selector => {
    const input = selector.querySelector('.qty-input');
    const minusBtn = selector.querySelector('.minus');
    const plusBtn = selector.querySelector('.plus');

    if (input && minusBtn && plusBtn) {
      minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value);
        if (currentValue > 1) {
          input.value = currentValue - 1;
        }
      });

      plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(input.value);
        input.value = currentValue + 1;
      });
    }
  });

  // Size Chart Modal Logic
  const sizeChartLink = document.querySelector('.size-chart-link');
  const sizeChartModal = document.getElementById('SizeChartModal');
  const closeModalBtn = document.querySelector('.close-modal');
  const modalOverlay = document.querySelector('.size-chart-overlay');

  if (sizeChartLink && sizeChartModal) {
    sizeChartLink.addEventListener('click', function(e) {
      e.preventDefault();
      sizeChartModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });

    function closeModal() {
      sizeChartModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sizeChartModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Product Card Slider Logic
  const cardSliders = document.querySelectorAll('.product-card-slider');

  cardSliders.forEach(slider => {
    const track = slider.querySelector('.card-slider-track');
    const items = slider.querySelectorAll('.card-slider-item');
    const prevBtn = slider.querySelector('.card-slider-arrow.prev');
    const nextBtn = slider.querySelector('.card-slider-arrow.next');
    
    if (!track || items.length <= 1) return;

    // Infinite Slider Logic
    // Items structure: [CloneLast, Img1, Img2, ..., ImgN, CloneFirst]
    // Start at index 1 (Img1)
    let currentIndex = 1;
    let startX = 0;
    let isDragging = false;
    let isTransitioning = false;

    // Initial position
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    function updateSlider(withTransition = true) {
      if (withTransition) {
        track.style.transition = 'transform 0.3s ease';
        isTransitioning = true;
      } else {
        track.style.transition = 'none';
        isTransitioning = false;
      }
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Handle Transition End for Infinite Loop
    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      if (items[currentIndex].classList.contains('clone')) {
        if (currentIndex === 0) {
          // At CloneLast -> Jump to ImgN (index length - 2)
          currentIndex = items.length - 2;
        } else if (currentIndex === items.length - 1) {
          // At CloneFirst -> Jump to Img1 (index 1)
          currentIndex = 1;
        }
        updateSlider(false); // Jump without transition
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isTransitioning) return;
        currentIndex--;
        updateSlider();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isTransitioning) return;
        currentIndex++;
        updateSlider();
      });
    }

    // Swipe Support
    slider.addEventListener('touchstart', (e) => {
      if (isTransitioning) return;
      // Prevent swipe logic if touching an arrow
      if (e.target.closest('.card-slider-arrow')) return;
      
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = 'none'; // Remove transition for direct drag control
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      // Optional: Add resistance or live drag effect here
      // For simple implementation, we just track the swipe
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) { // Threshold
        if (diff > 0) {
          // Swipe Left -> Next
          currentIndex++;
        } else {
          // Swipe Right -> Prev
          currentIndex--;
        }
        updateSlider(true);
      } else {
        // Snap back if swipe wasn't strong enough
        updateSlider(true);
      }
      isDragging = false;
    });
    
    // Prevent link click on drag
    // This is tricky; usually handled by checking if moved significantly
    const links = slider.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            // If it was a drag, prevent default. 
            // Simplified: rely on the fact that touchstart/end handles the slide, 
            // and click usually fires after touchend if no move.
            // But if we swiped, we might want to prevent the click.
            // For now, let's assume standard browser behavior handles distinction well enough 
            // or add a flag if needed.
        });
    });
  });
});
