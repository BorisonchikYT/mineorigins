// preload-manager.js - Менеджер предзагрузки ресурсов (исправленная версия)
class PreloadManager {
  constructor() {
      this.loadedResources = new Set();
      this.pendingResources = new Map();
      this.isOnline = navigator.onLine;
      this.basePath = this.detectBasePath();
      
      // Слушаем изменения состояния сети
      window.addEventListener('online', () => {
          this.isOnline = true;
          console.log('🟢 Онлайн: возобновляем предзагрузку');
      });
      
      window.addEventListener('offline', () => {
          this.isOnline = false;
          console.log('🔴 Оффлайн: приостанавливаем предзагрузку');
      });
  }

  // Автоматическое определение базового пути
  detectBasePath() {
      // Получаем текущий путь к HTML файлу
      const currentPath = window.location.pathname;
      const isLocalFile = window.location.protocol === 'file:';
      
      if (isLocalFile) {
          // Для локальных файлов определяем путь относительно текущей директории
          const pathParts = currentPath.split('/');
          pathParts.pop(); // Убираем имя текущего файла
          return pathParts.join('/') || '/';
      } else {
          // Для веб-сервера используем корень
          return '/';
      }
  }

  // Нормализация пути к ресурсу
  normalizePath(path) {
      // Если путь уже абсолютный (начинается с / или http), возвращаем как есть
      if (path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://')) {
          return path;
      }
      
      // Для относительных путей добавляем базовый путь
      if (path.startsWith('./')) {
          path = path.substring(2);
      }
      
      return this.basePath + (this.basePath.endsWith('/') ? '' : '/') + path;
  }

  // Проверка доступности ресурса
  async checkResourceExists(url) {
      try {
          // Для локальных файлов используем XMLHttpRequest вместо fetch
          if (window.location.protocol === 'file:') {
              return await new Promise((resolve) => {
                  const xhr = new XMLHttpRequest();
                  xhr.open('HEAD', url, true);
                  xhr.onreadystatechange = function() {
                      if (xhr.readyState === 4) {
                          resolve(xhr.status === 0 || xhr.status === 200);
                      }
                  };
                  xhr.onerror = () => resolve(false);
                  xhr.ontimeout = () => resolve(false);
                  xhr.send();
              });
          } else {
              const response = await fetch(url, { 
                  method: 'HEAD',
                  mode: 'same-origin',
                  cache: 'no-cache'
              });
              return response.ok;
          }
      } catch (error) {
          console.warn('⚠️ Проверка ресурса не удалась:', url, error.message);
          return false;
      }
  }

  // Предзагрузка критических ресурсов
  async preloadCritical() {
      const criticalResources = [
          'assets/css/style.css',
          'assets/images/MineOriginsAva.png',
          'assets/images/MineOrigins.png',
          'assets/images/icons/index_icon_house.png',
          'assets/js/main.js'
      ];

      for (const resource of criticalResources) {
          const normalizedPath = this.normalizePath(resource);
          const exists = await this.checkResourceExists(normalizedPath);
          
          if (exists) {
              await this.preloadResource(normalizedPath);
          } else {
              console.warn('⚠️ Критический ресурс не найден, пропускаем:', normalizedPath);
          }
      }
  }

  // Предзагрузка ресурсов для других страниц
  async preloadPages() {
      // Проверяем условия для предзагрузки
      if (!this.isOnline) {
          console.log('📶 Оффлайн режим: пропускаем предзагрузку');
          return;
      }

      // Проверяем тип соединения
      if ('connection' in navigator) {
          const connection = navigator.connection;
          if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
              console.log('🐌 Медленное соединение: пропускаем предзагрузку');
              return;
          }
      }

      const pagesToPreload = [
          'players.html',
          'settlements.html', 
          'gallery.html',
          'faq.html'
      ];

      // Для локальных файлов предзагрузка страниц не работает из-за CORS
      if (window.location.protocol === 'file:') {
          console.log('📁 Локальный режим: предзагрузка страниц недоступна');
          return;
      }

      // Используем requestIdleCallback для фоновой загрузки
      const preloadTask = async () => {
          for (const page of pagesToPreload) {
              const normalizedPath = this.normalizePath(page);
              await this.preloadPage(normalizedPath);
          }
      };

      if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
              preloadTask();
          }, { timeout: 2000 });
      } else {
          // Fallback для браузеров без requestIdleCallback
          setTimeout(preloadTask, 1000);
      }
  }

  // Предзагрузка отдельного ресурса
  async preloadResource(url) {
      if (this.loadedResources.has(url) || this.pendingResources.has(url)) {
          return;
      }

      try {
          // Для CSS файлов используем альтернативный метод предзагрузки
          if (url.endsWith('.css')) {
              await this.preloadCSS(url);
              return;
          }

          const link = document.createElement('link');
          link.rel = 'preload';
          
          // Определяем тип ресурса
          if (url.endsWith('.css')) {
              link.as = 'style';
          } else if (url.endsWith('.js')) {
              link.as = 'script';
          } else if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
              link.as = 'image';
          } else {
              link.as = 'document';
          }

          link.href = url;
          
          // Обработчики событий
          link.onload = () => {
              console.log('✅ Ресурс предзагружен:', url);
              this.resourceLoaded(url);
          };
          
          link.onerror = (error) => {
              console.warn('❌ Ошибка предзагрузки ресурса:', url, error);
              this.pendingResources.delete(url);
          };

          document.head.appendChild(link);
          this.pendingResources.set(url, link);
          
      } catch (error) {
          console.error('🚨 Ошибка при создании preload ссылки:', error);
      }
  }

  // Альтернативный метод предзагрузки CSS
  async preloadCSS(url) {
      try {
          // Создаем link элемент для предзагрузки
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'style';
          preloadLink.href = url;
          
          preloadLink.onload = () => {
              console.log('✅ CSS предзагружен:', url);
              this.resourceLoaded(url);
              
              // Теперь загружаем CSS для применения
              const cssLink = document.createElement('link');
              cssLink.rel = 'stylesheet';
              cssLink.href = url;
              document.head.appendChild(cssLink);
          };
          
          preloadLink.onerror = () => {
              console.warn('❌ Ошибка предзагрузки CSS:', url);
              this.pendingResources.delete(url);
          };

          document.head.appendChild(preloadLink);
          this.pendingResources.set(url, preloadLink);
          
      } catch (error) {
          console.error('🚨 Ошибка предзагрузки CSS:', error);
      }
  }

  // Предзагрузка всей страницы (исправленная)
  async preloadPage(url) {
      if (!this.isOnline) {
          return;
      }

      try {
          // Для локальных файлов prefetch не работает
          if (window.location.protocol === 'file:') {
              console.log('📁 Локальный файл: prefetch недоступен для', url);
              return;
          }

          // Проверяем доступность страницы
          const exists = await this.checkResourceExists(url);
          
          if (exists) {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = url;
              
              link.onload = () => {
                  console.log('✅ Страница предзагружена:', url);
              };
              
              link.onerror = (error) => {
                  console.warn('❌ Ошибка предзагрузки страницы:', url, error);
              };

              document.head.appendChild(link);
          } else {
              console.warn('⚠️ Страница не найдена, пропускаем предзагрузку:', url);
          }
      } catch (error) {
          // Игнорируем ошибки предзагрузки, они не критичны
          if (error.name !== 'AbortError') {
              console.warn('⚠️ Не удалось предзагрузить страницу:', url, error.message);
          }
      }
  }

  resourceLoaded(url) {
      this.loadedResources.add(url);
      this.pendingResources.delete(url);
  }

  // Оптимизация загрузки изображений
  lazyLoadImages() {
      if (!('IntersectionObserver' in window)) {
          // Fallback для старых браузеров
          this.loadImagesImmediately();
          return;
      }

      const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  const img = entry.target;
                  this.loadImage(img);
                  observer.unobserve(img);
              }
          });
      }, {
          rootMargin: '50px 0px', // Начинаем загружать за 50px до появления в viewport
          threshold: 0.1
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
          // Устанавливаем placeholder если нужно
          if (!img.src) {
              img.src = this.createPlaceholder(img.dataset.width, img.dataset.height);
          }
          imageObserver.observe(img);
      });
  }

  // Создание SVG placeholder
  createPlaceholder(width = 100, height = 100) {
      return `data:image/svg+xml;base64,${btoa(`
          <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#f0f0f0"/>
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="#999">Loading...</text>
          </svg>
      `)}`;
  }

  loadImage(img) {
      const src = img.dataset.src;
      if (!src) return;

      const normalizedSrc = this.normalizePath(src);
      const image = new Image();
      
      image.onload = () => {
          img.src = normalizedSrc;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          console.log('🖼️ Изображение загружено:', normalizedSrc);
      };
      
      image.onerror = () => {
          console.warn('❌ Ошибка загрузки изображения:', normalizedSrc);
          img.classList.add('image-error');
          // Устанавливаем fallback изображение
          img.src = this.createPlaceholder(img.dataset.width, img.dataset.height);
      };
      
      image.src = normalizedSrc;
  }

  loadImagesImmediately() {
      document.querySelectorAll('img[data-src]').forEach(img => {
          const src = img.dataset.src;
          if (src) {
              const normalizedSrc = this.normalizePath(src);
              img.src = normalizedSrc;
              img.classList.remove('lazy');
          }
      });
  }

  // Оптимизация загрузки шрифтов
  optimizeFonts() {
      // Предзагрузка шрифтов Google
      const fontLinks = [
          'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
          'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap'
      ];

      // Preconnect к источникам шрифтов
      this.addPreconnect('https://fonts.googleapis.com');
      this.addPreconnect('https://fonts.gstatic.com', true);

      // Загрузка шрифтов
      fontLinks.forEach(fontUrl => {
          this.loadFont(fontUrl);
      });
  }

  addPreconnect(url, crossOrigin = false) {
      try {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = url;
          if (crossOrigin) link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
      } catch (error) {
          console.warn('⚠️ Ошибка preconnect:', error);
      }
  }

  loadFont(fontUrl) {
      try {
          const fontLink = document.createElement('link');
          fontLink.rel = 'stylesheet';
          fontLink.href = fontUrl;
          fontLink.onload = () => {
              console.log('✅ Шрифт загружен:', fontUrl);
          };
          fontLink.onerror = () => {
              console.warn('❌ Ошибка загрузки шрифта:', fontUrl);
          };
          document.head.appendChild(fontLink);
      } catch (error) {
          console.warn('⚠️ Ошибка загрузки шрифта:', error);
      }
  }

  // Очистка ресурсов
  cleanup() {
      this.pendingResources.forEach((link, url) => {
          if (link.parentNode) {
              link.parentNode.removeChild(link);
          }
      });
      this.pendingResources.clear();
  }

  // Получение статуса загрузки
  getStatus() {
      return {
          loaded: Array.from(this.loadedResources),
          pending: Array.from(this.pendingResources.keys()),
          online: this.isOnline,
          basePath: this.basePath
      };
  }
}

// Инициализация менеджера предзагрузки
const preloadManager = new PreloadManager();

// Запуск оптимизаций когда DOM готов
function initializePreloadManager() {
  try {
      console.log('🚀 Инициализация PreloadManager...');
      console.log('📁 Базовый путь:', preloadManager.basePath);
      console.log('🌐 Онлайн статус:', preloadManager.isOnline);
      
      preloadManager.optimizeFonts();
      preloadManager.lazyLoadImages();
      
      // Предзагрузка критических ресурсов с задержкой
      const onWindowLoad = () => {
          setTimeout(() => {
              preloadManager.preloadCritical().then(() => {
                  console.log('✅ Критические ресурсы загружены');
              }).catch(error => {
                  console.error('❌ Ошибка загрузки критических ресурсов:', error);
              });
              
              // Предзагрузка других страниц
              setTimeout(() => {
                  preloadManager.preloadPages().then(() => {
                      console.log('✅ Предзагрузка страниц завершена');
                  }).catch(error => {
                      console.error('❌ Ошибка предзагрузки страниц:', error);
                  });
              }, 500);
          }, 100);
      };

      if (document.readyState === 'complete') {
          onWindowLoad();
      } else {
          window.addEventListener('load', onWindowLoad, { once: true });
      }
  } catch (error) {
      console.error('🚨 Ошибка инициализации PreloadManager:', error);
  }
}

// Безопасная инициализация
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePreloadManager);
} else {
  initializePreloadManager();
}

// Глобальная функция для отладки
window.getPreloadStatus = () => preloadManager.getStatus();

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PreloadManager;
}