/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — SECTION PARTICLE SYSTEM ENGINE (v6 — Dual Palettes)
 * ==========================================================================
 *
 * Requirements & Enhancements:
 *   1. Dual Color Palettes:
 *      - Light Backgrounds (Banquet, Initiatives, Events, Footer):
 *        Richer antique gold & bronze tones (#7A4F1D, #8A5A24, #9C6A2F, #A8741A)
 *      - Dark Backgrounds (Hero, Stats, CTA):
 *        Brighter glowing gold tones (#C89B3C, #D4A64A, #E3C06A)
 *
 *   2. Increased Particle Density (Desktop baseline):
 *      - Hero: 80 | CTA: 70 | Banquet: 55 | Initiatives: 50 | Events: 50 | Stats: 45 | Footer: 30
 *      - Auto-scales for tablet (0.65) and mobile (0.40)
 *
 *   3. Visibility & Glow:
 *      - Opacity range: 0.16 – 0.28 (Noticeably visible illuminated gold dust)
 *      - 25–30% of particles have soft radial glow shadow
 *      - Size Tiering: 55% small (1.5-2px), 30% medium (2-3px), 15% large (3-4px)
 *
 *   4. Speed Depth Effect:
 *      - Small particles move faster (0.14-0.24 px/f)
 *      - Medium particles move normal (0.09-0.16 px/f)
 *      - Large glowing particles move slowest (0.05-0.09 px/f)
 *
 *   5. Performance:
 *      - IntersectionObserver pauses rendering when sections scroll off-screen (60 FPS)
 */

window.SBTParticles = (function SBTParticles() {
  'use strict';

  /* ── Configuration ────────────────────────────────────────────────── */
  var CONFIG = {
    /* Section baseline particle counts (Desktop baseline) */
    counts: {
      'hero': 50,
      'mission': 40,
      'banquet': 42, /* Increased 40% from 30 */
      'legacy': 45,
      'initiatives': 35, /* Increased 40% from 25 */
      'events': 40,
      'cta': 28, /* Increased 40% from 20 */
      'footer': 28, /* Increased 40% from 20 */
    },

    /* Responsive scaling factors (1.0 on mobile to preserve full density) */
    tabletScale: 0.90,
    mobileScale: 1.0,

    /* Background classification per section key */
    darkSections: ['hero', 'legacy', 'events'],

    /* Dual Palettes */
    palettes: {
      light: ['#B88A3A', '#C69C4D', '#C8A25A', '#BF9544'],
      dark: ['#C89B3C', '#D4A64A', '#E3C06A']
    },

    /* Size distribution (50% small 2-3px, 35% medium 4-5px, 15% accent 6px) */
    sizeDistribution: [
      { weight: 50, min: 2.0, max: 3.0, speedMin: 0.12, speedMax: 0.22, tier: 'small' },
      { weight: 35, min: 4.0, max: 5.0, speedMin: 0.08, speedMax: 0.15, tier: 'medium' },
      { weight: 15, min: 5.5, max: 6.5, speedMin: 0.04, speedMax: 0.08, tier: 'large' },
    ],

    /* Opacity range for light & dark sections */
    opacityMin: 0.20,
    opacityMax: 0.30,

    /* 28% soft glow */
    glowChance: 0.28,

    angleSpreadRad: 1.0,
    twinkleSpeedMin: 0.002,
    twinkleSpeedMax: 0.005,

    /* Cursor interaction */
    repelRadius: 160,
    repelStrength: 1.6,
    repelMaxPush: 2.6,
  };

  /* Helper functions */
  function rnd(min, max) { return min + Math.random() * (max - min); }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function pickSizeTier() {
    var total = 0, i, d = CONFIG.sizeDistribution;
    for (i = 0; i < d.length; i++) total += d[i].weight;
    var roll = Math.random() * total, cumulative = 0;
    for (i = 0; i < d.length; i++) {
      cumulative += d[i].weight;
      if (roll < cumulative) return d[i];
    }
    return d[0];
  }

  /* ── Particle Constructor ─────────────────────────────────────────── */
  function Particle(W, H, palette) {
    this.reset(W, H, palette, true);
  }

  Particle.prototype.reset = function (W, H, palette, spawnAtRandom) {
    this.x = rnd(0, W);
    this.y = spawnAtRandom ? rnd(0, H) : H + rnd(5, 20);

    var tier = pickSizeTier();
    this.r = rnd(tier.min, tier.max);

    /* Speed depth effect: smaller = faster, larger = slowest */
    var speed = rnd(tier.speedMin, tier.speedMax);
    var angle = -Math.PI / 2 + (Math.random() - 0.5) * CONFIG.angleSpreadRad;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    /* Higher opacity range: 0.16–0.28 */
    this.baseOpacity = rnd(CONFIG.opacityMin, CONFIG.opacityMax);
    this.opacity = this.baseOpacity;

    /* Palette selection based on section background type */
    this.color = palette[Math.floor(Math.random() * palette.length)];

    /* 28% glowing particles */
    this.hasGlow = (tier.tier === 'large') ? (Math.random() < 0.65) : (Math.random() < CONFIG.glowChance);
    if (this.hasGlow) {
      this.glowBlur = rnd(5, 12);
    }

    this.twinkleSpeed = rnd(CONFIG.twinkleSpeedMin, CONFIG.twinkleSpeedMax);
    this.twinklePhase = Math.random() * Math.PI * 2;
  };

  Particle.prototype.update = function (W, H, palette, frame, pointer) {
    this.x += this.vx;
    this.y += this.vy;

    /* Twinkle sine wave */
    this.opacity = this.baseOpacity * (0.82 + 0.18 * Math.sin(frame * this.twinkleSpeed + this.twinklePhase));

    /* Cursor repulsion */
    if (pointer.x !== -9999) {
      var dx = this.x - pointer.x;
      var dy = this.y - pointer.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0 && dist < CONFIG.repelRadius) {
        var norm = (CONFIG.repelRadius - dist) / CONFIG.repelRadius;
        var force = norm * norm * CONFIG.repelStrength;
        var pushX = (dx / dist) * force;
        var pushY = (dy / dist) * force;
        var pushLen = Math.sqrt(pushX * pushX + pushY * pushY);
        if (pushLen > CONFIG.repelMaxPush) {
          pushX *= (CONFIG.repelMaxPush / pushLen);
          pushY *= (CONFIG.repelMaxPush / pushLen);
        }
        this.x += pushX;
        this.y += pushY;
      }
    }

    /* Recycle off top/sides */
    if (this.y < -15 || this.x < -15 || this.x > W + 15) {
      this.reset(W, H, palette, false);
    }
  };

  Particle.prototype.draw = function (ctx) {
    if (this.opacity <= 0.005) return;

    ctx.save();
    ctx.globalAlpha = clamp(this.opacity, 0, 1);

    if (this.hasGlow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.glowBlur;
    }

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  /* ── Section Instance ─────────────────────────────────────────────── */
  function SectionInstance(canvasEl, sectionKey) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.sectionKey = sectionKey;

    /* Automatically determine appropriate color palette */
    var isDark = CONFIG.darkSections.indexOf(sectionKey) !== -1;
    this.palette = isDark ? CONFIG.palettes.dark : CONFIG.palettes.light;

    this.particles = [];
    this.frame = 0;
    this.active = false;
    this.isVisible = false;
    this.W = 0;
    this.H = 0;
    this.pointer = { x: -9999, y: -9999 };

    this.init();
  }

  SectionInstance.prototype.init = function () {
    this.resize();
    this.build();
    this.bindEvents();
    this.observe();
  };

  SectionInstance.prototype.resize = function () {
    var parent = this.canvas.parentElement;
    if (!parent) return;
    this.W = parent.offsetWidth || window.innerWidth;
    this.H = parent.offsetHeight || 400;
    this.canvas.width = this.W;
    this.canvas.height = this.H;
  };

  SectionInstance.prototype.getCount = function () {
    var base = CONFIG.counts[this.sectionKey] || 45;
    if (this.W < 768) {
      if (this.sectionKey === 'hero') {
        return 24; /* Mobile Hero particle count set to exactly 24 */
      }
      return Math.max(base, Math.round(base * CONFIG.mobileScale));
    }
    if (this.W < 1024) return Math.max(base, Math.round(base * CONFIG.tabletScale));
    return base;
  };

  SectionInstance.prototype.build = function () {
    var count = this.getCount();
    this.particles = [];
    for (var i = 0; i < count; i++) {
      this.particles.push(new Particle(this.W, this.H, this.palette));
    }
  };

  SectionInstance.prototype.bindEvents = function () {
    var self = this;
    var parent = this.canvas.parentElement;

    parent.addEventListener('mousemove', function (e) {
      var rect = self.canvas.getBoundingClientRect();
      self.pointer.x = e.clientX - rect.left;
      self.pointer.y = e.clientY - rect.top;
    }, { passive: true });

    parent.addEventListener('mouseleave', function () {
      self.pointer.x = -9999;
      self.pointer.y = -9999;
    });
  };

  SectionInstance.prototype.observe = function () {
    var self = this;
    var parent = this.canvas.parentElement;

    if ('ResizeObserver' in window && parent) {
      this.resizeObserver = new ResizeObserver(function () {
        var prevW = self.W;
        var prevH = self.H;
        self.resize();
        if (Math.abs(self.W - prevW) > 5 || Math.abs(self.H - prevH) > 5) {
          self.build();
        }
      });
      this.resizeObserver.observe(parent);
    }

    if ('IntersectionObserver' in window && parent) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          self.isVisible = entry.isIntersecting;
          if (self.isVisible && !self.active) {
            self.active = true;
            self.loop();
          } else if (!self.isVisible) {
            self.active = false;
          }
        });
      }, { threshold: 0.05 });
      observer.observe(parent);
    } else {
      this.isVisible = true;
      this.active = true;
      this.loop();
    }
  };

  SectionInstance.prototype.loop = function () {
    if (!this.active || !this.isVisible) return;
    var self = this;
    requestAnimationFrame(function () { self.loop(); });
    this.frame++;

    this.ctx.clearRect(0, 0, this.W, this.H);
    for (var i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.W, this.H, this.palette, this.frame, this.pointer);
      this.particles[i].draw(this.ctx);
    }
  };

  /* ── Public API & Boot ───────────────────────────────────────────── */
  var instances = [];
  var isInitialized = false;

  function initAll() {
    if (isInitialized) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var canvases = document.querySelectorAll('.section-particle-canvas');
    canvases.forEach(function (canvasEl) {
      var key = canvasEl.getAttribute('data-particle-section');
      if (key) {
        instances.push(new SectionInstance(canvasEl, key));
      }
    });

    window.addEventListener('resize', function () {
      instances.forEach(function (inst) {
        inst.resize();
        inst.build();
      });
    });

    isInitialized = true;
  }

  function boot() {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      document.addEventListener('sbt:preloader-done', function onDone() {
        document.removeEventListener('sbt:preloader-done', onDone);
        initAll();
      });
      setTimeout(function () {
        if (!isInitialized) initAll();
      }, 3500);
    } else {
      /* Inner pages without preloader initialize immediately */
      initAll();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  return { init: initAll, instances: instances };

})();
