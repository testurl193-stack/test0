---
kind: external_dependency
name: Cloudinary — Unsigned image upload service
slug: cloudinary
category: external_dependency
category_hints:
    - vendor_identity
    - framework_behavior
scope:
    - '**'
source_files:
    - src/utils/cloudinary.js
    - .env.example
---

### Cloudinary
- Integration point: `src/utils/cloudinary.js` reads Vite env vars (`VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, optional `VITE_CLOUDINARY_FOLDER`) and posts a `FormData` with `file`, `upload_preset`, and optional `folder` to `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`. On success it returns `data.secure_url`; callers store only the URL in `localStorage`/product data instead of base64 blobs.
- Durable usage model: **Unsigned Upload** via an Upload Preset created in the Cloudinary dashboard (Settings → Upload → Upload presets → Signing Mode = Unsigned). No API secret is ever sent from the frontend; if one was accidentally shared, it must be regenerated in the Cloudinary dashboard.
- Required runtime config (per `.env.example`): `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, and optionally `VITE_CLOUDINARY_FOLDER=hadiya`.
- Verify exact upload parameters against the official Cloudinary unsigned upload docs.