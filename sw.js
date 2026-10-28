const CACHE_NAME = 'carpeta-virtual-v1';
const ARCHIVOS_OFFLINE = [
  './',
  './index.html',
  './manifest.json',
  './fondo-carnet.png',
  './cedula.jpg',
  './pasaporte.jpg',
  // Benefactor A
  './vouchers_benefactor_a.pdf',
  './nda_benefactor_a.pdf',
  './cis_benefactor_a.pdf',
  './ddr_benefactor_a.pdf',
  // Benefactor B
  './vouchers_benefactor_b.pdf',
  './nda_benefactor_b.pdf',
  './cis_benefactor_b.pdf',
  './ddr_benefactor_b.pdf',
  // Benefactor X
  './vouchers_benefactor_x.pdf',
  './nda_benefactor_x.pdf',
  './cis_benefactor_x.pdf',
  './ddr_benefactor_x.pdf',
  // La Alianza
  './vouchers_alianza.pdf',
  './nda_alianza.pdf',
  './cis_alianza.pdf',
  './ddr_alianza.pdf',
  // Plan 600
  './vouchers_plan_600.pdf',
  './nda_plan_600.pdf',
  './cis_plan_600.pdf',
  './ddr_plan_600.pdf',
  // Otros Programas
  './vouchers_otros.pdf',
  './nda_otros.pdf',
  './cis_otros.pdf',
  './ddr_otros.pdf'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        ARCHIVOS_OFFLINE.map(url => {
          return cache.add(url).catch(err => console.log('Omitido o pendiente:', url));
        })
      );
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
