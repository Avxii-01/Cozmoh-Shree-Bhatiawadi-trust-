/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST - GLOBAL NAVIGATION CONTROLLER
 * Vanilla JavaScript (ES6)
 * Single Responsibility: Sticky Navbar, Scroll Transition, Mobile Menu Drawer & ARIA Accessibility
 * ==========================================================================
 */

class GlobalNavbarController {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.toggleBtn = document.querySelector('.navbar__toggle');
    this.closeBtn = document.querySelector('.navbar__mobile-close');
    this.mobileMenu = document.querySelector('.navbar__mobile-menu');
    this.navLinks = document.querySelectorAll('.navbar__link, .navbar__mobile-link');
    
    this.scrollThreshold = 50; // Scroll threshold in pixels
    this.isOpen = false;

    if (this.navbar) {
      this.init();
    }
  }

  init() {
    this.bindScrollObserver();
    this.bindMobileEvents();
    this.bindAccessibilityEvents();
    this.setActivePageHighlight();
  }

  /**
   * 1. Scroll Detection for Sticky & Translucent Blur Transition
   */
  bindScrollObserver() {
    const handleScroll = () => {
      if (window.scrollY > this.scrollThreshold) {
        this.navbar.classList.add('navbar--scrolled');
      } else {
        this.navbar.classList.remove('navbar--scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run initial check
  }

  /**
   * 2. Mobile Drawer Open/Close Logic
   */
  bindMobileEvents() {
    if (this.toggleBtn && this.mobileMenu) {
      this.toggleBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeMobileMenu());
    }

    // Close mobile menu on clicking any navigation link
    const mobileLinks = document.querySelectorAll('.navbar__mobile-link, .navbar__mobile-cta');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });
  }

  toggleMobileMenu() {
    if (this.isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isOpen = true;
    this.mobileMenu.classList.add('navbar__mobile-menu--active');
    this.toggleBtn.classList.add('navbar__toggle--open');
    this.toggleBtn.setAttribute('aria-expanded', 'true');
    this.mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Lock body scroll

    // Focus on first link or close button for screen reader accessibility
    if (this.closeBtn) {
      setTimeout(() => this.closeBtn.focus(), 100);
    }
  }

  closeMobileMenu() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.mobileMenu.classList.remove('navbar__mobile-menu--active');
    this.toggleBtn.classList.remove('navbar__toggle--open');
    this.toggleBtn.setAttribute('aria-expanded', 'false');
    this.mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Unlock body scroll

    if (this.toggleBtn) {
      this.toggleBtn.focus();
    }
  }

  /**
   * 3. Keyboard Accessibility (Escape Key & Focus Trap)
   */
  bindAccessibilityEvents() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeMobileMenu();
      }
    });
  }

  /**
   * 4. Highlight Active Page automatically based on current URL path
   */
  setActivePageHighlight() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('navbar__link--active', 'navbar__mobile-link--active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('navbar__link--active', 'navbar__mobile-link--active');
        link.removeAttribute('aria-current');
      }
    });
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.shreeNavbar = new GlobalNavbarController();
});
