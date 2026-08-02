/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — LEGACY TIMELINE & IMPACT CONTROLLER (js/legacy.js)
 * ES6 Vanilla JavaScript
 * Features IntersectionObserver scroll triggers, sequential 140ms node fade-ins,
 * horizontal line draw, count-up statistics, and subtle scroll parallax for story image.
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
      rootMargin: '0px 0px -100px 0px',
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

  animateTimeline() {
    // 1. Draw continuous gold line from left to right
    if (this.timelineLine) {
      this.timelineLine.style.width = '100%';
    }

    // 2. Sequentially reveal nodes with 140ms delay
    this.timelineNodes.forEach((node, index) => {
      setTimeout(() => {
        node.classList.add('legacy-timeline__node--active');
      }, index * 140);
    });
  }

  animateCounters() {
    this.statNumbers.forEach(stat => {
      const targetStr = stat.getAttribute('data-target');
      if (!targetStr) return;

      const numericMatch = targetStr.match(/\d+/);
      if (!numericMatch) {
        stat.textContent = targetStr;
        return;
      }

      const targetNum = parseInt(numericMatch[0], 10);
      const suffix = targetStr.replace(numericMatch[0], '');
      let currentNum = 0;
      const duration = 1600;
      const stepTime = 30;
      const totalSteps = Math.ceil(duration / stepTime);
      const increment = Math.ceil(targetNum / totalSteps);

      const timer = setInterval(() => {
        currentNum += increment;
        if (currentNum >= targetNum) {
          currentNum = targetNum;
          stat.textContent = currentNum + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = currentNum + suffix;
        }
      }, stepTime);
    });
  }

  /**
   * Subtle Parallax Scroll Effect on Archival Image
   */
  setupParallaxScroll() {
    if (!this.storyImg) return;

    window.addEventListener('scroll', () => {
      if (!this.section) return;
      const rect = this.section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const speed = 0.06;
        const yPos = (window.innerHeight - rect.top) * speed;
        this.storyImg.style.transform = `scale(1.04) translateY(${yPos - 15}px)`;
      }
    }, { passive: true });
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.shreeLegacy = new LegacyTimelineController();
});
