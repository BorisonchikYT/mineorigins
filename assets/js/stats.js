// 1. Запросы для Яндекс.Метрики API
class YandexMetricsAPI {
    constructor(counterId) {
        this.counterId = counterId;
        this.oauthToken = 'YOUR_OAUTH_TOKEN';
    }

    // Получение данных о посещениях
    async getVisitsStats(date1, date2, metrics = 'ym:s:visits') {
        const response = await fetch(`https://api-metrics.yandex.net/stat/v1/data?\
            ids=${this.counterId}&\
            metrics=${metrics}&\
            date1=${date1}&\
            date2=${date2}&\
            oauth_token=${this.oauthToken}`);
        return await response.json();
    }

    // Онлайн пользователи
    async getOnlineUsers() {
        const response = await fetch(`https://api-metrics.yandex.net/stat/v1/data/bytime?\
            ids=${this.counterId}&\
            metrics=ym:s:users&\
            date1=today&\
            date2=today&\
            oauth_token=${this.oauthToken}`);
        return await response.json();
    }

    // География посетителей
    async getGeography() {
        const response = await fetch(`https://api-metrics.yandex.net/stat/v1/data?\
            ids=${this.counterId}&\
            metrics=ym:s:visits&\
            dimensions=ym:s:regionCountry&\
            date1=7daysAgo&\
            date2=today&\
            oauth_token=${this.oauthToken}`);
        return await response.json();
    }
}

// 2. Запросы для Google Analytics API
class GoogleAnalyticsAPI {
    constructor(propertyId) {
        this.propertyId = propertyId;
        this.accessToken = 'YOUR_ACCESS_TOKEN';
    }

    // Основные метрики
    async getBasicMetrics(startDate, endDate) {
        const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dateRanges: [{ startDate, endDate }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'screenPageViews' },
                    { name: 'averageSessionDuration' },
                    { name: 'bounceRate' }
                ]
            })
        });
        return await response.json();
    }

    // Источники трафика
    async getTrafficSources() {
        const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'sessionSource' }],
                metrics: [{ name: 'sessions' }]
            })
        });
        return await response.json();
    }
}