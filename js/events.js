/**
 * ==========================================================================
 * SHREE BHATIAWADI - UPCOMING EVENTS DATA & EDITORIAL CAROUSEL
 * ==========================================================================
 */

// Reusable Events Dataset
const events = [
  {
    id: 'evt-1',
    date: '05',
    month: 'NOV',
    title: 'Navratri Garba Night',
    description: 'Large Garba celebration with traditional dance and music.',
    location: 'Community Hall',
    time: '7:00 PM onwards',
    image: 'assets/events/navratri.png'
  },
  {
    id: 'evt-2',
    date: '15',
    month: 'NOV',
    title: 'Classical Music Evening',
    description: 'Live classical music performance featuring renowned artists.',
    location: 'Cultural Auditorium',
    time: '6:30 PM',
    image: 'assets/events/classical_music.png'
  },
  {
    id: 'evt-3',
    date: '01',
    month: 'DEC',
    title: 'Diwali Celebration',
    description: 'Festival of lights with cultural performances and community gathering.',
    location: 'Trust Grounds',
    time: '6:00 PM',
    image: 'assets/events/diwali.png'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const eventsGrid = document.getElementById('events-grid');
  const prevBtn = document.getElementById('events-prev-btn');
  const nextBtn = document.getElementById('events-next-btn');

  if (!eventsGrid) return;

  /**
   * Render Event Cards Dynamically
   */
  const renderEventCards = (eventList) => {
    const html = eventList.map((event, index) => {
      return `
        <a href="events.html#${event.id}" class="event-card" aria-label="${event.title} - ${event.date} ${event.month}">
          <!-- Imagery Wrapper -->
          <div class="event-card__image-wrap">
            <img 
              src="${event.image}" 
              alt="${event.title}" 
              class="event-card__img" 
              loading="lazy" 
              width="600" 
              height="400"
            />
          </div>

          <!-- Dark Gradient Overlay -->
          <div class="event-card__overlay" aria-hidden="true"></div>

          <!-- Signature Vertical Date Badge -->
          <div class="event-date-badge" aria-label="Date: ${event.date} ${event.month}">
            <span class="event-date-badge__day">${event.date}</span>
            <span class="event-date-badge__month">${event.month}</span>
          </div>

          <!-- Event Information Overlay -->
          <div class="event-info">
            <h3 class="event-info__title">${event.title}</h3>
            <p class="event-info__desc">${event.description}</p>
            
            <div class="event-info__meta">
              <!-- Location Icon & Text -->
              <span class="event-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${event.location}
              </span>

              <!-- Time Icon & Text (if available) -->
              ${event.time ? `
                <span class="event-meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  ${event.time}
                </span>
              ` : ''}
            </div>
          </div>
        </a>
      `;
    }).join('');

    eventsGrid.innerHTML = html;
  };

  /**
   * Manual Slider Controller Logic
   */
  const updateSliderButtons = () => {
    if (!prevBtn || !nextBtn) return;
    
    const maxScrollLeft = eventsGrid.scrollWidth - eventsGrid.clientWidth;
    
    if (maxScrollLeft <= 5) {
      // If content fits completely without overflow
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    prevBtn.disabled = eventsGrid.scrollLeft <= 5;
    nextBtn.disabled = eventsGrid.scrollLeft >= maxScrollLeft - 5;
  };

  const getScrollDistance = () => {
    const firstCard = eventsGrid.querySelector('.event-card');
    if (!firstCard) return 360;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 24; // var(--space-24)
    return cardWidth + gap;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      eventsGrid.scrollBy({
        left: -getScrollDistance(),
        behavior: 'smooth'
      });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      eventsGrid.scrollBy({
        left: getScrollDistance(),
        behavior: 'smooth'
      });
    });
  }

  // Update slider buttons on scroll and resize
  eventsGrid.addEventListener('scroll', updateSliderButtons, { passive: true });
  window.addEventListener('resize', updateSliderButtons, { passive: true });

  // Initial render
  renderEventCards(events);
  updateSliderButtons();
});
