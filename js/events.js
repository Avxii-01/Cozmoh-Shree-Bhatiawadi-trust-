/**
 * ==========================================================================
 * SHREE BHATIAWADI — BHATIA CULTURAL FORUM SLIDER (js/events.js)
 * Lightweight Vanilla JS custom carousel with clean modular logic:
 * - Auto-play crossfade every 5 seconds (700-900ms transition)
 * - Manual navigation (Prev/Next buttons, Pagination dots)
 * - Temporary pause on manual interaction (resumes after 8 seconds)
 * - Hover pause on desktop, touch swipe gestures on mobile.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('cultural-slider-viewport');
  const slides = Array.from(document.querySelectorAll('.cultural-slide'));
  const dots = Array.from(document.querySelectorAll('.cultural-dot'));
  const prevBtn = document.getElementById('cultural-prev-btn');
  const nextBtn = document.getElementById('cultural-next-btn');

  if (!viewport || slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;
  let resumeTimer = null;
  let isHovered = false;

  const AUTO_PLAY_INTERVAL = 5000;   /* 5 seconds */
  const RESUME_DELAY = 8000;         /* 8 seconds after manual interaction */

  /**
   * Switch Active Slide
   * @param {number} targetIndex - Index of slide to display
   */
  const goToSlide = (targetIndex) => {
    if (targetIndex === currentIndex) return;

    // Remove active class from current slide & dot
    slides[currentIndex].classList.remove('cultural-slide--active');
    dots[currentIndex].classList.remove('cultural-dot--active');
    dots[currentIndex].setAttribute('aria-selected', 'false');

    // Set new current index with wrap-around boundary check
    currentIndex = (targetIndex + slides.length) % slides.length;

    // Activate new slide & dot
    slides[currentIndex].classList.add('cultural-slide--active');
    dots[currentIndex].classList.add('cultural-dot--active');
    dots[currentIndex].setAttribute('aria-selected', 'true');
  };

  /**
   * Next Slide Handler
   */
  const nextSlide = () => {
    goToSlide(currentIndex + 1);
  };

  /**
   * Prev Slide Handler
   */
  const prevSlide = () => {
    goToSlide(currentIndex - 1);
  };

  /**
   * Start Auto Play Cycle
   */
  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, AUTO_PLAY_INTERVAL);
  };

  /**
   * Stop Auto Play Cycle
   */
  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  /**
   * Handle Manual Interaction (Pause & Resume after 8 seconds)
   */
  const handleUserInteraction = () => {
    stopAutoPlay();
    if (resumeTimer) clearTimeout(resumeTimer);

    resumeTimer = setTimeout(() => {
      startAutoPlay();
    }, RESUME_DELAY);
  };

  /* ── Event Listeners ───────────────────────────────────────────────── */

  // Navigation Arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      handleUserInteraction();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      handleUserInteraction();
    });
  }

  // Pagination Dots
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.currentTarget.getAttribute('data-slide-target'), 10);
      if (!isNaN(targetIndex)) {
        goToSlide(targetIndex);
        handleUserInteraction();
      }
    });
  });

  // Desktop Hover Pause
  viewport.parentElement.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  viewport.parentElement.addEventListener('mouseleave', () => {
    isHovered = false;
  });

  // Touch Swipe Support for Mobile Devices
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50; // Minimum swipe distance in px
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swiped Left -> Next Slide
      nextSlide();
      handleUserInteraction();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swiped Right -> Prev Slide
      prevSlide();
      handleUserInteraction();
    }
  };

  // Initialize Auto Play
  startAutoPlay();
});
