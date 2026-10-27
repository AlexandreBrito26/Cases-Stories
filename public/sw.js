/* D5: funcionamento offline. Versão do cache: troque o número ao publicar mudanças grandes. */
const CACHE = 'cases-stories-v1'
const BASE = ['/', '/index.html', '/favicon.svg', '/logo-emblem-1024.png', '/manifest.webmanifest']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.all(BASE.map((u) => c.add(u).catch(() => null)))))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return
  if (req.mode === 'navigate') {
    // Páginas: tenta a rede; sem conexão, abre a versão guardada.
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone()
          caches.open(CACHE).then((c) => c.put('/index.html', copia))
          return res
        })
        .catch(() => caches.match('/index.html')),
    )
    return
  }
  // Demais arquivos (scripts, fontes, imagens): primeiro o cache, depois a rede.
  e.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copia = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copia))
          }
          return res
        }),
    ),
  )
})
