// Система проверки капчи перед загрузкой основной страницы
class CaptchaLoader {
    constructor() {
        this.verificationKey = 'captcha_verification';
        this.init();
    }

    init() {
        if (!this.isVerificationValid()) {
            this.showCaptchaWall();
        } else {
            this.hideCaptchaWall();
        }
    }

    isVerificationValid() {
        // Проверяем sessionStorage для текущей сессии
        if (sessionStorage.getItem('captcha_passed') === 'true') {
            return true;
        }

        // Проверяем localStorage для 24-часового периода
        const verification = localStorage.getItem(this.verificationKey);
        if (!verification) return false;

        try {
            const data = JSON.parse(verification);
            const now = Date.now();
            const hoursPassed = (now - data.timestamp) / (1000 * 60 * 60);
            return hoursPassed < 24;
        } catch {
            return false;
        }
    }

    showCaptchaWall() {
        // Создаем overlay для капчи
        const overlay = document.createElement('div');
        overlay.id = 'captchaOverlay';
        overlay.innerHTML = `
            <div class="captcha-wall">
                <div class="captcha-wall-content">
                    <div class="security-header">
                        <i class="fas fa-shield-alt"></i>
                        <h2>Требуется проверка безопасности</h2>
                    </div>
                    <p>Пожалуйста, подтвердите что вы человек для доступа к сайту</p>
                    <div class="captcha-actions">
                        <button id="startCaptcha" class="btn-primary">
                            <i class="fas fa-play"></i>
                            Начать проверку
                        </button>
                        <button id="learnMore" class="btn-secondary">
                            <i class="fas fa-info-circle"></i>
                            Подробнее
                        </button>
                    </div>
                    <div class="security-info">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>Проверка требуется 1 раз в 24 часа</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-shield"></i>
                            <span>Защита от автоматических запросов</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Добавляем стили
        const styles = document.createElement('style');
        styles.textContent = `
            #captchaOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 10, 15, 0.95);
                backdrop-filter: blur(20px);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Exo 2', sans-serif;
            }
            
            .captcha-wall {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 3rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
                backdrop-filter: blur(10px);
            }
            
            .security-header {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 1rem;
                color: #6366f1;
            }
            
            .security-header i {
                font-size: 2rem;
            }
            
            .security-header h2 {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.5rem;
            }
            
            .captcha-wall p {
                color: #94a3b8;
                margin-bottom: 2rem;
                line-height: 1.6;
            }
            
            .captcha-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-bottom: 2rem;
            }
            
            .btn-primary, .btn-secondary {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 10px;
                font-family: inherit;
                font-weight: 500;
                cursor: pointer;
                transition: 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .btn-primary {
                background: #6366f1;
                color: white;
            }
            
            .btn-primary:hover {
                background: #4f46e5;
                transform: translateY(-2px);
            }
            
            .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .security-info {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .info-item {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                color: #64748b;
                font-size: 0.9rem;
            }
            
            @media (max-width: 480px) {
                .captcha-wall {
                    padding: 2rem 1.5rem;
                }
                
                .captcha-actions {
                    flex-direction: column;
                }
                
                .security-header {
                    flex-direction: column;
                    text-align: center;
                }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(overlay);

        // Обработчики событий
        document.getElementById('startCaptcha').addEventListener('click', () => {
            this.redirectToCaptcha();
        });

        document.getElementById('learnMore').addEventListener('click', () => {
            this.showLearnMore();
        });
    }

    hideCaptchaWall() {
        const overlay = document.getElementById('captchaOverlay');
        if (overlay) {
            overlay.remove();
        }
    }

    redirectToCaptcha() {
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = `captcha.html?return=${currentUrl}`;
    }

    showLearnMore() {
        alert(`Система безопасности MineOrigins

• Защита от ботов и авто запросов
• Проверка требуется 1 раз в 24 часа
• Используются различные типы когнитивных тестов
• Данные проверки хранятся локально в вашем браузере

Эта система помогает поддерживать безопасность и производительность сайта для всех пользователей.`);
    }
}

// Автоматическая проверка при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Не проверяем на самой странице капчи
    if (window.location.pathname.includes('captcha.html')) return;
    
    window.captchaLoader = new CaptchaLoader();
});

// Утилиты для работы с капчей
window.CaptchaManager = {
    forceVerification: function() {
        localStorage.removeItem('captcha_verification');
        sessionStorage.removeItem('captcha_passed');
        window.captchaLoader?.showCaptchaWall();
    },
    
    checkStatus: function() {
        return window.captchaLoader?.isVerificationValid() || false;
    },
    
    getVerificationTime: function() {
        const verification = localStorage.getItem('captcha_verification');
        if (!verification) return null;
        
        try {
            const data = JSON.parse(verification);
            return new Date(data.timestamp);
        } catch {
            return null;
        }
    }
};