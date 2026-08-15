---
kind: error_handling
name: Frontend Error Handling via Toast Context, Local Validation, and Fallback Alerts
category: error_handling
scope:
    - '**'
source_files:
    - src/context/ToastContext.jsx
    - src/utils/cloudinary.js
    - src/pages/CheckoutPage.jsx
    - src/context/CartContext.jsx
    - src/context/WishlistContext.jsx
    - src/App.jsx
    - src/main.jsx
    - js/app.js
    - js/cart.js
    - admin.html
---

## What system/approach is used

This React SPA does not use a dedicated error-handling framework. Instead, it combines three lightweight mechanisms:

1. **A global `ToastContext`** (`src/context/ToastContext.jsx`) that provides a `showToast(message)` function to display transient success/info messages in a small toast UI (auto-dismiss after 2500ms). It is the primary user-facing feedback channel for successful operations.
2. **Synchronous client-side validation** using `alert()` calls inside page handlers (e.g., `CheckoutPage.jsx`, `admin.html`, `js/cart.js`, `js/app.js`) to block submission until required fields are present or invalid input is detected.
3. **`try/catch` around `localStorage` parsing** and `catch` blocks around async uploads to Cloudinary, which surface errors either through `alert()` or by propagating thrown `Error` objects up to callers.

There is no centralized error type hierarchy, no custom error classes, no global unhandled-rejection handler, and no server-side middleware — this is a client-only store with no backend API layer of its own.

## Key files and packages

- `src/context/ToastContext.jsx` — single source of truth for user-facing success notifications; wrapped around the entire app in `src/App.jsx` via `<ToastProvider>`.
- `src/utils/cloudinary.js` — only place that performs network I/O (Cloudinary image upload); throws typed `Error` messages for missing file, non-image file, misconfigured env vars, or non-OK HTTP response.
- `src/pages/CheckoutPage.jsx` — central hub where validation errors are surfaced via `alert()`, upload errors are caught and re-surfaced via `alert(err.message)`, and successful actions call `showToast()`.
- `src/context/CartContext.jsx` and `src/context/WishlistContext.jsx` — wrap `localStorage.getItem(...)` reads in `try/catch` so malformed storage data never crashes the app; emit success toasts on add/remove.
- `src/main.jsx` — registers the service worker in production and logs registration failures via `console.error`; otherwise no global error boundary.
- Static HTML/JS entry points (`admin.html`, `js/app.js`, `js/cart.js`) — rely almost entirely on `alert()` and a global `window.showToast` helper for user feedback.

## Architecture and conventions

- **User-facing feedback is split by severity**: success / informational messages go through `useToast().showToast(...)` (toast, auto-dismissing), while validation and runtime errors go through blocking `alert()` dialogs. There is no error-specific toast variant — the toast context only supports a single message string.
- **Errors are surfaced as plain `Error` objects with Arabic-language messages**. The Cloudinary utility throws `new Error('...')` for every failure mode (no file, wrong MIME, missing `VITE_CLOUDINARY_*` env vars, non-OK response). Callers catch these and translate them into `alert()` messages.
- **Storage access is defensively wrapped**: both `CartContext` and `WishlistContext` initialize state from `localStorage` inside `try { JSON.parse(...) } catch { return [] }`, so corrupted or empty storage silently falls back to defaults rather than crashing.
- **No global error boundary exists**: `App.jsx` wraps providers but does not install a React Error Boundary. Uncaught render-time exceptions will bubble to the browser default.
- **Service Worker registration errors are logged, not surfaced to users**: `main.jsx` catches SW registration failures and writes them to `console.error` only.
- **Form submission uses synchronous guard clauses**: `CheckoutPage.handleSubmitOrder` returns early with `alert()` for each missing field before any persistence occurs.

## Conventions and constraints

Observed patterns (descriptive):
- Success feedback is consistently delivered via the `useToast()` hook from anywhere inside the provider tree; contexts like Cart and Wishlist call `showToast()` immediately after mutating shared state.
- User-input validation errors are presented with `alert()` at the point of interaction (file picker, form submit), not propagated as thrown values.
- Network/upload errors are converted to `Error` objects with descriptive Arabic strings and then caught by the nearest caller, which chooses between `alert()` and toast depending on context.
- Environment configuration errors (missing Cloudinary env vars) are treated as fatal for the upload flow and surfaced to the user via an `alert()` after being thrown from `uploadToCloudinary`.
- No `throw new CustomError(...)` subclasses, no error code constants, no retry logic, and no global `unhandledrejection` listener were found.

Enforced rules (from the code itself):
- Any component that needs user feedback must consume `useToast()` from `ToastContext`; there is no alternative toast mechanism in `src/`.
- File uploads must pass through `uploadToCloudinary`; direct `fetch` calls bypass the built-in validation guards and are therefore not used elsewhere in `src/`.
- `localStorage` reads must be wrapped in `try/catch` when initializing state, as demonstrated in both cart and wishlist contexts.

Limitations visible in the codebase:
- Error presentation is inconsistent: some flows use `alert()`, others use `showToast()`, and there is no unified error toast variant.
- There is no structured logging facility beyond `console.log` / `console.error` in `main.jsx`.
- No route-level or component-level error boundaries exist to catch rendering exceptions.