document.addEventListener("DOMContentLoaded", function () {
  // Product Slider Logic
  const productCardSliders = document.querySelectorAll(".product-card-slider");

  productCardSliders.forEach((slider) => {
    const track = slider.querySelector(".card-slider-track");
    const items = slider.querySelectorAll(".card-slider-item");
    const prevBtn = slider.querySelector(".card-slider-arrow.prev");
    const nextBtn = slider.querySelector(".card-slider-arrow.next");

    if (!track || items.length === 0 || !prevBtn || !nextBtn) return;

    // State
    let currentIndex = 1; // Start at 1 because of the first clone
    const totalItems = items.length;
    let isTransitioning = false;

    // Initialize position (show first real image)
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Helper to move slider
    function moveSlider(index) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = index;
      track.style.transition = "transform 0.3s ease";
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Handle Transition End for Infinite Loop
    track.addEventListener("transitionend", () => {
      isTransitioning = false;
      if (currentIndex === 0) {
        // Jump to real last item
        track.style.transition = "none";
        currentIndex = totalItems - 2;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      } else if (currentIndex === totalItems - 1) {
        // Jump to real first item
        track.style.transition = "none";
        currentIndex = 1;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    });

    // Event Listeners
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent clicking the product link
      moveSlider(currentIndex - 1);
    });

    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent clicking the product link
      moveSlider(currentIndex + 1);
    });
  });

  // Product Gallery Logic
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.querySelector(".product-main-image img");
  const prevBtn = document.querySelector(".gallery-nav.prev");
  const nextBtn = document.querySelector(".gallery-nav.next");
  let currentImageIndex = 0;

  function updateGallery(index) {
    if (thumbnails.length === 0) return;

    // Wrap index
    if (index < 0) index = thumbnails.length - 1;
    if (index >= thumbnails.length) index = 0;

    currentImageIndex = index;
    const thumb = thumbnails[currentImageIndex];

    // Update main image
    const newSrc = thumb.querySelector("img").src;
    // Replace size to get high res image.
    // Note: Shopify adds size like _200x.jpg. We want to replace it with _1000x.jpg or remove it for original.
    // Regex to find size pattern like _200x, _small, etc before extension
    const highResSrc = newSrc.replace(/_\d+x/, "_1000x");

    if (mainImage) {
      mainImage.src = highResSrc;
      // Also update srcset if it exists to prevent browser from using cached small image
      if (mainImage.srcset) {
        mainImage.srcset = highResSrc;
      }
    }

    // Update active state
    thumbnails.forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");
  }

  if (thumbnails.length > 0 && mainImage) {
    // Thumbnail Clicks
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener("click", function () {
        updateGallery(index);
      });
      thumb.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          updateGallery(index);
        }
      });
    });

    // Arrow Clicks
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        updateGallery(currentImageIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        updateGallery(currentImageIndex + 1);
      });
    }

    // Drag to Change Logic
    const galleryContainer = document.querySelector(".product-main-image");
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;

    if (galleryContainer) {
      galleryContainer.style.cursor = "grab";

      // Touch Events
      galleryContainer.addEventListener("touchstart", touchStart);
      galleryContainer.addEventListener("touchend", touchEnd);
      galleryContainer.addEventListener("touchmove", touchMove);

      // Mouse Events
      galleryContainer.addEventListener("mousedown", touchStart);
      galleryContainer.addEventListener("mouseup", touchEnd);
      galleryContainer.addEventListener("mouseleave", () => {
        if (isDragging) touchEnd();
      });
      galleryContainer.addEventListener("mousemove", touchMove);

      // Prevent context menu on long press/right click
      galleryContainer.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
    }

    // Prevent default browser drag behavior on the image itself
    const imgElement = galleryContainer.querySelector("img");
    if (imgElement) {
      imgElement.addEventListener("dragstart", (e) => e.preventDefault());
    }

    function touchStart(event) {
      isDragging = true;
      startPos = getPositionX(event);
      galleryContainer.style.cursor = "grabbing";
      animationID = requestAnimationFrame(animation);
    }

    function touchEnd() {
      isDragging = false;
      cancelAnimationFrame(animationID);
      galleryContainer.style.cursor = "grab";

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
      setSliderPosition();
    }

    function touchMove(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
      }
    }

    function getPositionX(event) {
      return event.type.includes("mouse")
        ? event.pageX
        : event.touches[0].clientX;
    }

    function animation() {
      setSliderPosition();
      if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
      if (mainImage)
        mainImage.style.transform = `translateX(${currentTranslate}px)`;
    }
  }

  // Quantity Selector Logic
  const qtyInputs = document.querySelectorAll(".quantity-selector");

  qtyInputs.forEach((selector) => {
    const input = selector.querySelector(".qty-input");
    const minusBtn = selector.querySelector(".minus");
    const plusBtn = selector.querySelector(".plus");

    if (input && minusBtn && plusBtn) {
      minusBtn.addEventListener("click", () => {
        const currentValue = parseInt(input.value);
        if (currentValue > 1) {
          input.value = currentValue - 1;
        }
      });

      plusBtn.addEventListener("click", () => {
        const currentValue = parseInt(input.value);
        input.value = currentValue + 1;
      });
    }
  });
});

function buyNow() {
  var form = document.querySelector('form[action*="/cart/add"]');
  if (!form) return;

  var variantId = form.querySelector('input[name="id"]').value;
  var qtyInput = form.querySelector('input[name="quantity"]');
  var qty = qtyInput ? qtyInput.value : 1;

  window.location.href = "/cart/" + variantId + ":" + qty;
}

document.addEventListener("DOMContentLoaded", function () {
  // Size Chart Modal Logic
  const sizeChartLinks = document.querySelectorAll(".size-chart-link");
  const sizeChartModal = document.querySelector(".size-chart-modal");
  const closeModalBtn = document.querySelector(".close-modal");
  const modalOverlay = document.querySelector(".size-chart-overlay");

  if (sizeChartModal) {
    sizeChartLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        sizeChartModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      });
    });

    function closeModal() {
      sizeChartModal.classList.remove("active");
      document.body.style.overflow = "";
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
      modalOverlay.addEventListener("click", closeModal);
    }

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sizeChartModal.classList.contains("active")) {
        closeModal();
      }
    });
  }
});
