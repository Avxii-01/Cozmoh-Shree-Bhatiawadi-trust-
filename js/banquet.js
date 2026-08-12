/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — VENUE SHOWCASE RENDERER (js/banquet.js)
 * Editorial venue spread with alternating layouts & subtle image carousel
 * ==========================================================================
 */

class VenueShowcaseRenderer {
  constructor() {
    this.container = document.getElementById('venue-collection-container');
    this.carousels = [];
    if (this.container && window.venueCollectionData) {
      this.render();
      this.initCarousels();
    }
  }

  render() {
    const venues = window.venueCollectionData;
    let html = '';

    venues.forEach((venue, i) => {
      const imgLeft = i % 2 === 0;

      const amenities = venue.amenities.map(a => `
        <li class="vs-amenity">
          <svg class="vs-amenity__ic" viewBox="0 0 24 24" fill="none">${a.icon}</svg>
          <span class="vs-amenity__tx">${a.name}</span>
        </li>
      `).join('');

      // Carousel images
      const slides = venue.images.map((src, idx) => `
        <img src="${src}" alt="${venue.name}" class="vs__slide ${idx === 0 ? 'vs__slide--active' : ''}" data-index="${idx}" loading="lazy">
      `).join('');

      // Carousel dots
      const dots = venue.images.map((_, idx) => `
        <button type="button" class="vs__dot ${idx === 0 ? 'vs__dot--active' : ''}" data-slide="${idx}" aria-label="Slide ${idx + 1}"></button>
      `).join('');

      const content = `
        <div class="vs__content">
          <span class="vs__num">${venue.number}</span>
          <h3 class="vs__name">${venue.name}</h3>
          <span class="vs__tag">${venue.tagline}</span>
          <p class="vs__desc">${venue.description}</p>
          <div class="vs__cap">
            <div class="vs__cap-item">
              <svg class="vs__cap-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6"/></svg>
              <span class="vs__cap-val">${venue.seatingCapacity}</span>
              <span class="vs__cap-lbl">${venue.seatingLabel}</span>
            </div>
            <span class="vs__cap-div"></span>
            <div class="vs__cap-item">
              <svg class="vs__cap-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              <span class="vs__cap-val">${venue.movingCapacity}</span>
              <span class="vs__cap-lbl">${venue.movingLabel}</span>
            </div>
          </div>
          <ul class="vs__amenities">${amenities}</ul>
          <a href="${venue.bookingUrl}" class="vs__cta">BOOK THIS VENUE <span class="vs__cta-arr">&rarr;</span></a>
        </div>`;

      const image = `
        <div class="vs__image" id="carousel-${venue.id}">
          <div class="vs__slides">${slides}</div>
          <div class="vs__dots">${dots}</div>
        </div>`;

      html += `
      <article class="vs ${imgLeft ? 'vs--img-left' : 'vs--img-right'} reveal-fade-up" id="venue-${venue.id}">
        <!-- Double gold frame border -->
        <svg class="vs__frame" viewBox="0 0 1200 480" preserveAspectRatio="none" aria-hidden="true">
          <rect x="5" y="5" width="1190" height="470" rx="8" fill="none" stroke="#C89A4A" stroke-width="1.5" opacity="0.5"/>
          <rect x="12" y="12" width="1176" height="456" rx="5" fill="none" stroke="#C89A4A" stroke-width="0.7" opacity="0.28"/>
        </svg>
        <!-- Corner ornaments (curved L + dot) -->
        <svg class="vs__co vs__co--tl" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M4 32V14C4 8.477 8.477 4 14 4H32" stroke="#C89A4A" stroke-width="1.2" opacity="0.6"/>
          <circle cx="14" cy="14" r="2" fill="#C89A4A" opacity="0.5"/>
        </svg>
        <svg class="vs__co vs__co--tr" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M32 32V14C32 8.477 27.523 4 22 4H4" stroke="#C89A4A" stroke-width="1.2" opacity="0.6"/>
          <circle cx="22" cy="14" r="2" fill="#C89A4A" opacity="0.5"/>
        </svg>
        <svg class="vs__co vs__co--bl" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M4 4V22C4 27.523 8.477 32 14 32H32" stroke="#C89A4A" stroke-width="1.2" opacity="0.6"/>
          <circle cx="14" cy="22" r="2" fill="#C89A4A" opacity="0.5"/>
        </svg>
        <svg class="vs__co vs__co--br" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M32 4V22C32 27.523 27.523 32 22 32H4" stroke="#C89A4A" stroke-width="1.2" opacity="0.6"/>
          <circle cx="22" cy="22" r="2" fill="#C89A4A" opacity="0.5"/>
        </svg>
        <div class="vs__inner">
          ${imgLeft ? image + content : content + image}
        </div>
      </article>`;

      if (i < venues.length - 1) {
        html += `<div class="vs-sep" aria-hidden="true"><span class="vs-sep__l"></span><svg width="20" height="14" viewBox="0 0 20 14" fill="none"><path d="M10 1C8.5 4.5 5 6.5 1 7c4 0 7.5 2.5 9 6 1.5-3.5 5-6 9-6-4-.5-7.5-2.5-9-6z" fill="rgba(200,154,74,.12)" stroke="#C89A4A" stroke-width=".8"/><circle cx="10" cy="7" r="1.2" fill="#C89A4A"/></svg><span class="vs-sep__l"></span></div>`;
      }
    });

    this.container.innerHTML = html;
  }

  initCarousels() {
    const venues = window.venueCollectionData;
    venues.forEach(venue => {
      const el = document.getElementById(`carousel-${venue.id}`);
      if (el) this.carousels.push(new VsCarousel(el));
    });
  }
}

class VsCarousel {
  constructor(el) {
    this.el = el;
    this.slides = el.querySelectorAll('.vs__slide');
    this.dots = el.querySelectorAll('.vs__dot');
    this.cur = 0;
    this.total = this.slides.length;
    this.iv = null;

    if (this.total > 1) {
      this.dots.forEach((d, i) => d.addEventListener('click', () => { this.go(i); this.reset(); }));
      this.start();
    }
  }
  go(i) {
    if (i === this.cur) return;
    this.slides[this.cur].classList.remove('vs__slide--active');
    this.dots[this.cur].classList.remove('vs__dot--active');
    this.cur = i;
    this.slides[this.cur].classList.add('vs__slide--active');
    this.dots[this.cur].classList.add('vs__dot--active');
  }
  next() { this.go((this.cur + 1) % this.total); }
  start() { this.iv = setInterval(() => this.next(), 5000); }
  reset() { clearInterval(this.iv); this.start(); }
}

/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — HALL SELECTOR CONTROLLER
/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — HALL SELECTOR CONTROLLER
 * Data-driven hall switcher with elegant auto-rotation and interactive pause/resume
 * ==========================================================================
 */
class HallSelectorController {
  constructor() {
    this.cards = Array.from(document.querySelectorAll('.banquet-card-outer'));
    this.selectorsGrid = document.querySelector('.banquet__selectors-grid');
    this.featuredImg = document.getElementById('banquet-featured-img');
    this.infoOverlay = document.getElementById('banquet-info-overlay');
    this.hallName = document.getElementById('banquet-hall-name');
    this.hallSubtitle = document.getElementById('banquet-hall-subtitle');
    this.seatingVal = document.getElementById('banquet-seating-val');
    this.standingVal = document.getElementById('banquet-standing-val');
    this.featuresList = document.getElementById('banquet-features-list');
    this.primaryCta = document.querySelector('.banquet-info__buttons .btn--banquet-primary');
    this.secondaryCta = document.querySelector('.banquet-info__buttons .btn--banquet-secondary');

    this.currentIndex = 0;
    this.autoTimer = null;
    this.resumeTimer = null;

    if (this.cards.length && window.venueCollectionData) {
      this.init();
    }
  }

  init() {
    // Attach click and keydown handlers to all hall cards
    this.cards.forEach((card, index) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectHall(index, { source: 'user' });
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectHall(index, { source: 'user' });
        }
      });
    });

    // Initial hall UI update
    this.updateHallUI(0);

    // Check prefers-reduced-motion
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Start auto-rotation (3.5 seconds cycle)
    this.scheduleAutoRotation();
  }

  clearAllTimers() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
    if (this.resumeTimer) {
      clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
  }

  scheduleAutoRotation(interval = 3500) {
    this.clearAllTimers();
    this.autoTimer = setInterval(() => {
      const nextIndex = (this.currentIndex + 1) % this.cards.length;
      this.selectHall(nextIndex, { source: 'auto' });
    }, interval);
  }

  selectHall(index, { source = 'auto' } = {}) {
    if (index < 0 || index >= this.cards.length) return;

    // If user clicked, pause auto rotation immediately and schedule resume after 12s
    if (source === 'user') {
      this.clearAllTimers();
      this.updateActiveHallState(index);

      // Resume normal auto-rotation cycle after 12 seconds
      this.resumeTimer = setTimeout(() => {
        this.scheduleAutoRotation(3500);
      }, 12000);
    } else {
      // Auto rotation call
      this.updateActiveHallState(index);
    }
  }

  updateActiveHallState(index) {
    this.currentIndex = index;
    const targetCard = this.cards[index];
    const hallId = targetCard.getAttribute('data-hall-id');
    const venueData = window.venueCollectionData.find(v => v.id === hallId);
    if (!venueData) return;

    // Update active card styling
    this.cards.forEach((c, i) => {
      const isSelected = i === index;
      c.classList.toggle('banquet-card-outer--selected', isSelected);
      c.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // Mobile horizontal selector scrolling (ONLY scroll selector container, NEVER window)
    if (window.innerWidth <= 767 && targetCard && this.selectorsGrid) {
      const cardLeft = targetCard.offsetLeft;
      const cardWidth = targetCard.offsetWidth;
      const gridWidth = this.selectorsGrid.offsetWidth;
      const targetScrollLeft = cardLeft - (gridWidth / 2) + (cardWidth / 2);
      this.selectorsGrid.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
    }

    if (this.reducedMotion) {
      this.updateHallUI(index);
      return;
    }

    // Smooth cinematic transition (subtle fade/scale)
    if (this.featuredImg) this.featuredImg.classList.add('banquet__img--fading');
    if (this.infoOverlay) this.infoOverlay.classList.add('banquet__overlay--fading');

    setTimeout(() => {
      this.updateHallUI(index);
      if (this.featuredImg) this.featuredImg.classList.remove('banquet__img--fading');
      if (this.infoOverlay) this.infoOverlay.classList.remove('banquet__overlay--fading');
    }, 300);
  }

  updateHallUI(index) {
    const targetCard = this.cards[index];
    if (!targetCard) return;
    const hallId = targetCard.getAttribute('data-hall-id');
    const venueData = window.venueCollectionData.find(v => v.id === hallId);
    if (!venueData) return;

    // Update image
    if (this.featuredImg && venueData.images.length) {
      this.featuredImg.src = venueData.images[0];
      this.featuredImg.alt = `Shree Bhatiawadi ${venueData.name}`;
    }

    // Update text fields
    if (this.hallName) this.hallName.textContent = venueData.name;
    if (this.hallSubtitle) this.hallSubtitle.textContent = venueData.tagline;
    if (this.seatingVal) this.seatingVal.textContent = `${venueData.seatingCapacity}+`;
    if (this.standingVal) this.standingVal.textContent = `${venueData.movingCapacity}+`;

    // Limit features on homepage card to max 3 key items
    if (this.featuresList && venueData.amenities) {
      const displayAmenities = venueData.amenities.slice(0, 3);
      this.featuresList.innerHTML = displayAmenities.map(a => `
        <div class="banquet-feature-item" title="${a.name}">
          <svg class="banquet-feature-icon" viewBox="0 0 24 24" fill="none">
            ${a.icon}
          </svg>
          <span class="banquet-feature-name">${a.name}</span>
        </div>
      `).join('');
    }

    // Update CTA link to target specific hall on detailed page
    if (this.primaryCta) {
      this.primaryCta.href = `banquet-halls.html#venue-${venueData.id}`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new VenueShowcaseRenderer();
  new HallSelectorController();
});
