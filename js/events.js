/**
 * ==========================================================================
 * SHREE BHATIAWADI — BHATIA CULTURAL FORUM SLIDER (js/events.js)
 * Lightweight Vanilla JS custom carousel with clean modular logic:
 * - Auto-play crossfade every 5 seconds (700-900ms transition)
 * - Manual navigation (Prev/Next buttons, Pagination dots)
 * - Temporary pause on manual interaction (resumes after 8 seconds)
 * - Hover pause on desktop, touch swipe gestures on mobile.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     HOMEPAGE CULTURAL SLIDER (IF PRESENT)
     ========================================================================== */
  const viewport = document.getElementById('cultural-slider-viewport');
  const slides = Array.from(document.querySelectorAll('.cultural-slide'));
  const dots = Array.from(document.querySelectorAll('.cultural-dot'));
  const prevBtn = document.getElementById('cultural-prev-btn');
  const nextBtn = document.getElementById('cultural-next-btn');

  if (viewport && slides.length > 0) {
    let currentIndex = 0;
    let autoPlayTimer = null;
    let resumeTimer = null;
    let isHovered = false;

    const AUTO_PLAY_INTERVAL = 5000;   /* 5 seconds */
    const RESUME_DELAY = 8000;         /* 8 seconds after manual interaction */

    const goToSlide = (targetIndex) => {
      if (targetIndex === currentIndex) return;

      slides[currentIndex].classList.remove('cultural-slide--active');
      dots[currentIndex].classList.remove('cultural-dot--active');
      dots[currentIndex].setAttribute('aria-selected', 'false');

      currentIndex = (targetIndex + slides.length) % slides.length;

      slides[currentIndex].classList.add('cultural-slide--active');
      dots[currentIndex].classList.add('cultural-dot--active');
      dots[currentIndex].setAttribute('aria-selected', 'true');
    };

    const nextSlide = () => {
      goToSlide(currentIndex + 1);
    };

    const prevSlide = () => {
      goToSlide(currentIndex - 1);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        if (!isHovered) {
          nextSlide();
        }
      }, AUTO_PLAY_INTERVAL);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    const handleUserInteraction = () => {
      stopAutoPlay();
      if (resumeTimer) clearTimeout(resumeTimer);

      resumeTimer = setTimeout(() => {
        startAutoPlay();
      }, RESUME_DELAY);
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        handleUserInteraction();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        handleUserInteraction();
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        const targetIndex = parseInt(e.currentTarget.getAttribute('data-slide-target'), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex);
          handleUserInteraction();
        }
      });
    });

    if (viewport.parentElement) {
      viewport.parentElement.addEventListener('mouseenter', () => {
        isHovered = true;
      });

      viewport.parentElement.addEventListener('mouseleave', () => {
        isHovered = false;
      });
    }

    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
        handleUserInteraction();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
        handleUserInteraction();
      }
    };

    startAutoPlay();
  }

  /* ==========================================================================
     BHATIA CULTURAL FORUM — UPCOMING EVENTS MANUAL SHOWCASE CONTROLLER
     ========================================================================== */
  const showcase = document.getElementById('events-showcase');
  const selectors = Array.from(document.querySelectorAll('.upcoming-events__selector'));

  if (showcase && selectors.length > 0) {
    const eventImg = document.getElementById('event-showcase-img');
    const eventNum = document.getElementById('event-showcase-num');
    const eventTitle = document.getElementById('event-showcase-title');
    const eventDesc = document.getElementById('event-showcase-desc');
    const eventDate = document.getElementById('event-showcase-date');
    const eventTime = document.getElementById('event-showcase-time');

    const CULTURAL_EVENTS_DATA = [
      {
        num: "01 — NAVRATRI",
        title: "Navratri<br>Garba Night",
        alt: "Navratri Garba Night",
        img: "assets/images/garbanight1.jpg",
        objectPosition: "center 30%",
        desc: "Experience the vibrant spirit of Navratri with traditional Garba, devotional music, and joyful community participation.",
        date: "OCTOBER 05, 2024",
        time: "7:00 PM"
      },
      {
        num: "02 — CLASSICAL MUSIC",
        title: "Classical Music<br>Evening",
        alt: "Classical Music Evening",
        img: "assets/images/classical music.jpg",
        objectPosition: "center 30%",
        desc: "Immerse in soulful ragas and classical sitar & tabla recitals by renowned artists in an atmosphere of elegance and devotion.",
        date: "NOVEMBER 12, 2024",
        time: "6:30 PM"
      },
      {
        num: "03 — DIWALI",
        title: "Diwali Festival<br>Celebration",
        alt: "Diwali Festival Celebration",
        img: "assets/images/diwali.jpg",
        objectPosition: "center 35%",
        desc: "Gather with families to celebrate the Festival of Lights through traditional illuminations, cultural programs, and community festivities.",
        date: "NOVEMBER 01, 2024",
        time: "6:00 PM"
      },
      {
        num: "04 — COMMUNITY",
        title: "Women's Cultural<br>Gathering",
        alt: "Women's Cultural Gathering",
        img: "assets/images/womencultural gathering.jpg",
        objectPosition: "center 30%",
        desc: "A dignified, welcoming space for the women of our community to celebrate traditions, art, heritage performances, and togetherness.",
        date: "DECEMBER 18, 2024",
        time: "5:00 PM"
      }
    ];

    let activeIndex = 0;
    let isTransitioning = false;

    const selectEvent = (targetIndex) => {
      if (targetIndex === activeIndex || isTransitioning) return;

      const data = CULTURAL_EVENTS_DATA[targetIndex];
      if (!data) return;

      isTransitioning = true;

      selectors.forEach((sel, i) => {
        if (i === targetIndex) {
          sel.classList.add('upcoming-events__selector--active');
        } else {
          sel.classList.remove('upcoming-events__selector--active');
        }
      });

      // Auto-scroll selected button into view on mobile
      try {
        selectors[targetIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      } catch (err) {
        // Fallback for older browsers
      }

      showcase.classList.add('upcoming-events__showcase--transitioning');

      setTimeout(() => {
        if (eventImg) {
          eventImg.src = data.img;
          eventImg.alt = data.alt;
          eventImg.style.objectPosition = data.objectPosition || 'center center';
        }
        if (eventNum) eventNum.textContent = data.num;
        if (eventTitle) eventTitle.innerHTML = data.title;
        if (eventDesc) eventDesc.textContent = data.desc;
        if (eventDate) eventDate.textContent = data.date;
        if (eventTime) eventTime.textContent = data.time;

        activeIndex = targetIndex;

        showcase.classList.remove('upcoming-events__showcase--transitioning');
        isTransitioning = false;
      }, 250);
    };

    selectors.forEach((selector, idx) => {
      selector.addEventListener('click', (e) => {
        e.preventDefault();
        selectEvent(idx);
      });
    });
  }
});
