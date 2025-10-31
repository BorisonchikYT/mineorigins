// Оптимизированная регистрация Service Worker с проверками
(function() {
  'use strict';

  // Конфигурация
  const CONFIG = {
    swPath: '/service-worker.js', // Переместите SW в корень!
    scope: '/',
    registrationTimeout: 10000
  };

  // Проверка поддержки и окружения
  function canRegisterServiceWorker() {
    // 1. Проверка поддержки браузером
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker не поддерживается браузером');
      return false;
    }

    // 2. Проверка протокола (только HTTPS или localhost)
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
    const isHttps = window.location.protocol === 'https:';
    
    if (!isHttps && !isLocalhost) {
      console.warn('⚠️ Service Worker требует HTTPS или localhost. Текущий протокол:', window.location.protocol);
      return false;
    }

    // 3. Проверка что не file:// протокол
    if (window.location.protocol === 'file:') {
      console.warn('⚠️ Service Worker не работает с file:// протоколом. Используйте локальный сервер.');
      return false;
    }

    return true;
  }

  // Функция регистрации Service Worker
  async function registerServiceWorker() {
    if (!canRegisterServiceWorker()) {
      return;
    }

    try {
      // Ждем полной загрузки страницы
      if (document.readyState === 'loading') {
        await new Promise(resolve => window.addEventListener('load', resolve));
      }

      // console.log('🔄 Регистрируем Service Worker...');

      const registration = await Promise.race([
        navigator.serviceWorker.register(CONFIG.swPath, { scope: CONFIG.scope }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout при регистрации SW')), CONFIG.registrationTimeout)
        )
      ]);

      // console.log('✅ Service Worker зарегистрирован для scope:', registration.scope);

      // Проверка обновлений
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        // console.log('🔄 Обнаружено обновление Service Worker');
        
        newWorker.addEventListener('statechange', () => {
          // console.log('📊 Состояние SW:', newWorker.state);
          
          switch (newWorker.state) {
            case 'installed':
              if (navigator.serviceWorker.controller) {
                // console.log('🔄 Новый контент доступен!');
                showUpdateNotification();
              } else {
                // console.log('✅ Контент закэширован для оффлайн использования');
              }
              break;
            case 'activated':
              // console.log('✅ Service Worker активирован');
              break;
          }
        });
      });

      // Обработка сообщений от Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        // console.log('📨 Сообщение от Service Worker:', event.data);
        
        switch (event.data.type) {
          case 'CACHE_READY':
            // console.log('✅ Кэш готов');
            break;
          case 'OFFLINE_READY':
            // console.log('📶 Приложение готово к оффлайн работе');
            break;
        }
      });

      // Обработка контроллера
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // console.log('🔄 Controller изменен, обновляем страницу...');
        window.location.reload();
      });

    } catch (error) {
      console.error('❌ Ошибка регистрации Service Worker:', error);
      
      // Показываем пользователю информацию об ошибке
      if (error.message.includes('timeout')) {
        console.warn('⚠️ Регистрация SW заняла слишком много времени');
      } else if (error.message.includes('MIME-type')) {
        console.error('⚠️ Неправильный MIME-type для SW файла');
      } else if (error.message.includes('scope')) {
        console.error('⚠️ Проблема с scope SW');
      }
    }
  }

  // Уведомление об обновлении
  function showUpdateNotification() {
    // Создаем красивое уведомление вместо alert
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 10000;
      max-width: 300px;
    `;
    
    notification.innerHTML = `
      <strong>Доступно обновление!</strong>
      <p>Новая версия сайта готова.</p>
      <button onclick="this.parentElement.remove(); window.location.reload();" 
              style="background: white; color: #4CAF50; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
        Обновить
      </button>
      <button onclick="this.parentElement.remove()" 
              style="background: transparent; color: white; border: 1px solid white; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 10px;">
        Позже
      </button>
    `;
    
    document.body.appendChild(notification);
  }

  // Инициализация
  function init() {
    // console.log('🚀 Инициализация Service Worker...');
    
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      registerServiceWorker();
    } else {
      document.addEventListener('DOMContentLoaded', registerServiceWorker);
    }
  }

  // Запуск инициализации
  init();

  // Экспорт для глобального доступа
  window.AppSW = {
    register: registerServiceWorker,
    unregister: async () => {
      if (!navigator.serviceWorker) return;
      const registration = await navigator.serviceWorker.ready;
      return registration.unregister();
    },
    checkCompatibility: canRegisterServiceWorker
  };
})();