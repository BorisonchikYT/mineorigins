// Данные поселений
const settlementsData = {
    settlements: [
        {
            id: 1,
            name: "ФрикБургская Империя",
            image: "assets/images/settlements/frickburg.png",
            leader: "_Kot_Baris_",
            race: "earth",
            description: "💪 Мы сильнее всех! Строим из блоков империи, куем из побед легенды – за Фрикбург, за победу!",
            population: 8,
            residents: ["_Kot_Baris_", "pandamom", "darcklord", "ddanilkaaaa", "jdh16", "maxxaumka", "nicotine", "tropic_yt2021"],
            coordinates: { x: 30, y: 86, z: 1018 },
            war_status: "defensive",
            established: "2025-10-11",
            level: 4,
            features: ["Свобода слова и действий", "Адекватные люди", "Автоматические фермы"],
            location: "Земля"
        },
        {
            id: 2,
            name: "Логово Хантера",
            image: "assets/images/settlements/hunter_lair.png",
            leader: "stalker_hunter_",
            race: "hell",
            description: "К демонам приходят не ради помощи — а ради сделки. Каждое слово здесь имеет цену.",
            population: 3,
            residents: ["stalker_hunter_", "Yaryna", "Lemonchik"],
            coordinates: { x: 212, y: 80, z: 495 },
            war_status: "neutral",
            established: "2025-10-12",
            level: 3,
            features: ["Живут демоны и земные", "Лавовые водопады"],
            location: "Под землёй"
        }
    ]
};

// Кэш элементов
const DOM = {
    grid: null,
    search: null,
    filters: null
};

// Состояние приложения
const state = {
    currentFilter: 'all',
    currentSearch: '',
    isLoading: false
};

// Инициализация
class SettlementsApp {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.cacheDOM();
            this.bindEvents();
            this.renderSettlements();
            this.initMap();
        });
    }

    cacheDOM() {
        DOM.grid = document.getElementById('settlementsGrid');
        DOM.search = document.getElementById('settlementsSearch');
        DOM.filters = document.querySelectorAll('.settlement-filter-btn');
    }

    bindEvents() {
        // Поиск с debounce
        if (DOM.search) {
            DOM.search.addEventListener('input', this.debounce((e) => {
                state.currentSearch = e.target.value.toLowerCase();
                this.filterSettlements();
            }, 300));
        }

        // Фильтры
        DOM.filters.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        // Предотвращение множественных кликов
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                this.handleActionClick(e);
            }
        });
    }

    // Дебаунс для поиска
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    handleFilterClick(button) {
        DOM.filters.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        state.currentFilter = button.dataset.filter;
        this.filterSettlements();
    }

    handleActionClick(e) {
        const button = e.target;
        const settlementId = button.dataset.id;
        
        if (button.disabled) return;
        
        button.disabled = true;
        
        if (button.classList.contains('visit-btn')) {
            this.visitSettlement(settlementId);
        } else if (button.classList.contains('details-btn')) {
            this.showDetails(settlementId);
        } else if (button.classList.contains('copy-coords-btn')) {
            this.copyCoordinates(settlementId);
        }
        
        setTimeout(() => {
            button.disabled = false;
        }, 1000);
    }

    renderSettlements() {
        if (!DOM.grid) return;

        const fragment = document.createDocumentFragment();
        
        settlementsData.settlements.forEach(settlement => {
            const card = this.createSettlementCard(settlement);
            fragment.appendChild(card);
        });

        DOM.grid.innerHTML = '';
        DOM.grid.appendChild(fragment);
    }

    createSettlementCard(settlement) {
        const card = document.createElement('div');
        card.className = `settlement-card ${settlement.race}-settlement`;
        card.dataset.race = settlement.race;
        card.dataset.id = settlement.id;

        card.innerHTML = `
            <div class="settlement-visual">
                <div class="settlement-image ${settlement.race}">
                    <img src="${settlement.image}" alt="${settlement.name}" 
                         loading="lazy"
                         onerror="this.src='assets/images/settlements/default_settlement.png'">
                    <div class="settlement-overlay">
                        <div class="population-badge">
                            <img src="assets/images/icons/index_icon_players.gif" class="icon-sm"> 
                            ${settlement.population}
                        </div>
                        <div class="war-status-badge ${settlement.war_status}">
                            ${this.getWarStatusIcon(settlement.war_status)}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="settlement-content">
                <div class="settlement-header">
                    <h3 class="settlement-name">${settlement.name}</h3>
                    <span class="settlement-race ${settlement.race}">
                        ${this.getRaceIcon(settlement.race)} ${this.getRaceName(settlement.race)}
                    </span>
                </div>
                
                <div class="settlement-info">
                    <div class="info-item">
                        <span class="label">👑 Лидер:</span>
                        <span class="value">${settlement.leader}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">📍 Локация:</span>
                        <span class="value">${settlement.location}</span>
                    </div>
                </div>
                
                <div class="settlement-description">
                    <p>${settlement.description}</p>
                </div>
                
                <div class="settlement-features">
                    <h4>✨ Особенности</h4>
                    <div class="features-grid">
                        ${settlement.features.slice(0, 3).map(feature => 
                            `<span class="feature-tag">${feature}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="settlement-coordinates">
                    <div class="coords-display">
                        <span class="label">🎯 Координаты:</span>
                        <code>${settlement.coordinates.x} ${settlement.coordinates.y} ${settlement.coordinates.z}</code>
                    </div>
                    <button class="copy-coords-btn" data-id="${settlement.id}">
                        📋
                    </button>
                </div>
            </div>
            
            <div class="settlement-footer">
                <div class="settlement-meta">
                    <span class="level">Ур. ${settlement.level}</span>
                    <span class="date">${this.formatDate(settlement.established)}</span>
                </div>
                <div class="settlement-actions">
                    <button class="action-btn visit-btn" data-id="${settlement.id}">
                        🎮 Посетить
                    </button>
                    <button class="action-btn details-btn" data-id="${settlement.id}">
                        📖 Подробнее
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    filterSettlements() {
        const cards = DOM.grid.querySelectorAll('.settlement-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const race = card.dataset.race;
            const name = card.querySelector('.settlement-name').textContent.toLowerCase();
            const description = card.querySelector('.settlement-description p').textContent.toLowerCase();
            
            const matchesFilter = state.currentFilter === 'all' || race === state.currentFilter;
            const matchesSearch = !state.currentSearch || 
                                name.includes(state.currentSearch) || 
                                description.includes(state.currentSearch);
            
            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                card.classList.add('visible');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('visible');
            }
        });

        this.showEmptyState(visibleCount === 0);
    }

    showEmptyState(show) {
        let emptyState = DOM.grid.querySelector('.empty-state');
        
        if (show && !emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-content">
                    <div class="empty-icon">🏰</div>
                    <h3>Поселения не найдены</h3>
                    <p>Попробуйте изменить параметры поиска</p>
                    <button class="clear-filters-btn" onclick="app.clearFilters()">
                        Очистить фильтры
                    </button>
                </div>
            `;
            DOM.grid.appendChild(emptyState);
        } else if (!show && emptyState) {
            emptyState.remove();
        }
    }

    clearFilters() {
        state.currentSearch = '';
        state.currentFilter = 'all';
        
        if (DOM.search) DOM.search.value = '';
        
        DOM.filters.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });
        
        this.filterSettlements();
    }

    visitSettlement(id) {
        const settlement = settlementsData.settlements.find(s => s.id == id);
        if (settlement) {
            this.showNotification(`🔄 Телепортация в ${settlement.name}...`, 'info');
        }
    }

    showDetails(id) {
        const settlement = settlementsData.settlements.find(s => s.id == id);
        if (settlement) {
            this.openModal(settlement);
        }
    }

    copyCoordinates(id) {
        const settlement = settlementsData.settlements.find(s => s.id == id);
        if (settlement) {
            const coords = `${settlement.coordinates.x} ${settlement.coordinates.y} ${settlement.coordinates.z}`;
            navigator.clipboard.writeText(coords).then(() => {
                this.showNotification('✅ Координаты скопированы!', 'success');
            });
        }
    }

    openModal(settlement) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${settlement.name}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${settlement.image}" alt="${settlement.name}">
                    </div>
                    <div class="modal-details">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span class="label">Лидер:</span>
                                <span class="value">${settlement.leader}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Население:</span>
                                <span class="value">${settlement.population} жителей</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Уровень:</span>
                                <span class="value">${settlement.level}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Основано:</span>
                                <span class="value">${this.formatDate(settlement.established)}</span>
                            </div>
                        </div>
                        
                        <div class="residents-section">
                            <h4>Жители:</h4>
                            <div class="residents-list">
                                ${settlement.residents.map(resident => 
                                    `<span class="resident-tag">${resident}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="app.visitSettlement(${settlement.id})">
                        🎮 Телепортироваться
                    </button>
                    <button class="btn-secondary" onclick="app.closeModal()">
                        Закрыть
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').onclick = () => this.closeModal();
        modal.onclick = (e) => {
            if (e.target === modal) this.closeModal();
        };
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    initMap() {
        // Простая инициализация карты
        const mapPoints = document.querySelectorAll('.map-point');
        mapPoints.forEach(point => {
            point.addEventListener('click', () => {
                const settlementName = point.dataset.settlement;
                this.focusOnSettlement(settlementName);
            });
        });
    }

    focusOnSettlement(name) {
        const settlement = settlementsData.settlements.find(s => s.name === name);
        if (settlement) {
            const card = document.querySelector(`[data-id="${settlement.id}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                card.classList.add('highlight');
                setTimeout(() => card.classList.remove('highlight'), 2000);
            }
        }
    }

    // Вспомогательные методы
    getWarStatusIcon(status) {
        const icons = {
            'peace': '🕊️',
            'defensive': '🏹', 
            'aggressive': '⚔️',
            'neutral': '⚖️'
        };
        return icons[status] || '⚖️';
    }

    getRaceIcon(race) {
        const icons = {
            'hell': '🔥',
            'heaven': '👼',
            'earth': '🌍'
        };
        return icons[race] || '🏰';
    }

    getRaceName(race) {
        const names = {
            'hell': 'Демоны',
            'heaven': 'Ангелы',
            'earth': 'Земные'
        };
        return names[race] || 'Неизвестно';
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('ru-RU');
    }
}

// Инициализация приложения
const app = new SettlementsApp();