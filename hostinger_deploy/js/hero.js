/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — HERO SECTION CONTROLLER (js/hero.js)
 * Vanilla JavaScript (ES6)
 * Handles smooth scroll trigger for hero indicator, hero reveal animations,
 * and particle initialization hook.
 * ==========================================================================
 */

class HeroSectionController {
  constructor() {
    this.heroSection = document.getElementById('hero');
    this.scrollTrigger = document.getElementById('hero-scroll-trigger');

    if (this.heroSection) {
      this.init();
    }
  }

  init() {
    this.triggerRevealAnimations();
    this.bindScrollTrigger();
  }

  /**
   * Triggers GPU-accelerated entrance animations after DOM ready
   */
  triggerRevealAnimations() {
    // Add animated class shortly after initialization to trigger CSS transitions
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (this.heroSection) {
          this.heroSection.classList.add('hero--animated');
        }
      }, 100);
    });
  }

  /**
   * Binds click and keyboard events on the hero scroll indicator
   */
  bindScrollTrigger() {
    if (!this.scrollTrigger) return;

    const scrollToNextSection = () => {
      const nextSection = this.heroSection.nextElementSibling || document.getElementById('banquet-halls');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
      }
    };

    this.scrollTrigger.addEventListener('click', scrollToNextSection);

    this.scrollTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToNextSection();
      }
    });
  }
}

// Instantiate on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.shreeHero = new HeroSectionController();
});
