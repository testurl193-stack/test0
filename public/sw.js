// ============================================
// سعودي - Service Worker for Advanced Caching
// ============================================

const CACHE_NAME = 'saudi-store-v1';
const STATIC_CACHE = 'saudi-static-v1';
const IMAGE_CACHE = 'saudi-images-v1';

// الأصول الأساسية للتخزين المسبق
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
];

// Install: تخزين الأصول الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: حذف الكاشات القديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== IMAGE_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: استراتيجية الكاشينج الذكية
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الطلبات غير HTTP
  if (!url.protocol.startsWith('http')) return;

  // استراتيجية الصور: Cache First (الكاش أولاً)
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);
        });
      })
    );
    return;
  }

  // استراتيجية الأصول الثابتة (JS, CSS): Cache First
  if (
    url.pathname.startsWith('/assets/') ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          return cachedResponse || fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // استراتيجية الصفحات: Network First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }
});
