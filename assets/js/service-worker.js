// service-worker.js - Оптимизированная версия
const CACHE_NAME = 'mineorigins-optimized-v1.3.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Критически важные ресурсы для мгновенной загрузки
const CRITICAL_URLS = [
    '/',
    '/index.html',
    '/players.html',
    '/settlements.html', 
    '/gallery.html',
    '/faq.html',
    '/assets/images/MineOrigins.png',
    '/assets/images/world-map.png',
    '/assets/images/icons/index_icon_house.png',
    '/assets/images/icons/index_icon_players.gif',
    '/assets/images/icons/index_icon_settlements.gif',
    '/assets/images/icons/index_icon_gallery.gif',
    '/assets/images/icons/icon_discord.gif',
    '/assets/images/icons/icon_telegram.gif',
    '/assets/images/icons/icon_demon.gif',
    '/assets/images/icons/icon_angel.gif',
    '/assets/images/icons/icon_terrestrial.gif',
    '/assets/images/icons/icon_search.gif',
    '/assets/images/gallery/nature/osfon1.jpg',
    '/assets/images/gallery/builds/build1.jpg',
    '/assets/images/gallery/events/event1.png'
];

// Статические ресурсы
const STATIC_URLS = [
  '/assets/css/index.css',
  '/assets/css/players.css',
  '/assets/css/settlements.css',
  '/assets/css/gallery.css',
  '/assets/css/faq.css',
  '/assets/js/main.js',
  '/assets/js/players.js',
  '/assets/js/s2.js',
  '/assets/js/gallery.js',
  '/assets/js/faq.js',
  '/assets/images/world-map.png'
];

// Установка - кэшируем только критически важные ресурсы
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker: Установка (оптимизированная)...');
  
  event.waitUntil(
    caches.open(CRITICAL_CACHE)
      .then((cache) => {
        console.log('🚀 Кэширование критических ресурсов...');
        return cache.addAll(CRITICAL_URLS);
      })
      .then(() => {
        console.log('✅ Критические ресурсы закэшированы');
        return self.skipWaiting();
      })
  );
});

// Активация - очистка старых кэшей
self.addEventListener('activate', (event) => {
  console.log('🔥 Service Worker: Активация...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== CRITICAL_CACHE && 
              cacheName !== STATIC_CACHE) {
            console.log('🗑️ Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker активирован');
      return self.clients.claim();
    })
  );
});

// Стратегия кэширования: Network First для HTML, Cache First для статики
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Пропускаем внешние запросы и POST-запросы
  if (!url.origin.startsWith(self.location.origin) || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Для статических ресурсов - Cache First
        if (event.request.destination === 'image' || 
            event.request.destination === 'style' ||
            event.request.destination === 'script' ||
            url.pathname.includes('/assets/')) {
          
          if (cachedResponse) {
            // Обновляем кэш в фоне
            fetchAndCache(event.request);
            return cachedResponse;
          }
          
          return fetchAndCache(event.request);
        }
        
        // Для HTML - Network First
        return fetch(event.request)
          .then((networkResponse) => {
            // Кэшируем успешные ответы
            if (networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => {
            // Fallback to cache
            return cachedResponse || new Response('Оффлайн', {
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Функция для получения и кэширования
function fetchAndCache(request) {
  return fetch(request)
    .then((networkResponse) => {
      if (networkResponse.status === 200) {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(request, responseClone));
      }
      return networkResponse;
    })
    .catch(() => {
      return caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || new Response('Ресурс недоступен', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    });
}