/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — BANQUET CAROUSEL v4.1
 * Stable 3-card layout: prev | active | next  — always all three visible.
 * Animation: CSS class transitions only (translate + scale + opacity).
 * Never removes the active card. Never re-renders from scratch on navigate.
 * ==========================================================================
 */

class DataDrivenBanquetCarousel {
  constructor(containerElement) {
    this.container    = containerElement;
    this.stage        = containerElement.querySelector('.banquet-carousel__stage');
    this.dotsContainer = containerElement.querySelector('.banquet-dots');
    this.prevBtn      = containerElement.querySelector('.banquet-nav-btn--prev');
    this.nextBtn      = containerElement.querySelector('.banquet-nav-btn--next');

    this.data         = window.banquetHallsData || [];
    this.currentIndex = 0;
    this.isAnimating  = false;   // guard against rapid clicks

    if (this.stage && this.data.length > 0) {
      this.init();
    }
  }

  /* ─── Helpers ─────────────────────────────────────────────────── */
  getPrevIndex(base = this.currentIndex) {
    return (base - 1 + this.data.length) % this.data.length;
  }
  getNextIndex(base = this.currentIndex) {
    return (base + 1) % this.data.length;
  }

  /* ─── Bootstrap ───────────────────────────────────────────── */
  init() {
    this.buildStage();
    this.renderDots();
    this.bindEvents();
    this.bindTouch();
    this.bindKeyboard();
    this.attachNavButtons();
    this.bindResize();
  }

  /* ─── DOM Builder (called once) ──────────────────────────────── */
  buildStage() {
    this.stage.innerHTML = '';

    const prevHall   = this.data[this.getPrevIndex()];
    const activeHall = this.data[this.currentIndex];
    const nextHall   = this.data[this.getNextIndex()];

    this.leftCard    = this.createPreviewCard(prevHall,   'prev');
    this.centerCard  = this.createFeaturedCard(activeHall);
    this.rightCard   = this.createPreviewCard(nextHall,   'next');

    this.stage.appendChild(this.leftCard);
    this.stage.appendChild(this.centerCard);
    this.stage.appendChild(this.rightCard);
  }

  /* ─── Featured (Center) Card ─────────────────────────────────── */
  createFeaturedCard(hall) {
    const card = document.createElement('div');
    card.className = 'banquet-card--featured';
    card.setAttribute('role', 'group');
    card.setAttribute('aria-label', `Featured Venue: ${hall.name}`);
    this.populateFeaturedCard(card, hall);
    return card;
  }

  populateFeaturedCard(card, hall) {
    const amenitiesHTML = this.buildAmenitiesGrid(hall.amenities);

    card.innerHTML = `
      <img
        src="${hall.heroImage}"
        alt="${hall.name} Banquet Hall"
        class="banquet-card--featured__image"
        loading="eager"
      >
      <div class="banquet-info-overlay">
        <h3 class="banquet-info-overlay__title">${hall.name}</h3>

        <div class="banquet-info-overlay__stats">
          <div class="banquet-info-overlay__stat-item">
            <span class="banquet-info-overlay__stat-icon">&#128101;</span>
            <span class="banquet-info-overlay__stat-label">Seating Capacity</span>
            <span class="banquet-info-overlay__stat-value">${hall.seatingCapacity}</span>
          </div>
          <div class="banquet-info-overlay__stat-item">
            <span class="banquet-info-overlay__stat-icon">&#128101;</span>
            <span class="banquet-info-overlay__stat-label">Standing Capacity</span>
            <span class="banquet-info-overlay__stat-value">${hall.standingCapacity}</span>
          </div>
        </div>

        <div class="banquet-info-overlay__amenities-section">
          <div class="banquet-info-overlay__amenities-title">Amenities</div>
          <div class="banquet-info-overlay__amenities-grid">
            ${amenitiesHTML}
          </div>
        </div>

        <div class="banquet-info-overlay__actions">
          <a href="${hall.bookingLink}"  class="banquet-info-overlay__btn-primary">BOOK NOW</a>
          <a href="${hall.learnMoreLink}" class="banquet-info-overlay__btn-secondary">LEARN MORE <span class="btn-arrow">→</span></a>
        </div>
      </div>
    `;
  }

  buildAmenitiesGrid(amenities) {
    // Pair amenities into rows of 3 (matching mockup 3-column grid)
    return amenities.map((a, i) =>
      `<span class="banquet-info-overlay__amenity-item">${a}</span>`
    ).join('');
  }

  /* ─── Preview (Side) Card ────────────────────────────────────── */
  createPreviewCard(hall, position) {
    const card = document.createElement('div');
    card.className = `banquet-card--preview banquet-card--preview-${position}`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View ${hall.name}`);
    this.populatePreviewCard(card, hall);

    card.addEventListener('click', () => {
      if (position === 'prev') this.prev();
      else                      this.next();
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (position === 'prev') this.prev();
        else                      this.next();
      }
    });

    return card;
  }

  populatePreviewCard(card, hall) {
    const amenitiesSummary = hall.amenities.slice(0, 3).join(' · ');
    card.innerHTML = `
      <div class="banquet-card--preview__image-wrap">
        <img src="${hall.previewImage}" alt="${hall.name} Preview" class="banquet-card--preview__media" loading="lazy">
      </div>
      <div class="banquet-card--preview__body">
        <h4 class="banquet-card--preview__title">${hall.name}</h4>
        <div class="banquet-card--preview__capacity">&#128101; Seating: ${hall.seatingCapacity}</div>
        <div class="banquet-card--preview__amenities">${amenitiesSummary}</div>
        <span class="banquet-card--preview__link">LEARN MORE →</span>
      </div>
    `;
  }

  /* ─── Dots ───────────────────────────────────────────────────── */
  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    this.data.forEach((hall, i) => {
      const dot = document.createElement('button');
      dot.className = `banquet-dot${i === this.currentIndex ? ' banquet-dot--active' : ''}`;
      dot.setAttribute('aria-label', `Go to ${hall.name}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    });
  }

  updateDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.querySelectorAll('.banquet-dot').forEach((dot, i) => {
      dot.classList.toggle('banquet-dot--active', i === this.currentIndex);
    });
  }

  /* ─── Transition Engine ──────────────────────────────────────── */
  /**
   * direction: 'next' | 'prev'
   * On next: left  ← active, active → right-exit, next  → center
   * On prev: right ← active, active → left-exit,  prev  → center
   */
  animate(direction) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const DURATION = 400; // ms — matches CSS transition

    // ── 1. Compute incoming index ──────────────────────────────
    const incomingIndex = direction === 'next'
      ? this.getNextIndex()
      : this.getPrevIndex();

    const incomingHall  = this.data[incomingIndex];

    // ── 2. Determine exit class for the current center card ───
    const centerExitClass  = direction === 'next' ? 'slide-exit-left'  : 'slide-exit-right';
    const previewEnterClass = direction === 'next' ? 'slide-enter-from-right' : 'slide-enter-from-left';

    // ── 3. Add exit animation to current center ───────────────
    this.centerCard.classList.add(centerExitClass);

    // ── 4. Animate the preview card that will become center ───
    const enteringPreviewCard = direction === 'next' ? this.rightCard : this.leftCard;
    enteringPreviewCard.classList.add(previewEnterClass);

    // ── 5. After transition, swap content & reset classes ─────
    setTimeout(() => {
      // Update index
      this.currentIndex = incomingIndex;

      // Swap the exiting center card to become the opposite preview
      // and the entering preview becomes the new featured
      this.swapCardRoles(direction);

      // Update dots
      this.updateDots();

      this.isAnimating = false;
    }, DURATION);
  }

  swapCardRoles(direction) {
    // Remove all positional/animation classes
    const clearClasses = (el) => {
      el.className = el.className
        .replace(/slide-\S+/g, '')
        .replace(/banquet-card--preview-prev/g, '')
        .replace(/banquet-card--preview-next/g, '')
        .replace(/banquet-card--featured/g, '')
        .replace(/banquet-card--preview/g, '')
        .trim();
    };

    if (direction === 'next') {
      // leftCard  → becomes new left preview (prev index)
      // centerCard → becomes new right preview (prev of prev, i.e. the OLD prev)
      // rightCard → becomes new center

      // The old left card becomes the new right preview (it was prev, now it's gone off screen, reassign to right)
      // Actually: rotate references
      // new prev = old center → left
      // new active = old right → center
      // new next = old left → right (circular)

      const oldLeft   = this.leftCard;
      const oldCenter = this.centerCard;
      const oldRight  = this.rightCard;

      // Repopulate each slot with correct data
      const prevHall   = this.data[this.getPrevIndex()];
      const activeHall = this.data[this.currentIndex];
      const nextHall   = this.data[this.getNextIndex()];

      // Reuse DOM nodes — just reassign references and refill content
      // newLeft = oldCenter (repopulate with prevHall)
      clearClasses(oldCenter);
      oldCenter.className = 'banquet-card--preview banquet-card--preview-prev';
      oldCenter.setAttribute('aria-label', `View ${prevHall.name}`);
      this.populatePreviewCard(oldCenter, prevHall);
      oldCenter.onclick = () => { if (!this.isAnimating) this.prev(); };

      // newCenter = oldRight (repopulate with activeHall)
      clearClasses(oldRight);
      oldRight.className = 'banquet-card--featured';
      oldRight.setAttribute('aria-label', `Featured Venue: ${activeHall.name}`);
      this.populateFeaturedCard(oldRight, activeHall);

      // newRight = oldLeft (repopulate with nextHall)
      clearClasses(oldLeft);
      oldLeft.className = 'banquet-card--preview banquet-card--preview-next';
      oldLeft.setAttribute('aria-label', `View ${nextHall.name}`);
      this.populatePreviewCard(oldLeft, nextHall);
      oldLeft.onclick = () => { if (!this.isAnimating) this.next(); };

      // Re-order in DOM — detach nav buttons first so innerHTML='' doesn't destroy them
      this.prevBtn?.remove();
      this.nextBtn?.remove();
      this.stage.innerHTML = '';
      this.stage.appendChild(oldCenter); // new left
      this.stage.appendChild(oldRight);  // new center
      this.stage.appendChild(oldLeft);   // new right

      this.leftCard   = oldCenter;
      this.centerCard = oldRight;
      this.rightCard  = oldLeft;

    } else {
      // direction === 'prev'
      // new prev = old right (repopulate with prevHall)
      // new active = old left → center
      // new next = old center → right

      const oldLeft   = this.leftCard;
      const oldCenter = this.centerCard;
      const oldRight  = this.rightCard;

      const prevHall   = this.data[this.getPrevIndex()];
      const activeHall = this.data[this.currentIndex];
      const nextHall   = this.data[this.getNextIndex()];

      // newLeft = oldRight (repopulate with prevHall)
      clearClasses(oldRight);
      oldRight.className = 'banquet-card--preview banquet-card--preview-prev';
      oldRight.setAttribute('aria-label', `View ${prevHall.name}`);
      this.populatePreviewCard(oldRight, prevHall);
      oldRight.onclick = () => { if (!this.isAnimating) this.prev(); };

      // newCenter = oldLeft (repopulate with activeHall)
      clearClasses(oldLeft);
      oldLeft.className = 'banquet-card--featured';
      oldLeft.setAttribute('aria-label', `Featured Venue: ${activeHall.name}`);
      this.populateFeaturedCard(oldLeft, activeHall);

      // newRight = oldCenter (repopulate with nextHall)
      clearClasses(oldCenter);
      oldCenter.className = 'banquet-card--preview banquet-card--preview-next';
      oldCenter.setAttribute('aria-label', `View ${nextHall.name}`);
      this.populatePreviewCard(oldCenter, nextHall);
      oldCenter.onclick = () => { if (!this.isAnimating) this.next(); };

      // Re-order in DOM — detach nav buttons first so innerHTML='' doesn't destroy them
      this.prevBtn?.remove();
      this.nextBtn?.remove();
      this.stage.innerHTML = '';
      this.stage.appendChild(oldRight);  // new left
      this.stage.appendChild(oldLeft);   // new center
      this.stage.appendChild(oldCenter); // new right

      this.leftCard   = oldRight;
      this.centerCard = oldLeft;
      this.rightCard  = oldCenter;
    }
    // Re-attach nav buttons to their new parent positions
    this.attachNavButtons();
  }

  next() { this.animate('next'); }
  prev() { this.animate('prev'); }

  goTo(index) {
    if (index === this.currentIndex || this.isAnimating) return;
    // For goTo, we skip ahead directly — update index then rebuild
    this.currentIndex = index;
    this.buildStage();
    this.updateDots();
    this.attachNavButtons();
  }

  /* ─── Nav Button Placement ────────────────────────────────────── */
  /**
   * Desktop (>1023px) : prev → right inner edge of left preview card
   *                      next → left inner edge of right preview card
   * Tablet  (769–1023px): preview cards are hidden, buttons go into the stage
   * Mobile  (≤768px)   : prev/next → sides of the info overlay
   */
  attachNavButtons() {
    if (!this.prevBtn || !this.nextBtn) return;

    const w = window.innerWidth;

    if (w > 1023) {
      // Desktop — buttons are handles on the preview card inner edges
      if (this.leftCard)  this.leftCard.appendChild(this.prevBtn);
      if (this.rightCard) this.rightCard.appendChild(this.nextBtn);
    } else if (w > 768) {
      // Tablet — preview cards are hidden; park buttons in the stage
      // CSS will reposition them as left/right flanks of the featured card
      this.stage.appendChild(this.prevBtn);
      this.stage.appendChild(this.nextBtn);
    } else {
      // Mobile — buttons are handles on the info overlay panel
      const overlay = this.centerCard?.querySelector('.banquet-info-overlay');
      if (overlay) {
        overlay.appendChild(this.prevBtn);
        overlay.appendChild(this.nextBtn);
      }
    }
  }

  /* ─── Resize Listener ─────────────────────────────────────────── */
  bindResize() {
    // Re-attach buttons whenever the viewport crosses either breakpoint
    const getZone = () => window.innerWidth > 1023 ? 'desktop' : window.innerWidth > 768 ? 'tablet' : 'mobile';
    let lastZone = getZone();
    window.addEventListener('resize', () => {
      const zone = getZone();
      if (zone !== lastZone) {
        lastZone = zone;
        this.attachNavButtons();
      }
    });
  }

  /* ─── Event Binding ──────────────────────────────────────────── */
  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
  }

  bindTouch() {
    let startX = 0;
    this.container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    this.container.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) this.next();
        else          this.prev();
      }
    }, { passive: true });
  }

  bindKeyboard() {
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft')  this.prev();
    });
  }
}

/* ─── Global Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-banquet-carousel').forEach(el => {
    new DataDrivenBanquetCarousel(el);
  });
});
