---
kind: dependency_management
name: Node.js Dependencies via npm with Vite Build Toolchain
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
    - vite.config.js
---

## System / Approach

This project uses the standard Node.js ecosystem for dependency management:
- **Package manager**: `npm` (manifest: `package.json`, lockfile: `package-lock.json`).
- **Build tool**: [Vite](https://vitejs.dev/) (`vite` in devDependencies) configured via `vite.config.js`, which also pulls in the React plugin (`@vitejs/plugin-react`).
- **Runtime dependencies** are limited to a minimal set: `react`, `react-dom`, and `react-router-dom`.
- The project is marked `private: true`, so it is not published to the public npm registry.

There is no vendoring of JavaScript libraries — all third-party code is installed into the `node_modules/` directory at build time. No private npm registry, `.npmrc`, or scoped packages are present.

## Key Files

- `package.json` — declares runtime dependencies (`react`, `react-dom`, `react-router-dom`) and dev dependencies (`vite`, `@vitejs/plugin-react`), plus scripts `dev`, `build`, `preview`.
- `package-lock.json` — locks exact versions of every transitive dependency resolved by npm; used to ensure reproducible installs across environments.
- `vite.config.js` — configures the Vite dev server (port 3000, auto-open) and registers the React plugin; this is where the build-time dependency on `@vitejs/plugin-react` is consumed.
- `node_modules/` — the installed dependency tree (gitignored).

## Architecture & Conventions

- **Flat dependency surface**: Only three runtime dependencies are declared, keeping the production bundle small. All framework/tooling concerns (React compilation, routing, dev server) live under `devDependencies`.
- **ESM-only**: The package is declared with `"type": "module"`, so imports throughout `src/` use ES module syntax (`import ... from ...`). This aligns with Vite's ESM-first approach.
- **Caret version ranges**: All versions in `package.json` use caret (`^`) ranges, allowing minor/patch updates automatically while pinning major versions. Exact pins are delegated to `package-lock.json`.
- **No bundler beyond Vite**: There is no Webpack, Rollup, or Parcel configuration; Vite handles asset bundling, HMR, and production builds out of the box.
- **Static HTML entry points**: In addition to the Vite-built SPA (`index.html`), standalone marketing/admin pages (`shop.html`, `product.html`, `cart.html`, `admin.html`) exist at the repo root and are served as-is by the static host (Vercel, per `vercel.json`). These do not depend on the JS dependency graph.

## Conventions & Constraints

- **Lockfile enforced**: `package-lock.json` is committed alongside `package.json`; teams should install via `npm ci` in CI to respect the lockfile exactly.
- **No vendoring**: Third-party packages are never checked into source control; only `node_modules` is gitignored.
- **Private package**: The `private: true` field prevents accidental publishing to the npm registry.
- **Dev vs. runtime split**: Development-only tools (`vite`, `@vitejs/plugin-react`) are isolated in `devDependencies`; only React and React Router ship to production.
- **Single registry**: No custom registries or authentication tokens are configured; all packages are fetched from the default public npm registry.