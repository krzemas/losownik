// Service Worker for Losownik PWA
const CACHE_NAME = 'losownik-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/kostka/',
    '/mecz/',
    '/imie/',
    '/lotto/',
    '/wyliczanka/',
    '/liczba/',
    '/kolo-fortuny/',
    '/kolor/',
    '/moneta/',
    '/druzyny/',
    '/kolejnosc/',
    '/postac/',
    '/karty/',
    '/ruletka/',
    '/css/style.css',
    '/js/nav.js',
    '/manifest.json'
];

// Install - cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clone);
                });
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
