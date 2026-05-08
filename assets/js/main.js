/**
 * main.js
 * Replaces Framer runtime for:
 *   - Mobile nav toggle
 *   - Sticky header scroll behaviour
 *   - Active nav link highlighting
 *   - Body scroll lock when mobile nav is open
 */
(function () {
  'use strict';

  /* ── MOBILE NAV TOGGLE ────────────────────────────────────── */
  /*
   * Framer used two separate nav component variants toggled via
   * .hidden-XXXX CSS classes (per-page hashed names).
   * We replace with a JS toggle on a single nav with [data-nav-mobile].
   */
  var menuBtn   = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-nav-mobile]');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close on outside click */
    document.addEventListener('click', function (e) {
      if (
        mobileNav.classList.contains('is-open') &&
        !mobileNav.contains(e.target) &&
        !menuBtn.contains(e.target)
      ) {
        mobileNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        menuBtn.focus();
      }
    });
  }


  /* ── STICKY HEADER ────────────────────────────────────────── */
  /*
   * Framer's nav had backdrop-filter applied at all times.
   * We add .is-scrolled at scrollY > 20 to darken background.
   * Threshold of 20px — tighter than 50px to catch early scroll.
   */
  var header = document.querySelector('.site-nav, header, [data-nav-desktop]');
  if (header) {
    var SCROLL_THRESHOLD = 20;
    var ticking = false;

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    /* Set initial state if page loaded scrolled */
    onScroll();
  }


  /* ── ACTIVE NAV LINK ──────────────────────────────────────── */
  /*
   * Match current page path to nav href.
   * Handles: /repair, /repair.html, /page-1/household, etc.
   */
  var path = window.location.pathname
    .replace(/\/$/, '')
    .replace(/\.html$/, '') || '/';

  document.querySelectorAll('nav a[href]').forEach(function (link) {
    var href = link.getAttribute('href')
      .replace(/\/$/, '')
      .replace(/\.html$/, '');

    if (!href || href === '#') return;

    /* Strip anchor fragments for comparison */
    var hrefPath = href.split('#')[0];

    if (hrefPath && (path === hrefPath || path.endsWith('/' + hrefPath))) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });



  /* ── ACCORDION SMOOTH OPEN ────────────────────────────────── */
  document.querySelectorAll('details').forEach(function (el) {
    el.addEventListener('toggle', function () {
      if (el.open) {
        var body = el.querySelector('.services-accordion__body, .faq__answer');
        if (body) { body.style.maxHeight = body.scrollHeight + 'px'; }
      }
    });
  });


  /* ── PAGE TRANSITIONS ─────────────────────────────────────── */
  /*
   * .page-overlay starts fully opaque (white) via CSS.
   * On load: GSAP fades it out (page fades in).
   * On internal link click: fade to white, then navigate.
   */
  var overlay = document.querySelector('.page-overlay');
  if (overlay) {
    if (typeof gsap !== 'undefined') {
      gsap.to(overlay, { opacity: 0, duration: 0.55, delay: 0.1,
        onComplete: function () { overlay.style.pointerEvents = 'none'; overlay.style.display = 'none'; }
      });
    } else {
      overlay.style.transition = 'opacity 0.55s ease';
      overlay.style.opacity    = '0';
      setTimeout(function () { overlay.style.display = 'none'; }, 650);
    }

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (/^(https?:|mailto:|tel:|javascript:)/.test(href)) return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      if (link.target === '_blank') return;

      e.preventDefault();
      overlay.style.display      = '';
      overlay.style.pointerEvents = 'auto';

      if (typeof gsap !== 'undefined') {
        gsap.fromTo(overlay, { opacity: 0 }, {
          opacity: 1, duration: 0.35,
          onComplete: function () { window.location.href = href; }
        });
      } else {
        overlay.style.transition = 'opacity 0.35s ease';
        overlay.style.opacity    = '1';
        setTimeout(function () { window.location.href = href; }, 380);
      }
    });
  }


  /* ── GALLERY FILTER ───────────────────────────────────────── */
  var filterBtns = document.querySelectorAll('.gallery-filter__btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var cat = btn.dataset.filter;
        galleryItems.forEach(function (item) {
          var show = cat === 'all' || item.dataset.category === cat;
          if (typeof gsap !== 'undefined') {
            gsap.to(item, { opacity: show ? 1 : 0.15, scale: show ? 1 : 0.97,
              duration: 0.35, ease: 'power2.out' });
          } else {
            item.style.opacity = show ? '1' : '0.15';
          }
        });
      });
    });
  }

})();
