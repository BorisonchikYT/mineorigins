// Основные функции для страницы 404
function goBack() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        goHome();
    }
}

function goHome() {
    window.location.href = '/';
}

// Анимация появления элементов
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.error-number, .error-title, .error-message, .error-actions');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Добавляем волну к привидению
    const ghost = document.querySelector('.ghost');
    if (ghost) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        ghost.appendChild(wave);
    }
});// Основные функции для страницы 404
function goBack() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        goHome();
    }
}

function goHome() {
    window.location.href = '/';
}

// Анимация появления элементов
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.error-number, .error-title, .error-message, .error-actions');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
    
    // Добавляем волну к привидению
    const ghost = document.querySelector('.ghost');
    if (ghost) {
        const wave = document.createElement('div');
        wave.className = 'wave';
        ghost.appendChild(wave);
    }
});