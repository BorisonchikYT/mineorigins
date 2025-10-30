// Главный скрипт с реальной статистикой сервера Minecraft
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Начало загрузки статистики игроков');
    
    initAnimations();
    initServerStats();
    initOnlineStats();
    initRaceCards();
    initCursorEffect();
    initScrollAnimations();
    initTypewriterEffect();
    initRealTimeStats();
});

// Конфигурация сервера
const SERVER_CONFIG = {
    primaryIP: 'f27.joinserver.xyz:25835',
    numericIP: '95.216.92.76:25835',
    version: '1.21.1 Fabric',
    apiEndpoints: {
        status: 'https://api.mcsrvstat.us/3/95.216.92.76:25835',
        ping: 'https://api.mcsrvstat.us/debug/ping/95.216.92.76:25835',
        backup: 'https://api.mcsrvstat.us/2/95.216.92.76:25835',
        // Альтернативные API
        alternative1: 'https://api.mcstatus.io/v2/status/java/95.216.92.76:25835',
        alternative2: 'https://api.minetools.eu/ping/95.216.92.76/25835'
    }
};

// Класс для работы с данными игроков
class PlayersDataManager {
    constructor() {
        this.playersData = null;
        this.loaded = false;
    }

    // Загрузка данных игроков из players.json
    async loadPlayersData() {
        try {
            console.log('🔄 Загрузка данных игроков...');
            const response = await fetch('assets/json/players.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Данные игроков загружены:', data.players.length, 'игроков');
            
            this.playersData = data.players;
            this.loaded = true;
            
            return this.playersData;
            
        } catch (error) {
            console.error('❌ Ошибка загрузки данных игроков:', error);
            // Используем демо данные как fallback
            this.playersData = this.getDemoPlayersData();
            this.loaded = true;
            return this.playersData;
        }
    }

    // Получение информации об игроке по имени
    getPlayerInfo(playerName) {
        if (!this.playersData || !this.loaded) {
            return null;
        }

        const player = this.playersData.find(p => 
            p.name.toLowerCase() === playerName.toLowerCase()
        );

        return player || null;
    }

    // Демо данные игроков (fallback)
    getDemoPlayersData() {
        return [
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
                "avatar": "assets/images/icons/deace.png",
                "race": "heaven",
                "description": "Ангел гигачад, является экзорцистом среди всех ангелов. Истребляет нечестей, демонов и даже людей (если нужно будет)",
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
            }
        ];
    }
}

// Улучшенный класс для работы с API
class MinecraftServerAPI {
    constructor() {
        this.currentData = null;
        this.lastUpdate = null;
    }

    // Основной метод получения статуса
    async getServerStatus() {
        try {
            console.log('🔄 Запрос к основному API...');
            const response = await fetch(SERVER_CONFIG.apiEndpoints.status, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'MinecraftServerStatus/1.0'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Данные сервера получены:', data);

            return this.processServerData(data);

        } catch (error) {
            console.error('❌ Ошибка основного API:', error);
            return await this.tryBackupAPIs();
        }
    }

    // Обработка данных сервера
    processServerData(data) {
        // Обработка списка игроков
        let playersList = [];
        let hasRealPlayerData = false;
        
        if (data.players && data.players.list) {
            playersList = data.players.list.map(player => {
                if (typeof player === 'string') {
                    return player;
                } else if (player && player.name) {
                    return player.name;
                }
                return null;
            }).filter(name => name !== null);
            hasRealPlayerData = playersList.length > 0;
        } else if (data.players && data.players.uuid) {
            // Если есть UUID, но нет имен
            playersList = Object.keys(data.players.uuid);
            hasRealPlayerData = playersList.length > 0;
        }

        // Обработка MOTD
        let motdText = 'Minecraft Origins Server';
        if (data.motd) {
            if (data.motd.clean && Array.isArray(data.motd.clean)) {
                motdText = data.motd.clean.join(' ');
            } else if (typeof data.motd === 'string') {
                motdText = data.motd;
            }
        }

        return {
            online: data.online || false,
            players: {
                online: data.players?.online || 0,
                max: data.players?.max || 0,
                list: playersList
            },
            version: data.version || 'Неизвестно',
            motd: motdText,
            hostname: data.hostname || SERVER_CONFIG.primaryIP,
            port: data.port || 25835,
            icon: data.icon || null,
            software: data.software || 'Vanilla',
            hasRealPlayerData: hasRealPlayerData
        };
    }

    // Попытка использовать backup API
    async tryBackupAPIs() {
        const backupAPIs = [
            SERVER_CONFIG.apiEndpoints.backup,
            SERVER_CONFIG.apiEndpoints.alternative1,
            SERVER_CONFIG.apiEndpoints.alternative2
        ];

        for (const apiUrl of backupAPIs) {
            try {
                console.log(`🔄 Попытка backup API: ${apiUrl}`);
                const response = await fetch(apiUrl);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ Backup API сработал: ${apiUrl}`);
                    return this.processBackupData(data, apiUrl);
                }
            } catch (error) {
                console.warn(`⚠️ Backup API не сработал: ${apiUrl}`, error);
                continue;
            }
        }

        // Если все API не сработали
        throw new Error('Все API недоступны');
    }

    // Обработка данных из backup API
    processBackupData(data, apiUrl) {
        let playersList = [];
        let hasRealPlayerData = false;

        if (apiUrl.includes('mcstatus.io')) {
            // Формат mcstatus.io
            playersList = data.players?.list?.map(p => p.name_clean) || [];
            hasRealPlayerData = playersList.length > 0;
            
            return {
                online: data.online || false,
                players: {
                    online: data.players?.online || 0,
                    max: data.players?.max || 0,
                    list: playersList
                },
                version: data.version?.name_clean || 'Неизвестно',
                motd: data.motd?.clean || 'Minecraft Origins Server',
                hasRealPlayerData: hasRealPlayerData
            };
        } else if (apiUrl.includes('minetools.eu')) {
            // Формат minetools.eu
            playersList = data.players?.sample?.map(p => p.name) || [];
            hasRealPlayerData = playersList.length > 0;
            
            return {
                online: data.status === 'success',
                players: {
                    online: data.players?.online || 0,
                    max: data.players?.max || 0,
                    list: playersList
                },
                version: data.version || 'Неизвестно',
                motd: data.description || 'Minecraft Origins Server',
                hasRealPlayerData: hasRealPlayerData
            };
        } else {
            // Стандартный формат mcsrvstat.us
            return this.processServerData(data);
        }
    }
}

// Создаем экземпляры менеджеров
const serverAPI = new MinecraftServerAPI();
const playersManager = new PlayersDataManager();

// Реальная статистика сервера
async function initRealTimeStats() {
    try {
        // Показываем загрузку
        updateServerStatus('loading', 'Загрузка...');
        
        // Загружаем данные игроков если еще не загружены
        if (!playersManager.loaded) {
            await playersManager.loadPlayersData();
        }
        
        // Получаем реальные данные сервера
        const serverData = await serverAPI.getServerStatus();
        
        if (serverData.online) {
            updateServerStatus('online', 'ОНЛАЙН');
            updatePlayerCount(serverData.players.online);
            
            // Обновляем список игроков с реальными данными
            await updateOnlinePlayers(serverData.players.list, serverData.hasRealPlayerData);
            
            updateServerInfo(serverData);
            updateServerChart(serverData);
            
            // Сохраняем данные для быстрого обновления
            serverAPI.currentData = serverData;
            serverAPI.lastUpdate = Date.now();
            
        } else {
            updateServerStatus('offline', 'ОФФЛАЙН');
            updatePlayerCount(0);
            updateOnlinePlayers([], false);
            showOfflineMessage();
        }
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        updateServerStatus('error', 'ОШИБКА');
        showErrorMessage('Не удалось получить данные сервера');
    }
}

// Обновление списка онлайн игроков
async function updateOnlinePlayers(players, hasRealPlayerData) {
    const onlineList = document.getElementById('onlineList');
    if (!onlineList) return;

    // Очищаем список
    onlineList.innerHTML = '';

    if (players && players.length > 0 && hasRealPlayerData) {
        console.log(`📊 Отображаем ${players.length} реальных игроков:`, players);
        
        // Отображаем реальных игроков с их данными
        for (const playerName of players.slice(0, 15)) {
            const playerInfo = playersManager.getPlayerInfo(playerName);
            const playerElement = createPlayerElement(playerName, playerInfo);
            onlineList.appendChild(playerElement);
        }

        if (players.length > 15) {
            const moreElement = document.createElement('div');
            moreElement.className = 'online-player more-players';
            moreElement.innerHTML = `
                <div class="player-avatar more">+${players.length - 15}</div>
                <div class="player-info">
                    <div class="player-name">и другие...</div>
                    <div class="player-race">всего ${players.length} игроков</div>
                </div>
            `;
            onlineList.appendChild(moreElement);
        }
    } else if (players && players.length > 0 && !hasRealPlayerData) {
        // Если есть онлайн игроки, но нет реальных данных от API
        console.log('📊 Есть онлайн игроки, но нет данных от API');
        onlineList.innerHTML = `
            <div class="no-players">
                <div class="no-players-icon">👥</div>
                <div class="no-players-text">На сервере играют ${players.length} игроков</div>
                <div class="no-players-subtext">Список игроков недоступен</div>
            </div>
        `;
    } else {
        // Если нет игроков онлайн
        console.log('📊 Нет игроков онлайн');
        onlineList.innerHTML = `
            <div class="no-players">
                <div class="no-players-icon">👥</div>
                <div class="no-players-text">Сейчас на сервере нет игроков</div>
                <div class="no-players-subtext">Будьте первым!</div>
            </div>
        `;
    }
}

// Создание элемента игрока
function createPlayerElement(playerName, playerInfo) {
    const playerElement = document.createElement('div');
    playerElement.className = 'online-player';
    
    if (playerInfo) {
        // Используем реальные данные игрока
        const avatarPath = playerInfo.avatar || `https://mc-heads.net/avatar/${playerName}/64`;
        const race = playerInfo.race || determinePlayerRace(playerName);
        
        playerElement.innerHTML = `
            <div class="player-avatar ${race}">
                <img src="${avatarPath}" alt="${playerName}" 
                     onerror="this.src='assets/icons/players/default.png'">
            </div>
            <div class="player-info">
                <div class="player-name">${playerName}</div>
                <div class="player-race">${getRaceName(race)}</div>
            </div>
        `;
    } else {
        // Используем базовые данные
        const race = determinePlayerRace(playerName);
        const avatarPath = `https://mc-heads.net/avatar/${playerName}/64`;
        
        playerElement.innerHTML = `
            <div class="player-avatar ${race}">
                <img src="${avatarPath}" alt="${playerName}" 
                     onerror="this.src='assets/icons/players/default.png'">
            </div>
            <div class="player-info">
                <div class="player-name">${playerName}</div>
                <div class="player-race">${getRaceName(race)}</div>
            </div>
        `;
    }

    return playerElement;
}

// Определение расы игрока по имени (fallback)
function determinePlayerRace(playerName) {
    const races = ['hell', 'heaven', 'earth'];
    
    // Простая эвристика по имени игрока
    if (playerName.toLowerCase().includes('nether') || 
        playerName.toLowerCase().includes('fire') ||
        playerName.toLowerCase().includes('demon') ||
        playerName.toLowerCase().includes('hell')) {
        return 'hell';
    } else if (playerName.toLowerCase().includes('sky') ||
               playerName.toLowerCase().includes('angel') ||
               playerName.toLowerCase().includes('wing') ||
               playerName.toLowerCase().includes('heaven')) {
        return 'heaven';
    } else if (playerName.toLowerCase().includes('earth') ||
               playerName.toLowerCase().includes('nature')) {
        return 'earth';
    }
    
    // Случайная раса если не удалось определить
    return races[Math.floor(Math.random() * races.length)];
}

// Получение названия расы
function getRaceName(race) {
    const races = {
        hell: 'Демон',
        heaven: 'Ангел',
        earth: 'Земной'
    };
    return races[race] || 'Неизвестно';
}

// Обновление статуса сервера
function updateServerStatus(status, text) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
        statusIndicator.className = 'status-indicator';
        statusIndicator.classList.add(status);
        statusText.textContent = text;

        statusIndicator.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => statusIndicator.style.animation = '', 500);
    }

    const navStatus = document.querySelector('.server-status .status-indicator');
    const navText = document.querySelector('.server-status .status-text');
    if (navStatus && navText) {
        navStatus.className = 'status-indicator ' + status;
        navText.textContent = text;
    }
}

// Обновление счетчика игроков
function updatePlayerCount(count) {
    const playerCount = document.querySelector('.player-count');
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    if (playerCount) {
        playerCount.textContent = count;
        playerCount.style.transform = 'scale(1.2)';
        setTimeout(() => playerCount.style.transform = 'scale(1)', 300);
    }
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (target > 0) {
            animateCounter(stat, count);
        }
    });

    updateOnlineProgress(count);
}

// Обновление прогресс бара онлайна
function updateOnlineProgress(onlineCount) {
    const progressBar = document.querySelector('.online-progress');
    const maxPlayers = 200;
    
    if (progressBar) {
        const percentage = Math.min((onlineCount / maxPlayers) * 100, 100);
        progressBar.style.width = percentage + '%';
        
        if (percentage > 80) {
            progressBar.style.background = 'var(--hell-color)';
        } else if (percentage > 50) {
            progressBar.style.background = 'var(--earth-color)';
        } else {
            progressBar.style.background = 'var(--heaven-color)';
        }
    }
}

// Обновление информации о сервере
function updateServerInfo(serverData) {
    const serverInfoElements = document.querySelectorAll('.server-info, .server-ip, .server-version');
    
    serverInfoElements.forEach(element => {
        if (element.classList.contains('server-ip')) {
            element.textContent = SERVER_CONFIG.primaryIP;
        } else if (element.classList.contains('server-version')) {
            element.textContent = serverData.version;
        } else {
            element.innerHTML = `
                <strong>IP:</strong> ${SERVER_CONFIG.primaryIP}<br>
                <strong>Версия:</strong> ${serverData.version}<br>
                <strong>Статус:</strong> <span class="status-${serverData.online ? 'online' : 'offline'}">${serverData.online ? 'ОНЛАЙН' : 'ОФФЛАЙН'}</span>
            `;
        }
    });

    const motdElement = document.querySelector('.server-motd');
    if (motdElement && serverData.motd) {
        motdElement.textContent = serverData.motd;
    }
}

// Обновление графика онлайна
function updateServerChart(serverData) {
    const chartContainer = document.querySelector('.online-chart');
    if (!chartContainer) return;

    const currentOnline = serverData.players.online;
    const maxPlayers = serverData.players.max || 200;

    chartContainer.innerHTML = `
        <div class="chart-real-time">
            <div class="chart-header">
                <h4>📊 Статистика онлайна</h4>
                <div class="current-online">
                    <span class="online-count">${currentOnline}</span>
                    <span class="online-max">/${maxPlayers}</span>
                    <span class="online-text">игроков онлайн</span>
                </div>
            </div>
            <div class="chart-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(currentOnline / maxPlayers) * 100}%"></div>
                </div>
            </div>
            <div class="chart-history">
                ${generateHistoryBars(currentOnline, maxPlayers)}
            </div>
        </div>
    `;

    setTimeout(() => {
        const bars = chartContainer.querySelectorAll('.history-bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.opacity = '1';
                bar.style.transform = 'scaleY(1)';
            }, index * 100);
        });
    }, 500);
}

// Генерация исторических данных
function generateHistoryBars(currentOnline, maxPlayers) {
    let bars = '';
    const hours = 12;
    
    for (let i = 0; i < hours; i++) {
        const baseOnline = currentOnline * (0.7 + Math.random() * 0.6);
        const height = Math.max(10, Math.min(100, (baseOnline / maxPlayers) * 100));
        
        const time = new Date();
        time.setHours(time.getHours() - (hours - i - 1));
        const timeLabel = time.getHours().toString().padStart(2, '0') + ':00';
        
        bars += `
            <div class="history-bar-container">
                <div class="history-bar" style="height: ${height}%"></div>
                <span class="history-time">${timeLabel}</span>
            </div>
        `;
    }
    
    return bars;
}

// Показ сообщения когда сервер оффлайн
function showOfflineMessage() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    if (!document.querySelector('.offline-message')) {
        const offlineMessage = document.createElement('div');
        offlineMessage.className = 'offline-message';
        offlineMessage.innerHTML = `
            <div class="offline-icon">🔌</div>
            <h3>Сервер временно недоступен</h3>
            <p>Мы уже работаем над решением проблемы. Попробуйте обновить страницу через несколько минут.</p>
        `;
        
        mainContent.prepend(offlineMessage);
        
        setTimeout(() => {
            if (offlineMessage.parentNode) {
                offlineMessage.style.opacity = '0';
                setTimeout(() => offlineMessage.remove(), 300);
            }
        }, 10000);
    }
}

// Показ сообщения об ошибке
function showErrorMessage(message) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent || document.querySelector('.error-message')) return;

    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <div class="error-icon">⚠️</div>
        <h3>Ошибка подключения</h3>
        <p>${message}</p>
        <button class="retry-btn" onclick="initRealTimeStats()">Попробовать снова</button>
    `;
    
    mainContent.prepend(errorMessage);
}

// Анимация счетчика
function animateCounter(element, target) {
    const duration = 1500;
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Остальные функции инициализации
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

function initServerStats() {
    console.log('🔄 Инициализация статистики сервера...');
}

function initOnlineStats() {
    console.log('🔄 Инициализация онлайн статистики...');
}

function initRaceCards() {
    const raceCards = document.querySelectorAll('.race-card');
    
    raceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const race = this.getAttribute('data-race');
            playRaceSound(race);
        });

        card.addEventListener('click', function() {
            const race = this.getAttribute('data-race');
            showRaceModal(race);
        });
    });
}

// УЛЬТИМАТИВНЫЙ ЭФФЕКТ КУРСОРА В СТИЛЕ GENSHIN IMPACT
function initUltimateGenshinCursor() {
    // ПОЛНОЕ БЛОКИРОВАНИЕ ВСЕХ СТАНДАРТНЫХ КУРСОРОВ ПРИНУДИТЕЛЬНО
    const disableAllCursors = () => {
        const styles = `
            * {
                cursor: none !important;
                caret-color: transparent !important;
            }
            
            *:hover {
                cursor: none !important;
            }
            
            html, body, div, span, applet, object, iframe,
            h1, h2, h3, h4, h5, h6, p, blockquote, pre,
            a, abbr, acronym, address, big, cite, code,
            del, dfn, em, img, ins, kbd, q, s, samp,
            small, strike, strong, sub, sup, tt, var,
            b, u, i, center,
            dl, dt, dd, ol, ul, li,
            fieldset, form, label, legend,
            table, caption, tbody, tfoot, thead, tr, th, td,
            article, aside, canvas, details, embed, 
            figure, figcaption, footer, header, hgroup, 
            menu, nav, output, ruby, section, summary,
            time, mark, audio, video {
                cursor: none !important;
            }
            
            input, textarea, [contenteditable] {
                cursor: none !important;
            }
            
            button, select, a {
                cursor: none !important;
            }
            
            ::selection {
                background: rgba(255, 215, 0, 0.3) !important;
            }
            
            ::-webkit-scrollbar {
                display: none !important;
            }
            
            *::-webkit-scursor {
                display: none !important;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        // Дополнительное принудительное отключение через JavaScript
        document.addEventListener('mouseover', (e) => {
            e.target.style.cursor = 'none !important';
        });
        
        document.addEventListener('mousedown', (e) => {
            e.target.style.cursor = 'none !important';
        });
    };

    disableAllCursors();

    // Создание многослойного курсора
    const createCursorLayer = (className, content, styles) => {
        const layer = document.createElement('div');
        layer.className = `genshin-cursor-${className}`;
        if (content) layer.innerHTML = content;
        layer.style.cssText = styles;
        document.body.appendChild(layer);
        return layer;
    };

    // Элементы Genshin Impact с путями к изображениям
    const elements = {
        anemo: { 
            colors: ['#80FFD7', '#00D8A0', '#00A885'], 
            symbol: 'images/elements/anemo.png',
            icon: '🌪️'
        },
        pyro: { 
            colors: ['#FF9999', '#FF6B6B', '#FF4757'], 
            symbol: 'images/elements/pyro.png',
            icon: '🔥'
        },
        electro: { 
            colors: ['#D9AFFF', '#B366FF', '#8C42FF'], 
            symbol: 'images/elements/electro.png',
            icon: '⚡'
        },
        hydro: { 
            colors: ['#87CEFA', '#4A90E2', '#357ABD'], 
            symbol: 'images/elements/hydro.png',
            icon: '💧'
        },
        geo: { 
            colors: ['#FFD166', '#FFB347', '#FF9500'], 
            symbol: 'images/elements/geo.png',
            icon: '⛰️'
        },
        cryo: { 
            colors: ['#A0D2FF', '#6BA8FF', '#4A7DFF'], 
            symbol: 'images/elements/cryo.png',
            icon: '❄️'
        },
        dendro: { 
            colors: ['#A8E6CF', '#7EDFA0', '#5CDB95'], 
            symbol: 'images/elements/dendro.png',
            icon: '🍃'
        }
    };

    // Основной курсор с кастомным изображением
    const mainCursor = createCursorLayer('main', '', `
        position: fixed;
        width: 32px;
        height: 32px;
        background: url('images/cursor/genshin-cursor.png') center/contain no-repeat;
        pointer-events: none;
        z-index: 10000;
        transition: all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        mix-blend-mode: screen;
        user-select: none;
        filter: 
            drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))
            drop-shadow(0 0 20px rgba(255, 140, 0, 0.6))
            brightness(1.1);
    `);

    // Аура курсора
    const cursorAura = createCursorLayer('aura', '', `
        position: fixed;
        width: 50px;
        height: 50px;
        border: 2px solid rgba(255, 215, 0, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 
            0 0 30px rgba(255, 140, 0, 0.6),
            inset 0 0 20px rgba(255, 215, 0, 0.3);
        opacity: 0.8;
        background: radial-gradient(circle, transparent 30%, rgba(255, 215, 0, 0.1) 100%);
    `);

    // Эффект свечения
    const cursorGlow = createCursorLayer('glow', '', `
        position: fixed;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
        opacity: 0.6;
        filter: blur(5px);
    `);

    // Массивы для эффектов
    let trailParticles = [];
    let elementalOrbs = [];
    let sparkleEffects = [];
    const MAX_TRAILS = 12;
    const MAX_ORBS = 20;
    const MAX_SPARKLES = 8;

    // Создание частицы следа с элементальными иконками
    function createTrailParticle(x, y, velocityMultiplier = 1) {
        const elementKeys = Object.keys(elements);
        const randomElement = elementKeys[Math.floor(Math.random() * elementKeys.length)];
        const element = elements[randomElement];
        
        const particle = document.createElement('div');
        const size = 6 + Math.random() * 8;
        const rotation = Math.random() * 360;
        
        // Случайно выбираем между градиентом и иконкой элемента
        const useIcon = Math.random() > 0.5;
        
        if (useIcon) {
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: url('${element.symbol}') center/contain no-repeat;
                border-radius: ${Math.random() > 0.7 ? '30%' : '50%'};
                pointer-events: none;
                z-index: 9997;
                opacity: ${0.7 + Math.random() * 0.3};
                filter: 
                    drop-shadow(0 0 8px ${element.colors[2]})
                    brightness(1.2);
                transform: scale(1) rotate(${rotation}deg);
                left: ${x}px;
                top: ${y}px;
            `;
        } else {
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, ${element.colors[0]} 0%, ${element.colors[1]} 70%);
                border-radius: ${Math.random() > 0.7 ? '30%' : '50%'};
                pointer-events: none;
                z-index: 9997;
                opacity: ${0.7 + Math.random() * 0.3};
                box-shadow: 0 0 ${10 + Math.random() * 10}px ${element.colors[2]};
                transform: scale(1) rotate(${rotation}deg);
                left: ${x}px;
                top: ${y}px;
                filter: blur(${Math.random() > 0.5 ? '1px' : '0px'});
            `;
        }
        
        particle.physData = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6 * velocityMultiplier,
            vy: (Math.random() - 0.5) * 6 * velocityMultiplier - 2,
            life: 0,
            maxLife: 800 + Math.random() * 400,
            rotation: rotation,
            rotationSpeed: (Math.random() - 0.5) * 10,
            scale: 1,
            element: randomElement,
            isIcon: useIcon
        };
        
        document.body.appendChild(particle);
        trailParticles.push(particle);
        
        // Ограничение количества
        if (trailParticles.length > MAX_TRAILS) {
            const oldParticle = trailParticles.shift();
            oldParticle?.remove();
        }
        
        return particle;
    }

    // Создание элементальной сферы с изображением
    function createElementalOrb(x, y, elementType = null) {
        const elementKeys = Object.keys(elements);
        const elementName = elementType || elementKeys[Math.floor(Math.random() * elementKeys.length)];
        const element = elements[elementName];
        const size = 20 + Math.random() * 15;
        
        const orb = document.createElement('div');
        orb.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: url('${element.symbol}') center/contain no-repeat;
            pointer-events: none;
            z-index: 9996;
            opacity: 0.9;
            filter: 
                drop-shadow(0 0 10px ${element.colors[1]})
                drop-shadow(0 0 20px ${element.colors[2]})
                brightness(1.2);
            left: ${x}px;
            top: ${y}px;
            transition: opacity 0.3s ease;
        `;
        
        orb.physData = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12 - 6,
            life: 0,
            maxLife: 1500 + Math.random() * 700,
            scale: 1,
            element: elementName
        };
        
        document.body.appendChild(orb);
        elementalOrbs.push(orb);
        
        if (elementalOrbs.length > MAX_ORBS) {
            const oldOrb = elementalOrbs.shift();
            oldOrb?.remove();
        }
    }

    // Создание блесток с изображениями
    function createSparkle(x, y) {
        const sparkleTypes = [
            'images/effects/sparkle1.png',
            'images/effects/sparkle2.png',
            'images/effects/sparkle3.png',
            'images/effects/star.png',
            'images/effects/glitter.png'
        ];
        
        const sparkle = document.createElement('div');
        const sparkleType = sparkleTypes[Math.floor(Math.random() * sparkleTypes.length)];
        const size = 8 + Math.random() * 12;
        
        sparkle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: url('${sparkleType}') center/contain no-repeat;
            pointer-events: none;
            z-index: 9995;
            opacity: ${0.8 + Math.random() * 0.2};
            filter: drop-shadow(0 0 8px gold) brightness(1.3);
            left: ${x}px;
            top: ${y}px;
            transition: all 0.5s ease;
        `;
        
        sparkle.physData = {
            x: x,
            y: y,
            life: 0,
            maxLife: 400 + Math.random() * 200,
            scale: 0.5 + Math.random() * 0.5
        };
        
        document.body.appendChild(sparkle);
        sparkleEffects.push(sparkle);
        
        if (sparkleEffects.length > MAX_SPARKLES) {
            const oldSparkle = sparkleEffects.shift();
            oldSparkle?.remove();
        }
    }

    // Система анимации с requestAnimationFrame
    function animateAllEffects() {
        const now = Date.now();
        
        // Анимация trail частиц
        trailParticles.forEach((particle, index) => {
            const data = particle.physData;
            data.life += 16; // ~60fps
            
            if (data.life >= data.maxLife) {
                particle.remove();
                trailParticles.splice(index, 1);
            } else {
                const progress = data.life / data.maxLife;
                
                // Физика движения
                data.x += data.vx;
                data.y += data.vy;
                data.vy += 0.1; // гравитация
                data.rotation += data.rotationSpeed;
                data.scale = 1 - progress * 0.7;
                
                // Применение трансформаций
                particle.style.opacity = 0.8 * (1 - progress);
                particle.style.transform = `scale(${data.scale}) rotate(${data.rotation}deg)`;
                particle.style.left = `${data.x}px`;
                particle.style.top = `${data.y}px`;
            }
        });
        
        // Анимация элементальных сфер
        elementalOrbs.forEach((orb, index) => {
            const data = orb.physData;
            data.life += 16;
            
            if (data.life >= data.maxLife) {
                orb.remove();
                elementalOrbs.splice(index, 1);
            } else {
                const progress = data.life / data.maxLife;
                
                data.x += data.vx;
                data.y += data.vy;
                data.vy += 0.05;
                data.vx *= 0.98; // сопротивление
                data.vy *= 0.98;
                data.scale = 1 + progress * 0.5;
                
                orb.style.opacity = 0.9 * (1 - progress);
                orb.style.transform = `scale(${data.scale})`;
                orb.style.left = `${data.x}px`;
                orb.style.top = `${data.y}px`;
            }
        });
        
        // Анимация блесток
        sparkleEffects.forEach((sparkle, index) => {
            const data = sparkle.physData;
            data.life += 16;
            
            if (data.life >= data.maxLife) {
                sparkle.remove();
                sparkleEffects.splice(index, 1);
            } else {
                const progress = data.life / data.maxLife;
                sparkle.style.opacity = data.scale * (1 - progress);
                sparkle.style.transform = `scale(${data.scale * (1 - progress)}) rotate(${progress * 360}deg)`;
            }
        });
        
        requestAnimationFrame(animateAllEffects);
    }

    // Обработчики событий с улучшенной производительностью
    let mouseX = 0, mouseY = 0;
    let lastX = 0, lastY = 0;
    let velocity = 0;
    let isInteracting = false;
    let trailCooldown = 0;

    const updateCursorPosition = (x, y) => {
        // Мгновенное позиционирование основного курсора
        mainCursor.style.left = `${x - 16}px`;
        mainCursor.style.top = `${y - 16}px`;
        
        // Плавное следование ауры и свечения
        const auraX = parseFloat(cursorAura.style.left) || x - 25;
        const auraY = parseFloat(cursorAura.style.top) || y - 25;
        
        cursorAura.style.left = `${auraX + (x - 25 - auraX) * 0.3}px`;
        cursorAura.style.top = `${auraY + (y - 25 - auraY) * 0.3}px`;
        
        cursorGlow.style.left = `${auraX + (x - 35 - auraX) * 0.2}px`;
        cursorGlow.style.top = `${auraY + (y - 35 - auraY) * 0.2}px`;
        
        // Расчет скорости для интенсивности эффектов
        const deltaX = x - lastX;
        const deltaY = y - lastY;
        velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Создание следов с учетом скорости
        if (velocity > 2 && trailCooldown <= 0) {
            const intensity = Math.min(velocity / 10, 3);
            createTrailParticle(x, y, intensity);
            
            // Случайные блестки при быстром движении
            if (Math.random() < velocity * 0.01) {
                createSparkle(x, y);
            }
            
            trailCooldown = Math.max(1, 4 - intensity);
        }
        
        lastX = x;
        lastY = y;
        if (trailCooldown > 0) trailCooldown--;
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateCursorPosition(mouseX, mouseY);
    });

    // Эпические эффекты при клике
    document.addEventListener('mousedown', (e) => {
        isInteracting = true;
        
        // Трансформации курсора
        mainCursor.style.transform = 'scale(1.8)';
        mainCursor.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 30px rgba(255, 140, 0, 0.8)) brightness(1.3)';
        cursorAura.style.transform = 'scale(1.5)';
        cursorAura.style.borderColor = 'rgba(255, 69, 0, 0.9)';
        cursorAura.style.boxShadow = '0 0 50px rgba(255, 69, 0, 0.8)';
        cursorGlow.style.transform = 'scale(1.8)';
        cursorGlow.style.opacity = '0.8';
        
        // Взрыв элементальных сфер
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                createElementalOrb(e.clientX, e.clientY);
            }, i * 30);
        }
        
        // Волна блесток
        for (let i = 0; i < 6; i++) {
            setTimeout(() => createSparkle(e.clientX, e.clientY), i * 50);
        }
    });

    document.addEventListener('mouseup', () => {
        isInteracting = false;
        resetCursorAppearance();
    });

    function resetCursorAppearance() {
        mainCursor.style.transform = 'scale(1)';
        mainCursor.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 140, 0, 0.6)) brightness(1.1)';
        cursorAura.style.transform = 'scale(1)';
        cursorAura.style.borderColor = 'rgba(255, 215, 0, 0.8)';
        cursorAura.style.boxShadow = '0 0 30px rgba(255, 140, 0, 0.6)';
        cursorGlow.style.transform = 'scale(1)';
        cursorGlow.style.opacity = '0.6';
    }

    // Интерактивные состояния
    document.addEventListener('mouseover', (e) => {
        if (e.target.matches('a, button, [role="button"], input, select, textarea, [onclick]')) {
            mainCursor.style.transform = 'scale(1.4)';
            mainCursor.style.filter = 'drop-shadow(0 0 12px rgba(255, 107, 107, 0.9)) drop-shadow(0 0 25px rgba(255, 69, 0, 0.7)) brightness(1.2)';
            cursorAura.style.borderColor = 'rgba(255, 107, 107, 0.9)';
            cursorAura.style.boxShadow = '0 0 40px rgba(255, 107, 107, 0.7)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.matches('a, button, [role="button"], input, select, textarea, [onclick]')) {
            if (!isInteracting) resetCursorAppearance();
        }
    });

    // Адаптация к скроллу
    window.addEventListener('scroll', () => {
        updateCursorPosition(mouseX, mouseY);
    });

    // Видимость курсора
    document.addEventListener('mouseleave', () => {
        mainCursor.style.opacity = '0';
        cursorAura.style.opacity = '0';
        cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        mainCursor.style.opacity = '1';
        cursorAura.style.opacity = '0.8';
        cursorGlow.style.opacity = '0.6';
    });

    // Запуск системы
    animateAllEffects();
    
    // Периодическая смена элемента для разнообразия
    setInterval(() => {
        if (Math.random() < 0.3) {
            createElementalOrb(mouseX + (Math.random() - 0.5) * 100, mouseY + (Math.random() - 0.5) * 100);
        }
    }, 2000);

    console.log('🎮✨ УЛЬТИМАТИВНЫЙ ЭФФЕКТ КУРСОРА GENSHIN IMPACT АКТИВИРОВАН!');
}

// Автоматическая инициализация
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUltimateGenshinCursor);
} else {
    initUltimateGenshinCursor();
}

// Периодическое обновление статистики
setInterval(() => {
    console.log('🔄 Автообновление статистики...');
    initRealTimeStats();
}, 60000);

// Принудительное обновление по клику
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('refresh-stats')) {
        e.preventDefault();
        initRealTimeStats();
    }
});

// Экспорт для глобального использования
window.ServerStats = {
    refresh: initRealTimeStats,
    getConfig: () => SERVER_CONFIG,
    getAPI: () => serverAPI,
    getPlayersManager: () => playersManager
};