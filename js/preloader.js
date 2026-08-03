/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — PREMIUM PRELOADER  (v4 — Extended Hold & Smooth Reveal)
 * ==========================================================================
 *
 * Sequence Timeline:
 *   300ms  → Golden spark appears & traces logo outline
 *  1200ms  → Soft gold glow expands behind logo
 *  1250ms  → Logo fills with rich gold
 *  1650ms  → Gold rule draws across
 *  1800ms  → "Shree Bhatiawadi Trust" wordmark rises
 *  2050ms  → Tagline fades in
 *  2800ms-3200ms → Extended hold moment for brand impact
 *  3200ms  → EXIT BEGINS:
 *            1. Soft gold glow expands outwards into hero background
 *            2. Homepage softly fades in underneath
 *            3. Preloader overlay fades out smoothly
 *  4200ms  → Preloader node cleaned up from DOM
 * Total duration: ~2.8-3.2 seconds display
 */

(function SBTPreloader() {
  'use strict';

  var HOLD_DURATION = 4500; /* Extended hold for total ~4.5s display (1.3s longer) */
  var REDUCED_HOLD  = 400;
  var EXIT_DURATION = 1200;
  var DOM_CLEANUP   = EXIT_DURATION + 100;

  /* Dev mode: sessionStorage check disabled for live testing */

  function init() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    document.body.classList.add('preloader-active');

    var prefersReduced = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    if (prefersReduced) {
      setTimeout(function () { dismiss(preloader, true); }, REDUCED_HOLD);
    } else {
      setTimeout(function () { dismiss(preloader, false); }, HOLD_DURATION);
    }
  }

  function dismiss(preloader, instant) {
    /* Trigger glow expansion and overlay fade */
    preloader.classList.add('preloader--exit');
    /* Trigger homepage soft fade-in underneath */
    document.body.classList.remove('preloader-active');
    document.body.classList.add('page-ready');

    setTimeout(function () {
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
      document.dispatchEvent(new CustomEvent('sbt:preloader-done'));
    }, instant ? 50 : DOM_CLEANUP);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
