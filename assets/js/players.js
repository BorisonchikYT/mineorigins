// Скрипт для страницы игроков с данными из JSON
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем страницу игроков');
    initPlayersPage();
    initPlayersFilter();
    initPlayersStats();
    loadPlayersData();
    initRealTimePlayerCount();
    initOnlineStatusSystem();
});

// Инициализация страницы игроков
function initPlayersPage() {
    console.log('Страница игроков инициализирована');
}

// Инициализация системы онлайн статуса
function initOnlineStatusSystem() {
    console.log('🔄 Инициализация системы онлайн статуса...');
    
    // Загружаем текущий онлайн статус
    updateOnlineStatusForAllPlayers();
    
    // Обновляем статус каждые 30 секунд
    setInterval(updateOnlineStatusForAllPlayers, 30000);
}

// Получение информации о сервере и количестве онлайн игроков
async function getServerStatus() {
    try {
        console.log('🔄 Получение статуса сервера...');
        
        const SERVER_CONFIG = {
            apiEndpoints: {
                status: 'https://api.mcsrvstat.us/3/95.216.92.76:25835',
                ping: 'https://api.mcsrvstat.us/debug/ping/95.216.92.76:25835',
                backup: 'https://api.mcsrvstat.us/2/95.216.92.76:25835'
            }
        };

        // Пробуем основное API версии 3
        let response = await fetch(SERVER_CONFIG.apiEndpoints.status, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        console.log('✅ Данные сервера получены (v3):', data);

        // Если сервер онлайн, возвращаем данные
        if (data.online) {
            return {
                online: true,
                players: {
                    online: data.players?.online || 0,
                    max: data.players?.max || 25,
                    list: data.players?.list || []
                },
                version: data.version,
                motd: data.motd
            };
        } else {
            throw new Error('Сервер оффлайн');
        }

    } catch (error) {
        console.error('❌ Ошибка получения статуса (v3):', error);
        
        // Пробуем резервное API версии 2
        try {
            console.log('🔄 Пробуем резервное API v2...');
            const response = await fetch(SERVER_CONFIG.apiEndpoints.backup);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Данные сервера получены (v2):', data);

            if (data.online) {
                return {
                    online: true,
                    players: {
                        online: data.players?.online || 0,
                        max: data.players?.max || 25,
                        list: data.players?.list || []
                    },
                    version: data.version,
                    motd: data.motd
                };
            } else {
                throw new Error('Сервер оффлайн (v2)');
            }
        } catch (error2) {
            console.error('❌ Ошибка получения статуса (v2):', error2);
            
            // Возвращаем оффлайн статус
            return {
                online: false,
                players: {
                    online: 0,
                    max: 25,
                    list: []
                },
                version: 'Неизвестно',
                motd: null
            };
        }
    }
}

// Получение списка онлайн игроков с сервера
async function getOnlinePlayers() {
    try {
        const serverStatus = await getServerStatus();
        
        if (!serverStatus.online) {
            console.log('❌ Сервер оффлайн');
            return [];
        }

        console.log(`📊 Онлайн игроков: ${serverStatus.players.online}/${serverStatus.players.max}`);
        
        // Если есть список игроков, возвращаем его
        if (serverStatus.players.list && serverStatus.players.list.length > 0) {
            const onlinePlayers = serverStatus.players.list.map(player => player.toLowerCase().trim());
            console.log('👥 Список онлайн игроков:', onlinePlayers);
            return onlinePlayers;
        } else {
            // Если список недоступен, но сервер онлайн
            console.log('📋 Список игроков недоступен, но сервер онлайн');
            return []; // Возвращаем пустой массив, так как имена игроков неизвестны
        }

    } catch (error) {
        console.error('❌ Ошибка получения списка игроков:', error);
        return [];
    }
}

// Получение количества онлайн игроков
async function getOnlinePlayersCount() {
    try {
        const serverStatus = await getServerStatus();
        return serverStatus.online ? serverStatus.players.online : 0;
    } catch (error) {
        console.error('❌ Ошибка получения количества игроков:', error);
        return 0;
    }
}

// Обновление онлайн статуса для всех игроков
async function updateOnlineStatusForAllPlayers() {
    try {
        console.log('🔄 Обновление онлайн статусов...');
        
        const onlinePlayers = await getOnlinePlayers();
        const onlineCount = await getOnlinePlayersCount();
        
        console.log(`📊 Онлайн игроков: ${onlineCount}`, onlinePlayers);
        
        // Обновляем статусы на карточках игроков
        updatePlayerCardsStatus(onlinePlayers);
        
        // Обновляем статусы в модальных окнах если они открыты
        updateModalStatuses(onlinePlayers);
        
        // Обновляем счетчик онлайн игроков
        updateOnlineCounter(onlineCount);
        
        // Показываем уведомление об обновлении
        showStatusUpdateNotification(onlineCount);
        
    } catch (error) {
        console.error('❌ Ошибка обновления статусов:', error);
    }
}

// Обновление счетчика онлайн игроков
function updateOnlineCounter(onlineCount) {
    // Обновляем в статистике
    const onlineStatElement = document.querySelector('.player-count');
    if (onlineStatElement) {
        onlineStatElement.textContent = onlineCount;
    }
    
    // Обновляем в заголовке если есть
    const titleElement = document.querySelector('.online-players-count');
    if (titleElement) {
        titleElement.textContent = onlineCount;
    }
}

// Обновление статусов на карточках игроков
function updatePlayerCardsStatus(onlinePlayers) {
    const playerCards = document.querySelectorAll('.player-card');
    let onlineDetected = 0;
    
    playerCards.forEach(card => {
        const playerNameElement = card.querySelector('.player-name');
        if (!playerNameElement) return;
        
        const playerName = playerNameElement.textContent.toLowerCase().trim();
        const isOnline = onlinePlayers.includes(playerName);
        
        if (isOnline) onlineDetected++;
        
        updateCardStatus(card, isOnline);
    });
    
    console.log(`🎯 Обновлено статусов: ${onlineDetected} онлайн из ${playerCards.length} карточек`);
}

// Обновление статуса на карточке игрока
function updateCardStatus(card, isOnline) {
    // Удаляем предыдущие статусы
    card.classList.remove('player-online', 'player-offline');
    
    // Добавляем соответствующий класс
    card.classList.add(isOnline ? 'player-online' : 'player-offline');
    
    // Обновляем индикатор статуса
    let statusIndicator = card.querySelector('.player-status-indicator');
    if (!statusIndicator) {
        statusIndicator = document.createElement('div');
        statusIndicator.className = 'player-status-indicator';
        const header = card.querySelector('.player-header');
        if (header) {
            header.prepend(statusIndicator);
        }
    }
    
    statusIndicator.className = `player-status-indicator ${isOnline ? 'online' : 'offline'}`;
    statusIndicator.title = isOnline ? 'Сейчас в игре' : 'Не в сети';
    
    // Обновляем текст статуса если есть
    const statusText = card.querySelector('.player-status-text');
    if (statusText) {
        statusText.textContent = isOnline ? 'В игре' : 'Не в сети';
        statusText.className = `player-status-text ${isOnline ? 'online' : 'offline'}`;
    }
}

// Обновление статусов в модальных окнах
function updateModalStatuses(onlinePlayers) {
    const modals = document.querySelectorAll('.player-modal');
    
    modals.forEach(modal => {
        const playerNameElement = modal.querySelector('.player-info h2');
        if (!playerNameElement) return;
        
        const playerName = playerNameElement.textContent.toLowerCase().trim();
        const isOnline = onlinePlayers.includes(playerName);
        
        updateModalStatus(modal, isOnline);
    });
}

// Обновление статуса в модальном окне
function updateModalStatus(modal, isOnline) {
    let statusBadge = modal.querySelector('.player-online-status');
    
    if (!statusBadge) {
        statusBadge = document.createElement('div');
        statusBadge.className = 'player-online-status';
        const playerInfo = modal.querySelector('.player-info');
        if (playerInfo) {
            playerInfo.appendChild(statusBadge);
        }
    }
    
    statusBadge.className = `player-online-status ${isOnline ? 'online' : 'offline'}`;
    statusBadge.innerHTML = `
        <span class="status-dot"></span>
        <span class="status-text">${isOnline ? 'Сейчас в игре' : 'Не в сети'}</span>
    `;
}

// Показ уведомления об обновлении статуса
function showStatusUpdateNotification(onlineCount) {
    // Удаляем предыдущее уведомление если есть
    const existingNotification = document.querySelector('.status-update-content');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'status-update-content';
    notification.innerHTML = `
        <div class="status-update-glow"></div>
        <div class="status-update-icon">🔄</div>
        <div class="status-update-text">
            <strong>Статус обновлен</strong>
            <span>Сейчас играет: ${onlineCount} игроков</span>
        </div>
        <button class="status-update-close">×</button>
        <div class="status-update-progress">
            <div class="progress-fill"></div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматическое скрытие через 5 секунд
    const autoHideTimeout = setTimeout(() => {
        hideStatusNotification(notification);
    }, 5000);
    
    // Закрытие по клику
    const closeBtn = notification.querySelector('.status-update-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHideTimeout);
        hideStatusNotification(notification);
    });
}

// Скрытие уведомления статуса
function hideStatusNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 600);
}

// Обновление статуса в модальном окне игрока
async function updatePlayerModalStatus(modal, playerName) {
    try {
        const onlinePlayers = await getOnlinePlayers();
        const isOnline = onlinePlayers.includes(playerName.toLowerCase());
        
        const statusElement = modal.querySelector('.online-status-value');
        const onlineStatus = modal.querySelector('.player-online-status');
        
        if (statusElement) {
            statusElement.textContent = isOnline ? 'В сети' : 'Не в сети';
            statusElement.className = `online-status-value ${isOnline ? 'online' : 'offline'}`;
        }
        
        if (onlineStatus) {
            onlineStatus.className = `player-online-status ${isOnline ? 'online' : 'offline'}`;
            onlineStatus.innerHTML = `
                <span class="status-dot"></span>
                <span class="status-text">${isOnline ? 'Сейчас в игре' : 'Не в сети'}</span>
            `;
        }
    } catch (error) {
        console.error('Ошибка обновления статуса в модальном окне:', error);
    }
}

// Реальная статистика онлайна
async function initRealTimePlayerCount() {
    try {
        const onlineCount = await getOnlinePlayersCount();
        updateOnlineCounter(onlineCount);
        
        // Обновляем каждые 30 секунд
        setInterval(async () => {
            const count = await getOnlinePlayersCount();
            updateOnlineCounter(count);
        }, 30000);
        
    } catch (error) {
        console.error('Ошибка загрузки онлайна:', error);
        // Используем случайное число как fallback
        const fallbackCount = Math.floor(Math.random() * 10) + 1;
        updateOnlineCounter(fallbackCount);
    }
}

// Получение данных игроков из JSON файла
async function fetchPlayersData() {
    try {
        console.log('Пытаемся загрузить players.json...');
        
        // Для локального режима используем встроенные данные
        if (window.location.protocol === 'file:') {
            console.log('📁 Локальный режим: используем встроенные данные игроков');
            return getLocalPlayersData();
        }
        
        // Для веб-сервера загружаем JSON
        const response = await fetch('assets/json/players.json');
        console.log('Ответ сервера:', response);
        
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('JSON данные получены:', data);
        
        if (!data.players || !Array.isArray(data.players)) {
            throw new Error('Некорректная структура JSON: отсутствует массив players');
        }
        
        console.log(`Загружено ${data.players.length} игроков`);
        return data.players;
        
    } catch (error) {
        console.error('Ошибка загрузки JSON:', error);
        throw error;
    }
}

// Отображение сетки игроков
function renderPlayersGrid(players) {
    const grid = document.getElementById('playersGrid');
    if (!grid) {
        console.error('Элемент playersGrid не найден!');
        return;
    }

    // console.log(`Рендерим ${players.length} игроков`);
    grid.innerHTML = '';

    if (players.length === 0) {
        grid.innerHTML = `
            <div class="no-players-message">
                <h3>Игроки не найдены</h3>
                <p>Если не исправится, сообщите разработчику</p>
            </div>
        `;
        return;
    }

    players.forEach((player, index) => {
        // console.log(`Создаем карточку для игрока: ${player.name}`);
        const playerCard = createPlayerCard(player);
        grid.appendChild(playerCard);
        
        // Анимация появления с задержкой
        setTimeout(() => {
            playerCard.classList.add('visible');
        }, index * 100);
    });
}

// Загрузка данных игроков из JSON
async function loadPlayersData() {
    try {
        console.log('Начинаем загрузку данных игроков...');
        showLoadingState();
        const playersData = await fetchPlayersData();
        console.log('Данные успешно загружены:', playersData);
        renderPlayersGrid(playersData);
        updatePlayersStats(playersData);
        hideLoadingState();
        
        // После загрузки данных обновляем онлайн статус
        setTimeout(() => {
            updateOnlineStatusForAllPlayers();
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка загрузки данных игроков:', error);
        console.log('Пробуем загрузить демо данные...');
        loadDemoPlayersData();
    }
}

// Создание карточки игрока
function createPlayerCard(player) {
    // console.log(`Создание карточки для ${player.name}`, player);
    
    const card = document.createElement('div');
    card.className = `player-card ${player.race}-race`;
    card.setAttribute('data-race', player.race);
    card.setAttribute('data-player-id', player.id);
    card.setAttribute('data-player-name', player.name.toLowerCase());
    
    // Форматируем социальные сети
    const socials = player.socials || {};
    const hasSocials = Object.keys(socials).length > 0;
    
    // Проверяем наличие аватара
    const avatarPath = player.avatar || 'assets/icons/players/default.png';
    // console.log(`Аватар для ${player.name}: ${avatarPath}`);
    
    card.innerHTML = `
        <div class="player-header">
            <div class="player-avatar ${player.race}">
                <img src="${avatarPath}" alt="${player.name}" class="avatar-image" 
                     onerror="console.error('Ошибка загрузки аватара для ${player.name}'); this.src='assets/icons/players/default.png'">
            </div>
            <div class="player-main-info">
                <h3 class="player-name">${player.name}</h3>
                <div class="player-meta">
                    <span class="player-race-badge race-${player.race}">${getRaceName(player.race)}</span>
                </div>
            </div>
        </div>
        <div class="player-description">
            <p>${player.description || 'Описание отсутствует'}</p>
        </div>
        ${hasSocials ? `
        <div class="player-contacts">
            ${socials.discord ? `<a href="https://discord.gg/yvjewMujcx" class="contact-link discord" title="Discord"><img src="assets/images/icons/icon_discord.gif" alt="" class="contact-icon"> ${socials.discord}</a>` : ''}
            ${socials.telegram ? `<a href="https://t.me/mine_origins" class="contact-link telegram" title="Telegram"><img src="assets/images/icons/icon_telegram.gif" alt="" class="contact-icon"> ${socials.telegram}</a>` : ''}
        </div>
        ` : '<div class="player-contacts"><span class="no-contacts">Нет контактов</span></div>'}
        <div class="player-footer">
            <span class="join-date">С нами с ${formatDate(player.joinDate)}</span>
            <button class="profile-btn" data-player-id="${player.id}">Профиль</button>
        </div>
    `;

    // Обработчики событий
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.contact-link') && !e.target.closest('.profile-btn')) {
            showPlayerProfile(player);
        }
    });

    const profileBtn = card.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPlayerProfile(player);
        });
    }

    // Обработчики для контактных ссылок
    card.querySelectorAll('.contact-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const contactType = link.classList[1];
            const contactInfo = link.textContent.replace(/[🎮✈️]/g, '').trim();
            showContactInfo(contactType, contactInfo);
        });
    });

    return card;
}

// Показ профиля игрока
function showPlayerProfile(player) {
    const socials = player.socials || {};
    
    const modal = document.createElement('div');
    modal.className = 'player-modal';
    modal.innerHTML = `
        <div class="modal-content ${player.race}-theme">
            <div class="modal-header">
                <div class="player-avatar-large ${player.race}">
                    <img src="${player.avatar}" alt="${player.name}" class="avatar-image-large"
                         onerror="this.src='assets/icons/players/default.png'">
                </div>
                <div class="player-info">
                    <h2>${player.name}</h2>
                    <span class="player-race-badge">${getRaceName(player.race)}</span>
                </div>
                <button class="modal-close">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="player-stats-detailed">
                    <div class="stat-item">
                        <span class="stat-label">Присоединился</span>
                        <span class="stat-value">${formatDate(player.joinDate)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Раса</span>
                        <span class="stat-value">${getRaceName(player.race)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Статус</span>
                        <span class="stat-value online-status-value">Загрузка...</span>
                    </div>
                </div>
                <div class="player-description-detailed">
                    <h4>О себе</h4>
                    <p>${player.description}</p>
                </div>
                ${Object.keys(socials).length > 0 ? `
                <div class="player-contacts-detailed">
                    <h4>Контакты</h4>
                    <div class="contacts-list">
                        ${socials.discord ? `
                            <div class="contact-item discord">
                                <span class="contact-icon"><img src="assets/images/icons/icon_discord.gif" alt="" class="contact-icon"></span>
                                <div class="contact-info">
                                    <strong>Discord</strong>
                                    <span>${socials.discord}</span>
                                </div>
                                <button class="copy-contact" data-text="${socials.discord}">
                                    <img src="assets/images/icons/Copy_gifzada.png" alt="Копировать" class="contact-icon">
                                </button>
                            </div>
                        ` : ''}
                        ${socials.telegram ? `
                            <div class="contact-item telegram">
                                <span class="contact-icon"><img src="assets/images/icons/icon_telegram.gif" alt="" class="contact-icon"></span>
                                <div class="contact-info">
                                    <strong>Telegram</strong>
                                    <span>${socials.telegram}</span>
                                </div>
                                <a href="https://t.me/${socials.telegram.replace('@', '')}" class="contact-link-btn" target="_blank">
                                    <img src="assets/images/icons/copy_link.png" alt="Перейти" class="contact-icon">
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>
                ` : '<div class="no-contacts-detailed"><p>Контакты не указаны</p></div>'}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Анимация появления
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);

    // Обновляем онлайн статус для этого игрока
    updatePlayerModalStatus(modal, player.name);

    // Обработчики для модального окна
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Обработчики копирования контактов
    modal.querySelectorAll('.copy-contact').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const text = e.target.closest('.copy-contact').getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
                showPremiumNotification('Discord', text);
            }).catch(err => {
                console.error('Ошибка копирования:', err);
                showPremiumNotification('Discord', text, true);
            });
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Обновление статуса в модальном окне игрока
async function updatePlayerModalStatus(modal, playerName) {
    try {
        const onlinePlayers = await getOnlinePlayers();
        const isOnline = onlinePlayers.includes(playerName.toLowerCase());
        
        const statusElement = modal.querySelector('.online-status-value');
        const onlineStatus = modal.querySelector('.player-online-status');
        
        if (statusElement) {
            statusElement.textContent = isOnline ? 'Скоро' : 'Скоро';
            statusElement.className = `online-status-value ${isOnline ? 'online' : 'offline'}`;
            // В сети не в сети
        }
        
        if (onlineStatus) {
            onlineStatus.className = `player-online-status ${isOnline ? 'online' : 'offline'}`;
            onlineStatus.innerHTML = `
                <span class="status-dot"></span>
                <span class="status-text">СКОРО</span>
            `;
            // ${isOnline ? 'Сейчас в игре' : 'Не в сети'}
        }
    } catch (error) {
        console.error('Ошибка обновления статуса в модальном окне:', error);
    }
}

// Показ информации о контакте с премиальным уведомлением
function showContactInfo(type, info) {
    const contactNames = {
        discord: 'Discord',
        telegram: 'Telegram',
        tiktok: 'TikTok'
    };

    // Копируем в буфер обмена
    navigator.clipboard.writeText(info).then(() => {
        showPremiumNotification(contactNames[type], info);
    }).catch(err => {
        console.error('Ошибка копирования:', err);
        showPremiumNotification(contactNames[type], info, true);
    });
}

// Показ премиального уведомления
function showPremiumNotification(platform, info, isFallback = false) {
    // Удаляем предыдущее уведомление если есть
    const existingNotification = document.querySelector('.copy-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'copy-notification premium';
    
    const platformConfig = {
        discord: { icon: '<img src="assets/images/icons/icon_discord.gif" class="nav-image-index">', color: '#5865F2', glow: 'rgba(88, 101, 242, 0.3)' },
        telegram: { icon: '<img src="assets/images/icons/icon_telegram.gif" class="nav-image-index">', color: '#0088cc', glow: 'rgba(0, 136, 204, 0.3)' },
        tiktok: { icon: '', color: '#ff0050', glow: 'rgba(255, 0, 80, 0.3)' }
    };
    
    const config = platformConfig[platform.toLowerCase()] || { 
        icon: '📋', 
        color: 'var(--mc-accent)', 
        glow: 'rgba(126, 87, 194, 0.3)' 
    };

    notification.innerHTML = `
        <div class="notification-glow" style="background: ${config.glow}"></div>
        <div class="copy-notification-content">
            <div class="notification-header">
                <div class="notification-badge" style="background: ${config.color}">
                    <span class="notification-icon">${config.icon}</span>
                    <div class="notification-pulse"></div>
                </div>
                <div class="notification-title">
                    <span class="platform-name">${platform}</span>
                    <span class="notification-status">${isFallback ? 'Готово к копированию' : 'Успешно скопировано!'}</span>
                </div>
                <button class="notification-close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="notification-body">
                <div class="copied-content ${isFallback ? 'selectable' : ''}">
                    <span class="content-label">${isFallback ? 'Выделите текст ниже:' : 'Скопированный текст:'}</span>
                    <div class="content-text">${info}</div>
                </div>
                ${isFallback ? `
                <div class="notification-hint">
                    <span class="hint-icon">💡</span>
                    <span class="hint-text">Нажмите на текст чтобы выделить</span>
                </div>
                ` : ''}
            </div>
            <div class="notification-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="background: ${config.color}"></div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
        startProgressAnimation(notification);
    }, 10);

    // Автоматическое скрытие через 5 секунд
    const autoHide = setTimeout(() => {
        hidePremiumNotification(notification);
    }, 5000);

    // Закрытие по клику на кнопку
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoHide);
        hidePremiumNotification(notification);
    });

    // Закрытие по клику вне уведомления
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            clearTimeout(autoHide);
            hidePremiumNotification(notification);
        }
    });

    // Для fallback режима - выделяем текст при клике
    if (isFallback) {
        const textDiv = notification.querySelector('.content-text');
        textDiv.addEventListener('click', function() {
            const range = document.createRange();
            range.selectNodeContents(this);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Показываем подсказку о копировании
            const hint = notification.querySelector('.notification-hint');
            hint.innerHTML = '<span class="hint-icon">✅</span><span class="hint-text">Текст выделен! Используйте Ctrl+C</span>';
        });
    }
}

// Анимация прогресс-бара
function startProgressAnimation(notification) {
    const progressFill = notification.querySelector('.progress-fill');
    if (progressFill) {
        progressFill.style.width = '100%';
        progressFill.style.transition = 'width 5s linear';
    }
}

// Скрытие премиального уведомления
function hidePremiumNotification(notification) {
    notification.classList.remove('show');
    notification.classList.add('hide');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 500);
}

// Инициализация фильтров
function initPlayersFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('playersSearch');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterPlayers(filter);
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterPlayersBySearch(searchTerm);
        });
    }
}

// Фильтрация игроков по расе
function filterPlayers(filter) {
    const players = document.querySelectorAll('.player-card');
    
    players.forEach(player => {
        if (filter === 'all' || player.getAttribute('data-race') === filter) {
            player.style.display = 'flex';
        } else {
            player.style.display = 'none';
        }
    });
}

// Фильтрация игроков по поиску
function filterPlayersBySearch(searchTerm) {
    const players = document.querySelectorAll('.player-card');
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    
    players.forEach(player => {
        const playerName = player.querySelector('.player-name').textContent.toLowerCase();
        const playerRace = player.getAttribute('data-race');
        
        const matchesSearch = playerName.includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || playerRace === activeFilter;
        
        if (matchesSearch && matchesFilter) {
            player.style.display = 'flex';
        } else {
            player.style.display = 'none';
        }
    });
}

// Инициализация статистики
function initPlayersStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        animateCounter(stat, target, 2000);
    });
}


// Локальные данные игроков
function getLocalPlayersData() {
    return [
        {
            "id": 1,
            "name": "_Kot_Baris_",
            "avatar": "assets/images/icons/kotbaris.png",
            "race": "earth",
            "description": "◈ Земной\nКото-человек — лидер земной расы, создатель ФрикБургской Империи, хочет наладить мир между расами.",
            "joinDate": "2025-10-11",
            "socials": {
              "discord": "borisonchik_yt",
              "telegram": "@BorisonchikOfficial"
            }
          },
          {
            "id": 2,
            "name": "stalker_hunter_",
            "avatar": "assets/images/icons/stalker.png",
            "race": "hell",
            "description": "◈ Демон\nПадший Ангел — лидер адской расы, присутствует на сервере с открытия. Сохраняет нейтралитет между ФрикБургом и ВДНХ, наблюдает за порядком в аду и на поверхности.",
            "joinDate": "2025-10-11",
            "socials": {
              "discord": "stalker_hunter_",
              "telegram": "@Stalker_Hunter_s"
            }
          },
          {
            "id": 3,
            "name": "ED4MKM_AERO",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "heaven",
            "description": "◈ Золотой Ангельский Лис — лидер ангелов.\nЯвляется самым первым участником проекта (еще со временем Black Alpha). Сохраняет нейтралитет между всеми фракциями, наблюдает за порядком на сервере. Очень любит лис.",
            "joinDate": "2025-10-18",
            "socials": {
                "discord": "last_troid_0079",
                "telegram": "@ED4MKM_AERO"
            }
          },
          {
            "id": 4,
            "name": "amidamaru3434",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "heaven",
            "description": "Ангел Серафим — бывший лидер ангелов.\nБыл изгнан из высших ангелов.",
            "joinDate": "2025-10-14",
            "socials": {
              "discord": "bruhhhhsasa21",
              "telegram": "@aza_matsuto"
            }
          },
          {
            "id": 5,
            "name": "darcklord",
            "avatar": "assets/images/icons/darcklord.png",
            "race": "earth",
            "description": "Дворф — бывший воин который просто хочет спокойно жить но приключения зовут его\nЖивет в городе Фрикбург  и хочет накопить золотых чтобы построить лучшую харчевню где люди и нелюди смогли бы давать и брать задания просто отдыхать и снимать жилье а так же участвовать в рейдах на замки и быть наемниками,",
            "joinDate": "2025-10-11",
            "socials": {
              "discord": "bagriannik._33166",
              "telegram": ""
            }
          },
          {
            "id": 6,
            "name": "ddanilkaaaa",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "earth",
            "description": "Воин — Данилка который любит PvP сражения, заклятые враги:\n \"_Kot_Baris_\" и весь \"ФБ\"",
            "joinDate": "2025-10-13",
            "socials": {
                "discord": "ddanilkaaaa_83622",
                "telegram": "@Ddanilkaaaa"
            }
          },
          {
            "id": 7,
            "name": "deace",
            "avatar": "assets/images/icons/deace.png",
            "race": "heaven",
            "description": "Ангел гигачад — является экзорцистом среди всех ангелов. Истребляет нечестей, демонов и даже людей (если нужно будет)",
            "joinDate": "2025-10-25",
            "socials": {
                "discord": "winchikvpotoke_36739",
                "telegram": "@Zkrtssikit"
            }
          },
          {
            "id": 8,
            "name": "jdh16",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "earth",
            "description": "Человек — Отсутствует",
            "joinDate": "2025-10-22",
            "socials": {
                "discord": "frozen_flames1703",
                "telegram": "@Frozen2474"
            }
          },
          {
            "id": 9,
            "name": "maxxaumka",
            "avatar": "assets/images/icons/maksimka.png",
            "race": "earth",
            "description": "Волшебник — С самого начала активен на сервере. Он нейтрален ко всем расам и кланам и не состоит ни в одном клане. Живёт в кубе вместе с пользователем snekky_off, с которым изучает различные механизмы и машины.",
            "joinDate": "2025-10-13",
            "socials": {
                "discord": "maxxaumka6679",
                "telegram": "@KOT_B_palbto"
            }
          },
          {
            "id": 10,
            "name": "nicotine",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "earth",
            "description": "Человек — Отсутствует",
            "joinDate": "2025-10-12",
            "socials": {
                "discord": "maximus7915",
                "telegram": "@Maxim_beb"
            }
          },
          {
            "id": 11,
            "name": "pandamom",
            "avatar": "assets/images/icons/pandamom.png",
            "race": "earth",
            "description": "Кото-человек — просто кот присутствую хз когда сохраняю мирность в ФрикБурге бегаю",
            "joinDate": "2025-10-11",
            "socials": {
                "discord": "pisde4",
                "telegram": "@Heyheyhey223"
            }
          },
          {
            "id": 12,
            "name": "snekky_offc",
            "avatar": "assets/images/icons/snekky.png",
            "race": "heaven",
            "description": "Ангел — Из-за скучного мира ангелов, я решил покинуть небеса. Долгое время я бродил по миру, где и встретил земного механика Максаумка. Его заинтересовал мир технологий. После долгих исследований на базе - Океаническая Черепах он смог стать Кибер-Ангелом",
            "joinDate": "2025-10-11",
            "socials": {
                "discord": "linar9341",
                "telegram": "@FV_4_0_0_5"
            }
      },
          {
            "id": 13,
            "name": "Yaryna",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "hell",
            "description": "Демоница — житель Логова Хантера, дружелюбная и общительная участница сервера.",
            "joinDate": "",
            "socials": {
                "discord": "prus404",
                "telegram": "@Prus404"
            }
      }, 
          {
            "id": 14,
            "name": "Lemonchik",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "hell",
            "description": "Демон — Отсутствует",
            "joinDate": "",
            "socials": {
                "discord": "yt_lymonchuk",
                "telegram": "@Motosport_52"
            }
      }, 
          {
            "id": 15,
            "name": "tropic_yt2021",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "earth",
            "description": "Лис — Отсутствует",
            "joinDate": "",
            "socials": {
                "discord": "trop1c_.",
                "telegram": "@tropic_mc"
            }
      }, 
          {
            "id": 16,
            "name": "Ayaz_ak",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "earth",
            "description": "",
            "joinDate": "",
            "socials": {
                "discord": "a.l.t.y.n",
                "telegram": "@Ayaz_ak"
            }
      },
      {
        "id": 17,
        "name": "Cartoshka_",
        "avatar": "assets/images/icons/cartoskha_.png",
        "race": "hell",
        "description": "",
        "joinDate": "2025-10-28",
        "socials": {
            "discord": ".cartoshka_",
            "telegram": ""
        }
      },
      {
        "id": 18,
        "name": "Chat_ty",
        "avatar": "assets/images/icons/ERROR.png",
        "race": "heaven",
        "description": "Ангел — Он в тиме с \"Pandamom\", любит летать на крыльях.",
        "joinDate": "2025-11-01",
        "socials": {
            "discord": "sy209chara",
            "telegram": ""
        }
      }
    ];
}

// Обновление статистики на основе данных
function updatePlayersStats(players) {
    const raceCounts = {
        hell: 0,
        heaven: 0,
        earth: 0,
        timer: 0,
        ii: "∞",
        total: players.length
    };
    
    players.forEach(player => {
        if (raceCounts.hasOwnProperty(player.race)) {
            raceCounts[player.race]++;
        }
    });
    
    // Безопасное обновление элементов
    const hellElement = document.querySelector('.stat-badge.hell .stat-number2');
    const heavenElement = document.querySelector('.stat-badge.heaven .stat-number2');
    const earthElement = document.querySelector('.stat-badge.earth .stat-number2');
    const timerElement = document.querySelector('.stat-badge.timer .stat-number2');
    const iiElement = document.querySelector('.stat-badge.ii .stat-number2');
    const totalElement = document.querySelector('.stat-badge.total .stat-number2');
    
    if (hellElement) hellElement.textContent = raceCounts.hell;
    if (heavenElement) heavenElement.textContent = raceCounts.heaven;
    if (earthElement) earthElement.textContent = raceCounts.earth;
    if (timerElement) timerElement.textContent = raceCounts.timer;
    if (iiElement) iiElement.textContent = raceCounts.ii;
    if (totalElement) totalElement.textContent = raceCounts.total;
}

// Анимация счетчика
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

// Реальная статистика онлайна
async function initRealTimePlayerCount() {
    try {
        const onlineCount = Math.floor(Math.random() * 50) + 100;
        updatePlayerCount(onlineCount);
    } catch (error) {
        console.error('Ошибка загрузки онлайна:', error);
    }
}

function updatePlayerCount(count) {
    const playerCountElement = document.querySelector('.player-count');
    if (playerCountElement) {
        playerCountElement.textContent = count;
    }
}

// Вспомогательные функции
function getRaceName(race) {
    const races = {
        hell: 'Демон',
        heaven: 'Ангел',
        earth: 'Земной',
        timer: 'Хранитель Времени',
        ii: 'Чужой',
    };
    return races[race] || 'Неизвестно';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
}

function showLoadingState() {
    const grid = document.getElementById('playersGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Загрузка игроков...</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    // Убирается автоматически при рендере игроков
}

// Загрузка демо данных при ошибке
function loadDemoPlayersData() {
    console.log('Загружаем демо данные...');
    const demoPlayers = getLocalPlayersData();
    renderPlayersGrid(demoPlayers);
    updatePlayersStats(demoPlayers);
}

// Удаляем проблемный код из players.html и заменяем его на:
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем страницу игроков');
    initPlayersPage();
    initPlayersFilter();
    initPlayersStats();
    loadPlayersData();
    initRealTimePlayerCount();
    initOnlineStatusSystem();
});

// Обновление данных каждые 3 секунды
setInterval(() => {
    initRealTimePlayerCount();
}, 3000);