// Проверка на несуществующие страницы
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
        console.log('Resource not found:', e.target.src || e.target.href);
    }
});

// Перехват ошибок навигации
window.addEventListener('unhandledrejection', function(event) {
    console.log('Unhandled promise rejection:', event.reason);
});