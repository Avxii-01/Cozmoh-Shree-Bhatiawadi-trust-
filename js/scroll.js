/**
 * ==========================================================================
 * SHREE BHATIAWADI - SCROLL REVEAL OBSERVER
 * Single Responsibility: IntersectionObserver for scroll animations
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-scale');

  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
});
