/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — LEGACY TIMELINE & IMPACT CONTROLLER (js/legacy.js)
 * ES6 Vanilla JavaScript
 * Features IntersectionObserver scroll triggers, 150ms sequential milestone reveals,
 * gold line animation, 1800ms ease-out counter animation, and parallax scroll.
 * ==========================================================================
 */

class LegacyTimelineController {
  constructor() {
    this.section = document.getElementById('legacy-timeline');
    this.timelineLine = document.querySelector('.legacy-timeline__line-progress');
    this.timelineNodes = document.querySelectorAll('.legacy-timeline__node');
    this.statNumbers = document.querySelectorAll('.legacy-stat__val[data-target]');
    this.storyImg = document.querySelector('.legacy__story-bg');
    
    this.animated = false;

    if (this.section) {
      this.init();
    }
  }

  init() {
    this.setupIntersectionObserver();
    this.setupParallaxScroll();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animated = true;
          this.animateTimeline();
          this.animateCounters();
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(this.section);
  }

  /**
   * Step 2 & 3: Gold Line Draw & 150ms Sequential Milestone Reveal
   */
  animateTimeline() {
    // Step 2: Animate timeline line (left to right on desktop, top to bottom on mobile)
    if (this.timelineLine) {
      if (window.innerWidth <= 768) {
        this.timelineLine.style.height = '100%';
      } else {
        this.timelineLine.style.width = '100%';
      }
    }

    // Step 3: Sequentially reveal milestones (1948 -> 1960s -> 1980s -> 2000s -> Today) with 150ms delay
    this.timelineNodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.add('legacy-timeline__node--active');
      }, 200 + (index * 150));
    });
  }

  /**
   * 1800ms Ease-Out Statistics Counter Animation
   */
  animateCounters() {
    this.statNumbers.forEach(stat => {
      const rawTarget = stat.getAttribute('data-target') || stat.textContent.trim();
      if (!rawTarget) return;

      // Extract number portion and suffix (e.g., "75+", "100K+", "5,000+")
      const match = rawTarget.match(/([\d,]+)(.*)/);
      if (!match) return;

      const rawNumStr = match[1].replace(/,/g, '');
      const targetNum = parseInt(rawNumStr, 10);
      const suffix = match[2];
      const hasComma = match[1].includes(',');

      if (isNaN(targetNum)) return;

      const duration = 1800; // 1800ms smooth count-up
      const startTime = performance.now();

      const updateCounter = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic formula
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentNum = Math.floor(easeOut * targetNum);

        const formatted = hasComma ? currentNum.toLocaleString('en-US') : currentNum.toString();
        stat.textContent = formatted + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          const finalFormatted = hasComma ? targetNum.toLocaleString('en-US') : targetNum.toString();
          stat.textContent = finalFormatted + suffix;
        }
      };

      requestAnimationFrame(updateCounter);
    });
  }

  /**
   * Parallax Scroll Effect on Story Image
   */
  setupParallaxScroll() {
    if (!this.storyImg) return;

    window.addEventListener('scroll', () => {
      if (!this.section) return;
      const rect = this.section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.05;
        const yPos = (window.innerHeight - rect.top) * speed;
        this.storyImg.style.transform = `scale(1.04) translateY(${yPos - 12}px)`;
      }
    }, { passive: true });
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.shreeLegacy = new LegacyTimelineController();
});
