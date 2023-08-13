// Define a name for the current cache
const cacheName = 'v1';

// Default files to always cache
const cacheAssets = [
  '/',
  '/index.html',
  '/frontend.js',
  '/icons/48.png',
  '/icons/96.png',
  '/icons/144.png',
  '/icons/192.png',
  '/icons/256.png',
  '/icons/384.png',
  '/icons/512.png',
  "/how-to-use.html",
  "/home.html",
   "/temps.html",
  "/privacy.html",
  "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
  // Add other assets you want to cache
];

// Call Install Event
self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Call Activate Event
self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Clone the response
        const resClone = res.clone();
        // Open cache
        caches.open(cacheName).then(cache => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});
