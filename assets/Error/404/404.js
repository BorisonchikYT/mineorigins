// Основные функции для страницы 404
function goBack() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        goHome();
    }
}

function goHome() {
    // Замените на URL вашей главной страницы
    window.location.href = '/';
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        // Замените на URL поиска вашего сайта
        const searchUrl = `/search?q=${encodeURIComponent(query)}`;
        window.location.href = searchUrl;
    } else {
        searchInput.focus();
        showNotification('Пожалуйста, введите поисковый запрос', 'warning');
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'warning' ? '#ffeb3b' : '#2196f3'};
        color: ${type === 'warning' ? '#333' : 'white'};
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Поиск при нажатии Enter
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Добавляем волну к привидению
    const ghost = document.querySelector('.ghost');
    if (ghost) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        ghost.appendChild(wave);
    }
});

// Анимация для элементов при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.error-number, .error-title, .error-message, .error-actions, .error-search');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
});