/**
 * ==========================================================================
 * SHREE BHATIAWADI TRUST — TRUSTEES RENDERER (js/trustees.js)
 * Single source of truth rendering for archival trustees register.
 * Reads TRUSTEES_DATA, sorts programmatically, and dynamically generates
 * alternating editorial entries adhering strictly to design architecture.
 * ==========================================================================
 */

(function () {
  'use strict';

  /**
   * Format role into Title Case for accessible alt attributes.
   * e.g. "CHAIRPERSON" -> "Chairperson", "TRUSTEE MEMBER" -> "Trustee Member"
   */
  function formatRole(role) {
    if (!role) return '';
    return role
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }

  /**
   * Sort trustees data according to institutional governance rules:
   * 1. CHAIRPERSON always appears first.
   * 2. Remaining TRUSTEE MEMBER entries sorted by appointment year ascending (oldest -> newest).
   * 3. Same appointment year preserves original index order from TRUSTEES_DATA.
   * 4. Missing/non-numeric appointment years placed after valid years (preserving relative order).
   */
  function sortTrustees(data) {
    if (!Array.isArray(data)) return [];

    var itemsWithIndex = data.map(function (item, index) {
      return {
        item: item,
        originalIndex: index
      };
    });

    itemsWithIndex.sort(function (a, b) {
      var itemA = a.item;
      var itemB = b.item;

      var aIsChair = Boolean(itemA.role && itemA.role.toUpperCase().indexOf('CHAIRPERSON') !== -1);
      var bIsChair = Boolean(itemB.role && itemB.role.toUpperCase().indexOf('CHAIRPERSON') !== -1);

      if (aIsChair && !bIsChair) return -1;
      if (!aIsChair && bIsChair) return 1;

      var yearA = parseInt(itemA.appointed, 10);
      var yearB = parseInt(itemB.appointed, 10);
      var aValidYear = !isNaN(yearA);
      var bValidYear = !isNaN(yearB);

      if (aValidYear && !bValidYear) return -1;
      if (!aValidYear && bValidYear) return 1;

      if (aValidYear && bValidYear) {
        if (yearA !== yearB) {
          return yearA - yearB;
        }
      }

      return a.originalIndex - b.originalIndex;
    });

    return itemsWithIndex.map(function (wrapper) {
      return wrapper.item;
    });
  }

  /**
   * Build the portrait column markup
   */
  function createPortraitColumn(trustee) {
    var altText = trustee.name + ' \u2014 ' + formatRole(trustee.role);
    return [
      '<div class="trustee-entry__portrait-col">',
      '  <div class="trustee-portrait-frame" aria-label="Portrait of ' + trustee.name + '">',
      '    <img src="' + trustee.image + '" alt="' + altText + '" class="trustee-portrait-img" loading="lazy">',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  /**
   * Build the content column markup
   */
  function createContentColumn(trustee) {
    return [
      '<div class="trustee-entry__content-col">',
      '  <div class="trustee-entry__header">',
      '    <h3 class="trustee-entry__name">' + trustee.name + '</h3>',
      '    <span class="trustee-entry__role">' + trustee.role + '</span>',
      '  </div>',
      '  <p class="trustee-entry__bio">' + trustee.bio + '</p>',
      '  <div class="trustee-entry__meta-wrapper">',
      '    <div class="trustee-meta-item">',
      '      <span class="trustee-meta-label">',
      '        <svg class="trustee-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
      '          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>',
      '          <line x1="16" y1="2" x2="16" y2="6"></line>',
      '          <line x1="8" y1="2" x2="8" y2="6"></line>',
      '          <line x1="3" y1="10" x2="21" y2="10"></line>',
      '        </svg>',
      '        APPOINTED',
      '      </span>',
      '      <span class="trustee-meta-value">' + trustee.appointed + '</span>',
      '    </div>',
      '    <div class="trustee-meta-divider" aria-hidden="true"></div>',
      '    <div class="trustee-meta-item">',
      '      <span class="trustee-meta-label">',
      '        <svg class="trustee-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">',
      '          <circle cx="12" cy="12" r="10"></circle>',
      '          <polyline points="12 6 12 16 14"></polyline>',
      '        </svg>',
      '        SERVICE',
      '      </span>',
      '      <span class="trustee-meta-value">' + trustee.service + '</span>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  /**
   * Render all trustees into .trustees-list
   */
  function renderTrustees() {
    var container = document.querySelector('.trustees-list');
    if (!container) return;

    var dataSource = (typeof window !== 'undefined' && window.TRUSTEES_DATA)
      ? window.TRUSTEES_DATA
      : (typeof TRUSTEES_DATA !== 'undefined' ? TRUSTEES_DATA : []);

    if (!Array.isArray(dataSource) || dataSource.length === 0) {
      console.warn('TrusteesRenderer: No TRUSTEES_DATA found to render.');
      return;
    }

    var sortedData = sortTrustees(dataSource);
    var htmlFragments = [];

    sortedData.forEach(function (trustee, index) {
      var isOdd = (index % 2 === 0);
      var variantClass = isOdd ? 'trustee-entry--odd' : 'trustee-entry--even';
      var portraitHtml = createPortraitColumn(trustee);
      var contentHtml = createContentColumn(trustee);

      var innerHtml = isOdd
        ? portraitHtml + '\n' + contentHtml
        : contentHtml + '\n' + portraitHtml;

      var entryHtml = [
        '<article class="trustee-entry ' + variantClass + ' reveal-fade-up">',
        '  <div class="trustee-entry__inner">',
        innerHtml,
        '  </div>',
        '</article>'
      ].join('\n');

      htmlFragments.push(entryHtml);
    });

    container.innerHTML = htmlFragments.join('\n\n');
  }

  // Initialize immediately if DOM is ready, or on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTrustees);
  } else {
    renderTrustees();
  }
})();
