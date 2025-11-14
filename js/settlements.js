// settlements.js - Оптимизированная версия

class SettlementsManager {
    constructor() {
        this.settlements = [];
        this.filteredSettlements = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.isInitialized = false;
        
        // DOM элементы
        this.elements = {
            grid: document.getElementById('settlementsGrid'),
            search: document.getElementById('settlementsSearch'),
            filterBtns: document.querySelectorAll('.settlement-filter-btn'),
            mapPoints: document.querySelectorAll('.map-point')
        };
        
        this.init();
    }

    async init() {
        try {
            await this.loadSettlementsData();
            this.setupEventListeners();
            this.renderSettlements();
            this.setupMapInteractions();
            this.isInitialized = true;
            
        } catch (error) {
            console.error('❌ Failed to initialize SettlementsManager:', error);
            this.showError('Не удалось загрузить данные о поселениях');
        }
    }

    async loadSettlementsData() {
        // Временные данные - в реальном приложении загружаем с сервера
        this.settlements = [
            {
                id: 1,
                name: "ФрикБургская Империя",
                race: "earth",
                leader: "_Kot_Baris_",
                population: 8,
                level: "Империя",
                location: "ЗЕМЛЯ",
                description: "💪 Мы сильнее всех! Строим из блоков империи, куем из побед легенды – за Фрикбург, за победу!",
                features: ["Объеденение всех рас", "Нейтральная империя"],
                coordinates: "30 86 1018",
                established: "11.10.25",
                banner: "assets/images/icons/settlements/boris.png",
                warStatus: "defensive"
            },
            {
                id: 2,
                name: "Логово Хантера",
                race: "hell",
                leader: "stalker_hunter_",
                population: 1,
                level: "Логово",
                location: "ПОДЗЕМНЫЙ",
                description: "К демонам приходят не ради помощи — а ради сделки. Каждое слово здесь имеет цену, каждая улыбка — намерение, а каждая искра — обещание будущего огня.",
                features: ["Мы дружим с ФБ", "Мы поддерживаем со всеми расами связь"],
                coordinates: "212 80 495",
                established: "11.10.25",
                banner: "assets/images/icons/icon_demon.png",
                warStatus: "defensive"
            },
            {
                id: 3,
                name: "База Тропика",
                race: "earth",
                leader: "tropic_yt2021",
                population: 1,
                level: "База",
                location: "ТАЙГА",
                description: "Отсутствует",
                features: ["Отсутствует"],
                coordinates: "1500 64 -800",
                established: "13.10.25",
                banner: "assets/images/icons/icon_terrestrial.gif",
                warStatus: "none"
            },
            {
                id: 4,
                name: "ВДНХ",
                race: "earth",
                leader: "jdh16",
                population: 2,
                level: "Поселение",
                location: "ЗЕМЛЯ",
                description: "Отсутствует",
                features: ["Отсутствует"],
                coordinates: "450 70 600",
                established: "14.10.25",
                banner: "assets/images/icons/icon_terrestrial.gif",
                warStatus: "none"
            },
            {
                id: 5,
                name: "База Ангелов",
                race: "heaven",
                leader: "amidamaru3434",
                population: 1,
                level: "База",
                location: "ГОРЫ",
                description: "Отсутствует",
                features: ["Отсутствует"],
                coordinates: "100 120 -200",
                established: "15.10.25",
                banner: "assets/images/icons/icon_angel.gif",
                warStatus: "none"
            },
            {
                id: 6,
                name: "Максимка",
                race: "earth",
                leader: "maxxaumka",
                population: 1,
                level: "Поселение",
                location: "ОСТРОВ",
                description: "Отсутствует",
                features: ["Северное расположение"],
                coordinates: "-800 70 -1500",
                established: "16.10.25",
                banner: "assets/images/icons/icon_terrestrial.gif",
                warStatus: "none"
            },
            {
                id: 7,
                name: "База механиков",
                race: "earth",
                leader: "maxxaumka snekky_offc",
                population: 2,
                level: "База",
                location: "АНТРОПОГЕННЫЙ ОСТРОВ",
                description: "Отсутствует",
                features: ["Технологии", "Механизмы"],
                coordinates: "1200 65 1800",
                established: "17.10.25",
                banner: "assets/images/icons/icon_terrestrial.gif",
                warStatus: "none"
            }
        ];
        
        this.filteredSettlements = [...this.settlements];
    }

    setupEventListeners() {
        // Поиск
        if (this.elements.search) {
            this.elements.search.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase().trim();
                this.filterSettlements();
            });
        }

        // Фильтры
        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.setFilter(filter);
            });
        });

        // Глобальные обработчики
        document.addEventListener('click', this.handleGlobalClick.bind(this));
    }

    setupMapInteractions() {
        this.elements.mapPoints.forEach(point => {
            point.addEventListener('mouseenter', this.handleMapPointHover.bind(this));
            point.addEventListener('mouseleave', this.handleMapPointLeave.bind(this));
            point.addEventListener('click', this.handleMapPointClick.bind(this));
        });
    }

    handleMapPointHover(e) {
        const settlementName = e.currentTarget.dataset.settlement;
        const settlement = this.settlements.find(s => s.name === settlementName);
        
        if (settlement) {
            this.showMapTooltip(e.currentTarget, settlement);
        }
    }

    handleMapPointLeave() {
        this.hideMapTooltip();
    }

    handleMapPointClick(e) {
        const settlementName = e.currentTarget.dataset.settlement;
        const settlement = this.settlements.find(s => s.name === settlementName);
        
        if (settlement) {
            this.showSettlementModal(settlement);
        }
    }

    showMapTooltip(element, settlement) {
        // Удаляем существующий тултип
        this.hideMapTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip visible';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${settlement.name}</strong>
                <span>Лидер: ${settlement.leader}</span>
                <span>Население: ${settlement.population}</span>
                <span>${settlement.location}</span>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Позиционирование
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        
        this.currentTooltip = tooltip;
    }

    hideMapTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Обновляем активную кнопку
        this.elements.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.filterSettlements();
    }

    filterSettlements() {
        this.filteredSettlements = this.settlements.filter(settlement => {
            const matchesFilter = this.currentFilter === 'all' || settlement.race === this.currentFilter;
            const matchesSearch = !this.searchTerm || 
                settlement.name.toLowerCase().includes(this.searchTerm) ||
                settlement.leader.toLowerCase().includes(this.searchTerm) ||
                settlement.description.toLowerCase().includes(this.searchTerm);
            
            return matchesFilter && matchesSearch;
        });
        
        this.renderSettlements();
    }

    renderSettlements() {
        if (!this.elements.grid) return;
        
        if (this.filteredSettlements.length === 0) {
            this.elements.grid.innerHTML = `
                <div class="no-settlements-message">
                    <h3>Поселения не найдены</h3>
                </div>
            `;
            return;
        }
        
        this.elements.grid.innerHTML = this.filteredSettlements
            .map(settlement => this.createSettlementCard(settlement))
            .join('');
            
        this.setupCardInteractions();
    }

    createSettlementCard(settlement) {
        const raceClass = `${settlement.race}-settlement`;
        const raceBadge = this.getRaceBadge(settlement.race);
        const warStatus = this.getWarStatus(settlement.warStatus);
        
        return `
            <div class="settlement-card ${raceClass} visible" 
                 data-race="${settlement.race}" 
                 data-settlement-id="${settlement.id}">
                <div class="settlement-visual">
                    <div class="settlement-image ${settlement.race}">
                        ${settlement.banner ? 
                            `<img src="${settlement.banner}" alt="${settlement.name}" class="banner-image">` :
                            `<div class="settlement-banner-placeholder">${settlement.name.charAt(0)}</div>`
                        }
                        <div class="settlement-glow"></div>
                        <div class="population-badge">
                            <img src="assets/images/icons/index_icon_players.gif" class="resized-image3"> 
                            ${settlement.population}
                        </div>
                        ${warStatus}
                    </div>
                </div>
                
                <div class="settlement-content">
                    <div class="settlement-header">
                        <h3 class="settlement-name">${settlement.name}</h3>
                        <span class="settlement-race-badge">${raceBadge}</span>
                    </div>
                    
                    <div class="settlement-leader">
                        <span class="leader-label">
                            <img src="assets/images/icons/icon_leader.gif" class="resized-image3"> 
                            ЛИДЕР -
                        </span>
                        <span class="leader-name">${settlement.leader}</span>
                    </div>
                    
                    <div class="settlement-location">
                        <span class="location-icon">
                            <img src="assets/images/icons/index_icon_settlements.gif" class="resized-image3">
                        </span>
                        <span class="location-text">${settlement.location}</span>
                    </div>
                    
                    <div class="settlement-description">
                        <p>${settlement.description}</p>
                    </div>
                    
                    <div class="settlement-features">
                        <h4>
                            <img src="assets/images/icons/icon_peculiarities.gif" class="resized-image3"> 
                            ОСОБЕННОСТИ
                        </h4>
                        <div class="features-list">
                            ${settlement.features.map(feature => 
                                `<span class="feature-tag">${feature}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="settlement-coordinates">
                        <span class="coordinates-label">📌 КООРДИНАТЫ:</span>
                        <code class="coordinates-value">${settlement.coordinates}</code>
                    </div>
                </div>
                
                <div class="settlement-footer">
                    <span class="established-date">Основано ${settlement.established}</span>
                    <button class="view-details-btn" data-settlement-id="${settlement.id}">
                        Подробнее
                    </button>
                </div>
            </div>
        `;
    }

    getRaceBadge(race) {
        const badges = {
            'hell': 'Демоны',
            'heaven': 'Ангелы',
            'earth': 'Земные',
            'timer': 'Хранитель Времени',
            'ii': 'Чужой',
        };
        return badges[race] || 'Неизвестно';
    }

    getWarStatus(status) {
        const statuses = {
            'none': { text: 'Неизвестно', class: 'neutral' },
            'peace': { text: 'Мирный статус', class: 'peace' },
            'defensive': { text: 'В боевой готовности', class: 'defensive' },
            'aggressive': { text: 'Агрессивный', class: 'aggressive' },
            'neutral': { text: 'Нейтральный', class: 'neutral' }
        };
        
        const statusInfo = statuses[status] || statuses.neutral;
        return `<div class="war-status-badge ${statusInfo.class}">${statusInfo.text}</div>`;
    }

    setupCardInteractions() {
        // Обработчики для кнопок "Подробнее"
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const settlementId = parseInt(e.target.dataset.settlementId);
                const settlement = this.settlements.find(s => s.id === settlementId);
                
                if (settlement) {
                    this.showSettlementModal(settlement);
                }
            });
        });

        // Обработчики для баннеров (если есть)
        document.querySelectorAll('.banner-image').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                const card = e.target.closest('.settlement-card');
                const settlementId = parseInt(card.dataset.settlementId);
                const settlement = this.settlements.find(s => s.id === settlementId);
                
                if (settlement) {
                    this.showSettlementModal(settlement);
                }
            });
        });
    }

    showSettlementModal(settlement) {
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'settlement-modal active';
        modal.innerHTML = this.createModalContent(settlement);
        
        document.body.appendChild(modal);
        
        // Закрытие по клику вне контента
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
        
        // Кнопка закрытия
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal(modal));
        }
        
        // Кнопка посещения
        const visitBtn = modal.querySelector('.visit-btn');
        if (visitBtn) {
            visitBtn.addEventListener('click', () => this.showCoordinates(settlement));
        }
        
        this.currentModal = modal;
    }

    createModalContent(settlement) {
        const raceClass = settlement.race;
        const raceBadge = this.getRaceBadge(settlement.race);
        
        return `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="settlement-image-large ${raceClass}">
                        ${settlement.banner ? 
                            `<img src="${settlement.banner}" alt="${settlement.name}" style="width: 100%; height: 100%; border-radius: 16px;">` :
                            `<div style="font-size: 2rem;">${settlement.name.charAt(0)}</div>`
                        }
                    </div>
                    <div class="settlement-info">
                        <h2>${settlement.name}</h2>
                        <div class="settlement-level">${settlement.level} • ${raceBadge}</div>
                        <button class="close-modal">&times;</button>
                    </div>
                </div>
                
                <div class="modal-body">
                    <div class="settlement-stats-detailed">
                        <div class="detail-item">
                            <h4>Население</h4>
                            <div class="stat-value">${settlement.population} жителей</div>
                        </div>
                        <div class="detail-item">
                            <h4>Лидер</h4>
                            <div class="leader-info">${settlement.leader}</div>
                        </div>
                        <div class="detail-item">
                            <h4>Основано</h4>
                            <div class="established-date">${settlement.established}</div>
                        </div>
                    </div>
                    
                    <div class="settlement-description-detailed">
                        <h4>Описание</h4>
                        <p>${settlement.description}</p>
                    </div>
                    
                    <div class="settlement-features-detailed">
                        <h4>Особенности</h4>
                        <div class="features-grid-detailed">
                            ${settlement.features.map(feature => `
                                <div class="feature-item-detailed">
                                    <div class="feature-icon">✓</div>
                                    <div class="feature-content">
                                        <strong>${feature}</strong>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="settlement-coordinates-detailed">
                        <h4>Координаты</h4>
                        <div class="coordinates-display">
                            <code>${settlement.coordinates}</code>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="visit-btn">Посетить</button>
                    <button class="share-btn">Поделиться</button>
                </div>
            </div>
        `;
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }

    showCoordinates(settlement) {
        this.closeModal(this.currentModal);
        
        const notification = document.createElement('div');
        notification.className = 'visit-notification active';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>Координаты поселения</h4>
                <pre>${settlement.coordinates}</pre>
                <p>Скопируйте координаты для использования в игре</p>
                <div class="notification-buttons">
                    <button class="copy-coords-btn">Скопировать</button>
                    <button class="close-notification">Закрыть</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Копирование координат
        const copyBtn = notification.querySelector('.copy-coords-btn');
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(settlement.coordinates)
                .then(() => this.showToast('Координаты скопированы!'))
                .catch(() => this.showToast('Не удалось скопировать координаты'));
        });
        
        // Закрытие уведомления
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('active');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Закрытие по клику вне
        notification.addEventListener('click', (e) => {
            if (e.target === notification) {
                notification.classList.remove('active');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification show';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h4>Ошибка</h4>
                <p>${message}</p>
                <button class="retry-btn">Повторить</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        const retryBtn = errorDiv.querySelector('.retry-btn');
        retryBtn.addEventListener('click', () => {
            errorDiv.remove();
            this.init();
        });
    }

    handleGlobalClick(e) {
        // Закрытие тултипов при клике вне
        if (this.currentTooltip && !e.target.closest('.map-point')) {
            this.hideMapTooltip();
        }
    }

    // Публичные методы для внешнего использования
    refreshData() {
        this.loadSettlementsData().then(() => {
            this.filterSettlements();
            this.showToast('Данные обновлены');
        });
    }

    getSettlementById(id) {
        return this.settlements.find(s => s.id === id);
    }

    getSettlementsByRace(race) {
        return this.settlements.filter(s => s.race === race);
    }

    // Деструктор для очистки
    destroy() {
        this.hideMapTooltip();
        
        if (this.currentModal) {
            this.closeModal(this.currentModal);
        }
        
        // Удаляем все обработчики
        document.removeEventListener('click', this.handleGlobalClick);
        
        this.isInitialized = false;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на странице поселений
    if (document.querySelector('.settlements-section')) {
        window.settlementsManager = new SettlementsManager();
        
        // Глобальные методы для отладки
        window.debugSettlements = {
            refresh: () => window.settlementsManager.refreshData(),
            getData: () => window.settlementsManager.settlements,
            filter: (type) => window.settlementsManager.setFilter(type)
        };
    }
});

// Оптимизации для производительности
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.settlementsManager && window.settlementsManager.currentTooltip) {
            window.settlementsManager.hideMapTooltip();
        }
    }, 250);
});

// Preload критических ресурсов
if (document.querySelector('.settlements-section')) {
    const criticalImages = [
        'assets/images/icons/index_icon_players.gif',
        'assets/images/icons/icon_leader.gif',
        'assets/images/icons/index_icon_settlements.gif',
        'assets/images/icons/icon_peculiarities.gif'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Service Worker для кэширования (только для продакшена)
if ('serviceWorker' in navigator && 
    (window.location.protocol === 'https:' || window.location.hostname === 'localhost') &&
    document.querySelector('.settlements-section')) {
    
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('✅ ServiceWorker registered successfully:', registration);
        })
        .catch(error => {
            console.log('❌ ServiceWorker registration failed:', error);
        });
}

// Service Worker для кэширования (опционально)
if ('serviceWorker' in navigator && document.querySelector('.settlements-section')) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration)
        .catch(error);
}