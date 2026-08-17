/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — GILDED HERITAGE EMBLEM REVEAL (PRELOADER ENGINE)
 * ==========================================================================
 *
 * Sequence Timeline (Total ~5.2s before smooth exit dissolve):
 *   0ms - 600ms   → Dark royal background (#15120F) & subtle vignette establishes
 *   600ms - 2500ms → Golden ceremonial line draws around emblem frame
 *  1000ms - 2800ms → Floating gold dust particles awaken around emblem
 *  2500ms - 2750ms → Completed golden line holds briefly
 *  2750ms - 3100ms → Golden line gracefully dissolves (opacity 1->0, scale 1->1.02)
 *  2950ms - 3500ms → Official Shree Bhatiawadi Trust logo emerges from the space
 *  3500ms - 3800ms → Official logo settles gracefully (scale 0.97->1) & holds
 *  3800ms - 4300ms → Heritage divider (── ✦ ──) draws outward from center
 *  4200ms - 4700ms → "SERVING WITH DEVOTION" tagline gently fades & rises
 *  4700ms - 5200ms → Complete brand identity hold moment
 *  5200ms          → EXIT BEGINS:
 *                    1. Gilded identity gently fades
 *                    2. Ambient gold halo expands subtly & overlay dissolves smoothly (1000ms)
 *                    3. Homepage hero reveals underneath (body.page-ready)
 *  6300ms          → Preloader DOM node cleaned up & sbt:preloader-done dispatched
 *
 * Reduced Motion:
 *   Fast ~400ms clean, accessible dismissal
 */

(function SBTPreloader() {
  'use strict';

  var HOLD_DURATION = 5200; /* Total display ~5.2s before exit */
  var REDUCED_HOLD  = 400;
  var EXIT_DURATION = 1000;
  var DOM_CLEANUP   = EXIT_DURATION + 100;

  var animFrameId = null;

  /* ── Staged Gold Particle System (Fine Golden Dust in Dark Room) ─────── */
  function initPreloaderParticles(canvas) {
    if (!canvas || !canvas.getContext) return null;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    var width = 0;
    var height = 0;
    var particles = [];
    var PARTICLE_COUNT = 22; /* Low-Medium density: delicate, floating gilded dust */
    var palette = ['#C89A4A', '#D9B56C', '#E6C885', '#D4A64A'];
    var startTime = Date.now();

    function resize() {
      width = canvas.width = window.innerWidth || document.documentElement.clientWidth;
      height = canvas.height = window.innerHeight || document.documentElement.clientHeight;
    }

    function Particle(idx) {
      this.index = idx;
      this.reset(true);
    }

    Particle.prototype.reset = function (initial) {
      var centerX = (width || window.innerWidth) / 2;
      var centerY = (height || window.innerHeight) / 2;

      if (initial) {
        /* Spawn around emblem area and gently drift */
        var angle = Math.random() * Math.PI * 2;
        var dist = 25 + Math.random() * 130;
        this.x = centerX + Math.cos(angle) * dist;
        this.y = centerY + Math.sin(angle) * dist;
        this.vx = Math.cos(angle) * (0.07 + Math.random() * 0.14);
        this.vy = Math.sin(angle) * (0.07 + Math.random() * 0.14) - 0.08; /* gentle upward drift */
      } else {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.vx = (Math.random() - 0.5) * 0.16;
        this.vy = - (0.12 + Math.random() * 0.20);
      }

      this.size = 1.3 + Math.random() * 2.0; /* 1.3px - 3.3px delicate golden dust */
      this.baseOpacity = 0.16 + Math.random() * 0.22; /* Warm, gentle opacity */
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.hasGlow = Math.random() < 0.35;
    };

    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;

      if (this.y < -15 || this.x < -15 || this.x > width + 15) {
        this.reset(false);
      }
    };

    Particle.prototype.draw = function (context, elapsedMs) {
      /* Particles awaken gradually between 1000ms and 2800ms */
      var globalFade = 1;
      if (elapsedMs < 800) {
        globalFade = 0;
      } else if (elapsedMs < 2800) {
        globalFade = (elapsedMs - 800) / 2000;
      }

      if (globalFade <= 0) return;

      context.save();
      context.globalAlpha = this.baseOpacity * globalFade;
      context.fillStyle = this.color;
      if (this.hasGlow) {
        context.shadowColor = this.color;
        context.shadowBlur = 5;
      }
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    resize();
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle(i));
    }

    window.addEventListener('resize', resize);

    function loop() {
      var elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      for (var j = 0; j < particles.length; j++) {
        particles[j].update();
        particles[j].draw(ctx, elapsed);
      }

      animFrameId = requestAnimationFrame(loop);
    }

    loop();

    return function stop() {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      window.removeEventListener('resize', resize);
    };
  }

  /* ── Preloader Lifecycle ────────────────────────────────────────────── */
  function init() {
    var preloader = document.getElementById('preloader');
    if (!preloader) return;

    document.body.classList.add('preloader-active');

    var prefersReduced = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    var stopParticles = null;
    if (!prefersReduced) {
      var canvas = document.getElementById('preloader-particles');
      if (canvas) {
        stopParticles = initPreloaderParticles(canvas);
      }
    }

    if (prefersReduced) {
      setTimeout(function () { dismiss(preloader, true, stopParticles); }, REDUCED_HOLD);
    } else {
      setTimeout(function () { dismiss(preloader, false, stopParticles); }, HOLD_DURATION);
    }
  }

  function dismiss(preloader, instant, stopParticles) {
    if (stopParticles) {
      stopParticles();
    }

    /* Trigger preloader exit fade */
    preloader.classList.add('preloader--exit');

    /* Trigger homepage soft reveal underneath */
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
