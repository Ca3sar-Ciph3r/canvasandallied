# CLAUDE.md — Framer → Static HTML Replication Project

## Mission
This project contains a website exported from Framer. Your job is to:
1. Parse and understand the Framer export structure (React + Framer Motion compiled output)
2. Translate all Framer-specific code into clean, dependency-free static HTML/CSS/JS
3. Preserve ALL visual design, animations, interactions, and responsive behaviour exactly
4. Enforce consistency across all pages
5. Prepare the project for GitHub push and Vercel deployment

---

## What Framer Exports — Know This First

Framer exports are NOT simple HTML. They are compiled React apps. Expect:

- **Chunked JS bundles** — `chunk-XXXXXXXX.js` files. These are compiled React +
  Framer Motion. Do not try to edit them directly — read them to understand what
  they do, then recreate the behaviour in vanilla JS.
- **Framer Motion animations** — scroll-triggered reveals, hover states, spring
  physics defined in JS
- **CSS custom properties** — Framer uses `--token-*` naming for design tokens
- **Framer-generated class names** — hashed classes like `.framer-XXXXX`
- **Google Fonts or Framer Fonts** — loaded via `<link>` or injected by JS
- **Image optimisation** — Framer serves WebP via its CDN. Downloaded exports
  may have broken image URLs pointing to framerusercontent.com
- **Breakpoints** — Framer uses: Desktop (1200px+), Tablet (768px), Mobile (390px)
- **External asset URLs** — exported files may reference `framerusercontent.com`
  or `framer.com` for images, fonts, and scripts

---

## Non-negotiables
- NEVER guess. Read the actual files before making changes.
- ALWAYS show a diff summary after each batch of edits.
- NEVER remove any visual content, animations, or interactions.
- Preserve pixel-perfect layout — spacing, sizing, colours must match exactly.
- All file paths must be relative after translation.
- If a Framer Motion animation is too complex to replicate in CSS, keep the
  Framer Motion bundle for that component only and note it in the final report.

---

## Project Structure Target
```
/
├── index.html
├── vercel.json
├── .gitignore
├── README.md
├── assets/
│   ├── css/
│   │   ├── main.css          ← design tokens + shared styles
│   │   └── animations.css    ← all scroll/hover animations
│   ├── js/
│   │   ├── main.js           ← nav, mobile menu, scroll effects
│   │   └── animations.js     ← IntersectionObserver reveal engine
│   ├── images/               ← all images downloaded locally
│   └── fonts/                ← local fonts if self-hosting
└── CLAUDE.md
```

---

## Phase Order
Always run sequentially. Pause for approval after Phase 1.

1. FRAMER EXPORT AUDIT
2. DESIGN TOKEN EXTRACTION
3. ANIMATION TRANSLATION
4. PAGE TRANSLATION
5. ASSET LOCALISATION
6. CONSISTENCY ENFORCEMENT
7. VERCEL DEPLOYMENT PREP
8. FINAL REPORT

---

## PHASE 1 — FRAMER EXPORT AUDIT (Read Only, No Edits)

Run these first:
```bash
find . -name "*.html" | sort
find . -name "*.css" | sort
find . -name "*.js" | sort
find . \( -name "*.webp" -o -name "*.png" -o -name "*.jpg" -o -name "*.svg" \) | sort
```

Read every HTML file and every CSS file. Then output:

```
FRAMER EXPORT AUDIT
===================
Pages found: N
  - [filename] → [page title]

CSS files:
  - [filename]

JS bundles:
  - [filename] (Framer chunk / main / other)

Framer patterns detected:
  - CSS custom properties (--token-*): [list them]
  - Framer class names (.framer-*): [Y/N]
  - Framer Motion scroll animations: [Y/N]
  - Framer Motion hover animations: [Y/N]
  - Page transitions (AnimatePresence): [Y/N]
  - Mobile navigation: [Y/N, describe]
  - Sticky header: [Y/N]

External assets needing localisation:
  - framerusercontent.com images: [count]
  - Framer font CDN: [Y/N]
  - Google Fonts: [Y/N — which families + weights]
  - Other external: [list]

Responsive breakpoints found in CSS: [list]

Broken/missing references: [list]
```

Stop. Wait for approval.

---

## PHASE 2 — DESIGN TOKEN EXTRACTION

Read all CSS. Extract every `--token-*` variable and every hardcoded value
that repeats 3+ times. Map to semantic names.

Create `/assets/css/main.css`:

```css
/* ============================================================
   DESIGN TOKENS — extracted from Framer export
   ============================================================ */
:root {
  /* Colours */
  --color-primary:        ;
  --color-secondary:      ;
  --color-background:     ;
  --color-surface:        ;
  --color-text-primary:   ;
  --color-text-secondary: ;
  --color-accent:         ;
  --color-border:         ;

  /* Typography */
  --font-heading:   ;
  --font-body:      ;
  --font-size-xs:   ;
  --font-size-sm:   ;
  --font-size-md:   ;
  --font-size-lg:   ;
  --font-size-xl:   ;
  --font-size-2xl:  ;
  --font-size-3xl:  ;

  /* Spacing */
  --space-xs:  ;
  --space-sm:  ;
  --space-md:  ;
  --space-lg:  ;
  --space-xl:  ;
  --space-2xl: ;

  /* Layout */
  --container-max:    ;
  --border-radius-sm: ;
  --border-radius-md: ;
  --border-radius-lg: ;

  /* Shadows */
  --shadow-sm: ;
  --shadow-md: ;
  --shadow-lg: ;
}

/* Reset, base, typography, layout, components, responsive */
```

Breakpoints — always use Framer's three tiers:
```css
@media (max-width: 1199px) { /* Tablet */ }
@media (max-width: 767px)  { /* Mobile */ }
```

---

## PHASE 3 — ANIMATION TRANSLATION

### Framer Motion → CSS/JS Conversion Table

| Framer Motion | CSS/JS Equivalent |
|---|---|
| `initial={{ opacity:0 }} animate={{ opacity:1 }}` | `.reveal { opacity:0; transition: opacity 0.6s ease; }` + JS observer adds `.is-visible { opacity:1 }` |
| `initial={{ y:40, opacity:0 }}` | `.reveal { transform: translateY(40px); opacity:0; }` |
| `initial={{ x:-40, opacity:0 }}` | `.reveal-left { transform: translateX(-40px); opacity:0; }` |
| `whileHover={{ scale:1.05 }}` | CSS `:hover { transform: scale(1.05); transition: transform 0.2s ease; }` |
| `whileHover={{ y:-6 }}` | CSS `:hover { transform: translateY(-6px); }` |
| `transition={{ duration:0.6, delay:0.2 }}` | CSS `transition-duration: 0.6s; transition-delay: 0.2s;` |
| `transition={{ type:"spring", stiffness:300 }}` | CSS `transition-timing-function: cubic-bezier(0.34,1.56,0.64,1);` |
| `viewport={{ once:true }}` | JS IntersectionObserver with `observer.unobserve()` after trigger |
| `staggerChildren: 0.1` | CSS `nth-child` transition-delay increments |

### Create `/assets/css/animations.css`
```css
/* Scroll reveal — base */
.reveal,
.reveal-fade,
.reveal-left,
.reveal-right {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal      { opacity:0; transform: translateY(32px); }
.reveal-fade { opacity:0; }
.reveal-left { opacity:0; transform: translateX(-32px); }
.reveal-right{ opacity:0; transform: translateX(32px); }

.reveal.is-visible,
.reveal-fade.is-visible,
.reveal-left.is-visible,
.reveal-right.is-visible {
  opacity:1;
  transform: none;
}

/* Stagger delays for child groups */
.stagger > *:nth-child(1) { transition-delay: 0.00s; }
.stagger > *:nth-child(2) { transition-delay: 0.10s; }
.stagger > *:nth-child(3) { transition-delay: 0.20s; }
.stagger > *:nth-child(4) { transition-delay: 0.30s; }
.stagger > *:nth-child(5) { transition-delay: 0.40s; }
.stagger > *:nth-child(6) { transition-delay: 0.50s; }

/* Hover lift (replaces whileHover y offset) */
.hover-lift {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.hover-lift:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
}

/* Hover scale */
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: scale(1.04);
}
```

### Create `/assets/js/animations.js`
```js
(function () {
  'use strict';
  var selectors = '.reveal, .reveal-fade, .reveal-left, .reveal-right';
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(selectors).forEach(function (el) {
    observer.observe(el);
  });
})();
```

---

## PHASE 4 — PAGE TRANSLATION

For each HTML page:

### Step 1 — Identify content from compiled output
Read the compiled HTML. Extract:
- All visible text content (headings, paragraphs, labels, CTAs)
- All image sources and alt text
- All link hrefs
- The visual layout structure (sections, columns, grids)
- Which elements have scroll animation wrappers
- Which elements have hover animations

### Step 2 — Standard head block (use on every page)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="[page description]" />
  <title>[Page] | [Site Name]</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="[exact Google Fonts URL from original export]" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/css/main.css" />
  <link rel="stylesheet" href="/assets/css/animations.css" />
</head>
<body>
  [nav]
  [main content]
  [footer]
  <script src="/assets/js/main.js" defer></script>
  <script src="/assets/js/animations.js" defer></script>
</body>
</html>
```

### Step 3 — Apply animation classes to translated HTML
- Any element that faded/slid in on scroll → add `.reveal` (or variant)
- Groups of cards/items that stagger → wrap parent in `.stagger`, children get `.reveal`
- Hover lift cards → add `.hover-lift`
- Hover scale buttons/images → add `.hover-scale`

### Step 4 — Create `/assets/js/main.js`
```js
(function () {
  'use strict';

  // Mobile nav toggle
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-nav-mobile]');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Sticky header
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // Active nav link
  var links = document.querySelectorAll('nav a[href]');
  links.forEach(function (link) {
    if (link.href === window.location.href) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();
```

---

## PHASE 5 — ASSET LOCALISATION

### Images
For every `framerusercontent.com` image URL in the HTML:
1. Note the URL
2. Save a local copy to `/assets/images/[descriptive-name].[ext]`
3. Replace the URL with `/assets/images/[descriptive-name].[ext]`
4. Ensure every `<img>` has a meaningful `alt` attribute

### Fonts
- If Google Fonts: keep the `<link>` tag, use exact same families and weights
- If Framer-hosted font: find the equivalent on Google Fonts and substitute
- If no equivalent: flag for manual download in the final report

### SVG Icons
- Framer often inlines SVGs. Keep them inline — they are already local.

---

## PHASE 6 — CONSISTENCY ENFORCEMENT

Apply across every page:
- Identical `<head>` structure (except title and description)
- Identical nav HTML — use the most complete version found
- Identical footer HTML
- All `.reveal` classes applied consistently to matching element types
- All hover effects via CSS classes (not inline JS)
- All internal hrefs use correct relative paths
- No remaining references to `framerusercontent.com`, `framer.com`, or localhost

---

## PHASE 7 — VERCEL DEPLOYMENT PREP

`vercel.json`:
```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/(.*)", "destination": "/$1.html" }
  ]
}
```

`.gitignore`:
```
.DS_Store
Thumbs.db
node_modules/
.env
*.log
```

---

## PHASE 8 — FINAL REPORT

```
COMPLETION REPORT
=================
Pages translated:          N
Design tokens extracted:   N
Animations translated:     N
  - Scroll reveals:        N
  - Hover effects:         N
  - Stagger groups:        N
Images localised:          N
External refs remaining:   [list any intentionally kept CDN links]
Framer Motion removed:     Y/N (if N, list which components still use it)
vercel.json created:       Y
Ready to deploy:           Y/N

Manual review needed:
  - [anything that could not be automated]
```
