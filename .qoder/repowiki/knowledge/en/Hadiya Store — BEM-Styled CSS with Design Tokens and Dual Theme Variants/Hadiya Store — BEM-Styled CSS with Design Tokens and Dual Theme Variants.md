---
kind: frontend_style
name: Hadiya Store — BEM-Styled CSS with Design Tokens and Dual Theme Variants
category: frontend_style
scope:
    - '**'
source_files:
    - src/styles/style.css
    - src/styles/animations.css
    - css/style.css
    - css/animations.css
    - vite.config.js
    - src/main.jsx
---

## What system/approach is used

The Hadiya store uses a **plain CSS** styling strategy (no CSS-in-JS, no Tailwind, no Sass/Less) built on top of **CSS Custom Properties (design tokens)** and a **BEM-style naming convention**. The project ships two parallel style trees:

- `src/styles/style.css` + `src/styles/animations.css` — the theme consumed by the React SPA built via Vite.
- `css/style.css` + `css/animations.css` — an identical stylesheet tree served directly from static HTML entry points (`index.html`, `shop.html`, `product.html`, `cart.html`, `admin.html`) for non-SPA pages.

There is no build-time CSS processor configured in `vite.config.js`; only the `@vitejs/plugin-react` plugin is enabled. Styles are imported as plain `.css` files.

## Key files and packages

- `src/styles/style.css` (~1900 lines): the single source of truth for the React app’s visual design — reset, design tokens, base styles, layout, component styles (header, hero, product cards, footer, mobile bottom nav, drawers, toasts).
- `src/styles/animations.css`: hardware-accelerated scroll-reveal, badge pop, image zoom keyframes, and a `prefers-reduced-motion` block.
- `css/style.css` and `css/animations.css`: near-duplicate copies of the above, kept so static HTML pages can link them directly without a build step.
- `public/sw.js`, `public/_headers`, `public/_redirects`: service worker and Netlify/Vercel headers that cache assets (including the CSS bundles) for offline support.
- `package.json` / `vite.config.js`: no CSS-specific plugins or preprocessors — Vite serves raw CSS.

## Architecture and conventions

### Design tokens live in `:root`
All colors, typography scales, spacing units, radii, z-index layers, and layout constants are declared as CSS custom properties under `:root`. The React variant (`src/styles/style.css`) defines a warm brown-and-gold palette (`--color-primary: #3D231D`, `--color-secondary: #C5A059`, `--color-bg-alt: #FAF7F2`) while the static `css/` variant uses a darker neutral primary (`#121212`). This dual token set lets the same class names render different brand themes depending on which stylesheet is loaded.

Shared token categories include:
- Colors: `--color-primary`, `--color-secondary`, `--color-text`, `--color-sale`, `--color-success`, `--color-new`, `--color-hot`, `--color-overlay`.
- Typography scale: `--font-size-xs` through `--font-size-4xl` plus `--font-body: 'Cairo', sans-serif`.
- Spacing scale: `--space-xs` … `--space-3xl`.
- Layout tokens: `--container-width: 1240px`, `--container-padding`, `--header-height`, `--announce-height`, `--bottom-nav-height`.
- Radius tokens: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`.
- Transition tokens: `--transition-fast`, `--transition-base`.
- Z-index layering: `--z-header`, `--z-bottom-nav`, `--z-overlay`, `--z-drawer`, `--z-toast`.

### BEM-style class naming
Component classes follow a BEM-like pattern: `block__element--modifier` (e.g., `.header__nav-link`, `.product-card__badge--sale`, `.mobile-bottom-nav__item.active`). Block-level wrappers use simple class names (`.hero`, `.footer`, `.btn`, `.section`, `.container`).

### Global base styles
A universal reset sets `box-sizing: border-box` and clears margins/padding. The `<body>` is set to `direction: rtl; text-align: right` (Arabic RTL), uses the Cairo font, and applies a default line height. A utility class `body.no-scroll` locks scrolling when drawers/toasts are open.

### Responsive strategy
Responsive behavior is driven by CSS media queries inside the same stylesheet (not a separate responsive framework). Breakpoints are applied to switch between desktop grids (e.g., `.products-grid { grid-template-columns: repeat(4, 1fr); }`) and mobile layouts (e.g., `.mobile-bottom-nav` is `display: none` on desktop and shown via media query). Container width is capped at `--container-width: 1240px` with centered auto margins.

### Animation philosophy
Animations are pure CSS keyframes and transitions chosen for GPU acceleration: `translate3d`, `scale3d`, `backface-visibility: hidden`, and `will-change` toggled after reveal. A global `@media (prefers-reduced-motion: reduce)` block disables animations for accessibility. Staggered reveals are provided via `.reveal-stagger > *:nth-child(n)` delays.

### Component style organization
Styles are organized into logical sections within one large file, each preceded by a comment header (e.g., `/* ============================================ ANNOUNCEMENT BAR */`, `/* PRODUCTS GRID & CARD */`, `/* DRAWERS & OVERLAYS */`). There are no per-component CSS files — all UI components share the global stylesheet.

## Conventions and constraints

- **No CSS preprocessor**: No `.scss`, `.sass`, or CSS-in-JS libraries are used; everything is vanilla CSS processed by Vite's native CSS pipeline.
- **Design tokens are the single source of truth**: Hardcoded color/spacing values are avoided in favor of `var(--*)` references throughout the stylesheet.
- **BEM naming is enforced by convention**: New components should follow the existing `block__element--modifier` pattern to stay consistent with header, product card, footer, and drawer styles.
- **RTL-first layout**: The root body is set to `direction: rtl` and `text-align: right`, so all component styles assume right-to-left reading order (consistent with the Arabic brand name "هدية").
- **Dual theme variants exist but are not switched at runtime**: `src/styles/` and `css/` contain two independent theme palettes; switching themes requires swapping which stylesheet is linked/imported, not toggling a CSS variable at runtime.
- **Animations must be GPU-friendly**: The animation stylesheet documents and enforces the use of `translate3d`/`scale3d` transforms and includes a `prefers-reduced-motion` override — new animations should follow this pattern.
- **Static HTML pages depend on the `css/` folder**: Any change to the shared look of the standalone HTML entry points must be mirrored in both `src/styles/` and `css/` since they are maintained as separate copies.