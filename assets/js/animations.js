(function () {
  'use strict';

  // ── REDUCED MOTION: show everything instantly and bail ────────────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll(
      '.reveal-up, .reveal-fade, .reveal-down, .reveal-left, .reveal-right'
    ).forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  // ── GSAP GUARD: fall back to IntersectionObserver if CDN failed ───
  if (typeof gsap === 'undefined') {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(
      '.reveal-up, .reveal-fade, .reveal-down, .reveal-left, .reveal-right'
    ).forEach(function (el) { observer.observe(el); });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── HERO PARALLAX ─────────────────────────────────────────────────
  // Subtle background scroll at 60% of page speed — premium depth effect
  var heroBg = document.querySelector('.hero__bg, .page-hero__bg');
  if (heroBg) {
    var heroSection = heroBg.closest('section') || heroBg.parentElement;
    gsap.fromTo(heroBg,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  // ── HERO TEXT ENTRANCE ────────────────────────────────────────────
  // Timed stagger (not scroll) — fires after nav animation settles at 1s
  var heroContent = document.querySelector('.hero__content');
  if (heroContent) {
    var heroEls = Array.from(
      heroContent.querySelectorAll('.reveal-up, .reveal-fade')
    );
    if (heroEls.length) {
      gsap.fromTo(heroEls,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay: 1.15,
          stagger: 0.18,
          ease: 'expo.out',
          clearProps: 'transform'
        }
      );
    }
  }

  // ── PAGE-HERO TEXT ENTRANCE (contact, services, service pages) ────
  var pageHeroContent = document.querySelector('.page-hero__content');
  if (pageHeroContent) {
    var pageEls = Array.from(
      pageHeroContent.querySelectorAll('.reveal-up, .reveal-fade')
    );
    if (pageEls.length) {
      gsap.fromTo(pageEls,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          delay: 1.15,
          stagger: 0.15,
          ease: 'expo.out',
          clearProps: 'transform'
        }
      );
    }
  }

  // ── SCROLL REVEALS ─────────────────────────────────────────────────
  // Build a Set of hero child elements to exclude from scroll reveals
  var heroChildSet = new Set();
  ['.hero__content *', '.page-hero__content *'].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      heroChildSet.add(el);
    });
  });

  function scrollReveal(selector, fromVars, toVars) {
    gsap.utils.toArray(selector).forEach(function (el) {
      if (heroChildSet.has(el)) return;
      gsap.fromTo(el, fromVars,
        Object.assign({}, toVars, {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        })
      );
    });
  }

  scrollReveal('.reveal-up',
    { opacity: 0, y: 36 },
    { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', clearProps: 'transform' }
  );
  scrollReveal('.reveal-fade',
    { opacity: 0 },
    { opacity: 1, duration: 1.0, ease: 'power2.out' }
  );
  scrollReveal('.reveal-down',
    { opacity: 0, y: -24 },
    { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out', clearProps: 'transform' }
  );
  scrollReveal('.reveal-left',
    { opacity: 0, x: -44 },
    { opacity: 1, x: 0, duration: 1.1, ease: 'expo.out', clearProps: 'transform' }
  );
  scrollReveal('.reveal-right',
    { opacity: 0, x: 44 },
    { opacity: 1, x: 0, duration: 1.1, ease: 'expo.out', clearProps: 'transform' }
  );

  // ── STAGGER GROUPS ─────────────────────────────────────────────────
  gsap.utils.toArray('.stagger').forEach(function (parent) {
    var children = Array.from(parent.children).filter(function (c) {
      return !heroChildSet.has(c);
    });
    if (!children.length) return;
    gsap.fromTo(children,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'expo.out',
        stagger: 0.12,
        clearProps: 'transform',
        scrollTrigger: {
          trigger: parent,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // ── TRUST BAR COUNT-UP ────────────────────────────────────────────
  document.querySelectorAll('.trust-bar__number').forEach(function (el) {
    var raw     = el.textContent.trim();
    var hasPlus = raw.indexOf('+') !== -1;
    var hasPct  = raw.indexOf('%') !== -1;
    var num     = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return;

    var suffix = (hasPlus ? '+' : '') + (hasPct ? '%' : '');

    // Year-like numbers (≥ 1000) just fade in — counting from 0 looks odd
    if (num >= 1000) {
      gsap.fromTo(el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%',
            toggleActions: 'play none none none' }
        }
      );
      return;
    }

    el.textContent = '0' + suffix;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        var obj = { val: 0 };
        gsap.to(obj, {
          val: num,
          duration: 2.0,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(obj.val) + suffix;
          }
        });
      }
    });
  });

  // ── SERVICE CARD — IMAGE ZOOM ON HOVER ───────────────────────────
  // GSAP handles this; CSS transition+hover rule removed from main.css
  gsap.utils.toArray('.service-card').forEach(function (card) {
    var img = card.querySelector('.service-card__bg');
    if (!img) return;
    card.addEventListener('mouseenter', function () {
      gsap.to(img, { scale: 1.09, duration: 0.55, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', function () {
      gsap.to(img, { scale: 1.0, duration: 0.5, ease: 'power2.inOut' });
    });
  });

})();
