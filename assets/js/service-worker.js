// service-worker.js - Оптимизированная версия v2.0
const CACHE_VERSION = '2.0.0';
const CACHE_NAMES = {
  CRITICAL: `mineorigins-critical-v${CACHE_VERSION}`,
  STATIC: `mineorigins-static-v${CACHE_VERSION}`,
  DYNAMIC: `mineorigins-dynamic-v${CACHE_VERSION}`,
  IMAGES: `mineorigins-images-v${CACHE_VERSION}`
};

// Критически важные ресурсы для мгновенной загрузки
const CRITICAL_URLS = [
  '/',
  '/index.html',
  '/players.html',
  '/settlements.html', 
  '/gallery.html',
  '/faq.html',
  '/assets/css/index.css',
  '/assets/css/players.css',
  '/assets/css/settlements.css',
  '/assets/css/gallery.css',
  '/assets/css/faq.css',
  '/assets/js/main.js',
  '/manifest.json'
];

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const swUrl = '/service-worker.js'
    
    navigator.serviceWorker.register(swUrl, {
      scope: '/'
    })
    .then(registration => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          }
        });
      });
    })
    .catch(error => {
      console.error('❌ Ошибка регистрации Service Worker:', error);
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }
}

document.addEventListener('DOMContentLoaded', registerServiceWorker);
document.addEventListener('DOMContentLoaded', registerServiceWorker);
document.addEventListener('DOMContentLoaded', registerServiceWorker);
const STATIC_URLS = [
  '/assets/js/players.js',
  '/assets/js/s2.js',
  '/assets/js/gallery.js',
  '/assets/js/faq.js',
  '/assets/images/MineOrigins.png',
  '/assets/images/world-map.png'
];

const PRELOAD_IMAGES = [
  '/assets/images/icons/index_icon_house.png',
  '/assets/images/icons/index_icon_players.gif',
  '/assets/images/icons/index_icon_settlements.gif',
  '/assets/images/icons/index_icon_gallery.gif',
  '/assets/images/icons/icon_discord.gif',
  '/assets/images/icons/icon_telegram.gif',
  '/assets/images/icons/icon_demon.gif',
  '/assets/images/icons/icon_angel.gif',
  '/assets/images/icons/icon_terrestrial.gif',
  '/assets/images/icons/icon_search.gif'
];

const MAX_DYNAMIC_ITEMS = 50;

self.addEventListener('install', (event) => {
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAMES.CRITICAL)
        .then(cache => cache.addAll(CRITICAL_URLS)),
      
      caches.open(CACHE_NAMES.STATIC)
        .then(cache => cache.addAll(STATIC_URLS)),
      
      caches.open(CACHE_NAMES.IMAGES)
        .then(cache => cache.addAll(PRELOAD_IMAGES))
    ]).then(() => {
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ Ошибка кеширования:', error);
    })
  );
});

self.addEventListener('activate', (event) => {
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (!url.origin.startsWith(self.location.origin) || request.method !== 'GET') {
    return;
  }

  if (url.pathname.endsWith('manifest.json')) {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(networkResponse => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAMES.STATIC)
            .then(cache => cache.put(request, responseClone));
          return networkResponse;
        });
      })
    );
    return;
  }

  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  if (request.destination === 'document') {
    event.respondWith(staleWhileRevalidateStrategy(request, CACHE_NAMES.CRITICAL));
    return;
  }

  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheFirstStrategy(request, event, CACHE_NAMES.STATIC));
    return;
  }

  if (request.destination === 'image') {
    event.respondWith(imageCacheStrategy(request));
    return;
  }

  event.respondWith(networkFirstStrategy(request));
});

async function cacheFirstStrategy(request, event, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    event.waitUntil(
      fetch(request).then(response => {
        if (response.status === 200) {
          return cache.put(request, response);
        }
      }).catch(() => { })
    );
    return cachedResponse;
  }
  
  return fetchAndCache(request, cacheName);
}

async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAMES.DYNAMIC);
      await cache.put(request, networkResponse.clone());
      await cleanupDynamicCache();
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    if (request.destination === 'document') {
      return caches.match('/offline.html') || offlineResponse();
    }
    
    return offlineResponse();
  }
}

async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      caches.open(cacheName)
        .then(cache => cache.put(request, responseClone));
    }
    return networkResponse;
  }).catch(() => { 
    return cachedResponse;
  });
  
  return cachedResponse || fetchPromise;
}

async function imageCacheStrategy(request) {
  const cache = await caches.open(CACHE_NAMES.IMAGES);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const keys = await cache.keys();
      if (keys.length < 100) {
        await cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (error) {
    const fallbackResponse = await caches.match(request);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="10">No Image</text></svg>',
      { 
        status: 404, 
        headers: { 'Content-Type': 'image/svg+xml' } 
      }
    );
  }
}

async function cleanupDynamicCache() {
  const cache = await caches.open(CACHE_NAMES.DYNAMIC);
  const keys = await cache.keys();
  
  if (keys.length > MAX_DYNAMIC_ITEMS) {
    await cache.delete(keys[0]);
  }
}

async function fetchAndCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || offlineResponse();
  }
}

function offlineResponse() {
  return new Response(
    `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Оффлайн - MineOrigins</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline { color: #666; }
        </style>
    </head>
    <body>
        <div class="offline">
            <h1>📶 Оффлайн режим</h1>
            <p>Соединение с интернетом отсутствует</p>
            <p>Некоторые функции могут быть недоступны</p>
        </div>
    </body>
    </html>
    `,
    {
      status: 503,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-update') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  try {
    const cache = await caches.open(CACHE_NAMES.DYNAMIC);
  } catch (error) {
    console.error('Ошибка при обновлении контента:', error);
  }
}

async function fetchWithTimeout(request, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, { 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}