/**
 * animations.js
 * Replaces Framer Motion's scroll reveal engine.
 *
 * Source spec: data-framer-appear-id elements had initial state
 *   opacity:0.001, transform:translateY(-10px)
 * Triggered by IntersectionObserver (once, unobserve on fire).
 *
 * In Phase 4, [data-framer-appear-id] elements will be replaced with
 * .reveal-up or .reveal-fade classes. This script targets those classes.
 */
(function () {
  'use strict';

  var SELECTORS = '.reveal-up, .reveal-fade, .reveal-down, .reveal-left, .reveal-right';
  var THRESHOLD  = 0.12;
  var ROOT_MARGIN = '0px 0px -40px 0px';

  if (!('IntersectionObserver' in window)) {
    /* Fallback: make everything visible immediately */
    document.querySelectorAll(SELECTORS).forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold:  THRESHOLD,
    rootMargin: ROOT_MARGIN
  });

  document.querySelectorAll(SELECTORS).forEach(function (el) {
    observer.observe(el);
  });

})();
