/**
 * ==========================================================================
 * SHREE BHATIAWADI — STATISTICS COUNTER ANIMATION
 * Animates numbers from 0 → target when the section enters the viewport.
 * Runs once only. Uses IntersectionObserver and requestAnimationFrame.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  /**
   * Parse the target value from a stat number element.
   * Handles formats: "75+", "100K+", "5000+", "Many"
   * Returns { numericValue: number, suffix: string, isText: boolean }
   */
  function parseStatValue(raw) {
    const text = raw.trim();

    // Pure text values like "Many" — no animation needed
    if (!/\d/.test(text)) {
      return { numericValue: 0, suffix: text, isText: true };
    }

    // Extract the number and everything after it
    const match = text.match(/^([\d,]+(?:\.\d+)?)\s*(.*)/);
    if (!match) {
      return { numericValue: 0, suffix: text, isText: true };
    }

    const numStr = match[1].replace(/,/g, '');
    const suffix = match[2] || '';

    return {
      numericValue: parseFloat(numStr),
      suffix: suffix,
      isText: false
    };
  }

  /**
   * Format a number for display during animation.
   * Keeps the same format as the target (e.g. "100K+" stays as "XXK+").
   */
  function formatAnimatedValue(current, parsed) {
    if (parsed.isText) return parsed.suffix;

    // For "100K+" — numericValue is 100, so current animates 0→100.
    // Just round and append the suffix directly.
    if (parsed.suffix.startsWith('K')) {
      return Math.round(current) + parsed.suffix;
    }

    return Math.round(current).toLocaleString() + parsed.suffix;
  }

  /**
   * Animate a single counter element.
   * Duration: 1200ms with easeOutCubic.
   */
  function animateCounter(element, parsed) {
    if (parsed.isText) return; // Don't animate text values like "Many"

    const target = parsed.numericValue;
    // For "100K+" — animate 0→100, then format adds the K
    let animTarget = target;
    if (parsed.suffix.startsWith('K')) {
      animTarget = target; // already parsed as the raw number (100 for "100K+")
    }

    const duration = 1200; // ms
    const startTime = performance.now();

    // easeOutCubic for a smooth deceleration
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const current = eased * animTarget;

      element.textContent = formatAnimatedValue(current, parsed);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    // Start from 0
    element.textContent = '0' + parsed.suffix;
    requestAnimationFrame(tick);
  }

  /**
   * IntersectionObserver — fires once when the section enters view.
   */
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Find all stat number elements and kick off their animations
        const numberEls = statsSection.querySelectorAll('.stats-item__number');
        numberEls.forEach((el) => {
          const targetText = el.getAttribute('data-target') || el.textContent;
          const parsed = parseStatValue(targetText);
          animateCounter(el, parsed);
        });

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  });

  counterObserver.observe(statsSection);
});
