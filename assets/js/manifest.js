// Оптимизированная регистрация Service Worker
(function() {
  'use strict';

  // Конфигурация
  const CONFIG = {
    swPath: '/assets/js/service-worker.js',
    scope: '/',
    registrationTimeout: 10000 // 10 секунд
  };

  // Функция регистрации Service Worker
  async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker не поддерживается');
      return;
    }

    try {
      // Ждем полной загрузки страницы
      if (document.readyState === 'loading') {
        await new Promise(resolve => window.addEventListener('load', resolve));
      }

      const registration = await Promise.race([
        navigator.serviceWorker.register(CONFIG.swPath, { scope: CONFIG.scope }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), CONFIG.registrationTimeout)
        )
      ]);

      console.log('✅ Service Worker зарегистрирован:', registration);

      // Проверка обновлений
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 Обнаружено обновление Service Worker');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 Новый Service Worker готов к активации');
            showUpdateNotification();
          }
        });
      });

      // Обработка сообщений от Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('📨 Сообщение от Service Worker:', event.data);
        
        if (event.data.type === 'CACHE_READY') {
          console.log('✅ Кэш готов');
        }
      });

    } catch (error) {
      console.error('❌ Ошибка регистрации Service Worker:', error);
    }
  }

  // Уведомление об обновлении
  function showUpdateNotification() {
    if (confirm('Доступна новая версия сайта. Обновить?')) {
      window.location.reload();
    }
  }

  // Инициализация при загрузке
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    registerServiceWorker();
  } else {
    document.addEventListener('DOMContentLoaded', registerServiceWorker);
  }

  // Экспорт для глобального доступа (если нужен)
  window.AppSW = {
    register: registerServiceWorker,
    unregister: async () => {
      const registration = await navigator.serviceWorker.ready;
      return registration.unregister();
    }
  };
})();