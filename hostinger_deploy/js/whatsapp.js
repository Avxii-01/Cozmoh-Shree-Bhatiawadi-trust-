/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — GLOBAL FLOATING WHATSAPP ENQUIRY COMPONENT
 * Single Responsibility: Inject and manage the site-wide floating WhatsApp enquiry button
 * and dual-number quick chat selection modal
 * ==========================================================================
 */

(function () {
  'use strict';

  // Centralized Configuration for Both WhatsApp Contact Numbers
  const WHATSAPP_CONFIG = {
    contact1: {
      number: '7039327737',
      fullPhone: '917039327737',
      display: '+91 70393 27737',
      label: 'WhatsApp 1',
      sublabel: 'Direct Chat & Quick Enquiries'
    },
    contact2: {
      number: '9653256680',
      fullPhone: '919653256680',
      display: '+91 96532 56680',
      label: 'WhatsApp 2',
      sublabel: 'Venue Booking & Trust Office'
    },
    baseMessage: 'Hello Shree Bhatiawadi Trust, I am interested in enquiring about your banquet venues for an upcoming event. Please share the available venues, pricing, and booking details. Thank you.',
    ariaLabel: 'Chat with us on WhatsApp'
  };

  /**
   * Builds the formatted WhatsApp click-to-chat URL
   * @param {string} phone 
   * @param {string} message 
   * @returns {string}
   */
  function buildWhatsAppUrl(phone, message) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }

  /**
   * Initializes and renders the WhatsApp floating button & popup
   */
  function initWhatsAppFloatingButton() {
    if (document.getElementById('whatsapp-floating-btn')) {
      return;
    }

    const url1 = buildWhatsAppUrl(WHATSAPP_CONFIG.contact1.fullPhone, WHATSAPP_CONFIG.baseMessage);
    const url2 = buildWhatsAppUrl(WHATSAPP_CONFIG.contact2.fullPhone, WHATSAPP_CONFIG.baseMessage);

    // 1. Create Floating Button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'whatsapp-floating-btn';
    btn.className = 'whatsapp-floating-btn';
    btn.setAttribute('aria-label', WHATSAPP_CONFIG.ariaLabel);
    btn.setAttribute('aria-haspopup', 'dialog');
    btn.setAttribute('aria-expanded', 'false');

    const whatsappIconSvg = `
      <svg class="whatsapp-floating-btn__icon" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    `;
    btn.innerHTML = whatsappIconSvg;

    // 2. Create Floating Popup Modal
    const popup = document.createElement('div');
    popup.id = 'whatsapp-popup';
    popup.className = 'whatsapp-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'false');
    popup.setAttribute('aria-label', 'WhatsApp Contacts');
    popup.setAttribute('aria-hidden', 'true');

    popup.innerHTML = `
      <div class="whatsapp-popup__header">
        <div class="whatsapp-popup__title-group">
          <div class="whatsapp-popup__avatar" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
          <div>
            <h4 class="whatsapp-popup__title">Shree Bhatiawadi Trust</h4>
            <span class="whatsapp-popup__status"><span class="whatsapp-popup__dot"></span> Online &bull; Direct Chat</span>
          </div>
        </div>
        <button type="button" class="whatsapp-popup__close" id="whatsapp-popup-close" aria-label="Close WhatsApp chat options">&times;</button>
      </div>
      <div class="whatsapp-popup__body">
        <p class="whatsapp-popup__intro">Select a WhatsApp contact to connect with our team:</p>
        <a href="${url1}" target="_blank" rel="noopener noreferrer" class="whatsapp-popup__item" id="whatsapp-link-1" aria-label="Chat with WhatsApp 1: +91 70393 27737">
          <div class="whatsapp-popup__item-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
          <div class="whatsapp-popup__item-text">
            <span class="whatsapp-popup__item-number">${WHATSAPP_CONFIG.contact1.display}</span>
            <span class="whatsapp-popup__item-sub">${WHATSAPP_CONFIG.contact1.label} &bull; ${WHATSAPP_CONFIG.contact1.sublabel}</span>
          </div>
          <svg class="whatsapp-popup__item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </a>

        <a href="${url2}" target="_blank" rel="noopener noreferrer" class="whatsapp-popup__item" id="whatsapp-link-2" aria-label="Chat with WhatsApp 2: +91 96532 56680">
          <div class="whatsapp-popup__item-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
          </div>
          <div class="whatsapp-popup__item-text">
            <span class="whatsapp-popup__item-number">${WHATSAPP_CONFIG.contact2.display}</span>
            <span class="whatsapp-popup__item-sub">${WHATSAPP_CONFIG.contact2.label} &bull; ${WHATSAPP_CONFIG.contact2.sublabel}</span>
          </div>
          <svg class="whatsapp-popup__item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </a>
      </div>
    `;

    document.body.appendChild(popup);
    document.body.appendChild(btn);

    // Toggle Modal Behavior
    function togglePopup(open) {
      const isOpen = typeof open === 'boolean' ? open : !popup.classList.contains('is-open');
      if (isOpen) {
        popup.classList.add('is-open');
        popup.setAttribute('aria-hidden', 'false');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        popup.classList.remove('is-open');
        popup.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
      }
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePopup();
    });

    const closeBtn = document.getElementById('whatsapp-popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePopup(false);
      });
    }

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!popup.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        if (popup.classList.contains('is-open')) {
          togglePopup(false);
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && popup.classList.contains('is-open')) {
        togglePopup(false);
        btn.focus();
      }
    });

    // Close popup when a WhatsApp option is clicked
    popup.querySelectorAll('.whatsapp-popup__item').forEach(function (link) {
      link.addEventListener('click', function () {
        togglePopup(false);
      });
    });
  }

  // Inject once DOM is interactive
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhatsAppFloatingButton);
  } else {
    initWhatsAppFloatingButton();
  }
})();
