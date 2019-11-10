const staticAssets = [
  'index.html',
  'app.js',
  'resource/icons-192.png',
  'resource/icons-512.png',
  'resource/jquery.min.js',
  'resource/404.jpeg',
  'fallback.json',
];

self.addEventListener('install', async event => {
  const cache = await caches.open('staticAssets');
  cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cache =  await caches.open('dynamicAssets');
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch {
    const cachedResponse = await cache.match(req);
    return cachedResponse || await caches.match('fallback.json');
  }
}
