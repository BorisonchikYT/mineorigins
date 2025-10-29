// preload-manager.js - Менеджер предзагрузки ресурсов
class PreloadManager {
    constructor() {
      this.loadedResources = new Set();
      this.pendingResources = new Map();
    }
  
    // Предзагрузка критических ресурсов
    preloadCritical() {
      const criticalResources = [
        '/assets/css/style.css',
        'assets/images/MineOriginsAva.png',
        '/assets/images/MineOrigins.png',
        '/assets/images/icons/index_icon_house.png',
        '/assets/images/icons/main.js'
      ];
  
      criticalResources.forEach(resource => {
        this.preloadResource(resource);
      });
    }
  
    // Предзагрузка ресурсов для других страниц
    preloadPages() {
      if ('connection' in navigator && navigator.connection.saveData) {
        return; // Не предзагружаем в режиме экономии трафика
      }
  
      const pagesToPreload = [
        'index.html',
        '',
        'players.html',
        'settlements.html', 
        'gallery.html',
        'faq.html',
        '/index.html',
        '/',
        '/players.html',
        '/settlements.html', 
        '/gallery.html',
        '/faq.html'
      ];
  
      // Используем requestIdleCallback для фоновой загрузки
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          pagesToPreload.forEach(page => {
            this.preloadPage(page);
          });
        });
      }
    }
  
    // Предзагрузка отдельного ресурса
    preloadResource(url) {
      if (this.loadedResources.has(url) || this.pendingResources.has(url)) {
        return;
      }
  
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (url.endsWith('.css')) {
        link.as = 'style';
        link.onload = () => this.resourceLoaded(url);
      } else if (url.endsWith('.js')) {
        link.as = 'script';
      } else if (url.match(/\.(png|jpg|jpeg|gif|webp)$/)) {
        link.as = 'image';
        link.onload = () => this.resourceLoaded(url);
      }
  
      link.href = url;
      document.head.appendChild(link);
      this.pendingResources.set(url, link);
    }
  
    // Предзагрузка всей страницы
    preloadPage(url) {
      fetch(url, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
          }
        })
        .catch(console.error);
    }
  
    resourceLoaded(url) {
      this.loadedResources.add(url);
      this.pendingResources.delete(url);
    }
  
    // Оптимизация загрузки изображений
    lazyLoadImages() {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          });
        });
  
        document.querySelectorAll('img[data-src]').forEach(img => {
          imageObserver.observe(img);
        });
      } else {
        // Fallback для старых браузеров
        document.querySelectorAll('img[data-src]').forEach(img => {
          img.src = img.dataset.src;
        });
      }
    }
  
    // Оптимизация загрузки шрифтов
    optimizeFonts() {
      // Предзагрузка шрифтов Google
      const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
        'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap'
      ];
  
      fontLinks.forEach(fontUrl => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://fonts.googleapis.com';
        document.head.appendChild(link);
  
        const link2 = document.createElement('link');
        link2.rel = 'preconnect';
        link2.href = 'https://fonts.gstatic.com';
        link2.crossOrigin = 'anonymous';
        document.head.appendChild(link2);
  
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.as = 'style';
        fontLink.href = fontUrl;
        fontLink.onload = () => {
          fontLink.rel = 'stylesheet';
        };
        document.head.appendChild(fontLink);
      });
    }
  }
  
  // Инициализация менеджера предзагрузки
  const preloadManager = new PreloadManager();
  
  // Запуск оптимизаций когда DOM готов
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preloadManager.optimizeFonts();
      preloadManager.lazyLoadImages();
      
      // Предзагрузка других страниц после загрузки текущей
      window.addEventListener('load', () => {
        setTimeout(() => preloadManager.preloadPages(), 1000);
      });
    });
  } else {
    preloadManager.optimizeFonts();
    preloadManager.lazyLoadImages();
    window.addEventListener('load', () => {
      setTimeout(() => preloadManager.preloadPages(), 1000);
    });
  }