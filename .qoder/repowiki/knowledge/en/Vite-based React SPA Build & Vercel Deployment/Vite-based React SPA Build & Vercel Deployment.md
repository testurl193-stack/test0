---
kind: build_system
name: Vite-based React SPA Build & Vercel Deployment
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - vite.config.js
    - vercel.json
    - .env.example
---

## Build System Overview

The Hadiya Abaya Store is a React single-page application built with **Vite 5** and the official `@vitejs/plugin-react`. There are no Makefiles, Dockerfiles, shell build scripts, or CI pipeline files in this repository — the entire build and deployment flow is driven by npm scripts and Vercel configuration.

## What System/Approach Is Used

- **Build tool**: Vite (`vite build`) configured via `vite.config.js` with the React plugin. The dev server runs on port `3000` and auto-opens the browser.
- **Package manager**: npm (lockfile `package-lock.json` present). The project is marked `private` and uses ES modules (`"type": "module"`).
- **Runtime dependencies**: React 18, React DOM, React Router DOM. Dev-only dependency is Vite itself plus the React plugin.
- **Deployment target**: Vercel, configured declaratively via `vercel.json` at the repo root.
- **Environment variables**: Loaded from `.env` using Vite's `VITE_*` prefix convention (see `.env.example` for Cloudinary settings: `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, `VITE_CLOUDINARY_FOLDER`).

## Key Files

- `package.json` — defines the three npm scripts (`dev`, `build`, `preview`) and all dependencies.
- `vite.config.js` — enables the React plugin and sets the dev server to port 3000 with auto-open.
- `vercel.json` — declares client-side rewrites routing all paths to `/index.html` (SPA routing) and sets long-term immutable cache headers for assets (`/assets/*`, `*.js`, `*.css`, `*.woff2` → 1 year immutable), image caching (`/images/*` → 1 day + stale-while-revalidate), security headers (`X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`), and a favicon cache rule.
- `.env.example` — documents the required `VITE_*` environment variables for Cloudinary image uploads.
- `dist/` — output directory where `vite build` emits the production bundle (present but not committed as source of truth).
- Static HTML entry points (`index.html`, `admin.html`, `cart.html`, `product.html`, `shop.html`) live at the repo root and are served alongside the built SPA.

## Architecture and Conventions

- **Single-command build**: `npm run build` invokes `vite build`, which compiles `src/` into optimized static assets under `dist/`. No custom rollup/Vite config beyond the React plugin and dev server options.
- **Client-side routing**: All routes are handled by React Router; Vercel rewrites every path to `/index.html` so the SPA bootstraps correctly regardless of URL.
- **Asset caching strategy**: Production builds use content-hashed filenames (Vite default), paired with Vercel's `immutable` cache-control headers so browsers can cache them indefinitely without invalidation concerns.
- **Static vs. built assets**: Images and other public assets live in both `public/` (served verbatim) and `src/images/` (imported into the app); the build process handles bundling of the latter while the former is copied as-is.
- **Environment injection**: Only variables prefixed with `VITE_` are exposed to the client code, following Vite's convention documented in `.env.example`.

## Conventions and Constraints

- **Scripts contract**: Development, building, and previewing the app must be done through the three npm scripts defined in `package.json` (`npm run dev`, `npm run build`, `npm run preview`). There are no alternative build commands or Make targets.
- **No pre/post-build hooks**: The build is a single `vite build` invocation with no additional steps (no linting, minification overrides, asset optimization plugins, or post-processing).
- **Deployment is Git-push-to-Vercel**: The presence of `vercel.json` indicates the project is deployed on Vercel, which reads it automatically during build. No separate CI/CD file (e.g., GitHub Actions, `.github/workflows/`) exists in the repository.
- **Environment variables are required at build time for Cloudinary**: The `.env.example` file documents that `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` must be set in the deployment environment for image upload functionality to work.
- **Output location**: The build artifact is written to `dist/` (Vite default), which Vercel publishes automatically when a project is linked to this repository.