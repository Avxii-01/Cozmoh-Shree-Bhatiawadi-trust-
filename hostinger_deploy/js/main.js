/**
 * ==========================================================================
 * SHREE BHATIAWADI - MAIN APPLICATION BOOTSTRAP
 * Single Responsibility: Global Initialization
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Contact form submission handler (supports contact-enquiry-form and contact-form)
  const contactForm = document.getElementById('contact-enquiry-form') || document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-form-status');

  if (contactForm && statusEl) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check standard HTML5 validation
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : 'SEND MESSAGE';

      // 1. Enter sending state: disable button and update label
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.innerHTML = 'Sending Enquiry... <span class="btn__icon" aria-hidden="true">⏳</span>';
      }

      // Hide previous status message during new attempt
      statusEl.style.display = 'none';

      try {
        const formData = new FormData(contactForm);
        const actionUrl = contactForm.getAttribute('action') && contactForm.getAttribute('action') !== '#'
          ? contactForm.getAttribute('action')
          : '/send-inquiry.php';

        const response = await fetch(actionUrl, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.status === 'success') {
          // Success: Show confirmation message
          statusEl.style.display = 'block';
          statusEl.style.background = 'rgba(46, 125, 50, 0.12)';
          statusEl.style.border = '1px solid rgba(46, 125, 50, 0.4)';
          statusEl.style.color = '#1b5e20';
          statusEl.textContent = data.message || 'Thank you! Your event inquiry has been received. Our administration will review your details promptly.';

          // Reset form ONLY on confirmed backend success
          contactForm.reset();

          // Scroll status message into view smoothly
          statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          // Validation / Server / Rate-limit failure: Keep user data intact
          const errorMessage = (data && data.message)
            ? data.message
            : 'We could not send your message at this moment. Please check your details or contact us directly at 022-21028801.';

          statusEl.style.display = 'block';
          statusEl.style.background = 'rgba(211, 47, 47, 0.12)';
          statusEl.style.border = '1px solid rgba(211, 47, 47, 0.4)';
          statusEl.style.color = '#b71c1c';
          statusEl.textContent = errorMessage;

          statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } catch (err) {
        // Network or fetch failure
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(211, 47, 47, 0.12)';
        statusEl.style.border = '1px solid rgba(211, 47, 47, 0.4)';
        statusEl.style.color = '#b71c1c';
        statusEl.textContent = 'A network error occurred while submitting your enquiry. Please check your internet connection or call our office at 022-21028801.';

        statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } finally {
        // 2. Restore submit button to normal state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }
});

