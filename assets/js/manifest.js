// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('assets/js/service-worker.js');
    });
  }