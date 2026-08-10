/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — HISTORY & HERITAGE CONTROLLER (js/history.js)
 * 1. Scroll-Progress Driven Reversible Timeline & Central Heritage Path
 * 2. Entrance Count-Up Animated Statistics (Runs ONCE on Viewport Entry)
 * 3. Prefers-reduced-motion compliance
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────────────────────────────────────
     1. SCROLL-PROGRESS DRIVEN REVERSIBLE TIMELINE
     ────────────────────────────────────────────────────────────────────────── */
  const timelineSection = document.querySelector('.history-timeline');
  const lineFill = document.querySelector('.history-timeline__line-fill');
  const timelineItems = document.querySelectorAll('.history-timeline__item');

  if (timelineSection && timelineItems.length > 0) {
    if (prefersReducedMotion) {
      timelineItems.forEach(item => item.classList.add('is-active'));
      if (lineFill) lineFill.style.height = '100%';
    } else {
      let ticking = false;

      const updateTimelineOnScroll = () => {
        const rect = timelineSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionHeight = rect.height;

        // Calculate current scroll progress within the timeline section (0 to 1)
        const startOffset = windowHeight * 0.55;
        const endOffset = windowHeight * 0.35;
        
        let progress = (windowHeight - rect.top - startOffset) / (sectionHeight - startOffset + endOffset);
        progress = Math.max(0, Math.min(1, progress));

        // Update progressive gold path height
        if (lineFill) {
          lineFill.style.height = `${(progress * 100).toFixed(1)}%`;
        }

        // Calculate active state for each milestone based on viewport position
        const activationThreshold = windowHeight * 0.62;

        timelineItems.forEach((item) => {
          const itemRect = item.getBoundingClientRect();
          const itemCenter = itemRect.top + 30; // Check marker level

          if (itemCenter <= activationThreshold) {
            // Scroll down -> activates milestone
            item.classList.add('is-active');
            item.classList.remove('is-upcoming');
          } else {
            // Scroll UP -> REVERSES milestone back to inactive!
            item.classList.remove('is-active');
            item.classList.add('is-upcoming');
          }
        });

        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(updateTimelineOnScroll);
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      updateTimelineOnScroll(); // Initial position check
    }
  }

  /* ──────────────────────────────────────────────────────────────────────────
     2. ONE-TIME STATS COUNT-UP OBSERVER
     ────────────────────────────────────────────────────────────────────────── */
  const statsSection = document.querySelector('.history-stats');
  const statNumbers = document.querySelectorAll('.history-stats__number[data-count]');

  if (statsSection && statNumbers.length > 0) {
    if (prefersReducedMotion) {
      statNumbers.forEach(el => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '+';
        el.textContent = `${target >= 1000 ? target.toLocaleString() : target}${suffix}`;
      });
    } else {
      let animated = false;

      const animateStats = () => {
        const duration = 1800; // 1.8 seconds
        const startTime = performance.now();

        const step = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

          statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '+';
            const currentVal = Math.floor(easeProgress * target);

            if (target >= 1000) {
              el.textContent = `${currentVal.toLocaleString()}${suffix}`;
            } else {
              el.textContent = `${currentVal}${suffix}`;
            }
          });

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            statNumbers.forEach(el => {
              const target = parseInt(el.getAttribute('data-count'), 10);
              const suffix = el.getAttribute('data-suffix') || '+';
              el.textContent = `${target >= 1000 ? target.toLocaleString() : target}${suffix}`;
            });
          }
        };

        requestAnimationFrame(step);
      };

      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !animated) {
            animated = true;
            animateStats();
            statsObserver.unobserve(entry.target); // Runs ONLY ONCE
          }
        });
      }, {
        threshold: 0.25
      });

      statsObserver.observe(statsSection);
    }
  }
});
