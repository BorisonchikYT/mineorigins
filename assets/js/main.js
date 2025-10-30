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
            }
            // ... остальные игроки
        ];
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
            console.log('🔄 Запрос к основному API...');
            
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
            console.log('✅ Данные сервера получены:', data);

            // Сбрасываем счетчик повторений при успехе
            this.retryCount = 0;
            
            return this.processServerData(data);

        } catch (error) {
            console.error('❌ Ошибка основного API:', error);
            this.retryCount++;
            
            if (this.retryCount <= this.maxRetries) {
                console.log(`🔄 Повторная попытка ${this.retryCount}/${this.maxRetries}...`);
                return await this.tryBackupAPIs();
            } else {
                throw new Error('Все API недоступны после нескольких попыток');
            }
        }
    }

    // Обработка данных сервера
    processServerData(data) {
        console.log('🔧 Обработка данных сервера:', data);
        
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

        console.log('📊 Обработанные данные:', result);
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
                console.log(`🔄 Попытка backup API: ${apiUrl}`);
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
                    console.log(`✅ Backup API сработал: ${apiUrl}`, data);
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
        console.log(`🔧 Обработка backup данных от ${apiUrl}:`, data);
        
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
                motd: data.motd?.clean || 'Minecraft Origins Server',
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
                motd: data.description || 'Minecraft Origins Server',
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
        console.log('🔄 Используем fallback данные');
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
        console.log('🎮 Инициализация реальной статистики...');
        
        // Показываем загрузку
        updateServerStatus('loading', 'Загрузка...');
        
        // Загружаем данные игроков если еще не загружены
        if (!playersManager.loaded) {
            await playersManager.loadPlayersData();
        }
        
        // Получаем реальные данные сервера
        const serverData = await serverAPI.getServerStatus();
        
        console.log('📈 Обновление интерфейса с данными:', serverData);
        
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
            
            console.log('✅ Статистика успешно обновлена');
            
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
async function updateOnlinePlayers(players, hasRealPlayerData) {
    const onlineList = document.getElementById('onlineList');
    if (!onlineList) {
        console.warn('❌ Элемент onlineList не найден');
        return;
    }

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
                <div class="no-players-text">Сейчас на сервере нет игроков</div>
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
function showOfflineMessage(customMessage = null) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    if (!document.querySelector('.offline-message')) {
        const offlineMessage = document.createElement('div');
        offlineMessage.className = 'offline-message';
        offlineMessage.innerHTML = `
            <div class="offline-icon">🔌</div>
            <h3>Сервер временно недоступен</h3>
            <p>${customMessage || 'Мы уже работаем над решением проблемы. Попробуйте обновить страницу через несколько минут.'}</p>
            <button class="retry-btn" onclick="initRealTimeStats()">🔄 Обновить</button>
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

    // Основной курсор с кастомным изображением
    const mainCursor = createCursorLayer('main', '', `
        position: fixed;
        width: 32px;
        height: 32px;
        background: url('assets/images/cursor/genshin-cursor.png') center/contain no-repeat;
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

    // Обработчики событий с улучшенной производительностью
    let mouseX = 0, mouseY = 0;
    let lastX = 0, lastY = 0;

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
        
        lastX = x;
        lastY = y;
    };

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        updateCursorPosition(mouseX, mouseY);
    });

    // Эпические эффекты при клике
    document.addEventListener('mousedown', (e) => {
        mainCursor.style.transform = 'scale(1.8)';
        mainCursor.style.filter = 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 30px rgba(255, 140, 0, 0.8)) brightness(1.3)';
        cursorAura.style.transform = 'scale(1.5)';
        cursorAura.style.borderColor = 'rgba(255, 69, 0, 0.9)';
        cursorAura.style.boxShadow = '0 0 50px rgba(255, 69, 0, 0.8)';
        cursorGlow.style.transform = 'scale(1.8)';
        cursorGlow.style.opacity = '0.8';
    });

    document.addEventListener('mouseup', () => {
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
            resetCursorAppearance();
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

    console.log('🎮✨ УЛЬТИМАТИВНЫЙ ЭФФЕКТ КУРСОРА GENSHIN IMPACT АКТИВИРОВАН!');
}

// Автоматическая инициализация курсора
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUltimateGenshinCursor);
} else {
    initUltimateGenshinCursor();
}

// Периодическое обновление статистики
setInterval(() => {
    console.log('🔄 Автообновление статистики...');
    initRealTimeStats();
}, 60000); // Каждую минуту

// Принудительное обновление по клику
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('refresh-stats') || 
        e.target.closest('.refresh-stats')) {
        e.preventDefault();
        console.log('🔄 Принудительное обновление статистики...');
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

// Инициализация других эффектов
function initScrollAnimations() {
    // Ваша реализация
}

function initTypewriterEffect() {
    // Ваша реализация  
}

function initCursorEffect() {
    // Уже реализовано выше
}

console.log('🎮 Скрипт статистики сервера загружен и готов к работе!');