var CACHE = 'panini2026-v5';
var FILES = [
  '/panini2026/',
  '/panini2026/index.html'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Network first strategy - always try to get fresh content
self.addEventListener('fetch', function(e) {
  if (e.request.url.includes('/panini2026/')) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(e.request, clone);
          });
          return response;
        })
        .catch(function() {
          return caches.match(e.request);
        })
    );
  }
});
