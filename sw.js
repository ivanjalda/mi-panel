// Permite instalar el panel como app y abrirlo aunque falle la conexión.
const CACHE = "mi-panel-v1";
const BASE = ["./", "index.html", "manifest.json", "icono.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(l => Promise.all(l.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copia = r.clone();
      caches.open(CACHE).then(c => c.put(e.request.url.split("?")[0], copia));
      return r;
    }).catch(() => caches.match(e.request.url.split("?")[0]))
  );
});
