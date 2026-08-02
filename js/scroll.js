/**
 * ==========================================================================
 * SHREE BHATIAWADI - SCROLL REVEAL OBSERVER & STAGGERED TRANSITIONS
 * IntersectionObserver for high-performance 60fps scroll animations
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale');

  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Auto-apply subtle staggered sibling delay (80ms) if no explicit inline delay is present
        const el = entry.target;
        if (!el.style.transitionDelay && el.parentElement) {
          const siblings = Array.from(el.parentElement.children).filter(child => 
            child.classList.contains('reveal-fade-up') ||
            child.classList.contains('reveal-fade-left') ||
            child.classList.contains('reveal-fade-right') ||
            child.classList.contains('reveal-scale')
          );
          const index = siblings.indexOf(el);
          if (index > 0) {
            el.style.transitionDelay = `${Math.min(index * 80, 480)}ms`;
          }
        }

        el.classList.add('reveal-active');
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.10,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
