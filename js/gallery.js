/**
 * ==========================================================================
 * SHREE BHATIAWADI - GALLERY & LIGHTBOX CONTROLLER
 * Single Responsibility: Category filtering & lightbox popup viewer
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-filter') || 'all';

        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
});
