/**
 * ==========================================================================
 * SHREE BHATIAWADI - ANIMATED COUNTER CONTROLLER
 * Single Responsibility: IntersectionObserver animated count-up numbers
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const counterElements = document.querySelectorAll('.js-counter');

  if (counterElements.length === 0) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target') || '0');
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = parseInt(el.getAttribute('data-duration') || '2000', 10);
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing cubic-bezier(.2,.8,.2,1) approximation
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeProgress * target);

      el.textContent = currentValue.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        el.textContent = target.toLocaleString() + suffix;
      }
    };

    requestAnimationFrame(updateValue);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counterElements.forEach(counter => observer.observe(counter));
});
