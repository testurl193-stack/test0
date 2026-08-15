---
kind: configuration_system
name: Vite-based Environment and Build Configuration for Hadiya Store
category: configuration_system
scope:
    - '**'
source_files:
    - vite.config.js
    - package.json
    - .env.example
    - src/utils/cloudinary.js
    - src/main.jsx
    - vercel.json
    - public/_headers
    - public/_redirects
---

## What system/approach is used

The project uses a **Vite + React SPA** configuration model. There is no runtime application config loader; instead, configuration is split into three layers:

1. **Build-time environment variables** via Vite's `import.meta.env` mechanism — values prefixed with `VITE_` are injected at build time.
2. **Vite build/dev server configuration** in `vite.config.js` (port, open-on-start, plugins).
3. **Deployment/runtime configuration** declared in `vercel.json` and the Netlify-style `public/_headers` and `public/_redirects` files, which control HTTP headers, caching, and SPA rewrites on Vercel/Netlify.

No `.env` file is committed; only `.env.example` is provided as a template.

## Key files and packages

- `vite.config.js` — Vite dev server port (`3000`) and auto-open behavior; registers `@vitejs/plugin-react`.
- `package.json` — declares scripts (`dev`, `build`, `preview`), sets `type: module`, and pins Vite 5.x plus React 18.
- `.env.example` — documents the required Cloudinary env vars: `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, and optional `VITE_CLOUDINARY_FOLDER`.
- `src/utils/cloudinary.js` — reads `VITE_CLOUDINARY_*` variables from `import.meta.env` and validates presence; throws a user-facing Arabic error if they are missing.
- `src/main.jsx` — uses `import.meta.env.PROD` to conditionally register the service worker only in production builds.
- `vercel.json` — defines SPA rewrite (`/* → /index.html`) and per-path `Cache-Control` / security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`).
- `public/_headers` and `public/_redirects` — Netlify-compatible equivalents of the same header/rewrite rules, enabling deployment on Netlify or serving static assets directly.

## Architecture and conventions

- **Environment variable naming**: All client-exposed env vars use the `VITE_` prefix so Vite can inject them into the bundle via `import.meta.env`. This is enforced by Vite itself — any non-`VITE_` variable is excluded from the client bundle.
- **Separation of concerns**: Runtime secrets (Cloudinary credentials) live only in env vars consumed by `src/utils/cloudinary.js`; build/dev settings live in `vite.config.js`; deployment routing and caching live in `vercel.json` / `public/_headers`.
- **Dual deployment configs**: The repo ships both Vercel-native `vercel.json` and Netlify-compatible `public/_headers` + `public/_redirects`, allowing the same build output to be deployed to either platform without code changes.
- **Service worker gating**: Registration is guarded by `import.meta.env.PROD`, so the SW is never registered during local development.
- **Static HTML entry points**: Standalone pages (`admin.html`, `cart.html`, `product.html`, `shop.html`) sit at the repo root alongside `index.html`, bypassing the React router entirely for marketing/admin flows.

## Conventions and constraints

- **Env var convention**: Client-side configuration must be exposed through `VITE_*` env vars documented in `.env.example`; consuming code should read them from `import.meta.env.VITE_*` (see `src/utils/cloudinary.js`).
- **Required vars guard**: `src/utils/cloudinary.js` explicitly checks that `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` are set before attempting uploads and surfaces an Arabic error message if they are absent — this is the effective enforcement for those keys.
- **Dev server defaults**: The dev server always starts on port `3000` and opens the browser automatically (`server.port = 3000`, `server.open = true` in `vite.config.js`).
- **SPA routing**: Both `vercel.json` and `public/_redirects` enforce a catch-all rewrite to `/index.html`, ensuring client-side routes work on static hosting.
- **Caching policy**: Assets under `/assets/`, `*.js`, `*.css`, `*.woff2` are served with immutable cache headers (`max-age=31536000, immutable`); images get shorter TTL with stale-while-revalidate; all responses include XSS/frame/content-type hardening headers.
- **Module type**: The project is configured as ESM (`"type": "module"` in `package.json`), so all JS files (including config files) must use ES module syntax.