// JSON данные о поселениях
const settlementsData = {
    "settlements": [
        {
            "id": 1,
            "name": "ФрикБургская Империя",
            "image": "assets/images/settlements/frickburg.png",
            "leader": "_Kot_Baris_",
            "deputy": "pandamom",
            "race": "earth",
            "description": "💪 Мы сильнее всех! Строим из блоков империи, куем из побед легенды – за Фрикбург, за победу! Великая земная цивилизация, объединяющая лучших строителей и воинов.",
            "population": 8,
            "residents": ["_Kot_Baris_", "pandamom", "darcklord", "ddanilkaaaa", "jdh16", "maxxaumka", "nicotine", "tropic_yt2021"],
            "coordinates": { "x": 30, "y": 86, "z": 1018 },
            "war_status": "defensive",
            "established": "2025-10-11",
            "level": 4,
            "features": ["Свобода слова и действий", "Адекватные люди", "Автоматические фермы", "Торговая площадь", "Оборонительные стены"],
            "location": "Земля",
            "mapPosition": { "x": 50, "y": 84 }
        },
        {
            "id": 2,
            "name": "Логово Хантера",
            "image": "assets/images/settlements/hunter_lair.png",
            "leader": "stalker_hunter_",
            "deputy": "Yaryna",
            "race": "hell",
            "description": "К демонам приходят не ради помощи — а ради сделки. Каждое слово здесь имеет цену, каждая улыбка — намерение, а каждая искра — обещание будущего огня. Тайное убежище в глубинах преисподней.",
            "population": 3,
            "residents": ["stalker_hunter_", "Yaryna", "Lemonchik"],
            "coordinates": { "x": 212, "y": 80, "z": 495 },
            "war_status": "neutral",
            "established": "2025-10-12",
            "level": 3,
            "features": ["Живут демоны и земные", "Лавовые водопады", "Обсидиановые стены", "Незеритовые рудники"],
            "location": "Под землёй",
            "mapPosition": { "x": 57, "y": 70 }
        },
        {
            "id": 3,
            "name": "База Тропика",
            "image": "assets/images/settlements/tropic_base.png",
            "leader": "tropic_yt2021",
            "deputy": "",
            "race": "earth",
            "description": "Уютная база в тропическом биоме с современными постройками и автоматическими системами.",
            "population": 1,
            "residents": ["tropic_yt2021"],
            "coordinates": { "x": 150, "y": 64, "z": 800 },
            "war_status": "peace",
            "established": "2025-10-13",
            "level": 2,
            "features": ["Тропический сад", "Автоматические фермы", "Современная архитектура"],
            "location": "Земля",
            "mapPosition": { "x": 80, "y": 62 }
        },
        {
            "id": 4,
            "name": "ВДНХ",
            "image": "assets/images/settlements/vdnx.png",
            "leader": "maxxaumka",
            "deputy": "",
            "race": "earth",
            "description": "Выставка достижений народного хозяйства - место где собраны лучшие постройки и технологии сервера.",
            "population": 2,
            "residents": ["maxxaumka", "nicotine"],
            "coordinates": { "x": 100, "y": 70, "z": 600 },
            "war_status": "peace",
            "established": "2025-10-14",
            "level": 3,
            "features": ["Выставочные павильоны", "Технологические экспонаты", "Образовательный центр"],
            "location": "Земля",
            "mapPosition": { "x": 59, "y": 65 }
        },
        {
            "id": 5,
            "name": "База Ангелов",
            "image": "assets/images/settlements/angel_base.png",
            "leader": "Angel_Player",
            "deputy": "",
            "race": "heaven",
            "description": "Небесное святилище где ангелы сохраняют баланс и гармонию мира. Место силы и мудрости.",
            "population": 2,
            "residents": ["Angel_Player", "Celestial_Being"],
            "coordinates": { "x": -300, "y": 120, "z": 200 },
            "war_status": "neutral",
            "established": "2025-10-15",
            "level": 4,
            "features": ["Парящие острова", "Библиотека заклинаний", "Сады хоруса", "Обсерватория"],
            "location": "Небеса",
            "mapPosition": { "x": 35, "y": 50 }
        },
        {
            "id": 6,
            "name": "Максимка",
            "image": "assets/images/settlements/maximka.png",
            "leader": "maxxaumka",
            "deputy": "",
            "race": "earth",
            "description": "Личная база игрока maxxaumka с уникальными механизмами и экспериментальными постройками.",
            "population": 1,
            "residents": ["maxxaumka"],
            "coordinates": { "x": -500, "y": 65, "z": -200 },
            "war_status": "peace",
            "established": "2025-10-16",
            "level": 2,
            "features": ["Экспериментальные механизмы", "Секретная лаборатория", "Тестовые зоны"],
            "location": "Земля",
            "mapPosition": { "x": 8, "y": 30 }
        }
    ],
    "stats": {
        "total_settlements": 6,
        "total_residents": 17,
        "race_distribution": {
            "earth": 4,
            "hell": 1,
            "heaven": 1
        }
    }
};

// Глобальные переменные
let currentFilter = 'all';
let currentSearch = '';
let favoriteSettlements = JSON.parse(localStorage.getItem('favoriteSettlements')) || [];

// Основная функция инициализации
document.addEventListener('DOMContentLoaded', function() {
    // console.log('🎮 Инициализация страницы поселений...');
    initSettlementsPage();
    initEventListeners();
    renderAllSettlements();
    updateStatistics();
});

// Инициализация страницы
function initSettlementsPage() {
    // console.log('✨ Страница поселений инициализирована');
    
    // Добавляем премиальные эффекты к заголовку
    const title = document.querySelector('.section-title');
    if (title) {
        title.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3, #54a0ff)';
        title.style.backgroundSize = '400% 400%';
        title.style.webkitBackgroundClip = 'text';
        title.style.backgroundClip = 'text';
        title.style.color = 'transparent';
        title.style.animation = 'premiumGradient 8s ease infinite';
    }

    // Инициализация карты
    initWorldMap();
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Поиск
    const searchInput = document.getElementById('settlementsSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value.toLowerCase();
            filterSettlements();
        });
    }

    // Фильтры
    const filterButtons = document.querySelectorAll('.settlement-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-filter');
            filterSettlements();
        });
    });

    // Точки на карте
    const mapPoints = document.querySelectorAll('.map-point');
    mapPoints.forEach(point => {
        point.addEventListener('click', function() {
            const settlementName = this.getAttribute('data-settlement');
            showSettlementOnMap(settlementName);
        });
    });
}

// Отображение всех поселений
function renderAllSettlements() {
    const grid = document.getElementById('settlementsGrid');
    if (!grid) {
        console.error('❌ Элемент settlementsGrid не найден!');
        return;
    }

    grid.innerHTML = '';
    
    settlementsData.settlements.forEach(settlement => {
        const settlementCard = createSettlementCard(settlement);
        grid.appendChild(settlementCard);
    });
}

// Создание карточки поселения
function createSettlementCard(settlement) {
    const card = document.createElement('div');
    card.className = `settlement-card ${settlement.race}-settlement`;
    card.setAttribute('data-race', settlement.race);
    card.setAttribute('data-settlement-id', settlement.id);
    
    const warStatus = getWarStatusInfo(settlement.war_status);
    const isFavorite = favoriteSettlements.includes(settlement.id);
    
    card.innerHTML = `
        <div class="settlement-visual">
            <div class="settlement-image ${settlement.race}">
                <img src="${settlement.image}" alt="${settlement.name}" 
                     class="settlement-banner-link" 
                     onerror="this.src='assets/images/settlements/default_settlement.png'">
                <div class="settlement-glow"></div>
                <div class="population-badge">
                    <img src="assets/images/icons/index_icon_players.gif" class="resized-image3"> 
                    ${settlement.population}
                </div>
                <div class="war-status-badge ${warStatus.class}">
                    ${warStatus.icon} ${warStatus.text}
                </div>
                <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" 
                        onclick="toggleFavorite(${settlement.id}, this)">
                    ${isFavorite ? '★' : '☆'}
                </button>
            </div>
        </div>
        
        <div class="settlement-content">
            <div class="settlement-header">
                <h3 class="settlement-name">${settlement.name}</h3>
                <span class="settlement-race-badge race-${settlement.race}">
                    ${getRaceIcon(settlement.race)} ${getRaceName(settlement.race)}
                </span>
            </div>
            
            <div class="settlement-leader">
                <span class="leader-label">
                    <img src="assets/images/icons/icon_leader.gif" class="resized-image3"> ЛИДЕР:
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
                <code class="coordinates-value">${settlement.coordinates.x} ${settlement.coordinates.y} ${settlement.coordinates.z}</code>
                <button class="copy-coords-btn" onclick="copyCoordinates(${settlement.coordinates.x}, ${settlement.coordinates.y}, ${settlement.coordinates.z})">
                    📋
                </button>
            </div>
            
            <div class="settlement-residents">
                <div class="residents-header">
                    <span class="residents-label">
                        <img src="assets/images/icons/index_icon_players.gif" class="resized-image2"> 
                        ЖИТЕЛИ (${settlement.residents.length}):
                    </span>
                </div>
                <div class="residents-list">
                    ${settlement.residents.map(resident => 
                        `<span class="resident-tag">${resident}</span>`
                    ).join('')}
                </div>
            </div>
        </div>
        
        <div class="settlement-footer">
            <span class="established-date">Основано ${formatDate(settlement.established)}</span>
            <div class="settlement-actions">
                <button class="action-btn visit-btn" onclick="visitSettlement(${settlement.id})">
                    🎮 Посетить
                </button>
                <button class="action-btn details-btn" onclick="showSettlementDetails(${settlement.id})">
                    📖 Подробнее
                </button>
            </div>
        </div>
    `;

    // Добавляем анимацию появления
    setTimeout(() => {
        card.style.animation = 'fadeInUp 0.6s ease-out';
    }, 100);

    return card;
}

// Фильтрация поселений
function filterSettlements() {
    const settlements = document.querySelectorAll('.settlement-card');
    let visibleCount = 0;

    settlements.forEach(card => {
        const race = card.getAttribute('data-race');
        const name = card.querySelector('.settlement-name').textContent.toLowerCase();
        const description = card.querySelector('.settlement-description p').textContent.toLowerCase();
        
        const matchesFilter = currentFilter === 'all' || race === currentFilter;
        const matchesSearch = currentSearch === '' || 
                            name.includes(currentSearch) || 
                            description.includes(currentSearch);
        
        if (matchesFilter && matchesSearch) {
            card.style.display = 'block';
            card.classList.add('visible');
            visibleCount++;
            
            // Анимация появления
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
                card.classList.remove('visible');
            }, 300);
        }
    });

    // Показываем сообщение если ничего не найдено
    showNoResultsMessage(visibleCount === 0);
}

// Сообщение когда нет результатов
function showNoResultsMessage(show) {
    let message = document.getElementById('noResultsMessage');
    
    if (show && !message) {
        message = document.createElement('div');
        message.id = 'noResultsMessage';
        message.className = 'no-results-message';
        message.innerHTML = `
            <div class="no-results-content">
                <div class="no-results-icon">🏰</div>
                <h3>Поселения не найдены</h3>
                <p>Попробуйте изменить параметры поиска или фильтрации</p>
                <button onclick="clearFilters()" class="clear-filters-btn">
                    🗑️ Очистить фильтры
                </button>
            </div>
        `;
        
        const grid = document.getElementById('settlementsGrid');
        grid.appendChild(message);
    } else if (!show && message) {
        message.remove();
    }
}

// Очистка фильтров
function clearFilters() {
    currentSearch = '';
    currentFilter = 'all';
    
    const searchInput = document.getElementById('settlementsSearch');
    if (searchInput) searchInput.value = '';
    
    const filterButtons = document.querySelectorAll('.settlement-filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
        }
    });
    
    filterSettlements();
}

// Инициализация карты мира
function initWorldMap() {
    // console.log('🗺️ Инициализация карты мира...');
    
    const mapPoints = document.querySelectorAll('.map-point');
    mapPoints.forEach(point => {
        point.addEventListener('mouseenter', function() {
            const settlementName = this.getAttribute('data-settlement');
            highlightSettlementOnMap(settlementName);
        });
        
        point.addEventListener('mouseleave', function() {
            clearMapHighlights();
        });
        
        point.addEventListener('click', function() {
            const settlementName = this.getAttribute('data-settlement');
            focusOnSettlement(settlementName);
        });
    });
}

// Подсветка поселения на карте
function highlightSettlementOnMap(settlementName) {
    const settlement = settlementsData.settlements.find(s => s.name === settlementName);
    if (!settlement) return;
    
    const cards = document.querySelectorAll('.settlement-card');
    cards.forEach(card => {
        if (card.querySelector('.settlement-name').textContent === settlementName) {
            card.classList.add('highlighted');
        }
    });
}

// Снятие подсветки
function clearMapHighlights() {
    const cards = document.querySelectorAll('.settlement-card');
    cards.forEach(card => card.classList.remove('highlighted'));
}

// Фокусировка на поселении
function focusOnSettlement(settlementName) {
    const settlement = settlementsData.settlements.find(s => s.name === settlementName);
    if (!settlement) return;
    
    // Прокручиваем к карточке
    const card = document.querySelector(`[data-settlement-id="${settlement.id}"]`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('pulse-highlight');
        setTimeout(() => card.classList.remove('pulse-highlight'), 2000);
    }
}

// Показать поселение на карте
function showSettlementOnMap(settlementName) {
    const settlement = settlementsData.settlements.find(s => s.name === settlementName);
    if (!settlement) return;
    
    const mapPoint = document.querySelector(`[data-settlement="${settlementName}"]`);
    if (mapPoint) {
        mapPoint.classList.add('pulse');
        setTimeout(() => mapPoint.classList.remove('pulse'), 1000);
    }
}

// Обновление статистики
function updateStatistics() {
    const stats = settlementsData.stats;
    
    // Обновляем общую статистику
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = stat.getAttribute('data-target');
        if (target === '1') {
            animateCounter(stat, stats.total_settlements);
        } else if (target === '8') {
            animateCounter(stat, stats.total_residents);
        }
    });
}

// Анимация счетчика
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 30);
}

// Вспомогательные функции
function getWarStatusInfo(status) {
    const statuses = {
        'peace': { text: 'Мир', class: 'peace', icon: '🕊️' },
        'defensive': { text: 'В боевой готовности', class: 'defensive', icon: '🏹' },
        'aggressive': { text: 'Атака', class: 'aggressive', icon: '⚔️' },
        'neutral': { text: 'Нейтралитет', class: 'neutral', icon: '⚖️' }
    };
    return statuses[status] || statuses['neutral'];
}

function getRaceIcon(race) {
    const icons = {
        'hell': '🔥',
        'heaven': '👼',
        'earth': '🌍'
    };
    return icons[race] || '🏰';
}

function getRaceName(race) {
    const names = {
        'hell': 'Демоны',
        'heaven': 'Ангелы',
        'earth': 'Земные'
    };
    return names[race] || 'Неизвестно';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

// Функции взаимодействия
function toggleFavorite(settlementId, button) {
    const index = favoriteSettlements.indexOf(settlementId);
    
    if (index === -1) {
        favoriteSettlements.push(settlementId);
        button.classList.add('favorited');
        button.innerHTML = '★';
        showNotification('Добавлено в избранное', 'success');
    } else {
        favoriteSettlements.splice(index, 1);
        button.classList.remove('favorited');
        button.innerHTML = '☆';
        showNotification('Удалено из избранного', 'info');
    }
    
    localStorage.setItem('favoriteSettlements', JSON.stringify(favoriteSettlements));
}

function copyCoordinates(x, y, z) {
    const coords = `${x} ${y} ${z}`;
    navigator.clipboard.writeText(coords).then(() => {
        showNotification('Координаты скопированы!', 'success');
    }).catch(() => {
        showNotification('Ошибка копирования', 'error');
    });
}

function visitSettlement(settlementId) {
    const settlement = settlementsData.settlements.find(s => s.id === settlementId);
    if (settlement) {
        showNotification(`Телепортация в ${settlement.name}...`, 'info');
        // Здесь можно добавить логику телепортации на сервере
    }
}

function showSettlementDetails(settlementId) {
    const settlement = settlementsData.settlements.find(s => s.id === settlementId);
    if (settlement) {
        // Создаем модальное окно с детальной информацией
        createDetailsModal(settlement);
    }
}

// Создание модального окна с деталями
function createDetailsModal(settlement) {
    const modal = document.createElement('div');
    modal.className = 'settlement-modal';
    modal.innerHTML = `
        <div class="modal-content ${settlement.race}-theme">
            <div class="modal-header">
                <h2>${settlement.name}</h2>
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${settlement.image}" alt="${settlement.name}"
                         onerror="this.src='assets/images/settlements/default_settlement.png'">
                </div>
                <div class="modal-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <label>👑 Лидер:</label>
                            <span>${settlement.leader}</span>
                        </div>
                        <div class="info-item">
                            <label>👥 Население:</label>
                            <span>${settlement.population} жителей</span>
                        </div>
                        <div class="info-item">
                            <label>⭐ Уровень:</label>
                            <span>${settlement.level}/5</span>
                        </div>
                        <div class="info-item">
                            <label>📅 Основано:</label>
                            <span>${formatDate(settlement.established)}</span>
                        </div>
                        <div class="info-item">
                            <label>📍 Расположение:</label>
                            <span>${settlement.location}</span>
                        </div>
                    </div>
                    
                    <div class="residents-section">
                        <h4>🏠 Жители поселения:</h4>
                        <div class="residents-grid">
                            ${settlement.residents.map(resident => 
                                `<span class="resident-badge">${resident}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="coordinates-section">
                        <h4>🎯 Координаты:</h4>
                        <code class="coordinates-display">${settlement.coordinates.x} ${settlement.coordinates.y} ${settlement.coordinates.z}</code>
                        <button onclick="copyCoordinates(${settlement.coordinates.x}, ${settlement.coordinates.y}, ${settlement.coordinates.z})" 
                                class="copy-btn">
                            📋 Скопировать
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="visitSettlement(${settlement.id})" class="visit-btn-large">
                    🎮 Телепортироваться
                </button>
                <button onclick="closeModal()" class="close-btn">
                    Закрыть
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Анимация появления
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.settlement-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Система уведомлений
function showNotification(message, type = 'info') {
    // Создаем контейнер для уведомлений если его нет
    let container = document.querySelector('.notifications-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматическое закрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Экспорт функций для глобального использования
window.toggleFavorite = toggleFavorite;
window.copyCoordinates = copyCoordinates;
window.visitSettlement = visitSettlement;
window.showSettlementDetails = showSettlementDetails;
window.closeModal = closeModal;
window.clearFilters = clearFilters;
