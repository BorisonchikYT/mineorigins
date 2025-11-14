// Главный скрипт с реальной статистикой сервера Minecraft
document.addEventListener('DOMContentLoaded', function() {
    
    initAnimations();
    initServerStats();
    initOnlineStats();
    initRaceCards();
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
        // Основные API с правильными форматами
        status: 'https://api.mcsrvstat.us/3/95.216.92.76:25835',
        ping: 'https://api.mcsrvstat.us/ping/95.216.92.76:25835',
        backup: 'https://api.mcsrvstat.us/2/95.216.92.76:25835',
        // Альтернативные API
        alternative1: 'https://api.mcstatus.io/v2/status/java/95.216.92.76:25835',
        alternative2: 'https://api.minetools.eu/ping/95.216.92.76/25835',
        alternative3: 'https://api.mcsrvstat.us/bedrock/3/95.216.92.76:25835'
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
        
        // Для локального режима используем встроенные данные
        if (window.location.protocol === 'file:') {
            this.playersData = this.getDemoPlayersData();
            this.loaded = true;
            return this.playersData;
        }
        
        const response = await fetch('assets/json/players.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
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

    // Демо данные игроков (fallback)
    getDemoPlayersData() {
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
                "avatar": "assets/images/icons/ED4MKM_AERO.png",
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

getPlayerInfo(playerName) {
    if (!this.playersData || !Array.isArray(this.playersData)) {
        return null;
    }
    
    // Ищем игрока по имени (регистронезависимо)
    const player = this.playersData.find(p => 
        p.name && p.name.toLowerCase() === playerName.toLowerCase()
    );
    
    return player || null;
}
}

// Улучшенный класс для работы с API
class MinecraftServerAPI {
    constructor() {
        this.currentData = null;
        this.lastUpdate = null;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    // Основной метод получения статуса
    async getServerStatus() {
        try {
            
            // Добавляем timestamp для избежания кеширования
            const timestamp = Date.now();
            const apiUrl = `${SERVER_CONFIG.apiEndpoints.status}?t=${timestamp}`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'MinecraftServerStatus/1.0'
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Сбрасываем счетчик повторений при успехе
            this.retryCount = 0;
            
            return this.processServerData(data);

        } catch (error) {
            console.error('❌ Ошибка основного API:', error);
            this.retryCount++;
            
            if (this.retryCount <= this.maxRetries) {
                return await this.tryBackupAPIs();
            } else {
                throw new Error('Все API недоступны после нескольких попыток');
            }
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
        let motdText = 'MineOrigins Server';
        if (data.motd) {
            if (data.motd.clean && Array.isArray(data.motd.clean)) {
                motdText = data.motd.clean.join(' ');
            } else if (typeof data.motd === 'string') {
                motdText = data.motd;
            } else if (data.motd.html) {
                motdText = this.stripHtml(data.motd.html);
            }
        }

        // Определяем онлайн статус
        const isOnline = data.online === true || data.online === 'true';

        const result = {
            online: isOnline,
            players: {
                online: data.players?.online || 0,
                max: data.players?.max || 20,
                list: playersList
            },
            version: data.version || 'Неизвестно',
            motd: motdText,
            hostname: data.hostname || SERVER_CONFIG.primaryIP,
            port: data.port || 25835,
            icon: data.icon || null,
            software: data.software || 'Vanilla',
            hasRealPlayerData: hasRealPlayerData,
            lastUpdated: new Date().toLocaleTimeString()
        };

        return result;
    }

    // Удаление HTML тегов из текста
    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '');
    }

    // Попытка использовать backup API
    async tryBackupAPIs() {
        const backupAPIs = [
            SERVER_CONFIG.apiEndpoints.backup,
            SERVER_CONFIG.apiEndpoints.alternative1,
            SERVER_CONFIG.apiEndpoints.alternative2,
            SERVER_CONFIG.apiEndpoints.alternative3
        ];

        for (const apiUrl of backupAPIs) {
            try {
                const timestamp = Date.now();
                const urlWithTimestamp = `${apiUrl}?t=${timestamp}`;
                
                const response = await fetch(urlWithTimestamp, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    timeout: 8000
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return this.processBackupData(data, apiUrl);
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                console.warn(`⚠️ Backup API не сработал: ${apiUrl}`, error);
                continue;
            }
        }

        // Если все API не сработали, используем fallback данные
        return this.getFallbackData();
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
                    max: data.players?.max || 20,
                    list: playersList
                },
                version: data.version?.name_clean || 'Неизвестно',
                motd: data.motd?.clean || 'MineOrigins Server',
                hasRealPlayerData: hasRealPlayerData,
                lastUpdated: new Date().toLocaleTimeString()
            };
        } else if (apiUrl.includes('minetools.eu')) {
            // Формат minetools.eu
            playersList = data.players?.sample?.map(p => p.name) || [];
            hasRealPlayerData = playersList.length > 0;
            
            return {
                online: data.status === 'success',
                players: {
                    online: data.players?.online || 0,
                    max: data.players?.max || 20,
                    list: playersList
                },
                version: data.version || 'Неизвестно',
                motd: data.description || 'MineOrigins Server',
                hasRealPlayerData: hasRealPlayerData,
                lastUpdated: new Date().toLocaleTimeString()
            };
        } else {
            // Стандартный формат mcsrvstat.us
            return this.processServerData(data);
        }
    }

    // Fallback данные когда все API недоступны
    getFallbackData() {
        return {
            online: false,
            players: {
                online: 0,
                max: 20,
                list: []
            },
            version: 'Неизвестно',
            motd: 'Сервер временно недоступен',
            hasRealPlayerData: false,
            lastUpdated: new Date().toLocaleTimeString(),
            isFallback: true
        };
    }
}

// Создаем экземпляры менеджеров
const serverAPI = new MinecraftServerAPI();
const playersManager = new PlayersDataManager();

// Реальная статистика сервера
async function initRealTimeStats() {
    try {
        
        // Проверяем, есть ли на странице элементы статистики
        const hasStatsSection = document.querySelector('.online-stats') || 
                               document.querySelector('.server-stats') ||
                               document.querySelector('.status-indicator');
        
        if (!hasStatsSection) {
            // Если элементов статистики нет на этой странице - выходим
            return;
        }
        
        // Показываем загрузку
        updateServerStatus('loading', 'Загрузка...');
        
        // Загружаем данные игроков если еще не загружены
        if (!playersManager.loaded) {
            await playersManager.loadPlayersData();
        }
        
        // Получаем реальные данные сервера
        const serverData = await serverAPI.getServerStatus();
        
        
        if (serverData.online && !serverData.isFallback) {
            updateServerStatus('online', 'ОНЛАЙН');
            updatePlayerCount(serverData.players.online);
            
            // Обновляем список игроков с реальными данными
            await updateOnlinePlayers(serverData.players.list, serverData.hasRealPlayerData);
            
            updateServerInfo(serverData);
            updateServerChart(serverData);
            
            // Сохраняем данные для быстрого обновления
            serverAPI.currentData = serverData;
            serverAPI.lastUpdate = Date.now();
            
            
        } else if (serverData.isFallback) {
            // Все API недоступны
            updateServerStatus('error', 'ОШИБКА');
            updatePlayerCount(0);
            updateOnlinePlayers([], false);
            showOfflineMessage('Все сервисы статистики недоступны. Попробуйте позже.');
        } else {
            // Сервер оффлайн
            updateServerStatus('offline', 'ОФФЛАЙН');
            updatePlayerCount(0);
            updateOnlinePlayers([], false);
            showOfflineMessage('Сервер временно недоступен');
        }
        
    } catch (error) {
        console.error('❌ Ошибка загрузки статистики:', error);
        updateServerStatus('error', 'ОШИБКА');
        updatePlayerCount(0);
        showErrorMessage('Не удалось получить данные сервера: ' + error.message);
    }
}

// Обновление списка онлайн игроков
// Обновление списка онлайн игроков
async function updateOnlinePlayers(players, hasRealPlayerData) {
    const onlineList = document.getElementById('onlineList');
    
    // Если элемента нет на этой странице - просто выходим
    if (!onlineList) {
        return;
    }

    // Очищаем список
    onlineList.innerHTML = '';

    if (players && players.length > 0 && hasRealPlayerData) {
        
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
        onlineList.innerHTML = `
            <div class="no-players">
                <div class="no-players-text">На сервере играют ${players.length} игроков</div>
                <div class="no-players-subtext">Список игроков недоступен</div>
            </div>
        `;
    } else {
        // Если нет игроков онлайн
        onlineList.innerHTML = `
            <div class="no-players">
                <div class="no-players-text">Сейчас на сервере нет игроков</div>
            </div>
        `;
    }
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
                <h4><img src="assets/images/icons/stats.gif" class="resized-image" alt="Игроки" onerror="this.innerHTML='👥'"> Статистика онлайна</h4>
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
        </div>
    `;
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
                <img src="${avatarPath}" alt="${playerName}" style="width: 40px; height: 40px" 
                     onerror="this.src='assets/images/icons/ERROR.png'">
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
                     onerror="this.src='assets/images/icons/ERROR.png'">
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
    const races = ['hell', 'heaven', 'earth', 'timer', 'ii'];
    
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
        earth: 'Земной',
        timer: 'Хранитель Времени',
        ii: 'Чужой',
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
                <h4><img src="assets/images/icons/stats.gif" class="resized-image" alt="Игроки" onerror="this.innerHTML='👥'"> Статистика онлайна</h4>
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
        </div>
    `;
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
function showOfflineMessage(customMessage = null) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    if (!document.querySelector('.offline-message')) {
        const offlineMessage = document.createElement('div');
        offlineMessage.className = 'offline-message';
        offlineMessage.innerHTML = `
            <h3>Сервер временно недоступен</h3>
            <p>${customMessage || 'Возможные причины:'}</p>
            <p>Отсутствие подключение к интернету</p>
            <p>Включенный или выключенный VPN</p>
            <p>Ошибки браузера (Перезагрузите браузер)</p>
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
        <button class="retry-btn" onclick="initRealTimeStats()">🔄 Попробовать снова</button>
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
}

function initOnlineStats() {
}

function initRaceCards() {
    const raceCards = document.querySelectorAll('.race-card');
}

// Блокировка перетаскивания изображений
function disableImageDrag() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // CSS свойства
        img.style.userDrag = 'none';
        img.style.webkitUserDrag = 'none';
        img.style.MozUserDrag = 'none';
        img.style.userSelect = 'none';
        img.style.pointerEvents = 'none';
        
        // Атрибуты
        img.setAttribute('draggable', 'false');
        
        // Обработчики событий
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        img.addEventListener('mousedown', (e) => {
            e.preventDefault();
            return false;
        });
    });
}

// Вызовите при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    disableImageDrag();
});

// Периодическое обновление статистики (только если есть элементы статистики)
setInterval(() => {
    const hasStatsSection = document.querySelector('.online-stats') || 
                            document.querySelector('.server-stats') || 
                            document.querySelector('.status-text') || 
                            document.querySelector('.loading') || 
                            document.querySelector('.status-indicator') || 
                            document.querySelector('.server-status');
    if (hasStatsSection) {
        initRealTimeStats();
    }
}, 60000); // Каждую минуту

// Принудительное обновление по клику
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('refresh-stats') || 
        e.target.closest('.refresh-stats')) {
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


