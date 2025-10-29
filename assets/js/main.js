// Главный скрипт с реальной статистикой сервера Minecraft
document.addEventListener('DOMContentLoaded', function() {
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
        backup: 'https://api.mcsrvstat.us/2/95.216.92.76:25835'
    }
};

// Реальная статистика сервера
async function initRealTimeStats() {
    try {
        // Показываем загрузку
        updateServerStatus('loading', 'Загрузка...');
        
        // Получаем реальные данные сервера
        const serverData = await fetchRealServerData();
        
        if (serverData.online) {
            updateServerStatus('online', 'ОНЛАЙН');
            updatePlayerCount(serverData.players.online);
            updateOnlinePlayers(serverData.players.list || []);
            updateServerInfo(serverData);
            updateServerChart(serverData);
        } else {
            updateServerStatus('offline', 'ОФФЛАЙН');
            updatePlayerCount(0);
            showOfflineMessage();
        }
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        updateServerStatus('error', 'ОШИБКА');
        // Пробуем backup API
        try {
            const backupData = await fetchBackupServerData();
            if (backupData.online) {
                updateServerStatus('online', 'ОНЛАЙН');
                updatePlayerCount(backupData.players.online);
            }
        } catch (backupError) {
            console.error('Backup API тоже не работает:', backupError);
        }
    }
}

// Получение реальных данных сервера
async function fetchRealServerData() {
    try {
        console.log('🔄 Запрос к основному API...');
        const response = await fetch(SERVER_CONFIG.apiEndpoints.status, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'MineOrigins-Website/1.0'
            },
            timeout: 10000
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Данные сервера получены:', data);

        return {
            online: data.online || false,
            players: {
                online: data.players?.online || 0,
                max: data.players?.max || 0,
                list: data.players?.list || []
            },
            version: data.version || 'Неизвестно',
            motd: data.motd?.clean ? data.motd.clean[0] : 'Minecraft Origins Server',
            hostname: data.hostname || SERVER_CONFIG.primaryIP,
            port: data.port || 25835
        };

    } catch (error) {
        console.error('❌ Ошибка основного API:', error);
        // Пробуем ping API как fallback
        return await fetchPingData();
    }
}

// Получение данных через ping API
async function fetchPingData() {
    try {
        console.log('🔄 Запрос к Ping API...');
        const response = await fetch(SERVER_CONFIG.apiEndpoints.ping, {
            method: 'GET',
            timeout: 8000
        });

        if (!response.ok) throw new Error('Ping API недоступен');

        const data = await response.json();
        console.log('✅ Ping данные получены:', data);

        return {
            online: data.online || false,
            players: {
                online: data.players?.online || 0,
                max: data.players?.max || 0,
                list: []
            },
            version: data.version || 'Неизвестно',
            motd: data.description?.text || 'Minecraft Origins Server'
        };

    } catch (error) {
        console.error('❌ Ошибка Ping API:', error);
        throw error;
    }
}

// Backup API запрос
async function fetchBackupServerData() {
    try {
        console.log('🔄 Запрос к backup API...');
        const response = await fetch(SERVER_CONFIG.apiEndpoints.backup);
        
        if (!response.ok) throw new Error('Backup API недоступен');
        
        const data = await response.json();
        return {
            online: data.online || false,
            players: {
                online: data.players?.online || 0,
                max: data.players?.max || 0
            },
            version: data.version || 'Неизвестно'
        };
    } catch (error) {
        console.error('❌ Все API недоступны:', error);
        return {
            online: false,
            players: { online: 0, max: 0 },
            version: 'Неизвестно'
        };
    }
}

// Обновление статуса сервера
function updateServerStatus(status, text) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
        // Удаляем все классы статусов и добавляем текущий
        statusIndicator.className = 'status-indicator';
        statusIndicator.classList.add(status);
        statusText.textContent = text;

        // Добавляем анимацию
        statusIndicator.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => statusIndicator.style.animation = '', 500);
    }

    // Обновляем статус в навигации если есть
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
        
        // Анимация изменения
        playerCount.style.transform = 'scale(1.2)';
        setTimeout(() => playerCount.style.transform = 'scale(1)', 300);
    }
    
    // Обновление статистики на главной
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (target > 0) {
            animateCounter(stat, count);
        }
    });

    // Обновляем прогресс бар онлайна если есть
    updateOnlineProgress(count);
}

// Обновление прогресс бара онлайна
function updateOnlineProgress(onlineCount) {
    const progressBar = document.querySelector('.online-progress');
    const maxPlayers = 200; // Максимальное количество игроков
    
    if (progressBar) {
        const percentage = Math.min((onlineCount / maxPlayers) * 100, 100);
        progressBar.style.width = percentage + '%';
        
        // Меняем цвет в зависимости от заполненности
        if (percentage > 80) {
            progressBar.style.background = 'var(--hell-color)';
        } else if (percentage > 50) {
            progressBar.style.background = 'var(--earth-color)';
        } else {
            progressBar.style.background = 'var(--heaven-color)';
        }
    }
}

// Обновление списка онлайн игроков
function updateOnlinePlayers(players) {
    const onlineList = document.getElementById('onlineList');
    if (!onlineList) return;

    // Очищаем только если есть новые данные
    if (players.length > 0) {
        onlineList.innerHTML = '';
        
        players.slice(0, 15).forEach(player => { // Ограничиваем до 15 игроков
            const playerElement = document.createElement('div');
            playerElement.className = 'online-player';
            
            // Определяем расу по имени или случайно
            const race = determinePlayerRace(player);
            
            playerElement.innerHTML = `
                <div class="player-avatar ${race}">${getRaceEmoji(race)}</div>
                <div class="player-info">
                    <div class="player-name">${player}</div>
                    <div class="player-race">${getRaceName(race)}</div>
                </div>
            `;
            onlineList.appendChild(playerElement);
        });

        // Показываем количество скрытых игроков
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
    } else {
        onlineList.innerHTML = `
            <div class="no-players">
                <div class="no-players-icon">👥</div>
                <div class="no-players-text">Нет игроков онлайн</div>
            </div>
        `;
    }
}

// Определение расы игрока по имени
function determinePlayerRace(playerName) {
    const races = ['hell', 'heaven', 'earth'];
    
    // Простая эвристика по имени игрока
    if (playerName.toLowerCase().includes('nether') || 
        playerName.toLowerCase().includes('fire') ||
        playerName.toLowerCase().includes('demon')) {
        return 'hell';
    } else if (playerName.toLowerCase().includes('sky') ||
               playerName.toLowerCase().includes('angel') ||
               playerName.toLowerCase().includes('wing')) {
        return 'heaven';
    } else if (playerName.toLowerCase().includes('earth') ||
               playerName.toLowerCase().includes('stone') ||
               playerName.toLowerCase().includes('forest')) {
        return 'earth';
    }
    
    // Случайная раса если не удалось определить
    return races[Math.floor(Math.random() * races.length)];
}

// Получение emoji для расы
function getRaceEmoji(race) {
    const emojis = {
        hell: '🔥',
        heaven: '👼',
        earth: '🌍'
    };
    return emojis[race] || '👤';
}

// Обновление информации о сервере
function updateServerInfo(serverData) {
    // Обновляем информацию в различных местах страницы
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

    // Обновляем MOTD если есть
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

    // Анимация появления
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
    const hours = 12; // Показываем 12 последних часов
    
    for (let i = 0; i < hours; i++) {
        // Имитация исторических данных с небольшими колебаниями
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

    // Проверяем, нет ли уже сообщения
    if (!document.querySelector('.offline-message')) {
        const offlineMessage = document.createElement('div');
        offlineMessage.className = 'offline-message';
        offlineMessage.innerHTML = `
            <div class="offline-icon">🔌</div>
            <h3>Сервер временно недоступен</h3>
            <p>Мы уже работаем над решением проблемы. Попробуйте обновить страницу через несколько минут.</p>
            <button onclick="initRealTimeStats()" class="retry-btn">🔄 Обновить статус</button>
        `;
        
        mainContent.prepend(offlineMessage);
        
        // Автоматическое скрытие через 10 секунд
        setTimeout(() => {
            if (offlineMessage.parentNode) {
                offlineMessage.style.opacity = '0';
                setTimeout(() => offlineMessage.remove(), 300);
            }
        }, 10000);
    }
}

// Анимация счетчика
function animateCounter(element, target) {
    const duration = 1500;
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Остальные функции остаются без изменений
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

function playRaceSound(race) {
    // Реализация звуков рас...
}

function showRaceModal(race) {
    // Реализация модального окна рас...
}

function initCursorEffect() {
    // Реализация эффекта курсора...
}

function initScrollAnimations() {
    // Реализация анимаций скролла...
}

function initTypewriterEffect() {
    // Реализация эффекта печатной машинки...
}

// Вспомогательная функция
function getRaceName(race) {
    const races = {
        hell: 'Демоны',
        heaven: 'Ангелы',
        earth: 'Земные'
    };
    return races[race] || 'Неизвестно';
}

// Периодическое обновление статистики
setInterval(() => {
    console.log('🔄 Автообновление статистики...');
    initRealTimeStats();
}, 60000); // Обновление каждые 60 секунд

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
    getConfig: () => SERVER_CONFIG
};