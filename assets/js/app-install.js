// app-install.js - Управление установкой приложения
class AppInstallManager {
    constructor() {
      this.deferredPrompt = null;
      this.installButton = null;
      this.isInstalled = false;
      
      this.init();
    }
    
    init() {
      this.createInstallButton();
      this.setupEventListeners();
      this.checkInstallStatus();
    }
    
    createInstallButton() {
      // Создаем кнопку установки
      this.installButton = document.createElement('button');
      this.installButton.id = 'install-app-btn';
      this.installButton.innerHTML = `
        <span>📱 Установить приложение</span>
        <small>Быстрый доступ к MineOrigins</small>
      `;
      this.installButton.className = 'install-btn hidden';
      
      // Стили (можно вынести в CSS)
      this.installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 25px;
        padding: 12px 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transition: all 0.3s ease;
        font-family: inherit;
        max-width: 200px;
      `;
      
      this.installButton.addEventListener('mouseenter', () => {
        this.installButton.style.transform = 'translateY(-2px)';
        this.installButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
      });
      
      this.installButton.addEventListener('mouseleave', () => {
        this.installButton.style.transform = 'translateY(0)';
        this.installButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
      });
      
      document.body.appendChild(this.installButton);
    }
    
    setupEventListeners() {
      // Событие перед установкой
      window.addEventListener('beforeinstallprompt', (e) => {
        console.log('🚀 beforeinstallprompt сработал');
        e.preventDefault();
        this.deferredPrompt = e;
        this.showInstallButton();
      });
      
      // Приложение установлено
      window.addEventListener('appinstalled', (e) => {
        console.log('✅ Приложение установлено!');
        this.isInstalled = true;
        this.hideInstallButton();
        this.showInstallSuccess();
      });
      
      // Клик по кнопке установки
      this.installButton.addEventListener('click', () => {
        this.installApp();
      });
      
      // Проверяем, установлено ли уже приложение
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.isInstalled = true;
        console.log('📱 Приложение запущено в standalone режиме');
      }
    }
    
    async installApp() {
      if (!this.deferredPrompt) {
        this.showError('Функция установки недоступна');
        return;
      }
      
      try {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('✅ Пользователь принял установку');
          this.hideInstallButton();
        } else {
          console.log('❌ Пользователь отклонил установку');
        }
        
        this.deferredPrompt = null;
      } catch (error) {
        console.error('Ошибка установки:', error);
        this.showError('Ошибка при установке');
      }
    }
    
    showInstallButton() {
      if (this.isInstalled) return;
      
      this.installButton.classList.remove('hidden');
      this.installButton.style.display = 'block';
      
      // Автоматически скрыть через 10 секунд
      setTimeout(() => {
        this.hideInstallButton();
      }, 10000);
    }
    
    hideInstallButton() {
      this.installButton.classList.add('hidden');
      this.installButton.style.display = 'none';
    }
    
    showInstallSuccess() {
      const successMsg = document.createElement('div');
      successMsg.textContent = '✅ Приложение установлено!';
      successMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 10001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      `;
      
      document.body.appendChild(successMsg);
      
      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
    }
    
    showError(message) {
      const errorMsg = document.createElement('div');
      errorMsg.textContent = `❌ ${message}`;
      errorMsg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f44336;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 10001;
      `;
      
      document.body.appendChild(errorMsg);
      
      setTimeout(() => {
        document.body.removeChild(errorMsg);
      }, 3000);
    }
    
    checkInstallStatus() {
      // Проверяем различные способы определения установки
      if (window.navigator.standalone) {
        this.isInstalled = true;
      }
      
      if (window.matchMedia('(display-mode: standalone)').matches) {
        this.isInstalled = true;
      }
    }
  }
  
  // Инициализация при загрузке страницы
  document.addEventListener('DOMContentLoaded', () => {
    new AppInstallManager();
  });
  
  // Добавьте в CSS
  const installStyles = `
    .install-btn {
      animation: slideInUp 0.5s ease;
    }
    
    .install-btn.hidden {
      display: none !important;
    }
    
    .install-btn span {
      display: block;
      font-weight: bold;
      font-size: 14px;
    }
    
    .install-btn small {
      display: block;
      font-size: 11px;
      opacity: 0.9;
      margin-top: 2px;
    }
    
    @keyframes slideInUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  
  // Вставка стилей
  const styleSheet = document.createElement('style');
  styleSheet.textContent = installStyles;
  document.head.appendChild(styleSheet);