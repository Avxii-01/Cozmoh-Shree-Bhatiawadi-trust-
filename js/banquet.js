/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — BANQUET HALLS DATA & CONTROLLER (js/banquet.js)
 * ES6 Vanilla JavaScript — Single Source of Truth
 * Controls hall selection, smooth 400-500ms opacity crossfade, active frame animation,
 * and mobile scroll alignment.
 * ==========================================================================
 */

const BANQUET_HALLS_DATA = [
  {
    id: 'basil-hall',
    name: 'Basil Hall',
    tagline: 'GRAND. ELEGANT. TIMELESS.',
    seating: '300+',
    standing: '500+',
    featuredImage: 'assets/banquets/hall1.png',
    features: [
      { name: 'Air Conditioning', iconSvg: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Catering', iconSvg: '<path d="M12 3a9 9 0 00-9 9h18a9 9 0 00-9-9zM3 16h18M6 20h12" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Parking', iconSvg: '<rect x="4" y="3" width="16" height="18" rx="3" stroke="var(--gold)" stroke-width="1.5"/><path d="M9 17V7h4a3 3 0 010 6H9" stroke="var(--gold)" stroke-width="1.5"/>' },
      { name: 'Sound System', iconSvg: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Stage', iconSvg: '<rect x="3" y="14" width="18" height="6" rx="1" stroke="var(--gold)" stroke-width="1.5"/><path d="M7 14l5-8 5 8" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' }
    ]
  },
  {
    id: 'leaf-hall',
    name: 'Leaf Hall',
    tagline: 'SERENE. REFINED. CHARMING.',
    seating: '200+',
    standing: '350+',
    featuredImage: 'assets/banquets/hall2.png',
    features: [
      { name: 'Air Conditioning', iconSvg: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Catering', iconSvg: '<path d="M12 3a9 9 0 00-9 9h18a9 9 0 00-9-9zM3 16h18M6 20h12" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Parking', iconSvg: '<rect x="4" y="3" width="16" height="18" rx="3" stroke="var(--gold)" stroke-width="1.5"/><path d="M9 17V7h4a3 3 0 010 6H9" stroke="var(--gold)" stroke-width="1.5"/>' },
      { name: 'Sound System', iconSvg: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Stage', iconSvg: '<rect x="3" y="14" width="18" height="6" rx="1" stroke="var(--gold)" stroke-width="1.5"/><path d="M7 14l5-8 5 8" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' }
    ]
  },
  {
    id: 'lotus-hall',
    name: 'Lotus Hall',
    tagline: 'INTIMATE. REGAL. PRESTIGIOUS.',
    seating: '150+',
    standing: '250+',
    featuredImage: 'assets/banquets/hall3.png',
    features: [
      { name: 'Air Conditioning', iconSvg: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Catering', iconSvg: '<path d="M12 3a9 9 0 00-9 9h18a9 9 0 00-9-9zM3 16h18M6 20h12" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Parking', iconSvg: '<rect x="4" y="3" width="16" height="18" rx="3" stroke="var(--gold)" stroke-width="1.5"/><path d="M9 17V7h4a3 3 0 010 6H9" stroke="var(--gold)" stroke-width="1.5"/>' },
      { name: 'Sound System', iconSvg: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Stage', iconSvg: '<rect x="3" y="14" width="18" height="6" rx="1" stroke="var(--gold)" stroke-width="1.5"/><path d="M7 14l5-8 5 8" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' }
    ]
  },
  {
    id: 'orchid-hall',
    name: 'Orchid Hall',
    tagline: 'OPULENT. MAJESTIC. EXPANSIVE.',
    seating: '250+',
    standing: '400+',
    featuredImage: 'assets/banquets/hall4.png',
    features: [
      { name: 'Air Conditioning', iconSvg: '<path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Catering', iconSvg: '<path d="M12 3a9 9 0 00-9 9h18a9 9 0 00-9-9zM3 16h18M6 20h12" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Parking', iconSvg: '<rect x="4" y="3" width="16" height="18" rx="3" stroke="var(--gold)" stroke-width="1.5"/><path d="M9 17V7h4a3 3 0 010 6H9" stroke="var(--gold)" stroke-width="1.5"/>' },
      { name: 'Sound System', iconSvg: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' },
      { name: 'Stage', iconSvg: '<rect x="3" y="14" width="18" height="6" rx="1" stroke="var(--gold)" stroke-width="1.5"/><path d="M7 14l5-8 5 8" stroke="var(--gold)" stroke-width="1.5" stroke-linecap="round"/>' }
    ]
  }
];

class BanquetSectionController {
  constructor() {
    this.section = document.getElementById('banquet-halls');
    this.featuredImg = document.getElementById('banquet-featured-img');
    this.infoOverlay = document.getElementById('banquet-info-overlay');
    this.nameElem = document.getElementById('banquet-hall-name');
    this.subtitleElem = document.getElementById('banquet-hall-subtitle');
    this.seatingElem = document.getElementById('banquet-seating-val');
    this.standingElem = document.getElementById('banquet-standing-val');
    this.featuresContainer = document.getElementById('banquet-features-list');
    this.outerCards = document.querySelectorAll('.banquet-card-outer');
    
    this.activeId = 'basil-hall';
    this.isTransitioning = false;

    if (this.section && this.outerCards.length) {
      this.init();
    }
  }

  init() {
    this.bindCardEvents();
    this.preloadHallImages();
  }

  preloadHallImages() {
    BANQUET_HALLS_DATA.forEach(hall => {
      const img = new Image();
      img.src = hall.featuredImage;
    });
  }

  bindCardEvents() {
    this.outerCards.forEach(card => {
      const handleSelect = () => {
        const hallId = card.getAttribute('data-hall-id');
        if (hallId && hallId !== this.activeId && !this.isTransitioning) {
          this.switchHall(hallId, card);
        }
      };

      card.addEventListener('click', handleSelect);

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      });
    });
  }

  switchHall(hallId, clickedCard) {
    const hallData = BANQUET_HALLS_DATA.find(h => h.id === hallId);
    if (!hallData) return;

    this.isTransitioning = true;
    this.activeId = hallId;

    // 1. Move active ornamental gold frame class to clicked card only
    this.outerCards.forEach(card => {
      const isSelected = card.getAttribute('data-hall-id') === hallId;
      card.classList.toggle('banquet-card-outer--selected', isSelected);
      card.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    // 2. Smoothly scroll clicked card into view on mobile if scrollable
    if (window.innerWidth <= 768 && clickedCard) {
      clickedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    // 3. Fade out featured image & info panel (250ms)
    if (this.featuredImg) this.featuredImg.classList.add('banquet__img--fading');
    if (this.infoOverlay) this.infoOverlay.classList.add('banquet__overlay--fading');

    setTimeout(() => {
      // 4. Update content from single source of truth data object
      if (this.featuredImg) {
        this.featuredImg.src = hallData.featuredImage;
        this.featuredImg.alt = `Shree Bhatiawadi ${hallData.name}`;
      }
      if (this.nameElem) this.nameElem.textContent = hallData.name;
      if (this.subtitleElem) this.subtitleElem.textContent = hallData.tagline;
      if (this.seatingElem) this.seatingElem.textContent = hallData.seating;
      if (this.standingElem) this.standingElem.textContent = hallData.standing;

      if (this.featuresContainer) {
        this.featuresContainer.innerHTML = hallData.features.map(f => `
          <div class="banquet-feature-item" title="${f.name}">
            <svg class="banquet-feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              ${f.iconSvg}
            </svg>
            <span class="banquet-feature-name">${f.name}</span>
          </div>
        `).join('');
      }

      // 5. Fade back in (350ms)
      if (this.featuredImg) this.featuredImg.classList.remove('banquet__img--fading');
      if (this.infoOverlay) this.infoOverlay.classList.remove('banquet__overlay--fading');

      setTimeout(() => {
        this.isTransitioning = false;
      }, 350);
    }, 250);
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.shreeBanquet = new BanquetSectionController();
});
