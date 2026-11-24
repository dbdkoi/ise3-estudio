const CACHE_NAME = 'ise3-v4';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './oficial.enc'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  const req = e.request.mode === 'navigate' || u.pathname.endsWith('.html') || u.pathname.endsWith('/') ? new Request(e.request.url, { cache: 'no-store' }) : e.request;
  e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(CACHE_NAME).then(cc => cc.put(e.request, c)); } return r; }).catch(() => caches.match(e.request)));
});
