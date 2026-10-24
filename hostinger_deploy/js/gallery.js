/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — HERITAGE EVENT GALLERY CONTROLLER
 * Staggered independent auto-crossfade animation & IntersectionObserver
 * ==========================================================================
 */

class HeritageGalleryController {
  constructor() {
    this.section = document.getElementById('event-gallery');
    this.frames = Array.from(document.querySelectorAll('.h-frame'));
    this.frameTimers = [];
    this.isVisible = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.frames.length) {
      this.init();
    }
  }

  init() {
    // Setup IntersectionObserver to start/pause timers based on viewport visibility
    if ('IntersectionObserver' in window && this.section) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startAllFrameRotations();
          } else {
            this.stopAllFrameRotations();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(this.section);
    } else {
      this.startAllFrameRotations();
    }
  }

  startAllFrameRotations() {
    if (this.isVisible || this.reducedMotion) return;
    this.isVisible = true;

    // Stagger start of individual frame auto-crossfades:
    // Frame 0: 3800ms
    // Frame 1: 4600ms
    // Frame 2: 5400ms
    // Frame 3: 4200ms
    // Frame 4: 5000ms
    const intervals = [3800, 4600, 5400, 4200, 5000];

    this.frames.forEach((frame, idx) => {
      const slides = Array.from(frame.querySelectorAll('.h-frame__img'));
      if (slides.length <= 1) return;

      let currentIndex = 0;
      const interval = intervals[idx % intervals.length];

      // Delay initial start by stagger offset
      const initialDelay = idx * 600;

      const timeoutId = setTimeout(() => {
        const timerId = setInterval(() => {
          const nextIndex = (currentIndex + 1) % slides.length;
          slides[currentIndex].classList.remove('h-frame__img--active');
          slides[nextIndex].classList.add('h-frame__img--active');
          currentIndex = nextIndex;
        }, interval);

        this.frameTimers.push(timerId);
      }, initialDelay);

      this.frameTimers.push(timeoutId);
    });
  }

  stopAllFrameRotations() {
    this.isVisible = false;
    this.frameTimers.forEach(id => {
      clearInterval(id);
      clearTimeout(id);
    });
    this.frameTimers = [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HeritageGalleryController();
});
