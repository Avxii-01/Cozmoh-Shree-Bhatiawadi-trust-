/**
 * ==========================================================================
 * SHREE BHATIAWADI - ACCORDION CONTROLLER
 * Single Responsibility: FAQ and expandable content accordion
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all siblings if needed (accordion behavior)
      const parent = item.parentElement;
      if (parent && parent.classList.contains('accordion--single')) {
        parent.querySelectorAll('.accordion__item').forEach(child => {
          child.classList.remove('open');
          const childHeader = child.querySelector('.accordion__header');
          if (childHeader) childHeader.setAttribute('aria-expanded', 'false');
        });
      }

      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
      }
    });
  });
});
