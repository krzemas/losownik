// Service Worker for Losownik PWA
const CACHE_NAME = 'losownik-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/kostka',
    '/mecz',
    '/imie',
    '/lotto',
    '/wyliczanka',
    '/liczba',
    '/kolo-fortuny',
    '/kolor',
    '/moneta',
    '/manifest.json'
];

// Install - cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch(() => {
                // If some assets fail to cache, don't block install
                return cache.addAll(['/']);
            });
        })
    );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch - network first, fallback to cache (for HTML)
// Cache first for static assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Skip non-GET requests and external URLs (ads, analytics, fonts)
    if (event.request.method !== 'GET') return;
    if (url.origin !== self.location.origin) return;
    
    // For HTML pages: network first, cache fallback
    if (event.request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }
    
    // For other assets: cache first, network fallback
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return response;
            });
        })
    );
});
