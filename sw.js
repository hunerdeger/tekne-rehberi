// Çevrimdışı çalışma: sayfa önbellekte, tekne fotoğrafları görüldükçe saklanır.
const SHELL = 'rehber-v1', PH = 'rehber-foto-v1';
self.addEventListener('install', e => { e.waitUntil(caches.open(SHELL).then(c => c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-180.png']))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => ![SHELL, PH].includes(k)).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (/\.mm\.bing\.net$/.test(u.hostname)) {
    e.respondWith(caches.open(PH).then(async c => { const hit = await c.match(e.request); if (hit) return hit; try { const r = await fetch(e.request); if (r.ok || r.type === 'opaque') c.put(e.request, r.clone()); return r; } catch (x) { return hit || Response.error(); } }));
    return;
  }
  if (u.origin === location.origin) e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(SHELL).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
