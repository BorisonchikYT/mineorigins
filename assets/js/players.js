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
                <!-- <div class="status-indicator online"></div> -->
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
            ${socials.discord ? `<a href="https://discord.gg/yvjewMujcx" class="contact-link discord" title="Discord">🎮 ${socials.discord}</a>` : ''}
            ${socials.telegram ? `<a href="https://t.me/mine_origins" class="contact-link telegram" title="Telegram">✈️ ${socials.telegram}</a>` : ''}
            
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
                    <!-- <div class="status-indicator online"></div> -->
                </div>
                <div class="player-info">
                    <h2>${player.name}</h2>
                    <span class="player-race-badge">${getRaceName(player.race)}</span>
                    <!-- <div class="player-status">🟢 В сети</div> -->
                </div>
                <button class="modal-close">&times;</button>
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
                                <span class="contact-icon">🎮</span>
                                <div class="contact-info">
                                    <strong>Discord</strong>
                                    <span>${socials.discord}</span>
                                </div>
                                <button class="copy-contact" data-text="${socials.discord}">📋</button>
                            </div>
                        ` : ''}
                        ${socials.telegram ? `
                            <div class="contact-item telegram">
                                <span class="contact-icon">✈️</span>
                                <div class="contact-info">
                                    <strong>Telegram</strong>
                                    <span>${socials.telegram}</span>
                                </div>
                                <a href="https://t.me/${socials.telegram.replace('@', '')}" class="contact-link-btn" target="_blank">📤</a>
                            </div>
                        ` : ''}
                        ${socials.tiktok ? `
                            <div class="contact-item tiktok">
                                <span class="contact-icon">🎵</span>
                                <div class="contact-info">
                                    <strong>TikTok</strong>
                                    <span>${socials.tiktok}</span>
                                </div>
                                <a href="https://tiktok.com/${socials.tiktok}" class="contact-link-btn" target="_blank">📤</a>
                            </div>
                        ` : ''}
                    </div>
                </div>
                ` : '<div class="no-contacts-detailed"><p>❌ Контакты не указаны</p></div>'}
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
            const text = e.target.getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
                const originalText = e.target.textContent;
                e.target.textContent = '✅';
                setTimeout(() => {
                    e.target.textContent = originalText;
                }, 2000);
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

// Показ информации о контакте
function showContactInfo(type, info) {
    const contactNames = {
        discord: 'Discord',
        telegram: 'Telegram',
        tiktok: 'TikTok'
    };

    alert(`${contactNames[type]}: ${info}\n\nСкопировано в буфер обмена!`);
    navigator.clipboard.writeText(info);
}

// Инициализация фильтров
function initPlayersFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('playersSearch');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterPlayers(filter);
        });
    });

    // Поиск игроков
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
    // Анимация счетчиков статистики
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
    
    // Обновляем счетчики
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
        // В реальном проекте здесь будет запрос к API сервера
        const onlineCount = Math.floor(Math.random() * 50) + 100; // 100-150
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

// earth - земной
// heaven - рай
// hell - адский

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
              "telegram": "@BorisonchikOfficial",
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
            "joinDate": "",
            "socials": {
              "discord": "",
              "telegram": ""
            }
          },
          {
            "id": 4,
            "name": "darcklord",
            "avatar": "assets/images/icons/darcklord.png",
            "race": "earth",
            "description": "Дворф — бывший воин который просто хочет спокойно жить но приключения зовут его\nЖивет в городе Фрикбург  и хочет накопить золотых чтобы построить лучшую харчевню где люди и нелюди смогли бы давать и брать задания просто отдыхать и снимать жилье а так же участвовать в рейдах на замки и быть наемниками,",
            "joinDate": "",
            "socials": {
              "discord": "",
              "telegram": ""
            }
          },
          {
            "id": 5,
            "name": "ddanilkaaaa",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "earth",
            "description": "",
            "joinDate": "",
            "socials": {
                "discord": "",
                "telegram": ""
            }
          },
          {
            "id": 6,
            "name": "deace",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "heaven",
            "description": "",
            "joinDate": "",
            "socials": {
                "discord": "",
                "telegram": ""
            }
          },
          {
            "id": 7,
            "name": "hyutjnh",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "heaven",
            "description": "Ангел - участник ангельской расы, присутствует на сервере с открытия(я ещё со временем блек альфы). Сохраняет нейтралитет между ФрикБургом, ЛХ и ВДНХ, наблюдает за порядком на поверхности, характер ламповый, люблю лис.",
            "joinDate": "",
            "socials": {
                "discord": "",
                "telegram": ""
            }
          },
          {
            "id": 8,
            "name": "jdh16",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "earth",
            "description": "",
            "joinDate": "",
            "socials": {
                "discord": "",
                "telegram": ""
            }
          },
          {
            "id": 9,
            "name": "maxxaumka",
            "avatar": "assets/images/icons/maksimka.png",
            "race": "earth",
            "description": "Волшебник с самого начала активен на сервере. Он нейтрален ко всем расам и кланам и не состоит ни в одном клане. Живёт в кубе вместе с пользователем snekky_off, с которым изучает различные механизмы и машины.",
            "joinDate": "",
            "socials": {
                "discord": "",
                "telegram": ""
            }
          },
          {
            "id": 10,
            "name": "nicotine",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "earth",
            "description": "",
            "joinDate": "",
            "socials": {
                "discord": "",
                "telegram": ""
            }
          },
          {
            "id": 11,
            "name": "pandamom",
            "avatar": "assets/images/icons/pandamom.png",
            "race": "earth",
            "description": "Кото-человек просто кот присутствую хз когда сохраняю мирность в ФрикБурге бегаю",
            "joinDate": "",
            "socials": {
                "discord": "",
                "telegram": ""
            }
          },
          {
            "id": 12,
            "name": "snekky_offc",
            "avatar": "assets/images/icons/ERROR.png",
            "race": "heaven",
            "description": "",
            "joinDate": "",
            "socials": {
                "discord": "",
                "telegram": ""
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
                "discord": "",
                "telegram": ""
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
                "discord": "",
                "telegram": ""
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
                "discord": "",
                "telegram": ""
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