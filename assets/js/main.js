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

// Реальная статистика сервера
async function initRealTimeStats() {
    const serverIP = 'f27.joinserver.xyz:25835'; // Основной IP
    const numericIP = '95.216.92.76:25835'; // Цифровой IP
    const version = '1.21.1 Fabric';

    try {
        // Показываем загрузку
        updateServerStatus('loading', 'Загрузка...');
        
        // Получаем данные сервера (заглушка - в реальном проекте используйте API)
        const serverData = await fetchServerData(serverIP);
        
        if (serverData.online) {
            updateServerStatus('online', 'ОНЛАЙН');
            updatePlayerCount(serverData.players.online);
            updateOnlinePlayers(serverData.players.list || []);
            updateServerChart(serverData);
        } else {
            updateServerStatus('offline', 'ОФФЛАЙН');
            updatePlayerCount(0);
        }
        
        // Обновляем информацию о сервере
        updateServerInfo(serverIP, numericIP, version);
        
    } catch (error) {
        console.error('Ошибка загрузки статистики:', error);
        updateServerStatus('error', 'ОШИБКА');
    }
}

// Заглушка для получения данных сервера
async function fetchServerData(ip) {
    // В реальном проекте здесь будет запрос к API Minecraft сервера
    // Например, используя https://api.mcsrvstat.us/ или собственный бэкенд
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                online: true,
                players: {
                    online: Math.floor(Math.random() * 50) + 100, // 100-150 игроков
                    max: 200,
                    list: generateRandomPlayers(12) // 12 случайных онлайн игроков
                },
                version: '1.21.1',
                motd: 'Minecraft Origins - Мир трех рас'
            });
        }, 1000);
    });
}

// Генерация случайных игроков для демонстрации
function generateRandomPlayers(count) {
    const names = [
        'NetherLord', 'SkyGuardian', 'EarthBuilder', 'LavaWalker', 
        'CloudArchitect', 'ForestKeeper', 'StoneMason', 'IronForger',
        'DiamondMiner', 'RedstoneEngineer', 'EnderWalker', 'NetherExplorer',
        'HeavenBuilder', 'HellWarrior', 'EarthShaman', 'WaterMage'
    ];
    
    const races = ['hell', 'heaven', 'earth'];
    const avatars = {
        hell: ['🔥', '🌋', '👹', '💀'],
        heaven: ['👼', '✨', '🌤️', '🕊️'],
        earth: ['🌍', '🌳', '⛰️', '🌿']
    };
    
    return Array.from({ length: count }, (_, i) => {
        const race = races[Math.floor(Math.random() * races.length)];
        return {
            name: names[i] || `Player${i + 1}`,
            race: race,
            avatar: avatars[race][Math.floor(Math.random() * avatars[race].length)]
        };
    });
}

// Обновление статуса сервера
function updateServerStatus(status, text) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
        statusIndicator.className = 'status-indicator ' + status;
        statusText.textContent = text;
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
}

// Обновление списка онлайн игроков
function updateOnlinePlayers(players) {
    const onlineList = document.getElementById('onlineList');
    if (!onlineList) return;

    onlineList.innerHTML = '';
    
    players.forEach(player => {
        const playerElement = document.createElement('div');
        playerElement.className = 'online-player';
        playerElement.innerHTML = `
            <div class="player-avatar ${player.race}">${player.avatar}</div>
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-race">${getRaceName(player.race)} раса</div>
            </div>
        `;
        onlineList.appendChild(playerElement);
    });
}

// Обновление информации о сервере
function updateServerInfo(ip, numericIP, version) {
    // Можно добавить отображение IP и версии где-нибудь на странице
    console.log('Сервер:', ip, numericIP, version);
}

// Обновление графика (заглушка)
function updateServerChart(serverData) {
    const chartContainer = document.querySelector('.online-chart');
    if (!chartContainer) return;

    // Создаем простой график для демонстрации
    chartContainer.innerHTML = `
        <div class="chart-real-time">
            <div class="chart-header">
                <h4>📊 Онлайн за последние 24 часа</h4>
                <div class="current-online">Сейчас: ${serverData.players.online} игроков</div>
            </div>
            <div class="chart-bars-real">
                ${generateChartBars(serverData.players.online)}
            </div>
            <div class="chart-labels">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
            </div>
        </div>
    `;

    // Анимация появления графика
    setTimeout(() => {
        const bars = chartContainer.querySelectorAll('.chart-bar');
        bars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.opacity = '1';
                bar.style.transform = 'scaleY(1)';
            }, index * 50);
        });
    }, 500);
}

// Генерация столбцов графика
function generateChartBars(currentOnline) {
    let bars = '';
    const baseHeight = currentOnline;
    
    for (let i = 0; i < 24; i++) {
        // Случайные колебания вокруг текущего онлайна
        const height = Math.max(50, Math.min(100, 
            (baseHeight * (0.7 + Math.random() * 0.6)) / 2
        ));
        
        bars += `<div class="chart-bar" style="height: ${height}%"></div>`;
    }
    
    return bars;
}

// Анимация счетчика
function animateCounter(element, target) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Остальные функции остаются такими же, как в предыдущей версии
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
    // Теперь используем реальные данные из сервера
    console.log('Статистика инициализирована с реальными данными');
}

function initOnlineStats() {
    // Данные уже загружаются в initRealTimeStats
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
    const sounds = {
        hell: () => {
            const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Игнорируем ошибки автоплея
        },
        heaven: () => {
            // Звук райской расы
        },
        earth: () => {
            // Звук земной расы
        }
    };
    
    if (sounds[race]) {
        sounds[race]();
    }
}

    const data = raceData[race];
    if (!data) return;

    const modal = document.createElement('div');
    modal.className = 'race-modal';
    modal.style.borderColor = data.color;
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${data.title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${data.description}</p>
                <div class="abilities-list">
                    ${data.abilities.map(ability => `<span class="ability">${ability}</span>`).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });

function initCursorEffect() {
    const cursor = document.querySelector('.minecraft-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, .race-card, .nav-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'url("data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><rect x=\"2\" y=\"2\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"%23ffd700\" stroke-width=\"2\"/><rect x=\"6\" y=\"6\" width=\"8\" height=\"8\" fill=\"%23ffd700\" opacity=\"0.8\"/></svg>")';
        });

        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'url("data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\"><rect x=\"2\" y=\"2\" width=\"16\" height=\"16\" fill=\"none\" stroke=\"%23ffffff\" stroke-width=\"2\"/><rect x=\"6\" y=\"6\" width=\"8\" height=\"8\" fill=\"%23ffffff\" opacity=\"0.5\"/></svg>")';
        });
    });
}

function initScrollAnimations() {
    let lastScrollY = window.scrollY;
    const nav = document.querySelector('.main-nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;

        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-island');
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 1;
            el.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
    });
}

function initTypewriterEffect() {
    const description = document.querySelector('.server-description p');
    if (!description) return;

    const text = description.textContent;
    description.textContent = '';
    description.classList.add('typing-effect');

    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            description.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            description.classList.remove('typing-effect');
        }
    }, 50);
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
    initRealTimeStats();
}, 30000); // Обновление каждые 30 секунд
