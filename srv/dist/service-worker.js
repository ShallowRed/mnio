self.addEventListener('install', (event) => {
  // console.log('install', event);
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // console.log('activate', event);
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // console.log('fetch', event);
  event.respondWith(fetch(event.request));
});
