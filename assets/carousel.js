document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const container = document.querySelector('.carousel-container');
  if (!track || !container) return;

  let isDragging = false;
  let isHovering = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let dragID;
  let autoPlayID;
  let autoPlaySpeed = 1; // Speed for auto-scrolling
  let isAutoPlaying = true; // Internal flag for touch interaction pause

  // Original slides
  let slides = Array.from(track.children);
  if (slides.length === 0) return;

  let slideWidth = slides[0].offsetWidth + 20; // Width + gap
  let totalWidth = slideWidth * slides.length;

  // Clone enough slides to fill the screen and allow for smooth looping
  const cloneCount = 3; 
  for (let i = 0; i < cloneCount; i++) {
    slides.forEach(slide => {
      const clone = slide.cloneNode(true);
      track.appendChild(clone);
    });
  }

  // Recalculate dimensions on resize
  window.addEventListener('resize', () => {
    slideWidth = slides[0].offsetWidth + 20;
    totalWidth = slideWidth * slides.length;
  });

  // Hover Event Listeners
  container.addEventListener('mouseenter', () => {
    isHovering = true;
  });

  container.addEventListener('mouseleave', () => {
    isHovering = false;
  });

  // Drag/Touch Event Listeners
  track.addEventListener('mousedown', touchStart);
  track.addEventListener('touchstart', touchStart);

  track.addEventListener('mouseup', touchEnd);
  track.addEventListener('mouseleave', touchEnd);
  track.addEventListener('touchend', touchEnd);

  track.addEventListener('mousemove', touchMove);
  track.addEventListener('touchmove', touchMove);

  // Auto-play loop
  function autoPlay() {
    // Run auto-play only if:
    // 1. Not currently dragging
    // 2. Not hovering (mouse over)
    // 3. Not paused by touch interaction (isAutoPlaying flag)
    if (!isDragging && !isHovering && isAutoPlaying) {
      currentTranslate -= autoPlaySpeed;
      checkBoundary();
      setSliderPosition();
    }
    autoPlayID = requestAnimationFrame(autoPlay);
  }
  
  // Start auto-play
  autoPlay();

  function touchStart(event) {
    isDragging = true;
    isAutoPlaying = false; // Pause on interaction (mainly for touch)
    startPos = getPositionX(event);
    dragID = requestAnimationFrame(animation);
    track.style.cursor = 'grabbing';
  }

  function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(dragID);
    prevTranslate = currentTranslate;
    track.style.cursor = 'grab';
    
    // Resume auto-play after a short delay (mainly for touch)
    // For mouse, isHovering will still prevent it until leave
    setTimeout(() => {
      isAutoPlaying = true;
    }, 1000);
  }

  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      currentTranslate = prevTranslate + currentPosition - startPos;
      checkBoundary();
    }
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function animation() {
    setSliderPosition();
    if (isDragging) dragID = requestAnimationFrame(animation);
  }

  function setSliderPosition() {
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function checkBoundary() {
    if (Math.abs(currentTranslate) >= totalWidth) {
      currentTranslate += totalWidth;
      prevTranslate += totalWidth; 
    } 
    else if (currentTranslate > 0) {
      currentTranslate -= totalWidth;
      prevTranslate -= totalWidth;
    }
  }
});
