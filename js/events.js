/**
 * ==========================================================================
 * SHREE BHATIAWADI - EVENTS DATA & RENDERING
 * ==========================================================================
 */

const upcomingEvents = [
  {
    id: 'evt-1',
    date: '05',
    month: 'NOV',
    title: 'Navratri Garba Night',
    description: 'Colorful Garba, music & dance',
    location: 'Bhatiyawadi Community Hall'
  },
  {
    id: 'evt-2',
    date: '15',
    month: 'NOV',
    title: 'Classical Music Evening',
    description: 'An enchanting evening of classical performances',
    location: 'Cultural Auditorium'
  },
  {
    id: 'evt-3',
    date: '01',
    month: 'DEC',
    title: 'Diwali Mela & Festival',
    description: 'Food, lights, culture and fun for the whole family',
    location: 'Trust Grounds'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const eventsGrid = document.getElementById('events-grid');
  if (!eventsGrid) return;

  const renderEvents = () => {
    // We use a small stagger delay for the reveal animation
    const html = upcomingEvents.map((event, index) => {
      const delay = (index + 1) * 100; // 100ms, 200ms, 300ms
      
      return `
        <a href="#" class="event-card reveal-fade-up" style="transition-delay: ${delay}ms;" aria-labelledby="${event.id}-title">
          <div class="event-date">
            <span class="event-date__day">${event.date}</span>
            <span class="event-date__month">${event.month}</span>
          </div>
          <div class="event-content">
            <h3 id="${event.id}-title" class="event-content__title">${event.title}</h3>
            <p class="event-content__desc">${event.description}</p>
            <span class="event-content__location">
              <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M7 0C3.13 0 0 3.13 0 7C0 12.25 7 16 7 16C7 16 14 12.25 14 7C14 3.13 10.87 0 7 0ZM7 9.5C5.62 9.5 4.5 8.38 4.5 7C4.5 5.62 5.62 4.5 7 4.5C8.38 4.5 9.5 5.62 9.5 7C9.5 8.38 8.38 9.5 7 9.5Z" />
              </svg>
              ${event.location}
            </span>
          </div>
        </a>
      `;
    }).join('');

    eventsGrid.innerHTML = html;
  };

  renderEvents();

  // If the IntersectionObserver from scroll.js hasn't observed these new elements,
  // we dispatch a custom event to re-init it, or we rely on the fact that scroll.js
  // might have observed them. Wait, scroll.js is typically run on DOMContentLoaded.
  // Since this is also DOMContentLoaded, it depends on script load order.
  // We'll place this script before scroll.js in index.html to ensure they are picked up.
});
