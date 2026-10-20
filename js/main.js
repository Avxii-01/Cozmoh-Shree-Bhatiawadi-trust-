/**
 * ==========================================================================
 * SHREE BHATIAWADI - MAIN APPLICATION BOOTSTRAP
 * Single Responsibility: Global Initialization
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Contact form submission handler
  const contactForm = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-form-status');

  if (contactForm && statusEl) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const firstNameInput = document.getElementById('first-name');
      const firstName = firstNameInput ? firstNameInput.value.trim() : 'Guest';

      statusEl.style.display = 'block';
      statusEl.textContent = `Thank you, ${firstName}. Your event inquiry has been noted. Our trust administration will review your details. For immediate assistance or official hall bookings, please call 022-21028801, WhatsApp +91 75064 33819, or email shrebhatiawaditrust@gmail.com.`;

      contactForm.reset();
    });
  }
});

