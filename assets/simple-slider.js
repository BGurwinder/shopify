document.addEventListener('DOMContentLoaded', function() {
  const sliders = document.querySelectorAll('.simple-slider-container');

  sliders.forEach(slider => {
    const track = slider.querySelector('.simple-slider-track');
    const slides = Array.from(track.children);
    const nextBtn = slider.querySelector('.simple-slider-next');
    const prevBtn = slider.querySelector('.simple-slider-prev');
    
    if (slides.length === 0) return;

    // Clone slides for infinite loop
    const slidesToClone = slides.length; // Clone all slides to ensure enough buffer
    
    // Clone for end (append)
    slides.forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.classList.add('clone');
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    // Clone for start (prepend)
    slides.slice().reverse().forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.classList.add('clone');
      clone.setAttribute('aria-hidden', 'true');
      track.insertBefore(clone, track.firstChild);
    });

    const allSlides = Array.from(track.children);
    let currentIndex = slidesToClone; // Start at the first real slide
    let isTransitioning = false;
    const gap = 20;

    function updateSlideWidth() {
      // Calculate slide width dynamically based on CSS flex-basis
      const slide = allSlides[0];
      return slide.getBoundingClientRect().width;
    }

    function updatePosition(transition = true) {
      const slideWidth = updateSlideWidth();
      const offset = -(currentIndex * (slideWidth + gap));
      
      if (!transition) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 0.5s ease-in-out';
      }
      
      track.style.transform = `translateX(${offset}px)`;
    }

    // Initial position
    // Wait a moment for layout to settle
    setTimeout(() => {
      updatePosition(false);
    }, 100);

    window.addEventListener('resize', () => {
      updatePosition(false);
    });

    function handleTransitionEnd() {
      isTransitioning = false;
      const realCount = slides.length;
      
      // If we reached the end clones, jump back to start
      if (currentIndex >= realCount + slidesToClone) {
        currentIndex = slidesToClone;
        updatePosition(false);
      }
      // If we reached the start clones, jump forward to end
      else if (currentIndex < slidesToClone) {
        currentIndex = realCount + slidesToClone - 1;
        updatePosition(false);
      }
    }

    track.addEventListener('transitionend', handleTransitionEnd);

    nextBtn.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updatePosition();
    });

    prevBtn.addEventListener('click', () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updatePosition();
    });
  });
});
