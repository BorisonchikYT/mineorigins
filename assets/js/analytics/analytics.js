// Инициализация Яндекс.Метрики
if (typeof ym !== 'undefined' && YANDEX_METRIKA_ID) {
    ym(YANDEX_METRIKA_ID, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: "dataLayer",
        ssr: true
    });
}

// Инициализация Google Analytics через gtag
if (typeof gtag !== 'undefined' && GOOGLE_ANALYTICS_ID) {
    gtag('config', GOOGLE_ANALYTICS_ID, {
        page_title: document.title,
        page_location: window.location.href
    });
}

// Функции для отслеживания событий
class AnalyticsTracker {
    constructor() {
        this.ymId = YANDEX_METRIKA_ID;
        this.gaId = GOOGLE_ANALYTICS_ID;
    }

    // Отслеживание кликов
    trackClick(category, action, label, value = null) {
        console.log('Tracking click:', { category, action, label, value });
        
        // Яндекс.Метрика
        if (typeof ym !== 'undefined' && this.ymId) {
            ym(this.ymId, 'reachGoal', `${category}_${action}`);
        }
        
        // Google Analytics
        if (typeof gtag !== 'undefined' && this.gaId) {
            gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'value': value
            });
        }
    }

    // Отслеживание просмотров страниц
    trackPageView(pageName) {
        console.log('Tracking page view:', pageName);
        
        // Яндекс.Метрика
        if (typeof ym !== 'undefined' && this.ymId) {
            ym(this.ymId, 'hit', window.location.href, {
                title: pageName
            });
        }
        
        // Google Analytics
        if (typeof gtag !== 'undefined' && this.gaId) {
            gtag('event', 'page_view', {
                'page_title': pageName,
                'page_location': window.location.href,
                'page_path': window.location.pathname
            });
        }
    }

    // Отслеживание скачиваний
    trackDownload(fileName, fileType) {
        this.trackClick('download', 'file_download', fileName, 1);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'file_download', {
                'file_name': fileName,
                'file_type': fileType,
                'file_extension': fileName.split('.').pop()
            });
        }
    }

    // Отслеживание внешних ссылок
    trackOutboundLink(url) {
        this.trackClick('outbound', 'link_click', url);
        
        // Задержка для отслеживания перед переходом
        setTimeout(() => {
            window.location.href = url;
        }, 100);
    }

    // Отслеживание времени на странице
    trackTimeSpent() {
        let startTime = new Date().getTime();
        let maxTime = 0;
        
        // Обновление максимального времени каждые 10 секунд
        const timeInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeSpent = Math.round((currentTime - startTime) / 1000);
            maxTime = Math.max(maxTime, timeSpent);
        }, 10000);
        
        window.addEventListener('beforeunload', () => {
            clearInterval(timeInterval);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'page_engagement',
                    'value': maxTime,
                    'event_category': 'engagement'
                });
            }
        });
    }

    // Отслеживание скролла
    trackScroll(depth) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll', {
                'event_category': 'engagement',
                'event_label': `Scrolled to ${depth}%`,
                'value': depth
            });
        }
    }

    // E-commerce события
    trackPurchase(orderId, value, currency = 'RUB') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                'transaction_id': orderId,
                'value': value,
                'currency': currency
            });
        }
    }
}

// Инициализация трекера
const tracker = new AnalyticsTracker();

// Автоматическое отслеживание при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Отслеживание просмотра страницы
    tracker.trackPageView(document.title);
    
    // Отслеживание внешних ссылок
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        if (!link.href.includes(window.location.hostname) && !link.hasAttribute('data-no-track')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                tracker.trackOutboundLink(this.href);
            });
        }
    });

    // Отслеживание скачиваний
    const downloadLinks = document.querySelectorAll('a[download], a[href*=".zip"], a[href*=".exe"], a[href*=".pdf"]');
    downloadLinks.forEach(link => {
        link.addEventListener('click', function() {
            const fileName = this.href.split('/').pop();
            const fileType = fileName.split('.').pop();
            tracker.trackDownload(fileName, fileType);
        });
    });

    // Отслеживание времени на странице
    tracker.trackTimeSpent();

    // Отслеживание кликов по кнопкам
    const buttons = document.querySelectorAll('button, .btn, .action-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const category = 'button';
            const action = 'click';
            const label = this.textContent.trim() || this.getAttribute('aria-label') || this.getAttribute('data-track-label') || 'unknown';
            tracker.trackClick(category, action, label);
        });
    });

    // Отслеживание форм
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const formName = this.getAttribute('name') || this.getAttribute('id') || 'unknown_form';
            tracker.trackClick('form', 'submit', formName);
        });
    });

    // Отслеживание скролла
    let scrollTracked = [];
    window.addEventListener('scroll', function() {
        const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        const depths = [25, 50, 75, 90];
        
        depths.forEach(depth => {
            if (scrollDepth >= depth && !scrollTracked.includes(depth)) {
                tracker.trackScroll(depth);
                scrollTracked.push(depth);
            }
        });
    });
});

// Экспорт для использования в других модулях
window.AnalyticsTracker = AnalyticsTracker;
window.tracker = tracker;