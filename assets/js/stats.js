// Analytics Dashboard - Complete Functionality
class AnalyticsDashboard {
    constructor() {
        this.currentRange = 'realtime';
        this.isLive = true;
        this.data = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialData();
        this.startLiveUpdates();
        this.setupAnimations();
        
        // Отслеживание просмотра страницы аналитики
        this.trackPageView();
    }

    bindEvents() {
        // Фильтры времени
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setTimeRange(e.target.dataset.range);
            });
        });

        // Обновление данных
        document.getElementById('refreshData')?.addEventListener('click', () => {
            this.refreshData();
        });

        // Экспорт данных
        document.querySelector('.chart-export')?.addEventListener('click', () => {
            this.exportChartData();
        });

        // Кнопки действий
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.closest('.action-btn').querySelector('span').textContent;
                this.handleAction(action);
            });
        });

        // Выбор диапазона графика
        document.querySelector('.chart-range')?.addEventListener('change', (e) => {
            this.updateChartData(e.target.value);
        });

        // Автообновление каждые 30 секунд в реальном времени
        setInterval(() => {
            if (this.isLive) {
                this.updateLiveData();
            }
        }, 30000);

        // Обновление времени
        this.updateTime();
        setInterval(() => this.updateTime(), 60000);
    }

    setTimeRange(range) {
        this.currentRange = range;
        this.isLive = (range === 'realtime');
        
        // Обновление активной кнопки
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.range === range);
        });

        // Обновление данных
        this.loadDataForRange(range);
        
        // Обновление индикатора LIVE
        const liveIndicator = document.querySelector('.live-indicator');
        if (liveIndicator) {
            liveIndicator.style.display = this.isLive ? 'flex' : 'none';
        }
    }

    async loadInitialData() {
        try {
            // Симуляция загрузки данных
            this.showLoadingState();
            
            await this.simulateDataLoad();
            this.updateAllDisplays();
            this.hideLoadingState();
            
        } catch (error) {
            console.error('Error loading analytics data:', error);
            this.showErrorState();
        }
    }

    async simulateDataLoad() {
        // Симуляция API запроса
        return new Promise(resolve => {
            setTimeout(() => {
                this.data = {
                    onlineNow: this.generateRandomNumber(15, 35),
                    todayVisits: this.generateRandomNumber(1200, 1800),
                    avgSession: this.generateTimeString(),
                    bounceRate: this.generateRandomNumber(35, 50),
                    visitsData: this.generateVisitsData(),
                    trafficSources: this.generateTrafficSources(),
                    popularPages: this.generatePopularPages(),
                    geography: this.generateGeographyData(),
                    devices: this.generateDevicesData()
                };
                resolve();
            }, 1500);
        });
    }

    generateRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateTimeString() {
        const minutes = this.generateRandomNumber(2, 8);
        const seconds = this.generateRandomNumber(0, 59);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    generateVisitsData() {
        return Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
            visits: this.generateRandomNumber(800, 1600),
            unique: this.generateRandomNumber(500, 1200)
        }));
    }

    generateTrafficSources() {
        return [
            { name: 'Поисковые системы', value: 45.2, icon: 'search', type: 'organic' },
            { name: 'Социальные сети', value: 30.7, icon: 'share-alt', type: 'social' },
            { name: 'Прямые заходы', value: 15.8, icon: 'arrow-right', type: 'direct' },
            { name: 'Реферальные', value: 8.3, icon: 'link', type: 'referral' }
        ];
    }

    generatePopularPages() {
        return [
            { rank: 1, title: 'Главная страница', url: '/index.html', views: 1247, trend: 'positive' },
            { rank: 2, title: 'Страница игроков', url: '/players.html', views: 892, trend: 'positive' },
            { rank: 3, title: 'Поселения', url: '/settlements.html', views: 756, trend: 'neutral' }
        ];
    }

    generateGeographyData() {
        return [
            { country: 'Россия', flag: '🇷🇺', percent: 42 },
            { country: 'Украина', flag: '🇺🇦', percent: 18 },
            { country: 'Беларусь', flag: '🇧🇾', percent: 12 },
            { country: 'Казахстан', flag: '🇰🇿', percent: 8 }
        ];
    }

    generateDevicesData() {
        return [
            { type: 'Мобильные', icon: 'mobile-alt', percent: 58.3 },
            { type: 'Десктоп', icon: 'desktop', percent: 35.1 },
            { type: 'Планшеты', icon: 'tablet-alt', percent: 6.6 }
        ];
    }

    updateAllDisplays() {
        this.updateMetricCards();
        this.updateTrafficSources();
        this.updatePopularPages();
        this.updateGeography();
        this.updateDevices();
        this.updateChart();
    }

    updateMetricCards() {
        const metrics = {
            onlineNow: this.data.onlineNow,
            todayVisits: this.formatNumber(this.data.todayVisits),
            avgSession: this.data.avgSession,
            bounceRate: this.data.bounceRate + '%'
        };

        Object.entries(metrics).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                this.animateValueChange(element, value);
            }
        });
    }

    animateValueChange(element, newValue) {
        const oldValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const newValueNum = parseInt(newValue.replace(/,/g, '')) || newValue;
        
        if (typeof newValueNum === 'number') {
            let current = oldValue;
            const increment = (newValueNum - oldValue) / 30;
            const timer = setInterval(() => {
                current += increment;
                if ((increment > 0 && current >= newValueNum) || (increment < 0 && current <= newValueNum)) {
                    current = newValueNum;
                    clearInterval(timer);
                }
                element.textContent = this.formatNumber(Math.floor(current));
            }, 16);
        } else {
            element.textContent = newValue;
        }
    }

    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    updateTrafficSources() {
        const container = document.querySelector('.traffic-sources');
        if (!container) return;

        container.innerHTML = this.data.trafficSources.map(source => `
            <div class="source-item">
                <div class="source-icon ${source.type}">
                    <i class="fas fa-${source.icon}"></i>
                </div>
                <div class="source-info">
                    <span class="source-name">${source.name}</span>
                    <span class="source-value">${source.value}%</span>
                </div>
                <div class="source-bar">
                    <div class="bar-fill" style="width: ${source.value}%"></div>
                </div>
            </div>
        `).join('');
    }

    updatePopularPages() {
        const container = document.querySelector('.popular-pages');
        if (!container) return;

        container.innerHTML = this.data.popularPages.map(page => `
            <div class="page-item">
                <div class="page-rank">${page.rank}</div>
                <div class="page-info">
                    <span class="page-title">${page.title}</span>
                    <span class="page-url">${page.url}</span>
                </div>
                <div class="page-stats">
                    <span class="page-views">${this.formatNumber(page.views)}</span>
                    <div class="page-trend ${page.trend}">
                        <i class="fas fa-arrow-${page.trend === 'positive' ? 'up' : 'down'}"></i>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateGeography() {
        const container = document.querySelector('.geo-distribution');
        if (!container) return;

        container.innerHTML = this.data.geography.map(geo => `
            <div class="country-item">
                <span class="country-flag">${geo.flag}</span>
                <span class="country-name">${geo.country}</span>
                <span class="country-percent">${geo.percent}%</span>
                <div class="country-bar">
                    <div class="bar-fill" style="width: ${geo.percent}%"></div>
                </div>
            </div>
        `).join('');
    }

    updateDevices() {
        const container = document.querySelector('.devices-chart');
        if (!container) return;

        container.innerHTML = this.data.devices.map(device => `
            <div class="device-item">
                <div class="device-icon ${device.type.toLowerCase()}">
                    <i class="fas fa-${device.icon}"></i>
                </div>
                <div class="device-data">
                    <span class="device-type">${device.type}</span>
                    <span class="device-percent">${device.percent}%</span>
                </div>
            </div>
        `).join('');
    }

    updateChart() {
        // Анимация графика
        const chartBars = document.querySelectorAll('.chart-bars .bar');
        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                const randomHeight = Math.random() * 80 + 20;
                bar.style.height = `${randomHeight}%`;
            }, index * 100);
        });
    }

    updateLiveData() {
        if (!this.isLive) return;

        // Обновление онлайн пользователей
        const onlineChange = this.generateRandomNumber(-3, 3);
        this.data.onlineNow = Math.max(5, this.data.onlineNow + onlineChange);
        
        // Обновление посещений
        this.data.todayVisits += this.generateRandomNumber(10, 50);
        
        this.updateMetricCards();
        this.updateTime();
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const updateElement = document.getElementById('updateTime');
        if (updateElement) {
            updateElement.textContent = timeString;
        }
    }

    refreshData() {
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 500);
        }

        this.loadInitialData();
    }

    loadDataForRange(range) {
        // Здесь будет загрузка данных для выбранного диапазона
        console.log('Loading data for range:', range);
        this.updateChart();
    }

    updateChartData(range) {
        // Обновление данных графика на основе выбранного диапазона
        console.log('Updating chart for range:', range);
        this.updateChart();
    }

    exportChartData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Данные экспортированы успешно!', 'success');
    }

    handleAction(action) {
        switch (action) {
            case 'Экспорт в Excel':
                this.exportToExcel();
                break;
            case 'PDF отчет':
                this.exportToPDF();
                break;
            case 'Поделиться':
                this.shareDashboard();
                break;
            case 'Настройки':
                this.openSettings();
                break;
        }
    }

    exportToExcel() {
        this.showNotification('Экспорт в Excel будет доступен после настройки API', 'info');
    }

    exportToPDF() {
        this.showNotification('Экспорт в PDF будет доступен после настройки API', 'info');
    }

    shareDashboard() {
        if (navigator.share) {
            navigator.share({
                title: 'MineAnalytics Dashboard',
                text: 'Посмотрите аналитику проекта MineOrigins',
                url: window.location.href
            });
        } else {
            this.showNotification('Ссылка скопирована в буфер обмена', 'success');
            navigator.clipboard.writeText(window.location.href);
        }
    }

    openSettings() {
        this.showNotification('Настройки аналитики будут доступны в следующем обновлении', 'info');
    }

    showNotification(message, type = 'info') {
        // Создание уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            z-index: 10000;
            backdrop-filter: blur(20px);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showLoadingState() {
        document.body.style.opacity = '0.8';
        document.body.style.pointerEvents = 'none';
    }

    hideLoadingState() {
        document.body.style.opacity = '1';
        document.body.style.pointerEvents = 'auto';
    }

    showErrorState() {
        this.showNotification('Ошибка загрузки данных. Проверьте подключение.', 'error');
    }

    setupAnimations() {
        // Анимация появления элементов при скролле
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Наблюдаем за всеми карточками
        document.querySelectorAll('.metric-card, .analytics-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    startLiveUpdates() {
        // Запуск живых обновлений для реального времени
        if (this.isLive) {
            setInterval(() => {
                this.updateLiveData();
            }, 5000); // Обновление каждые 5 секунд в реальном времени
        }
    }

    trackPageView() {
        // Отслеживание просмотра страницы аналитики
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                'page_title': 'Analytics Dashboard',
                'page_location': window.location.href
            });
        }
        
        if (typeof ym !== 'undefined') {
            ym(104901220, 'hit', window.location.href, {
                title: 'Analytics Dashboard - MineOrigins'
            });
        }
    }
}

// Инициализация дашборда при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.analyticsDashboard = new AnalyticsDashboard();
});

// Глобальные функции для отладки
window.debugAnalytics = {
    getData: () => window.analyticsDashboard?.data,
    refresh: () => window.analyticsDashboard?.refreshData(),
    setRange: (range) => window.analyticsDashboard?.setTimeRange(range)
};