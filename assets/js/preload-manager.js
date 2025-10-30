// preload-manager.js - Менеджер предзагрузки ресурсов (исправленная для локальных файлов)
class PreloadManager {
  constructor() {
      this.loadedResources = new Set();
      this.pendingResources = new Map();
      this.isOnline = navigator.onLine;
      this.isLocalFile = window.location.protocol === 'file:';
      this.basePath = this.detectBasePath();
      
      console.log('🌐 Режим:', this.isLocalFile ? 'Локальный файл' : 'Веб-сервер');
      console.log('📁 Базовый путь:', this.basePath);
  }

  // Автоматическое определение базового пути
  detectBasePath() {
      const currentPath = window.location.pathname;
      
      if (this.isLocalFile) {
          // Для локальных файлов определяем путь относительно текущей директории
          const pathParts = currentPath.split('/');
          pathParts.pop(); // Убираем имя текущего файла
          return pathParts.join('/') || '';
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
      
      // Для локальных файлов не добавляем ведущий слеш
      if (this.isLocalFile) {
          return this.basePath + (this.basePath && !this.basePath.endsWith('/') ? '/' : '') + path;
      } else {
          return '/' + path;
      }
  }

  // Упрощенная проверка доступности ресурса (без HTTP запросов для локальных файлов)
  async checkResourceExists(url) {
      // Для локальных файлов просто предполагаем, что ресурсы существуют
      if (this.isLocalFile) {
          return true;
      }
      
      // Только для веб-сервера делаем реальные проверки
      try {
          const response = await fetch(url, { 
              method: 'HEAD',
              mode: 'same-origin',
              cache: 'no-cache'
          });
          return response.ok;
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

      console.log('🔄 Начинаем предзагрузку критических ресурсов...');

      for (const resource of criticalResources) {
          const normalizedPath = this.normalizePath(resource);
          
          // Для локальных файлов пропускаем проверку существования
          if (this.isLocalFile) {
              await this.preloadResource(normalizedPath);
          } else {
              const exists = await this.checkResourceExists(normalizedPath);
              if (exists) {
                  await this.preloadResource(normalizedPath);
              } else {
                  console.warn('⚠️ Ресурс не найден, пропускаем:', normalizedPath);
              }
          }
      }
  }

  // Предзагрузка ресурсов для других страниц
  async preloadPages() {
      // Для локальных файлов предзагрузка страниц не работает
      if (this.isLocalFile) {
          console.log('📁 Локальный режим: предзагрузка страниц недоступна');
          return;
      }

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

      console.log('🔄 Предзагрузка страниц...');

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
          if (url.endsWith('.js')) {
              link.as = 'script';
          } else if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
              link.as = 'image';
          } else {
              link.as = 'document';
          }

          link.href = url;
          
          // Обработчики событий
          link.onload = () => {
              console.log('✅ Ресурс предзагружен:', this.getShortPath(url));
              this.resourceLoaded(url);
          };
          
          link.onerror = (error) => {
              console.warn('❌ Ошибка предзагрузки ресурса:', this.getShortPath(url));
              this.pendingResources.delete(url);
              
              // Для локальных файлов игнорируем ошибки предзагрузки
              if (this.isLocalFile) {
                  this.resourceLoaded(url);
              }
          };

          document.head.appendChild(link);
          this.pendingResources.set(url, link);
          
          // Для локальных файлов добавляем таймаут на случай, если onload не сработает
          if (this.isLocalFile) {
              setTimeout(() => {
                  if (this.pendingResources.has(url)) {
                      console.log('⏰ Таймаут предзагрузки (локальный файл):', this.getShortPath(url));
                      this.resourceLoaded(url);
                  }
              }, 1000);
          }
          
      } catch (error) {
          console.error('🚨 Ошибка при создании preload ссылки:', error);
          // Для локальных файлов отмечаем ресурс как загруженный даже при ошибке
          if (this.isLocalFile) {
              this.resourceLoaded(url);
          }
      }
  }

  // Укорачивает путь для логов
  getShortPath(fullPath) {
      const parts = fullPath.split('/');
      return parts.slice(-3).join('/');
  }

  // Альтернативный метод предзагрузки CSS
  async preloadCSS(url) {
      try {
          // Для локальных файлов просто загружаем CSS без предзагрузки
          if (this.isLocalFile) {
              const cssLink = document.createElement('link');
              cssLink.rel = 'stylesheet';
              cssLink.href = url;
              cssLink.onload = () => {
                  console.log('✅ CSS загружен:', this.getShortPath(url));
                  this.resourceLoaded(url);
              };
              cssLink.onerror = () => {
                  console.warn('❌ Ошибка загрузки CSS:', this.getShortPath(url));
                  this.resourceLoaded(url); // Все равно отмечаем как загруженный
              };
              document.head.appendChild(cssLink);
              this.pendingResources.set(url, cssLink);
              return;
          }

          // Для веб-сервера используем стандартную предзагрузку
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'style';
          preloadLink.href = url;
          
          preloadLink.onload = () => {
              console.log('✅ CSS предзагружен:', this.getShortPath(url));
              this.resourceLoaded(url);
              
              // Теперь загружаем CSS для применения
              const cssLink = document.createElement('link');
              cssLink.rel = 'stylesheet';
              cssLink.href = url;
              document.head.appendChild(cssLink);
          };
          
          preloadLink.onerror = () => {
              console.warn('❌ Ошибка предзагрузки CSS:', this.getShortPath(url));
              this.pendingResources.delete(url);
          };

          document.head.appendChild(preloadLink);
          this.pendingResources.set(url, preloadLink);
          
      } catch (error) {
          console.error('🚨 Ошибка предзагрузки CSS:', error);
          // Для локальных файлов отмечаем как загруженный
          if (this.isLocalFile) {
              this.resourceLoaded(url);
          }
      }
  }

  // Предзагрузка страницы
  async preloadPage(url) {
      if (!this.isOnline || this.isLocalFile) {
          return;
      }

      try {
          // Проверяем доступность страницы
          const exists = await this.checkResourceExists(url);
          
          if (exists) {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = url;
              
              link.onload = () => {
                  console.log('✅ Страница предзагружена:', this.getShortPath(url));
              };
              
              link.onerror = (error) => {
                  console.warn('❌ Ошибка предзагрузки страницы:', this.getShortPath(url));
              };

              document.head.appendChild(link);
          } else {
              console.warn('⚠️ Страница не найдена:', this.getShortPath(url));
          }
      } catch (error) {
          console.warn('⚠️ Не удалось предзагрузить страницу:', this.getShortPath(url));
      }
  }

  resourceLoaded(url) {
      this.loadedResources.add(url);
      this.pendingResources.delete(url);
  }

  // Оптимизация загрузки изображений
  lazyLoadImages() {
      if (!('IntersectionObserver' in window)) {
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
          rootMargin: '50px 0px',
          threshold: 0.1
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
          if (!img.src) {
              img.src = this.createPlaceholder();
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
      };
      
      image.onerror = () => {
          console.warn('❌ Ошибка загрузки изображения:', this.getShortPath(normalizedSrc));
          img.classList.add('image-error');
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
          document.head.appendChild(fontLink);
      } catch (error) {
          console.warn('⚠️ Ошибка загрузки шрифта:', error);
      }
  }

  // Получение статуса загрузки
  getStatus() {
      return {
          loaded: Array.from(this.loadedResources),
          pending: Array.from(this.pendingResources.keys()),
          online: this.isOnline,
          isLocalFile: this.isLocalFile,
          basePath: this.basePath
      };
  }
}

// Инициализация менеджера предзагрузки
const preloadManager = new PreloadManager();

// Запуск оптимизаций
function initializePreloadManager() {
  try {
      preloadManager.optimizeFonts();
      preloadManager.lazyLoadImages();
      
      // Предзагрузка с задержкой
      const onWindowLoad = () => {
          setTimeout(() => {
              preloadManager.preloadCritical().then(() => {
                  console.log('✅ Все критические ресурсы обработаны');
              });
              
              // Предзагрузка других страниц
              setTimeout(() => {
                  preloadManager.preloadPages().then(() => {
                      console.log('✅ Предзагрузка завершена');
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