// Professional Loading Screen for MineOrigins Server
(function() {
    'use strict';
    
    // Создаем экран загрузки сразу при запуске скрипта
    const loadingHTML = `
        <div id="mineorigins-loading" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a0f 0%, #0f0f17 50%, #1a1a2e 100%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'Orbitron', sans-serif;
            color: #ffffff;
            overflow: hidden;
        ">
            <!-- Анимированный фон -->
            <div class="loading-bg-animation" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            ">
                <div class="floating-island hell-island" style="
                    position: absolute;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, #ff6b6b 0%, transparent 70%);
                    top: 20%;
                    left: 15%;
                    border-radius: 50%;
                    filter: blur(30px);
                    opacity: 0.1;
                    animation: floatIsland 15s infinite linear;
                "></div>
                <div class="floating-island heaven-island" style="
                    position: absolute;
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, #80deea 0%, transparent 70%);
                    top: 60%;
                    right: 10%;
                    border-radius: 50%;
                    filter: blur(30px);
                    opacity: 0.1;
                    animation: floatIsland 18s infinite linear reverse;
                    animation-delay: -5s;
                "></div>
                <div class="floating-island earth-island" style="
                    position: absolute;
                    width: 220px;
                    height: 220px;
                    background: radial-gradient(circle, #aed581 0%, transparent 70%);
                    bottom: 15%;
                    left: 50%;
                    border-radius: 50%;
                    filter: blur(30px);
                    opacity: 0.1;
                    animation: floatIsland 20s infinite linear;
                    animation-delay: -10s;
                "></div>
            </div>

            <!-- Основной контент -->
            <div class="loading-content" style="
                position: relative;
                z-index: 2;
                text-align: center;
                max-width: 800px;
                padding: 0 2rem;
            ">
                <!-- Логотип -->
                <div class="loading-logo" style="
                    margin-bottom: 3rem;
                    perspective: 1000px;
                ">
                    <div class="logo-3d" style="
                        font-family: 'Minecraft', 'Orbitron', sans-serif;
                        font-size: 4rem;
                        font-weight: 900;
                        text-transform: uppercase;
                        margin-bottom: 1rem;
                        line-height: 1.1;
                        background: linear-gradient(45deg, #ffffff, #ffd700);
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                        transform-style: preserve-3d;
                    ">
                        <div style="display: block;">MINE</div>
                        <div style="display: block; color: #7e57c2;">ORIGINS</div>
                    </div>
                </div>

                <!-- Прогресс бар -->
                <div class="loading-progress-container" style="
                    width: 100%;
                    max-width: 500px;
                    margin: 0 auto 3rem;
                ">
                    <div class="progress-bar-wrapper" style="
                        width: 100%;
                        height: 6px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 3px;
                        overflow: hidden;
                        margin-bottom: 1rem;
                        border: 1px solid rgba(255,255,255,0.1);
                    ">
                        <div class="progress-bar" style="
                            width: 0%;
                            height: 100%;
                            background: linear-gradient(90deg, #ff4444, #4fc3f7, #8bc34a);
                            border-radius: 3px;
                            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                            position: relative;
                            overflow: hidden;
                        ">
                            <div class="progress-shimmer" style="
                                position: absolute;
                                top: 0;
                                left: -100%;
                                width: 100%;
                                height: 100%;
                                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
                                animation: shimmer 2s infinite;
                            "></div>
                        </div>
                    </div>
                    
                    <div class="progress-info" style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 0.9rem;
                        color: #b0b0b0;
                    ">
                        <div class="loading-step">Загрузка ядра сервера...</div>
                        <div class="loading-percentage" style="
                            font-family: 'Minecraft', 'Orbitron', sans-serif;
                            font-weight: bold;
                            color: #ffd700;
                            font-size: 1.1rem;
                            margin: auto;
                            margin-left: 10px;
                        ">0%</div>
                    </div>
                </div>
            </div>
        </div>

        <style>
        @font-face {
            font-family: 'Minecraft';
            src: url('../fonts/MinecraftTen-VGORe.woff') format('woff'),
                 url('https://fonts.cdnfonts.com/css/minecraft-4') format('woff');
            font-weight: normal;
            font-style: normal;
            font-display: swap; /* Для лучшей производительности */
        }
        
        /* Подключение Orbitron (пример через Google Fonts) */
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap');

            @keyframes floatIsland {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg) scale(1);
                }
                33% {
                    transform: translateY(-20px) rotate(120deg) scale(1.05);
                }
                66% {
                    transform: translateY(10px) rotate(240deg) scale(0.95);
                }
            }

            @keyframes logoGlow {
                0% {
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
                }
                100% {
                    text-shadow: 
                        0 0 30px #7e57c2,
                        0 0 40px #7e57c2,
                        0 0 60px #7e57c2;
                }
            }

            @keyframes shimmer {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 0.5;
                    transform: scale(1);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.1);
                }
            }

            .race-preview-item.active {
                opacity: 1 !important;
            }

            .race-preview-item.active .race-icon {
                filter: grayscale(0) !important;
                animation: pulse 2s infinite;
            }

            .hell-race.active .race-icon {
                color: #ff4444 !important;
            }

            .heaven-race.active .race-icon {
                color: #4fc3f7 !important;
            }

            .earth-race.active .race-icon {
                color: #8bc34a !important;
            }
        </style>
    `;
    
    // Вставляем экран загрузки в самое начало body
    if (document.body) {
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        startProfessionalLoading();
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.insertAdjacentHTML('afterbegin', loadingHTML);
            startProfessionalLoading();
        });
    }
    
    function startProfessionalLoading() {
        const loadingScreen = document.getElementById('mineorigins-loading');
        const progressBar = loadingScreen.querySelector('.progress-bar');
        const loadingStep = loadingScreen.querySelector('.loading-step');
        const loadingPercentage = loadingScreen.querySelector('.loading-percentage');
        const raceItems = loadingScreen.querySelectorAll('.race-preview-item');
        
        const loadingSequence = [
            { 
                step: 'Загрузка ядра сервера...', 
                progress: 10, 
                raceIndex: -1,
                duration: 800 
            },
            { 
                step: 'Загрузка базы данных игроков...', 
                progress: 25, 
                raceIndex: -1,
                duration: 700 
            },
            { 
                step: 'Настройка систем рас демонов...', 
                progress: 40, 
                raceIndex: 0,
                duration: 600 
            },
            { 
                step: 'Настройка способностей ангелов...', 
                progress: 55, 
                raceIndex: 1,
                duration: 650 
            },
            { 
                step: 'Подготовка земных объектов...', 
                progress: 70, 
                raceIndex: 2,
                duration: 600 
            },
            { 
                step: 'Оптимизация производительности сервера...', 
                progress: 85, 
                raceIndex: -1,
                duration: 800 
            },
            { 
                step: 'Завершение генерации мира...', 
                progress: 95, 
                raceIndex: -1,
                duration: 500 
            }
        ];
        
        let currentStep = 0;
        
        function executeStep() {
            if (currentStep < loadingSequence.length) {
                const step = loadingSequence[currentStep];
                
                // Обновляем текст шага
                loadingStep.textContent = step.step;
                
                // Обновляем прогресс
                progressBar.style.width = step.progress + '%';
                loadingPercentage.textContent = step.progress + '%';
                
                // Активируем расу если нужно
                if (step.raceIndex !== -1 && raceItems[step.raceIndex]) {
                    raceItems.forEach(item => item.classList.remove('active'));
                    raceItems[step.raceIndex].classList.add('active');
                }
                
                currentStep++;
                setTimeout(executeStep, step.duration);
            } else {
                // Завершаем загрузку
                completeLoading();
            }
        }
        
        // Запускаем последовательность
        setTimeout(executeStep, 500);
    }
    
    function completeLoading() {
        const loadingScreen = document.getElementById('mineorigins-loading');
        const progressBar = loadingScreen.querySelector('.progress-bar');
        const loadingStep = loadingScreen.querySelector('.loading-step');
        const loadingPercentage = loadingScreen.querySelector('.loading-percentage');
        const raceItems = loadingScreen.querySelectorAll('.race-preview-item');
        
        // Финальные 100%
        progressBar.style.width = '100%';
        loadingPercentage.textContent = '100%';
        loadingStep.textContent = 'Готово! Приятного нахождения на сайте "MineOrigins"';
        
        // Активируем все расы
        raceItems.forEach(item => item.classList.add('active'));
        
        // Ждем полной загрузки страницы
        if (document.readyState === 'complete') {
            fadeOutLoading();
        } else {
            window.addEventListener('load', fadeOutLoading);
            // На всякий случай таймаут
            setTimeout(fadeOutLoading, 2000);
        }
    }
    
    function fadeOutLoading() {
        const loadingScreen = document.getElementById('mineorigins-loading');
        
        if (!loadingScreen) return;
        
        // Анимация исчезновения
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 800);
    }
    
    // Обработка ошибок
    window.addEventListener('error', function() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('mineorigins-loading');
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        }, 1000);
    });
    
    // Предотвращение взаимодействия с контентом под экраном загрузки
    document.addEventListener('DOMContentLoaded', function() {
        document.body.style.overflow = 'hidden';
        
        // Восстанавливаем скролл после загрузки
        window.addEventListener('load', function() {
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 1000);
        });
    });
    
})();