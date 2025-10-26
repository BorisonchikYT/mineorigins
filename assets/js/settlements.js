// Скрипт для страницы поселений с данными из JSON
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация страницы поселений...');
    initSettlementsPage();
    initSettlementsStats();
    loadSettlementsData();
    initWorldMap();
    initSettlementsFilter();
    initMapInteractions();
});

// Инициализация страницы поселений
function initSettlementsPage() {
    console.log('Страница поселений инициализирована');
}

// Инициализация карты мира с изображением
function initWorldMap() {
    console.log('Инициализация карты мира с изображением...');
    
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) {
        console.warn('Контейнер карты не найден');
        return;
    }

// Загрузка данных поселений из JSON
async function loadSettlementsData() {
    try {
        console.log('Загрузка данных поселений...');
        showLoadingState();
        const settlementsData = await fetchSettlementsData();
        console.log('Данные загружены:', settlementsData);
        renderSettlementsGrid(settlementsData);
        updateSettlementsStats(settlementsData);
        updateWorldMap(settlementsData);
        hideLoadingState();
        
    } catch (error) {
        console.error('Ошибка загрузки данных поселений:', error);
        loadDemoSettlementsData();
    }
}

// Получение данных поселений из JSON файла
async function fetchSettlementsData() {
    try {
        console.log('Загрузка settlements.json...');
        const response = await fetch('assets/json/settlements.json');
        console.log('Ответ сервера:', response);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('JSON данные получены:', data);
        
        if (!data.settlements || !Array.isArray(data.settlements)) {
            throw new Error('Некорректная структура JSON: отсутствует массив settlements');
        }
        
        console.log(`Загружено ${data.settlements.length} поселений`);
        return data.settlements;
        
    } catch (error) {
        console.error('Ошибка загрузки JSON:', error);
        throw error;
    }
}

// Отображение сетки поселений
function renderSettlementsGrid(settlements) {
    const grid = document.getElementById('settlementsGrid');
    if (!grid) {
        console.error('Элемент settlementsGrid не найден!');
        return;
    }

    console.log(`Рендерим ${settlements.length} поселений`);
    grid.innerHTML = '';

    if (settlements.length === 0) {
        grid.innerHTML = `
            <div class="no-settlements-message">
                <h3>🏰 Поселения не найдены</h3>
                <p>Попробуйте обновить страницу или проверьте файл данных</p>
            </div>
        `;
        return;
    }

    settlements.forEach((settlement, index) => {
        console.log(`Создаем карточку для поселения: ${settlement.name}`);
        const settlementCard = createSettlementCard(settlement);
        grid.appendChild(settlementCard);
        
        // Анимация появления с задержкой
        setTimeout(() => {
            settlementCard.classList.add('visible');
        }, index * 100);
    });
}

// Очищаем старый контент карты
mapContainer.innerHTML = '';

// Создаем структуру карты с изображением
mapContainer.innerHTML = `
    <img src="assets/images/world-map.png" alt="Карта мира" class="map-image" 
         onerror="this.src='assets/images/world-map.png'">
    <div class="map-overlay"></div>
    <div class="map-legend">
        <div class="legend-title">Легенда</div>
        <div class="legend-items">
            <div class="legend-item">
                <div class="legend-color hell"></div>
                <span>Адские</span>
            </div>
            <div class="legend-item">
                <div class="legend-color heaven"></div>
                <span>Райские</span>
            </div>
            <div class="legend-item">
                <div class="legend-color earth"></div>
                <span>Земные</span>
            </div>
            <div class="legend-item">
                <div class="legend-color glhell"></div>
                <span>◈ Адские</span>
            </div>
            <div class="legend-item">
                <div class="legend-color glheaven"></div>
                <span>◈ Райские</span>
            </div>
            <div class="legend-item">
                <div class="legend-color glearth"></div>
                <span>◈ Земные</span>
            </div>
        </div>
    </div>
`;
}

// Создание карточки поселения
function createSettlementCard(settlement) {
    console.log('Создание карточки:', settlement);
    
    const card = document.createElement('div');
    card.className = `settlement-card ${settlement.race}-settlement`;
    card.setAttribute('data-race', settlement.race);
    card.setAttribute('data-settlement-id', settlement.id);
    
    const warStatus = getWarStatusInfo(settlement.war_status);
    
    card.innerHTML = `
        <div class="settlement-visual">
            <div class="settlement-image ${settlement.race}">
                <img src="${settlement.image}" alt="${settlement.name}" class="settlement-image-content"
                     onerror="this.style.display='none'; this.parentNode.innerHTML='${settlement.race === 'hell' ? '🔥' : settlement.race === 'heaven' ? '👼' : '🌍'}'">
                <div class="settlement-glow"></div>
                <div class="population-badge">👥 ${settlement.population}</div>
                <div class="level-badge">⭐ ${settlement.level}</div>
                <div class="war-status-badge ${warStatus.class}">${warStatus.icon} ${warStatus.text}</div>
            </div>
        </div>
        
        <div class="settlement-content">
            <div class="settlement-header">
                <h3 class="settlement-name">${settlement.name}</h3>
                <span class="settlement-race-badge race-${settlement.race}">${getRaceName(settlement.race)}</span>
            </div>
            
            <div class="settlement-leader">
                <span class="leader-label">👑 Лидер:</span>
                <span class="leader-name">${settlement.leader}</span>
            </div>
            
            <div class="settlement-location">
                <span class="location-icon">📍</span>
                <span class="location-text">${settlement.location}</span>
            </div>
            
            <div class="settlement-description">
                <p>${settlement.description}</p>
            </div>
            
            <div class="settlement-features">
                <h4>🚀 Особенности</h4>
                <div class="features-list">
                    ${settlement.features.slice(0, 3).map(feature => 
                        `<span class="feature-tag">${feature}</span>`
                    ).join('')}
                    ${settlement.features.length > 3 ? 
                        `<span class="feature-tag">+${settlement.features.length - 3} еще</span>` : ''
                    }
                </div>
            </div>
            
            <div class="settlement-coordinates">
                <span class="coordinates-label">📌 Координаты:</span>
                <code class="coordinates-value">${settlement.coordinates.x} ${settlement.coordinates.y} ${settlement.coordinates.z}</code>
            </div>
        </div>
        
        <div class="settlement-footer">
            <span class="established-date">Основано ${formatDate(settlement.established)}</span>
            <button class="view-details-btn" data-settlement-id="${settlement.id}">Подробнее</button>
        </div>
    `;

    // Обработчики событий
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.view-details-btn')) {
            showSettlementDetails(settlement);
        }
    });

    const detailsBtn = card.querySelector('.view-details-btn');
    if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSettlementDetails(settlement);
        });
    }

    return card;
}

// Показ детальной информации о поселении
function showSettlementDetails(settlement) {
    console.log('Показ деталей поселения:', settlement);
    
    const warStatus = getWarStatusInfo(settlement.war_status);
    
    const modal = document.createElement('div');
    modal.className = 'settlement-modal';
    modal.innerHTML = `
        <div class="modal-content ${settlement.race}-theme">
            <div class="modal-header">
                <div class="settlement-image-large ${settlement.race}">
                    <img src="${settlement.image}" alt="${settlement.name}" class="settlement-image-large-content"
                         onerror="this.style.display='none'; this.parentNode.innerHTML='<span class=\"settlement-icon-large\">${settlement.race === 'hell' ? '🔥' : settlement.race === 'heaven' ? '👼' : '🌍'}</span>'">
                    <div class="population-badge">👥 ${settlement.population}</div>
                    <div class="level-badge">⭐ ${settlement.level}</div>
                    <div class="war-status-badge-large ${warStatus.class}">${warStatus.icon} ${warStatus.text}</div>
                </div>
                <div class="settlement-info">
                    <h2>${settlement.name}</h2>
                    <span class="settlement-race-badge">${getRaceName(settlement.race)}</span>
                    <div class="settlement-level">Уровень развития: ${settlement.level}</div>
                    <div class="settlement-location-modal">📍 ${settlement.location}</div>
                </div>
                <button class="modal-close">&times;</button>
            </div>
            
            <div class="modal-body">
                <div class="settlement-stats-detailed">
                    <div class="stat-item">
                        <span class="stat-label">Население</span>
                        <span class="stat-value">${settlement.population} жителей</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Уровень</span>
                        <span class="stat-value">${settlement.level}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Статус войны</span>
                        <span class="stat-value ${warStatus.class}">${warStatus.icon} ${warStatus.text}</span>
                    </div>
                </div>
                
                <div class="settlement-details-grid">
                    <div class="detail-item">
                        <h4>👑 Руководство</h4>
                        <p><strong>Лидер:</strong> ${settlement.leader}</p>
                        <p><strong>Заместитель:</strong> ${settlement.deputy}</p>
                        <button class="view-leader-profile" data-leader="${settlement.leader}">
                            Профиль лидера
                        </button>
                    </div>
                    <div class="detail-item">
                        <h4>📍 Расположение</h4>
                        <p>${settlement.location}</p>
                        <div class="biome-info">
                            <span class="biome-tag">${getBiomeFromLocation(settlement.location)}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <h4>📅 Основан</h4>
                        <p>${formatDate(settlement.established)}</p>
                        <div class="age-info">
                            <span class="age-tag">${calculateSettlementAge(settlement.established)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="settlement-description-detailed">
                    <h4>📖 Описание</h4>
                    <p>${settlement.description}</p>
                </div>
                
                <div class="settlement-residents">
                    <h4>👥 Жители (${settlement.residents.length})</h4>
                    <div class="residents-list">
                        ${settlement.residents.map(resident => `
                            <div class="resident-item">
                                <span class="resident-avatar">${getResidentAvatar(resident)}</span>
                                <span class="resident-name">${resident}</span>
                                ${resident === settlement.leader ? '<span class="leader-tag">👑</span>' : ''}
                                ${resident === settlement.deputy ? '<span class="deputy-tag">⭐</span>' : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="settlement-features-detailed">
                    <h4>🚀 Особенности и инфраструктура</h4>
                    <div class="features-grid-detailed">
                        ${settlement.features.map(feature => `
                            <div class="feature-item-detailed">
                                <span class="feature-icon">🏗️</span>
                                <div class="feature-content">
                                    <strong>${feature}</strong>
                                    <span class="feature-desc">${getFeatureDescription(feature)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="settlement-map-section">
                    <h4>🗺️ Расположение на карте</h4>
                    <div class="interactive-map">
                        <div class="map-overview">
                            <div class="map-point-large ${settlement.race}" 
                                 style="left: ${settlement.mapPosition.x}%; top: ${settlement.mapPosition.y}%">
                                <div class="point-glow-large"></div>
                            </div>
                        </div>
                        <div class="map-coordinates">
                            <div class="coordinate-item">
                                <span class="coord-label">Координаты X:</span>
                                <code class="coord-value">${settlement.coordinates.x}</code>
                            </div>
                            <div class="coordinate-item">
                                <span class="coord-label">Координаты Y:</span>
                                <code class="coord-value">${settlement.coordinates.y}</code>
                            </div>
                            <div class="coordinate-item">
                                <span class="coord-label">Координаты Z:</span>
                                <code class="coord-value">${settlement.coordinates.z}</code>
                            </div>
                            <div class="coordinate-item">
                                <span class="coord-label">Команда для телепортации:</span>
                                <code class="coord-value">/tp ${settlement.coordinates.x} ${settlement.coordinates.y} ${settlement.coordinates.z}</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-footer">
                <button class="visit-btn" data-coords="${settlement.coordinates.x},${settlement.coordinates.y},${settlement.coordinates.z}">
                    🎮 Телепортироваться
                </button>
                <button class="waypoint-btn" data-settlement="${settlement.name}" data-coords="${settlement.coordinates.x},${settlement.coordinates.z}">
                    📍 Создать точку пути
                </button>
                <button class="share-btn" data-settlement="${settlement.name}">
                    📤 Поделиться
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);

    // Обработчики кнопок
    modal.querySelector('.visit-btn').addEventListener('click', () => {
        showVisitInstructions(settlement);
    });

    modal.querySelector('.waypoint-btn').addEventListener('click', () => {
        createWaypoint(settlement);
    });

    modal.querySelector('.share-btn').addEventListener('click', () => {
        shareSettlement(settlement);
    });

    modal.querySelector('.view-leader-profile').addEventListener('click', () => {
        showLeaderProfile(settlement.leader);
    });

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Инициализация карты мира
function initWorldMap() {
    console.log('Инициализация карты мира...');
}

// Обновление карты мира с поселениями
function updateWorldMap(settlements) {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) {
        console.warn('Контейнер карты не найден');
        return;
    }

    // Очищаем старые точки
    const oldPoints = mapContainer.querySelectorAll('.map-point');
    oldPoints.forEach(point => point.remove());

    // Добавляем новые точки поселений
    settlements.forEach(settlement => {
        const point = document.createElement('div');
        point.className = `map-point ${settlement.race}`;
        point.setAttribute('data-settlement', settlement.name);
        point.setAttribute('data-settlement-id', settlement.id);
        point.setAttribute('title', `${settlement.name}\n👑 ${settlement.leader}\n👥 ${settlement.population} жителей`);
        
        // Позиционируем точку на карте
        const pos = settlement.mapPosition || calculateMapPosition(settlement.coordinates);
        point.style.left = `${pos.x}%`;
        point.style.top = `${pos.y}%`;
        
        point.innerHTML = `
            <div class="point-pulse"></div>
            <div class="point-glow"></div>
        `;

        // Обработчики событий для точки
        point.addEventListener('click', (e) => {
            e.stopPropagation();
            showSettlementDetails(settlement);
        });

        point.addEventListener('mouseenter', function(e) {
            showMapTooltip(settlement, this);
        });

        point.addEventListener('mouseleave', function() {
            hideMapTooltip();
        });

        mapContainer.appendChild(point);
    });
}

// Показ подсказки на карте
function showMapTooltip(settlement, pointElement) {
    let tooltip = document.querySelector('.map-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'map-tooltip';
        document.body.appendChild(tooltip);
    }

    const rect = pointElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <strong>${settlement.name}</strong>
            <span>${getRaceIcon(settlement.race)} ${getRaceName(settlement.race)}</span>
            <span>👑 ${settlement.leader}</span>
            <span>👥 ${settlement.population} жителей</span>
            <span>📍 ${settlement.location}</span>
            <span>⭐ Уровень ${settlement.level}</span>
        </div>
    `;
    
    // Позиционируем подсказку рядом с точкой
    const tooltipWidth = 200;
    const tooltipHeight = 150;
    
    let left = rect.left + scrollLeft + (rect.width / 2);
    let top = rect.top + scrollTop - tooltipHeight - 10;
    
    // Проверяем, чтобы подсказка не выходила за границы экрана
    if (left - tooltipWidth / 2 < 10) {
        left = tooltipWidth / 2 + 10;
    }
    if (left + tooltipWidth / 2 > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth / 2 - 10;
    }
    if (top < 10) {
        top = rect.bottom + scrollTop + 10;
    }
    
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.transform = 'translateX(-50%)';
    tooltip.classList.add('visible');
}

// Скрытие подсказки
function hideMapTooltip() {
    const tooltip = document.querySelector('.map-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

// Расчет позиции на карте по координатам Minecraft
function calculateMapPosition(coords) {
    // Настройте эти значения под размеры вашей карты
    const mapSizeX = 5000; // Размер мира по X
    const mapSizeZ = 5000; // Размер мира по Z
    
    // Преобразуем координаты Minecraft в проценты для позиционирования
    const x = ((coords.x + mapSizeX/2) / mapSizeX) * 100;
    const z = ((coords.z + mapSizeZ/2) / mapSizeZ) * 100;
    
    return {
        x: Math.max(2, Math.min(98, x)),
        y: Math.max(2, Math.min(98, z))
    };
}

// Инициализация интерактивной карты
function initMapInteractions() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;

    // Добавляем возможность масштабирования
    let scale = 1;
    const minScale = 0.5;
    const maxScale = 3;
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    mapContainer.style.cursor = 'grab';
    mapContainer.style.overflow = 'hidden';

    // Масштабирование колесиком мыши
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = -e.deltaY * 0.01;
        const oldScale = scale;
        scale = Math.min(maxScale, Math.max(minScale, scale + delta));
        
        // Сохраняем позицию под курсором
        const rect = mapContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / oldScale;
        const y = (e.clientY - rect.top) / oldScale;
        
        mapContainer.style.transform = `scale(${scale})`;
        
        // Корректируем позицию после масштабирования
        const newX = x * scale;
        const newY = y * scale;
        
        // Здесь можно добавить логику для скролла, если нужно
    });

    // Перетаскивание карты
    mapContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        mapContainer.style.cursor = 'grabbing';
        startX = e.pageX - mapContainer.offsetLeft;
        startY = e.pageY - mapContainer.offsetTop;
        scrollLeft = mapContainer.scrollLeft;
        scrollTop = mapContainer.scrollTop;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        mapContainer.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - mapContainer.offsetLeft;
        const y = e.pageY - mapContainer.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        mapContainer.scrollLeft = scrollLeft - walkX;
        mapContainer.scrollTop = scrollTop - walkY;
    });
}

// Инициализация фильтров
function initSettlementsFilter() {
    // Будет реализовано позже
    console.log('Инициализация фильтров поселений...');
}

// Вспомогательные функции
function getWarStatusInfo(status) {
    const statuses = {
        'peace': { text: 'Мир', class: 'peace', icon: '🕊️' },
        'defensive': { text: 'Оборона', class: 'defensive', icon: '🛡️' },
        'aggressive': { text: 'Агрессия', class: 'aggressive', icon: '⚔️' },
        'neutral': { text: 'Нейтралитет', class: 'neutral', icon: '⚖️' }
    };
    return statuses[status] || statuses['neutral'];
}

function getRaceName(race) {
    const races = {
        'hell': 'Ангел',
        'heaven': 'Демон', 
        'earth': 'Земной',
        'glhell': '◈ Ангел',
        'glheaven': '◈ Демон', 
        'glearth': '◈ Земной',
    };
    return races[race] || 'Неизвестно';
}

function getBiomeFromLocation(location) {
    const biomes = {
        'Нижний мир': '🔥 Незер',
        'Энд': '✨ Энд',
        'Джунгли': '🌿 Джунгли',
        'Ледяные пики': '❄️ Ледяные пики',
        'Горы': '⛰️ Горы',
        'Подземелье': '🕳️ Подземелье'
    };
    return biomes[location] || '🌍 Неизвестно';
}

function calculateSettlementAge(establishedDate) {
    const established = new Date(establishedDate);
    const now = new Date();
    const diffTime = Math.abs(now - established);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return '🆕 Новое';
    if (diffDays < 90) return '📈 Развивающееся';
    if (diffDays < 180) return '🏛️ Устоявшееся';
    return '🏰 Древнее';
}

function getFeatureDescription(feature) {
    const descriptions = {
        'Лавовые водопады': 'Декоративные и защитные сооружения',
        'Обсидиановые стены': 'Прочная защита от мобов',
        'Незеритовые рудники': 'Добыча редких ресурсов',
        'Портал в Оверворлд': 'Быстрое перемещение между мирами',
        'Парящие острова': 'Уникальная архитектура в небе',
        'Библиотека заклинаний': 'Исследование магии и заклинаний',
        'Автоматические фермы': 'Эффективное производство ресурсов',
        'Торговая площадь': 'Центр экономической активности',
        'Сады хоруса': 'Выращивание элитных ресурсов',
        'Обсерватория': 'Изучение звезд и планет'
    };
    return descriptions[feature] || 'Особенность поселения';
}

function getResidentAvatar(residentName) {
    // В реальном проекте здесь будет аватар из данных игроков
    return '👤';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function showLoadingState() {
    const grid = document.getElementById('settlementsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Загрузка поселений...</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    // Убирается автоматически при рендере
}

function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

// Функции для кнопок действий
function showVisitInstructions(settlement) {
    const command = `/tp ${settlement.coordinates.x} ${settlement.coordinates.y} ${settlement.coordinates.z}`;
    
    const notification = document.createElement('div');
    notification.className = 'visit-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>🎮 Телепортация в ${settlement.name}</h4>
            <p>Скопируйте команду ниже и вставьте в чат Minecraft:</p>
            <pre>${command}</pre>
            <div class="notification-buttons">
                <button class="copy-coords-btn">📋 Скопировать команду</button>
                <button class="close-notification">Закрыть</button>
            </div>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('active'), 10);

    notification.querySelector('.copy-coords-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(command).then(() => {
            showToast('✅ Команда скопирована в буфер обмена!');
        });
    });

    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    });
}

function createWaypoint(settlement) {
    const waypointData = {
        name: settlement.name,
        x: settlement.coordinates.x,
        z: settlement.coordinates.z,
        color: getRaceColor(settlement.race)
    };

    const waypointText = JSON.stringify(waypointData, null, 2);
    
    navigator.clipboard.writeText(waypointText).then(() => {
        showToast(`✅ Точка пути "${settlement.name}" скопирована!`);
    });
}

function shareSettlement(settlement) {
    const shareText = `🏰 ${settlement.name} - ${settlement.description}\n📍 Координаты: ${settlement.coordinates.x} ${settlement.coordinates.y} ${settlement.coordinates.z}\n👑 Лидер: ${settlement.leader}`;
    
    navigator.clipboard.writeText(shareText).then(() => {
        showToast('✅ Информация о поселении скопирована!');
    });
}

function showLeaderProfile(leaderName) {
    showToast(`👑 Информация о лидере: ${leaderName}`);
}

function getRaceColor(race) {
    const colors = {
        'hell': '#ff4444',
        'heaven': '#4fc3f7', 
        'earth': '#8bc34a'
    };
    return colors[race] || '#7e57c2';
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Загрузка демо данных при ошибке
function loadDemoSettlementsData() {
    console.log('Загрузка демо данных...');
    const demoSettlements = [
        {
            id: 1,
            name: "Демо Поселение",
            image: "assets/images/settlements/default.png",
            leader: "Demo_Leader",
            deputy: "Demo_Deputy",
            race: "earth",
            description: "Демонстрационное поселение для тестирования",
            population: 10,
            residents: ["Demo_Leader", "Demo_Deputy"],
            coordinates: { x: 0, y: 64, z: 0 },
            war_status: "peace",
            established: "2023-01-01",
            level: 3,
            features: ["Базовая инфраструктура", "Фермы"],
            location: "Равнины"
        }
    ];
    renderSettlementsGrid(demoSettlements);
    updateSettlementsStats(demoSettlements);
    updateWorldMap(demoSettlements);
}

// Продолжение settlements.js - добавление фильтров и улучшение функционала

// Инициализация фильтров поселений
function initSettlementsFilter() {
    console.log('Инициализация фильтров поселений...');
    
    // Создаем контейнер для фильтров
    const filterContainer = document.createElement('div');
    filterContainer.className = 'settlements-filter';
    filterContainer.innerHTML = `
        <div class="filter-controls">
            <input type="text" class="settlements-search" placeholder="🔍 Поиск поселения..." id="settlementsSearch">
            
            <div class="filter-buttons">
                <button class="settlement-filter-btn active" data-filter="all">
                    <span class="filter-icon">🌟</span>
                    ВСЕ
                </button>
                <button class="settlement-filter-btn" data-filter="hell">
                    <span class="filter-icon">🔥</span>
                    АДСКИЕ
                </button>
                <button class="settlement-filter-btn" data-filter="heaven">
                    <span class="filter-icon">👼</span>
                    РАЙСКИЕ
                </button>
                <button class="settlement-filter-btn" data-filter="earth">
                    <span class="filter-icon">🌍</span>
                    ЗЕМНЫЕ
                </button>
            </div>
        </div>
        
        <div class="advanced-filters">
            <div class="filter-group">
                <label>👥 Население:</label>
                <select class="population-filter">
                    <option value="all">Все</option>
                    <option value="small">Малые (1-10)</option>
                    <option value="medium">Средние (11-25)</option>
                    <option value="large">Крупные (26+)</option>
                </select>
            </div>
            <div class="filter-group">
                <label>⭐ Уровень:</label>
                <select class="level-filter">
                    <option value="all">Все</option>
                    <option value="1-2">⭐-⭐⭐</option>
                    <option value="3-4">⭐⭐⭐-⭐⭐⭐⭐</option>
                    <option value="5">⭐⭐⭐⭐⭐</option>
                </select>
            </div>
            <div class="filter-group">
                <label>🛡️ Статус войны:</label>
                <select class="war-filter">
                    <option value="all">Все</option>
                    <option value="peace">🕊️ Мир</option>
                    <option value="defensive">🛡️ Оборона</option>
                    <option value="aggressive">⚔️ Агрессия</option>
                    <option value="neutral">⚖️ Нейтралитет</option>
                </select>
            </div>
        </div>
    `;

    // Вставляем фильтры перед сеткой поселений
    const grid = document.getElementById('settlementsGrid');
    if (grid && grid.parentNode) {
        grid.parentNode.insertBefore(filterContainer, grid);
    }

    // Инициализация обработчиков фильтров
    initFilterHandlers();
}

// Инициализация обработчиков фильтров
function initFilterHandlers() {
    // Кнопки фильтров по расе
    const filterButtons = document.querySelectorAll('.settlement-filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            applyFilters();
        });
    });

    // Поиск
    const searchInput = document.querySelector('.settlements-search');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            applyFilters();
        });
    }

    // Расширенные фильтры
    const advancedFilters = document.querySelectorAll('.advanced-filters select');
    advancedFilters.forEach(select => {
        select.addEventListener('change', () => {
            applyFilters();
        });
    });
}

// Применение всех фильтров
function applyFilters() {
    const activeRaceFilter = document.querySelector('.settlement-filter-btn.active').getAttribute('data-filter');
    const searchTerm = document.querySelector('.settlements-search').value.toLowerCase();
    const populationFilter = document.querySelector('.population-filter').value;
    const levelFilter = document.querySelector('.level-filter').value;
    const warFilter = document.querySelector('.war-filter').value;

    const settlementCards = document.querySelectorAll('.settlement-card');
    
    settlementCards.forEach(card => {
        const race = card.getAttribute('data-race');
        const name = card.querySelector('.settlement-name').textContent.toLowerCase();
        const leader = card.querySelector('.leader-name').textContent.toLowerCase();
        const location = card.querySelector('.location-text').textContent.toLowerCase();
        const population = parseInt(card.querySelector('.population-badge').textContent.match(/\d+/)[0]);
        const level = parseInt(card.querySelector('.level-badge').textContent.match(/\d+/)[0]);
        const warStatus = card.querySelector('.war-status-badge').textContent.toLowerCase();

        let show = true;

        // Фильтр по расе
        if (activeRaceFilter !== 'all' && race !== activeRaceFilter) {
            show = false;
        }

        // Поиск
        if (searchTerm && !name.includes(searchTerm) && !leader.includes(searchTerm) && !location.includes(searchTerm)) {
            show = false;
        }

        // Фильтр по населению
        if (populationFilter !== 'all') {
            if (populationFilter === 'small' && population > 10) show = false;
            if (populationFilter === 'medium' && (population <= 10 || population > 25)) show = false;
            if (populationFilter === 'large' && population <= 25) show = false;
        }

        // Фильтр по уровню
        if (levelFilter !== 'all') {
            if (levelFilter === '1-2' && level > 2) show = false;
            if (levelFilter === '3-4' && (level < 3 || level > 4)) show = false;
            if (levelFilter === '5' && level < 5) show = false;
        }

        // Фильтр по статусу войны
        if (warFilter !== 'all') {
            const statusMap = {
                'peace': 'мир',
                'defensive': 'оборона', 
                'aggressive': 'агрессия',
                'neutral': 'нейтралитет'
            };
            if (!warStatus.includes(statusMap[warFilter])) {
                show = false;
            }
        }

        // Применение фильтра
        if (show) {
            card.style.display = 'flex';
            setTimeout(() => card.classList.add('visible'), 50);
        } else {
            card.classList.remove('visible');
            setTimeout(() => card.style.display = 'none', 300);
        }
    });

    // Обновляем статистику после фильтрации
    updateFilteredStats();
}

// Обновление статистики для отфильтрованных данных
function updateFilteredStats() {
    const visibleCards = document.querySelectorAll('.settlement-card[style*="display: flex"]');
    const totalPopulation = Array.from(visibleCards).reduce((sum, card) => {
        return sum + parseInt(card.querySelector('.population-badge').textContent.match(/\d+/)[0]);
    }, 0);
    
    const activeProjects = Array.from(visibleCards).filter(card => {
        const level = parseInt(card.querySelector('.level-badge').textContent.match(/\d+/)[0]);
        return level >= 3;
    }).length;

    // Обновляем счетчики в реальном времени
    const statNumbers = document.querySelectorAll('.settlements-stats .stat-number');
    if (statNumbers[0]) statNumbers[0].textContent = visibleCards.length;
    if (statNumbers[1]) statNumbers[1].textContent = totalPopulation;
    if (statNumbers[2]) statNumbers[2].textContent = activeProjects;
}

// Улучшенная функция для точек пути с поддержкой разных модов
function createWaypoint(settlement) {
    const waypointData = {
        name: settlement.name.replace(/ /g, '_'),
        x: settlement.coordinates.x,
        y: settlement.coordinates.y,
        z: settlement.coordinates.z,
        color: getRaceColor(settlement.race),
        server: 'f27.joinserver.xyz:25835',
        created: new Date().toISOString()
    };

    // Форматы для разных модов
    const waypointFormats = {
        journeyMap: JSON.stringify(waypointData, null, 2),
        xaero: `${waypointData.name}:${waypointData.x}:${waypointData.y}:${waypointData.z}:${waypointData.color.replace('#', '')}:true:0`,
        voxelMap: `name:${waypointData.name},x:${waypointData.x},y:${waypointData.y},z:${waypointData.z},enabled:true,red:${hexToRgb(waypointData.color).r},green:${hexToRgb(waypointData.color).g},blue:${hexToRgb(waypointData.color).b}`
    };

    showWaypointInstructions(settlement, waypointFormats);
}

// Функция для преобразования HEX в RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 126, g: 87, b: 194 };
}

// Улучшенные инструкции для точек пути
function showWaypointInstructions(settlement, waypointFormats) {
    const instructions = `
🎮 Инструкции по установке точки пути:

Для JourneyMap:
1. Нажмите 'J' для открытия карты
2. Перейдите в раздел Waypoints
3. Нажмите "Import" и вставьте текст:
\`\`\`json
${waypointFormats.journeyMap}
\`\`\`

Для Xaero's Minimap:
1. Нажмите 'Y' для открытия waypoints
2. Нажмите "Import from clipboard"
3. Вставьте текст:
${waypointFormats.xaero}

Для VoxelMap:
1. Откройте карту (M)
2. Нажмите "Waypoints"
3. Импортируйте точку пути

Координаты: X: ${settlement.coordinates.x} Y: ${settlement.coordinates.y} Z: ${settlement.coordinates.z}
    `;

    const notification = document.createElement('div');
    notification.className = 'waypoint-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>📍 Точка пути "${settlement.name}"</h4>
            <div class="waypoint-format-selector">
                <button class="format-btn active" data-format="journeyMap">JourneyMap</button>
                <button class="format-btn" data-format="xaero">Xaero's Map</button>
                <button class="format-btn" data-format="voxelMap">VoxelMap</button>
            </div>
            <pre class="waypoint-code">${waypointFormats.journeyMap}</pre>
            <div class="notification-buttons">
                <button class="copy-waypoint-btn" data-text="${waypointFormats.journeyMap}">
                    📋 Скопировать
                </button>
                <button class="copy-coords-btn" data-coords="${settlement.coordinates.x},${settlement.coordinates.y},${settlement.coordinates.z}">
                    📍 Координаты
                </button>
                <button class="close-notification">Закрыть</button>
            </div>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('active'), 10);

    // Обработчики для выбора формата
    notification.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            notification.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const format = this.getAttribute('data-format');
            const codeElement = notification.querySelector('.waypoint-code');
            const copyBtn = notification.querySelector('.copy-waypoint-btn');
            
            codeElement.textContent = waypointFormats[format];
            copyBtn.setAttribute('data-text', waypointFormats[format]);
        });
    });

    // Копирование waypoint
    notification.querySelector('.copy-waypoint-btn').addEventListener('click', function() {
        const text = this.getAttribute('data-text');
        navigator.clipboard.writeText(text).then(() => {
            const originalText = this.textContent;
            this.textContent = '✅ Скопировано!';
            setTimeout(() => this.textContent = originalText, 2000);
        });
    });

    // Копирование координат
    notification.querySelector('.copy-coords-btn').addEventListener('click', function() {
        const coords = this.getAttribute('data-coords');
        navigator.clipboard.writeText(coords).then(() => {
            const originalText = this.textContent;
            this.textContent = '✅ Координаты!';
            setTimeout(() => this.textContent = originalText, 2000);
        });
    });

    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    });
}

// Улучшенная функция для лидера поселения
function showLeaderProfile(leaderName) {
    // В реальном проекте здесь будет связь с данными игроков
    const leaderInfo = {
        name: leaderName,
        race: getLeaderRace(leaderName),
        joinDate: "2023-01-15",
        achievements: ["Основатель поселения", "Мастер строительства", "Лидер сообщества"]
    };

    const notification = document.createElement('div');
    notification.className = 'leader-profile-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>👑 Профиль лидера</h4>
            <div class="leader-info">
                <div class="leader-avatar ${leaderInfo.race}">
                    <span class="avatar-icon">${getRaceIcon(leaderInfo.race)}</span>
                </div>
                <div class="leader-details">
                    <h5>${leaderInfo.name}</h5>
                    <p>Раса: ${getRaceName(leaderInfo.race)}</p>
                    <p>На сервере с: ${formatDate(leaderInfo.joinDate)}</p>
                </div>
            </div>
            <div class="leader-achievements">
                <h5>🏆 Достижения:</h5>
                <ul>
                    ${leaderInfo.achievements.map(ach => `<li>${ach}</li>`).join('')}
                </ul>
            </div>
            <button class="close-notification">Закрыть</button>
        </div>
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('active'), 10);

    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 300);
    });
}

// Вспомогательные функции для лидеров
function getLeaderRace(leaderName) {
    // В реальном проекте это будет из данных игроков
    const raceMap = {
        '_kot_baris_': 'glhell',
        'stalker_hunter_': 'glheaven',
        'amidamaru3434': 'glearth',
        'darcklord': 'hell',
        'ddanilkaaaa': 'heaven',
        'deace': 'earth',
        'hyutjnh': 'hell',
        'jdh16': 'heaven',
        'maxxaumka': 'earth',
        'nicotine': 'hell',
        'pandamom': 'heaven',
        'snekky_offc': 'earth',
    };
    return raceMap[leaderName] || 'earth';
}

function getRaceIcon(race) {
    const icons = {
        'hell': '🔥',
        'heaven': '👼',
        'earth': '🌍',
        'glhell': '🔥',
        'glheaven': '👼',
        'glearth': '🌍'
    };
    return icons[race] || '👤';
}

// Экспорт функций для глобального использования
window.SettlementsApp = {
    loadSettlementsData,
    showSettlementDetails,
    applyFilters,
    updateSettlementsStats,
    createWaypoint,
    shareSettlement,
    showLeaderProfile
};

// Инициализация при загрузке
console.log('Settlements module loaded');