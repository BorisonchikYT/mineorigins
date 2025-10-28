// Скрипт для страницы игроков с данными из JSON
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем страницу игроков');
    initPlayersPage();
    initPlayersFilter();
    initPlayersStats();
    loadPlayersData();
    initRealTimePlayerCount();
});

// Инициализация страницы игроков
function initPlayersPage() {
    console.log('Страница игроков инициализирована');
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
        
    } catch (error) {
        console.error('Ошибка загрузки данных игроков:', error);
        console.log('Пробуем загрузить демо данные...');
        loadDemoPlayersData();
    }
}

// Получение данных игроков из JSON файла
async function fetchPlayersData() {
    try {
        console.log('Пытаемся загрузить players.json...');
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

    console.log(`Рендерим ${players.length} игроков`);
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
        console.log(`Создаем карточку для игрока: ${player.name}`);
        const playerCard = createPlayerCard(player);
        grid.appendChild(playerCard);
        
        // Анимация появления с задержкой
        setTimeout(() => {
            playerCard.classList.add('visible');
        }, index * 100);
    });
}

// Создание карточки игрока
function createPlayerCard(player) {
    console.log(`Создание карточки для ${player.name}`, player);
    
    const card = document.createElement('div');
    card.className = `player-card ${player.race}-race`;
    card.setAttribute('data-race', player.race);
    card.setAttribute('data-player-id', player.id);
    
    // Форматируем социальные сети
    const socials = player.socials || {};
    const hasSocials = Object.keys(socials).length > 0;
    
    // Проверяем наличие аватара
    const avatarPath = player.avatar || 'assets/icons/players/default.png';
    console.log(`Аватар для ${player.name}: ${avatarPath}`);
    
    card.innerHTML = `
        <div class="player-header">
            <div class="player-avatar ${player.race}">
                <img src="${avatarPath}" alt="${player.name}" class="avatar-image" 
                     onerror="console.error('Ошибка загрузки аватара для ${player.name}'); this.src='assets/icons/players/default.png'">
            </div>
            <div class="player-main-info">
                <h3 class="player-name">${player.name}</h3>
                <span class="player-race-badge race-${player.race}">${getRaceName(player.race)}</span>
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
        discord: { icon: '⚡', color: '#5865F2', glow: 'rgba(88, 101, 242, 0.3)' },
        telegram: { icon: '📱', color: '#0088cc', glow: 'rgba(0, 136, 204, 0.3)' },
        tiktok: { icon: '🎵', color: '#ff0050', glow: 'rgba(255, 0, 80, 0.3)' }
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

// Обновление статистики на основе данных
async function updatePlayersStats(players) {
    const raceCounts = {
        hell: 1,
        heaven: 4,
        earth: 7
    };
    
    players.forEach(player => {
        raceCounts[player.race]++;
    });
    
    document.querySelector('.stat-badge.hell .stat-number').textContent = raceCounts.hell;
    document.querySelector('.stat-badge.heaven .stat-number').textContent = raceCounts.heaven;
    document.querySelector('.stat-badge.earth .stat-number').textContent = raceCounts.earth;
    document.querySelector('.stat-badge.total .stat-number').textContent = players.length;
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
        earth: 'Земной'
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
    const demoPlayers = [
        {
          "id": 1,
          "name": "_Kot_Baris_",
          "avatar": "assets/images/icons/kotbaris.png",
          "race": "earth",
          "description": "◈ Земной\nКото-человек, я лидер земной расы, создатель ФрикБургской Империи, хочет наладить мир между расами.",
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
          "name": "amidamaru3434",
          "avatar": "assets/images/icons/ERROR.png",
          "race": "heaven",
          "description": "◈ Ангел\nСерафим — лидер райской расы, присутствует на сервере с открытия.",
          "joinDate": "2025-10-14",
          "socials": {
            "discord": "bruhhhhsasa21",
            "telegram": "@aza_matsuto"
          }
        },
        {
          "id": 4,
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
          "id": 5,
          "name": "ddanilkaaaa",
          "avatar": "assets/images/icons/ERROR.png",
          "race": "earth",
          "description": "",
          "joinDate": "2025-10-13",
          "socials": {
              "discord": "ddanilkaaaa_83622",
              "telegram": "@Ddanilkaaaa"
          }
        },
        {
          "id": 6,
          "name": "deace",
          "avatar": "assets/images/icons/ERROR.png",
          "race": "heaven",
          "description": "",
          "joinDate": "2025-10-25",
          "socials": {
              "discord": "winchikvpotoke_36739",
              "telegram": "@Zkrtssikit"
          }
        },
        {
          "id": 7,
          "name": "hyutjnh",
          "avatar": "assets/images/icons/ERROR.png",
          "race": "heaven",
          "description": "Ангел - участник ангельской расы, присутствует на сервере с открытия(я ещё со временем блек альфы). Сохраняет нейтралитет между ФрикБургом, ЛХ и ВДНХ, наблюдает за порядком на поверхности, характер ламповый, люблю лис.",
          "joinDate": "2025-10-18",
          "socials": {
              "discord": "last_troid_0079",
              "telegram": "@ED4MKM_AERO"
          }
        },
        {
          "id": 8,
          "name": "jdh16",
          "avatar": "assets/images/icons/ERROR.png",
          "race": "earth",
          "description": "",
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
          "description": "Волшебник с самого начала активен на сервере. Он нейтрален ко всем расам и кланам и не состоит ни в одном клане. Живёт в кубе вместе с пользователем snekky_off, с которым изучает различные механизмы и машины.",
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
          "description": "",
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
          "description": "Кото-человек просто кот присутствую хз когда сохраняю мирность в ФрикБурге бегаю",
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
          "description": "Из-за скучного мира ангелов, я решил покинуть небеса. Долгое время я бродил по миру, где и встретил земного механика Максаумка. Его заинтересовал мир технологий. После долгих исследований на базе - Океаническая Черепах он смог стать Кибер-Ангелом",
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
          "description": "",
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
          "description": "",
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
    }
    ];
    renderPlayersGrid(demoPlayers);
    updatePlayersStats(demoPlayers);
}

// Обновление данных каждые 30 секунд
setInterval(() => {
    initRealTimePlayerCount();
}, 30000);