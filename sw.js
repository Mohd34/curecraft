const CACHE_NAME = 'curecraft-v1.0.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './wet-brine-calculator.html',
  './charcuterie-drying-calculator.html',
  './curing-time-calculator.html',
  './nitrite-converter.html',
  './biltong-calculator.html',
  './seo-dashboard.html',
  './assets/css/style.css',
  './assets/js/calculators.js',
  './assets/js/app.js',
  './assets/img/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => caches.match('./index.html'))
  );
});
