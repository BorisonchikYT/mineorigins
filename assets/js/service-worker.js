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

// Оптимизированная регистрация Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    const swUrl = '/service-worker.js'; // Теперь в корне
    
    navigator.serviceWorker.register(swUrl, {
      scope: '/'
    })
    .then(registration => {
      // console.log('🎯 Service Worker зарегистрирован для scope:', registration.scope);
      
      // Проверка обновлений
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        // console.log('🔄 Обнаружено обновление Service Worker');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // console.log('📦 Новый контент доступен!');
            // Можно показать уведомление пользователю
          }
        });
      });
    })
    .catch(error => {
      console.error('❌ Ошибка регистрации Service Worker:', error);
    });

    // Обработка обновлений
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // console.log('🔄 Controller изменен, перезагрузка страницы...');
      window.location.reload();
    });
  }
}

// Зарегистрировать после загрузки DOM
document.addEventListener('DOMContentLoaded', registerServiceWorker);

// Зарегистрировать после загрузки DOM
document.addEventListener('DOMContentLoaded', registerServiceWorker);
// Зарегистрировать после загрузки DOM
document.addEventListener('DOMContentLoaded', registerServiceWorker);
// Статические ресурсы (версионированные)
const STATIC_URLS = [
  '/assets/js/players.js',
  '/assets/js/s2.js',
  '/assets/js/gallery.js',
  '/assets/js/faq.js',
  '/assets/images/MineOrigins.png',
  '/assets/images/world-map.png'
];

// Изображения для предварительного кеширования
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

// Максимальное количество элементов в динамическом кеше
const MAX_DYNAMIC_ITEMS = 50;

// Установка - стратегия параллельного кеширования
self.addEventListener('install', (event) => {
  // console.log('🔄 Service Worker: Установка (оптимизированная v2)...');
  
  event.waitUntil(
    Promise.all([
      // Кешируем критические ресурсы
      caches.open(CACHE_NAMES.CRITICAL)
        .then(cache => cache.addAll(CRITICAL_URLS)),
      
      // Кешируем статические ресурсы
      caches.open(CACHE_NAMES.STATIC)
        .then(cache => cache.addAll(STATIC_URLS)),
      
      // Кешируем важные изображения
      caches.open(CACHE_NAMES.IMAGES)
        .then(cache => cache.addAll(PRELOAD_IMAGES))
    ]).then(() => {
      // console.log('✅ Все ресурсы закэшированы');
      return self.skipWaiting();
    }).catch(error => {
      console.error('❌ Ошибка кеширования:', error);
    })
  );
});

// Активация - умная очистка старых кэшей
self.addEventListener('activate', (event) => {
  // console.log('🔥 Service Worker: Активация v2...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Удаляем все кеши, кроме текущих версий
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            // console.log('🗑️ Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // console.log('✅ Service Worker активирован и готов');
      return self.clients.claim();
    })
  );
});

// Стратегия кэширования с приоритетами
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Пропускаем внешние запросы и не-GET запросы
  if (!url.origin.startsWith(self.location.origin) || request.method !== 'GET') {
    return;
  }

  // Особые случаи - manifest.json
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

  // Для API запросов - Network First
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Для HTML - Stale-While-Revalidate
  if (request.destination === 'document') {
    event.respondWith(staleWhileRevalidateStrategy(request, CACHE_NAMES.CRITICAL));
    return;
  }

  // Для CSS и JS - Cache First с обновлением
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheFirstStrategy(request, event, CACHE_NAMES.STATIC));
    return;
  }

  // Для изображений - Cache First с ограничениями
  if (request.destination === 'image') {
    event.respondWith(imageCacheStrategy(request));
    return;
  }

  // По умолчанию - Network First
  event.respondWith(networkFirstStrategy(request));
});

// Стратегии кэширования

/**
 * Cache First - для статических ресурсов
 */
async function cacheFirstStrategy(request, event, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Обновляем кэш в фоне
    event.waitUntil(
      fetch(request).then(response => {
        if (response.status === 200) {
          return cache.put(request, response);
        }
      }).catch(() => { /* Игнорируем ошибки при обновлении */ })
    );
    return cachedResponse;
  }
  
  return fetchAndCache(request, cacheName);
}

/**
 * Network First - для динамического контента
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAMES.DYNAMIC);
      await cache.put(request, networkResponse.clone());
      await cleanupDynamicCache(); // Очищаем старые записи
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback для HTML страниц
    if (request.destination === 'document') {
      return caches.match('/offline.html') || offlineResponse();
    }
    
    return offlineResponse();
  }
}

/**
 * Stale-While-Revalidate - для HTML
 */
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Обновляем кэш в фоне
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      caches.open(cacheName)
        .then(cache => cache.put(request, responseClone));
    }
    return networkResponse;
  }).catch(() => { 
    // Игнорируем ошибки для фонового обновления
    return cachedResponse;
  });
  
  // Возвращаем кэшированную версию сразу, если есть
  return cachedResponse || fetchPromise;
}

/**
 * Стратегия для изображений с ограничениями
 */
async function imageCacheStrategy(request) {
  const cache = await caches.open(CACHE_NAMES.IMAGES);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      // Проверяем размер кэша перед сохранением
      const keys = await cache.keys();
      if (keys.length < 100) { // Максимум 100 изображений
        await cache.put(request, networkResponse.clone());
      }
    }
    return networkResponse;
  } catch (error) {
    const fallbackResponse = await caches.match(request);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    
    // Возвращаем пустой SVG если изображение не найдено
    return new Response(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" font-family="Arial" font-size="10">No Image</text></svg>',
      { 
        status: 404, 
        headers: { 'Content-Type': 'image/svg+xml' } 
      }
    );
  }
}

/**
 * Очистка динамического кэша
 */
async function cleanupDynamicCache() {
  const cache = await caches.open(CACHE_NAMES.DYNAMIC);
  const keys = await cache.keys();
  
  if (keys.length > MAX_DYNAMIC_ITEMS) {
    await cache.delete(keys[0]); // Удаляем самый старый элемент
  }
}

/**
 * Общая функция для получения и кэширования
 */
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

/**
 * Оффлайн ответ
 */
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

// Фоновая синхронизация (если нужна)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    // console.log('🔄 Фоновая синхронизация...');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Здесь можно реализовать фоновую синхронизацию данных
  // console.log('Выполняется фоновая синхронизация...');
}

// Периодическая синхронизация (для обновления контента)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-update') {
    // console.log('🔄 Периодическое обновление контента...');
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  // Обновление кэша в фоне
  try {
    const cache = await caches.open(CACHE_NAMES.DYNAMIC);
    // Логика обновления контента
    // console.log('Контент обновлен в фоне');
  } catch (error) {
    console.error('Ошибка при обновлении контента:', error);
  }
}

// В стратегиях кэширования добавьте:
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