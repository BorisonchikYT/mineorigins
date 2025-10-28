// captcha-system.js - ОБНОВЛЕННАЯ ВЕРСИЯ

class CaptchaSystem {
    constructor() {
        this.currentCaptcha = null;
        this.userInput = null;
        this.attempts = 0;
        this.maxAttempts = 3;
        this.init();
    }

    init() {
        this.loadRandomCaptcha();
        this.bindEvents();
        this.checkExistingVerification();
    }

    checkExistingVerification() {
        const verification = this.getStoredVerification();
        if (verification && this.isVerificationValid(verification)) {
            this.redirectToMain();
        }
    }

    getStoredVerification() {
        const verification = localStorage.getItem('captcha_verification');
        return verification ? JSON.parse(verification) : null;
    }

    isVerificationValid(verification) {
        const now = Date.now();
        const verificationTime = verification.timestamp;
        const hoursPassed = (now - verificationTime) / (1000 * 60 * 60);
        return hoursPassed < 24;
    }

    loadRandomCaptcha() {
        this.currentCaptcha = CaptchaUtils.getRandomCaptcha();
        this.renderCaptcha();
        this.resetInput();
    }

    renderCaptcha() {
        const container = document.getElementById('captchaCard');
        if (!container) return;

        container.innerHTML = '';
        container.className = 'captcha-card';

        // Используем универсальный рендерер
        const renderer = CaptchaRenderer.getRenderer(this.currentCaptcha.type);
        if (renderer) {
            renderer(this.currentCaptcha, container, this);
        } else {
            // Резервный рендерер для неизвестных типов
            this.renderFallbackCaptcha(container);
        }
    }

    renderFallbackCaptcha(container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--warning); margin-bottom: 1rem;"></i>
                <h3>Неизвестный тип задания</h3>
                <p>Пожалуйста, выберите другое задание</p>
            </div>
        `;
    }

    // ОСНОВНЫЕ МЕТОДЫ РЕНДЕРИНГА (сохранены для обратной совместимости)
    renderMathCaptcha(container) {
        container.classList.add('math-captcha');
        
        const problem = document.createElement('div');
        problem.className = 'math-problem';
        problem.textContent = this.currentCaptcha.question;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'math-input';
        input.placeholder = 'Ответ...';
        input.addEventListener('input', (e) => {
            this.userInput = e.target.value;
            this.updateVerifyButton();
        });

        container.appendChild(problem);
        container.appendChild(input);
    }

    renderPuzzleCaptcha(container) {
        container.classList.add('puzzle-captcha');
        
        const instruction = document.createElement('div');
        instruction.className = 'puzzle-instruction';
        instruction.textContent = this.currentCaptcha.instruction;

        const grid = document.createElement('div');
        grid.className = 'puzzle-grid';

        const shuffledOptions = CaptchaUtils.shuffleArray(this.currentCaptcha.options);
        this.userInput = [];

        shuffledOptions.forEach((number, index) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.textContent = number;
            piece.dataset.value = number;

            piece.addEventListener('click', () => {
                if (this.userInput.includes(number)) return;

                this.userInput.push(number);
                piece.classList.add('selected');

                const currentIndex = this.userInput.length - 1;
                if (this.userInput[currentIndex] === this.currentCaptcha.answer[currentIndex]) {
                    piece.classList.add('correct');
                } else {
                    piece.classList.add('incorrect');
                    setTimeout(() => {
                        this.userInput = [];
                        grid.querySelectorAll('.puzzle-piece').forEach(p => {
                            p.classList.remove('selected', 'correct', 'incorrect');
                        });
                    }, 1000);
                }

                this.updateVerifyButton();
            });

            grid.appendChild(piece);
        });

        container.appendChild(instruction);
        container.appendChild(grid);
    }

    renderImageCaptcha(container) {
        container.classList.add('image-captcha');
        
        const instruction = document.createElement('div');
        instruction.className = 'image-instruction';
        instruction.textContent = this.currentCaptcha.instruction;

        const grid = document.createElement('div');
        grid.className = 'image-grid';

        this.userInput = [];

        this.currentCaptcha.options.forEach((option, index) => {
            const imageOption = document.createElement('div');
            imageOption.className = 'image-option';
            imageOption.innerHTML = option.emoji;
            imageOption.dataset.emoji = option.emoji;
            imageOption.dataset.correct = option.correct;

            imageOption.addEventListener('click', () => {
                const emoji = imageOption.dataset.emoji;
                
                if (imageOption.classList.contains('selected')) {
                    imageOption.classList.remove('selected');
                    this.userInput = this.userInput.filter(e => e !== emoji);
                } else {
                    imageOption.classList.add('selected');
                    this.userInput.push(emoji);
                }

                this.updateVerifyButton();
            });

            grid.appendChild(imageOption);
        });

        container.appendChild(instruction);
        container.appendChild(grid);
    }

    updateVerifyButton() {
        const verifyBtn = document.getElementById('verifyCaptcha');
        if (!verifyBtn) return;

        let hasInput = false;
        
        if (Array.isArray(this.userInput)) {
            hasInput = this.userInput.length > 0;
        } else {
            hasInput = this.userInput !== null && this.userInput !== '';
        }
        
        verifyBtn.disabled = !hasInput;
    }

    resetInput() {
        this.userInput = null;
        this.updateVerifyButton();
    }

    bindEvents() {
        // Кнопка подтверждения
        document.getElementById('verifyCaptcha')?.addEventListener('click', () => {
            this.verifyCaptcha();
        });

        // Кнопка пропуска (другое задание)
        document.getElementById('skipCaptcha')?.addEventListener('click', () => {
            this.skipCaptcha();
        });

        // Enter для подтверждения
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !document.getElementById('verifyCaptcha')?.disabled) {
                this.verifyCaptcha();
            }
        });
    }

    verifyCaptcha() {
        if (!this.currentCaptcha || !this.userInput) return;

        const isValid = CaptchaUtils.validateAnswer(
            this.currentCaptcha.type, 
            this.userInput, 
            this.currentCaptcha.answer,
            this.currentCaptcha.options
        );
        
        if (isValid) {
            this.handleSuccess();
        } else {
            this.handleFailure();
        }
    }

    handleSuccess() {
        this.attempts = 0;
        this.saveVerification();
        this.showSuccessAnimation();
        
        setTimeout(() => {
            this.redirectToMain();
        }, 1500);
    }

    handleFailure() {
        this.attempts++;
        
        if (this.attempts >= this.maxAttempts) {
            this.showBlockedMessage();
            setTimeout(() => {
                this.loadRandomCaptcha();
                this.attempts = 0;
            }, 3000);
        } else {
            this.showErrorAnimation();
            setTimeout(() => {
                this.loadRandomCaptcha();
            }, 1000);
        }
    }

    skipCaptcha() {
        this.loadRandomCaptcha();
    }

    showSuccessAnimation() {
        const card = document.getElementById('captchaCard');
        const verifyBtn = document.getElementById('verifyCaptcha');
        
        if (card && verifyBtn) {
            card.classList.add('success');
            verifyBtn.innerHTML = '<i class="fas fa-check"></i> Успешно!';
            verifyBtn.style.background = 'var(--success)';
        }
    }

    showErrorAnimation() {
        const card = document.getElementById('captchaCard');
        if (card) {
            card.classList.add('shake');
            setTimeout(() => {
                card.classList.remove('shake');
            }, 500);
        }
    }

    showBlockedMessage() {
        const card = document.getElementById('captchaCard');
        if (card) {
            card.innerHTML = `
                <div style="text-align: center; color: var(--danger);">
                    <i class="fas fa-ban" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>Слишком много попыток</h3>
                    <p>Пожалуйста, подождите...</p>
                </div>
            `;
        }
    }

    saveVerification() {
        const verification = {
            timestamp: Date.now(),
            type: this.currentCaptcha.type,
            userAgent: navigator.userAgent
        };
        
        localStorage.setItem('captcha_verification', JSON.stringify(verification));
        sessionStorage.setItem('captcha_passed', 'true');
        
        // Обновляем статус в CaptchaManager
        if (window.CaptchaManager) {
            window.CaptchaManager.completeVerification();
        }
    }

    redirectToMain() {
        const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
        window.location.href = returnUrl;
    }
}

// captcha-renderer.js - НОВЫЙ ФАЙЛ ДЛЯ РЕНДЕРИНГА ВСЕХ ТИПОВ КАПЧ

const CaptchaRenderer = {
    getRenderer(type) {
        const renderers = {
            'math': this.renderMath,
            'puzzle': this.renderPuzzle,
            'image': this.renderImage,
            'sequence': this.renderSequence,
            'logic': this.renderLogic,
            'memory': this.renderMemory,
            'pattern': this.renderPattern,
            'rotation': this.renderRotation,
            'find_difference': this.renderFindDifference,
            'count': this.renderCount,
            'sorting': this.renderSorting,
            'matching': this.renderMatching,
            'time': this.renderTime,
            'geography': this.renderGeography,
            'science': this.renderScience,
            'programming': this.renderProgramming,
            'crypto': this.renderCrypto,
            'analogy': this.renderAnalogy,
            'word': this.renderWord,
            'spatial': this.renderSpatial,
            'color': this.renderColor,
            'observation': this.renderObservation
        };
        
        return renderers[type] || null;
    },

    // РЕНДЕРЕРЫ ДЛЯ НОВЫХ ТИПОВ КАПЧ
    renderPattern(captcha, container, system) {
        container.classList.add('pattern-captcha');
        container.innerHTML = `
            <div class="pattern-instruction">${captcha.instruction}</div>
            <div class="pattern-display">${captcha.pattern.join(' ')}</div>
            <div class="pattern-options">
                ${captcha.options.map(opt => `
                    <button class="pattern-option" data-value="${opt}">${opt}</button>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.pattern-option').forEach(btn => {
            btn.addEventListener('click', () => {
                system.userInput = btn.dataset.value;
                system.updateVerifyButton();
            });
        });
    },

    renderRotation(captcha, container, system) {
        container.classList.add('rotation-captcha');
        container.innerHTML = `
            <div class="rotation-instruction">${captcha.instruction}</div>
            <div class="base-shape">Исходная: ${captcha.base}</div>
            <div class="rotation-options">
                ${captcha.options.map(opt => `
                    <div class="rotation-option" data-value="${opt}">${opt}</div>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.rotation-option').forEach(opt => {
            opt.addEventListener('click', () => {
                container.querySelectorAll('.rotation-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                system.userInput = opt.dataset.value;
                system.updateVerifyButton();
            });
        });
    },

    renderFindDifference(captcha, container, system) {
        container.classList.add('difference-captcha');
        container.innerHTML = `
            <div class="difference-instruction">${captcha.instruction}</div>
            <div class="difference-items">
                ${captcha.items.map(item => `
                    <div class="difference-item" data-value="${item}">${item}</div>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.difference-item').forEach(item => {
            item.addEventListener('click', () => {
                system.userInput = item.dataset.value;
                system.updateVerifyButton();
            });
        });
    },

    renderCount(captcha, container, system) {
        container.classList.add('count-captcha');
        container.innerHTML = `
            <div class="count-instruction">${captcha.instruction}</div>
            <div class="count-items">${captcha.items.join('')}</div>
            <input type="number" class="count-input" placeholder="Введите число..." min="1" max="20">
        `;

        const input = container.querySelector('.count-input');
        input.addEventListener('input', (e) => {
            system.userInput = e.target.value;
            system.updateVerifyButton();
        });
    },

    renderSorting(captcha, container, system) {
        container.classList.add('sorting-captcha');
        container.innerHTML = `
            <div class="sorting-instruction">${captcha.instruction}</div>
            <div class="sorting-area">
                ${captcha.items.map(item => `
                    <div class="sortable-item" data-value="${item}">${item}</div>
                `).join('')}
            </div>
            <div class="sorting-result" style="display: none;"></div>
        `;

        // Простая реализация сортировки перетаскиванием
        let selectedItems = [];
        const items = container.querySelectorAll('.sortable-item');
        
        items.forEach(item => {
            item.addEventListener('click', () => {
                if (selectedItems.includes(item.dataset.value)) {
                    selectedItems = selectedItems.filter(val => val !== item.dataset.value);
                    item.classList.remove('selected');
                } else {
                    selectedItems.push(item.dataset.value);
                    item.classList.add('selected');
                }
                
                system.userInput = [...selectedItems];
                system.updateVerifyButton();
            });
        });
    },

    renderMatching(captcha, container, system) {
        container.classList.add('matching-captcha');
        container.innerHTML = `
            <div class="matching-instruction">${captcha.instruction}</div>
            <div class="matching-pairs">
                ${captcha.pairs.map((pair, index) => `
                    <div class="matching-pair">
                        <div class="pair-item left" data-value="${pair[0]}">${pair[0]}</div>
                        <div class="pair-connector">→</div>
                        <div class="pair-item right" data-value="${pair[1]}">${pair[1]}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Для matching просто проверяем, что пользователь видел пары
        system.userInput = captcha.pairs.map(pair => pair.join('')).sort();
        system.updateVerifyButton();
    },

    renderTime(captcha, container, system) {
        container.classList.add('time-captcha');
        container.innerHTML = `
            <div class="time-instruction">${captcha.instruction}</div>
            <div class="time-question">${captcha.question}</div>
            <input type="text" class="time-input" placeholder="Введите ответ...">
        `;

        const input = container.querySelector('.time-input');
        input.addEventListener('input', (e) => {
            system.userInput = e.target.value;
            system.updateVerifyButton();
        });
    },

    renderGeography(captcha, container, system) {
        this.renderLogic(captcha, container, system); // Используем логический рендерер
    },

    renderScience(captcha, container, system) {
        this.renderLogic(captcha, container, system); // Используем логический рендерер
    },

    renderProgramming(captcha, container, system) {
        this.renderLogic(captcha, container, system); // Используем логический рендерер
    },

    renderCrypto(captcha, container, system) {
        container.classList.add('crypto-captcha');
        container.innerHTML = `
            <div class="crypto-instruction">${captcha.instruction}</div>
            <input type="text" class="crypto-input" placeholder="Введите расшифрованный текст...">
        `;

        const input = container.querySelector('.crypto-input');
        input.addEventListener('input', (e) => {
            system.userInput = e.target.value;
            system.updateVerifyButton();
        });
    },

    renderAnalogy(captcha, container, system) {
        this.renderLogic(captcha, container, system); // Используем логический рендерер
    },

    renderWord(captcha, container, system) {
        container.classList.add('word-captcha');
        
        if (captcha.options) {
            // Если есть варианты ответов
            this.renderLogic(captcha, container, system);
        } else {
            // Если нужно вводить текст
            container.innerHTML = `
                <div class="word-instruction">${captcha.instruction}</div>
                <input type="text" class="word-input" placeholder="Введите ответ...">
            `;

            const input = container.querySelector('.word-input');
            input.addEventListener('input', (e) => {
                system.userInput = e.target.value;
                system.updateVerifyButton();
            });
        }
    },

    renderSpatial(captcha, container, system) {
        this.renderLogic(captcha, container, system); // Используем логический рендерер
    },

    renderColor(captcha, container, system) {
        container.classList.add('color-captcha');
        
        if (Array.isArray(captcha.answer)) {
            // Множественный выбор
            container.innerHTML = `
                <div class="color-instruction">${captcha.instruction}</div>
                <div class="color-options">
                    ${captcha.colors.map(color => `
                        <div class="color-option" data-value="${color}" style="background: ${this.getColorValue(color)}">${color}</div>
                    `).join('')}
                </div>
            `;

            system.userInput = [];
            container.querySelectorAll('.color-option').forEach(opt => {
                opt.addEventListener('click', () => {
                    const color = opt.dataset.value;
                    if (system.userInput.includes(color)) {
                        system.userInput = system.userInput.filter(c => c !== color);
                        opt.classList.remove('selected');
                    } else {
                        system.userInput.push(color);
                        opt.classList.add('selected');
                    }
                    system.updateVerifyButton();
                });
            });
        } else {
            // Одиночный выбор
            this.renderLogic(captcha, container, system);
        }
    },

    renderObservation(captcha, container, system) {
        container.classList.add('observation-captcha');
        container.innerHTML = `
            <div class="observation-instruction">${captcha.instruction}</div>
            <input type="text" class="observation-input" placeholder="Опишите что изменилось...">
        `;

        const input = container.querySelector('.observation-input');
        input.addEventListener('input', (e) => {
            system.userInput = e.target.value;
            system.updateVerifyButton();
        });
    },

    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    getColorValue(emoji) {
        const colorMap = {
            '🔴': '#ff4444',
            '🟢': '#44ff44', 
            '🔵': '#4444ff',
            '🟡': '#ffff44',
            '🟠': '#ff8844',
            '🟣': '#8844ff',
            '⚫': '#000000',
            '⚪': '#ffffff',
            '🟤': '#8b4513'
        };
        return colorMap[emoji] || '#cccccc';
    },

    // СУЩЕСТВУЮЩИЕ РЕНДЕРЕРЫ (для обратной совместимости)
    renderMath(captcha, container, system) {
        system.renderMathCaptcha(container);
    },

    renderPuzzle(captcha, container, system) {
        system.renderPuzzleCaptcha(container);
    },

    renderImage(captcha, container, system) {
        system.renderImageCaptcha(container);
    },

    renderSequence(captcha, container, system) {
        system.renderSequenceCaptcha(container);
    },

    renderLogic(captcha, container, system) {
        container.classList.add('logic-captcha');
        
        const question = document.createElement('div');
        question.className = 'logic-question';
        question.textContent = captcha.question || captcha.instruction;

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'logic-options';

        const options = captcha.options || [];
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'logic-option';
            optionElement.textContent = option;

            optionElement.addEventListener('click', () => {
                optionsContainer.querySelectorAll('.logic-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                optionElement.classList.add('selected');
                system.userInput = option;
                system.updateVerifyButton();
            });

            optionsContainer.appendChild(optionElement);
        });

        container.appendChild(question);
        container.appendChild(optionsContainer);
    },

    renderMemory(captcha, container, system) {
        system.renderMemoryCaptcha(container);
    }
};

// captcha-loader.js - ОБНОВЛЕННАЯ ВЕРСИЯ

class CaptchaLoader {
    constructor() {
        this.verificationKey = 'captcha_verification';
        this.sessionKey = 'captcha_session';
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
        if (this.isSessionValid()) {
            return true;
        }

        // Проверяем localStorage для 24-часового периода
        const verification = localStorage.getItem(this.verificationKey);
        if (!verification) return false;

        try {
            const data = JSON.parse(verification);
            const now = Date.now();
            const verificationTime = data.timestamp;
            const hoursPassed = (now - verificationTime) / (1000 * 60 * 60);
            
            const isValid = hoursPassed < 24;
            
            if (isValid) {
                this.startSession();
            } else {
                localStorage.removeItem(this.verificationKey);
            }
            
            return isValid;
            
        } catch (error) {
            localStorage.removeItem(this.verificationKey);
            return false;
        }
    }

    isSessionValid() {
        const session = sessionStorage.getItem(this.sessionKey);
        if (!session) return false;

        try {
            const sessionData = JSON.parse(session);
            const now = Date.now();
            const sessionTime = sessionData.timestamp;
            
            const hoursPassed = (now - sessionTime) / (1000 * 60 * 60);
            const isValid = hoursPassed < 8;
            
            if (!isValid) {
                sessionStorage.removeItem(this.sessionKey);
            }
            
            return isValid;
            
        } catch (error) {
            sessionStorage.removeItem(this.sessionKey);
            return false;
        }
    }

    startSession() {
        const sessionData = {
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            started: new Date().toISOString()
        };
        
        sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    showCaptchaWall() {
        const overlay = document.createElement('div');
        overlay.id = 'captchaOverlay';
        overlay.innerHTML = `
            <div class="captcha-wall">
                <div class="captcha-wall-content">
                    <div class="security-header">
                        <i class="fas fa-shield-alt"></i>
                        <h2>Требуется проверка безопасности</h2>
                    </div>
                    <div class="loading-indicator">
                        <div class="spinner"></div>
                        <p>Загрузка системы защиты...</p>
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
                        <div class="info-item">
                            <i class="fas fa-sync-alt"></i>
                            <span>Работает при перезагрузке страницы</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Добавляем стили
        const styles = document.createElement('style');
        styles.textContent = this.getCaptchaStyles();
        document.head.appendChild(styles);
        document.body.appendChild(overlay);

        // Блокируем прокрутку основной страницы
        document.body.style.overflow = 'hidden';

        this.setupCaptchaEventListeners(overlay);
        
        // Симулируем загрузку для плавности
        setTimeout(() => {
            const loadingIndicator = overlay.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.opacity = '0';
                setTimeout(() => {
                    loadingIndicator.remove();
                }, 500);
            }
        }, 1500);
    }

    setupCaptchaEventListeners(overlay) {
        document.getElementById('startCaptcha')?.addEventListener('click', () => {
            this.redirectToCaptcha();
        });

        document.getElementById('learnMore')?.addEventListener('click', () => {
            this.showLearnMore();
        });

        // Запрещаем закрытие капчи
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                e.preventDefault();
                e.stopPropagation();
                this.showCannotCloseMessage();
            }
        });

        // Блокируем клавиши
        document.addEventListener('keydown', this.blockKeyboardShortcuts);
    }

    blockKeyboardShortcuts(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
            (e.key === 'Escape')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }

    showCannotCloseMessage() {
        const overlay = document.getElementById('captchaOverlay');
        if (!overlay) return;

        const message = document.createElement('div');
        message.className = 'blocked-message';
        message.innerHTML = `
            <i class="fas fa-lock"></i>
            <span>Проверка безопасности обязательна для доступа к сайту</span>
        `;
        
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        `;

        overlay.appendChild(message);

        setTimeout(() => {
            if (message.parentNode) {
                message.style.opacity = '0';
                message.style.transform = 'translateX(-50%) translateY(-20px)';
                setTimeout(() => {
                    message.remove();
                }, 500);
            }
        }, 3000);
    }

    hideCaptchaWall() {
        const overlay = document.getElementById('captchaOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 500);
        }

        document.removeEventListener('keydown', this.blockKeyboardShortcuts);
    }

    redirectToCaptcha() {
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = `captcha.html?return=${currentUrl}`;
    }

    showLearnMore() {
        const modalHtml = `
            <div class="captcha-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-info-circle"></i> О системе безопасности</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="info-section">
                            <h4>Как это работает?</h4>
                            <p>Система проверяет, что вы реальный человек, а не автоматическая программа. Это помогает защитить сайт от ботов и поддерживать высокую производительность для всех пользователей.</p>
                        </div>
                        
                        <div class="info-section">
                            <h4>Что происходит после проверки?</h4>
                            <ul>
                                <li>✅ <strong>Создается сессия</strong> - действует 8 часов (при перезагрузке страницы)</li>
                                <li>✅ <strong>Сохраняется верификация</strong> - действует 24 часа (для новых сессий)</li>
                                <li>✅ <strong>Доступ открывается</strong> - ко всем защищенным страницам</li>
                            </ul>
                        </div>
                        
                        <div class="info-section">
                            <h4>Ваши данные в безопасности</h4>
                            <p>Все проверки происходят локально в вашем браузере. Мы не сохраняем и не передаем ваши личные данные.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-primary understand-btn">Понятно</button>
                    </div>
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.innerHTML = modalHtml;
        document.getElementById('captchaOverlay')?.appendChild(modal);

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.understand-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    getCaptchaStyles() {
        return `
            #captchaOverlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 10, 15, 0.98);
                backdrop-filter: blur(20px);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Exo 2', sans-serif;
                transition: opacity 0.5s ease;
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
                animation: slideUp 0.5s ease;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
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
            
            .loading-indicator {
                margin: 2rem 0;
                transition: opacity 0.5s ease;
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(99, 102, 241, 0.3);
                border-top: 3px solid #6366f1;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-indicator p {
                color: #94a3b8;
                font-size: 0.9rem;
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
            
            /* Стили для модального окна */
            .captcha-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .modal-content {
                background: rgba(30, 30, 45, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                backdrop-filter: blur(20px);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .modal-header h3 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: #6366f1;
                margin: 0;
                font-size: 1.2rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 5px;
            }
            
            .modal-close:hover {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .info-section {
                margin-bottom: 2rem;
            }
            
            .info-section h4 {
                color: #e2e8f0;
                margin-bottom: 0.75rem;
                font-size: 1.1rem;
            }
            
            .info-section p {
                color: #94a3b8;
                line-height: 1.6;
                margin-bottom: 1rem;
            }
            
            .info-section ul {
                color: #94a3b8;
                padding-left: 1.5rem;
            }
            
            .info-section li {
                margin-bottom: 0.5rem;
                line-height: 1.5;
            }
            
            .modal-footer {
                padding: 1rem 1.5rem 1.5rem;
                text-align: right;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .understand-btn {
                padding: 0.5rem 1.5rem;
            }
            
            .blocked-message {
                animation: slideDown 0.3s ease;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
    }
}

// captcha-utils.js - ОБНОВЛЕННАЯ ВЕРСИЯ С НОВЫМИ ТИПАМИ КАПЧ

const CaptchaUtils = {
    // ГЕНЕРАЦИЯ СЛУЧАЙНЫХ КАПЧ
    getRandomCaptcha() {
        const captchaTypes = [
            'math', 'puzzle', 'image', 'sequence', 'logic', 
            'memory', 'pattern', 'rotation', 'find_difference', 'count',
            'sorting', 'matching', 'time', 'geography', 'science',
            'programming', 'crypto', 'analogy', 'word', 'spatial',
            'color', 'observation'
        ];
        
        const randomType = captchaTypes[Math.floor(Math.random() * captchaTypes.length)];
        return this.generateCaptchaByType(randomType);
    },

    generateCaptchaByType(type) {
        const generators = {
            'math': () => this.generateMathCaptcha(),
            'puzzle': () => this.generatePuzzleCaptcha(),
            'image': () => this.generateImageCaptcha(),
            'sequence': () => this.generateSequenceCaptcha(),
            'logic': () => this.generateLogicCaptcha(),
            'memory': () => this.generateMemoryCaptcha(),
            'pattern': () => this.generatePatternCaptcha(),
            'rotation': () => this.generateRotationCaptcha(),
            'find_difference': () => this.generateFindDifferenceCaptcha(),
            'count': () => this.generateCountCaptcha(),
            'sorting': () => this.generateSortingCaptcha(),
            'matching': () => this.generateMatchingCaptcha(),
            'time': () => this.generateTimeCaptcha(),
            'geography': () => this.generateGeographyCaptcha(),
            'science': () => this.generateScienceCaptcha(),
            'programming': () => this.generateProgrammingCaptcha(),
            'crypto': () => this.generateCryptoCaptcha(),
            'analogy': () => this.generateAnalogyCaptcha(),
            'word': () => this.generateWordCaptcha(),
            'spatial': () => this.generateSpatialCaptcha(),
            'color': () => this.generateColorCaptcha(),
            'observation': () => this.generateObservationCaptcha()
        };

        return generators[type] ? generators[type]() : this.generateMathCaptcha();
    },

    // ГЕНЕРАТОРЫ НОВЫХ ТИПОВ КАПЧ
    generatePatternCaptcha() {
        const patterns = [
            { pattern: ['🔴', '🟢', '🔵'], next: '🔴', instruction: 'Какой символ будет следующим в последовательности?' },
            { pattern: ['⬆️', '➡️', '⬇️'], next: '⬅️', instruction: 'Продолжите последовательность стрелок:' },
            { pattern: ['1', '4', '9', '16'], next: '25', instruction: 'Какое следующее число в последовательности?' },
            { pattern: ['A', 'C', 'E', 'G'], next: 'I', instruction: 'Какая следующая буква?' }
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        const wrongOptions = this.generateWrongOptions(pattern.next, ['26', 'H', '⬆️', '🟡']);
        
        return {
            type: 'pattern',
            pattern: pattern.pattern,
            answer: pattern.next,
            options: [pattern.next, ...wrongOptions].sort(() => Math.random() - 0.5),
            instruction: pattern.instruction
        };
    },

    generateRotationCaptcha() {
        const rotations = [
            { base: '▲', rotated: '►', instruction: 'Как будет выглядеть фигура после поворота на 90° по часовой стрелке?' },
            { base: '◀', rotated: '▲', instruction: 'Как будет выглядеть стрелка после поворота на 90° против часовой стрелки?' },
            { base: '◆', rotated: '◆', instruction: 'Как будет выглядеть ромб после поворота на 180°?' }
        ];
        
        const rotation = rotations[Math.floor(Math.random() * rotations.length)];
        const wrongOptions = ['▼', '◀', '●', '⭐'].filter(opt => opt !== rotation.rotated);
        
        return {
            type: 'rotation',
            base: rotation.base,
            answer: rotation.rotated,
            options: [rotation.rotated, ...wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5),
            instruction: rotation.instruction
        };
    },

    generateFindDifferenceCaptcha() {
        const differences = [
            { items: ['🔴', '🟢', '🔵', '🟡', '🔴'], different: '🔴', instruction: 'Найдите элемент, который встречается дважды' },
            { items: ['🐱', '🐶', '🐭', '🐱', '🐹'], different: '🐱', instruction: 'Какое животное повторяется?' },
            { items: ['⭐', '🌟', '⭐', '💫', '✨'], different: '⭐', instruction: 'Найдите повторяющийся символ' }
        ];
        
        const diff = differences[Math.floor(Math.random() * differences.length)];
        
        return {
            type: 'find_difference',
            items: diff.items.sort(() => Math.random() - 0.5),
            answer: diff.different,
            instruction: diff.instruction
        };
    },

    generateCountCaptcha() {
        const counts = [
            { items: ['🐱', '🐶', '🐱', '🐭', '🐱'], count: 3, instruction: 'Сколько кошек вы видите?' },
            { items: ['🔴', '🟢', '🔴', '🔵', '🔴'], count: 3, instruction: 'Сколько красных кругов?' },
            { items: ['⭐', '🌟', '💫', '⭐', '✨'], count: 2, instruction: 'Сколько звезд?' }
        ];
        
        const count = counts[Math.floor(Math.random() * counts.length)];
        
        return {
            type: 'count',
            items: count.items,
            answer: count.count.toString(),
            instruction: count.instruction
        };
    },

    generateSortingCaptcha() {
        const sortings = [
            { items: ['3', '1', '4', '2'], sorted: ['1', '2', '3', '4'], instruction: 'Расставьте числа по возрастанию' },
            { items: ['Я', 'Б', 'В', 'А'], sorted: ['А', 'Б', 'В', 'Я'], instruction: 'Расставьте буквы в алфавитном порядке' },
            { items: ['маленький', 'средний', 'большой'], sorted: ['маленький', 'средний', 'большой'], instruction: 'Расставьте по размеру от меньшего к большему' }
        ];
        
        const sorting = sortings[Math.floor(Math.random() * sortings.length)];
        
        return {
            type: 'sorting',
            items: [...sorting.items].sort(() => Math.random() - 0.5),
            answer: sorting.sorted,
            instruction: sorting.instruction
        };
    },

    generateMatchingCaptcha() {
        const matchings = [
            {
                pairs: [['🐱', 'кошка'], ['🐶', 'собака'], ['🐭', 'мышь']],
                instruction: 'Соотнесите животных с их названиями'
            },
            {
                pairs: [['🔴', 'красный'], ['🟢', 'зеленый'], ['🔵', 'синий']],
                instruction: 'Соотнесите цвета с их названиями'
            }
        ];
        
        const matching = matchings[Math.floor(Math.random() * matchings.length)];
        
        return {
            type: 'matching',
            pairs: matching.pairs,
            answer: matching.pairs.map(pair => pair.join('')).sort(),
            instruction: matching.instruction
        };
    },

    generateTimeCaptcha() {
        const times = [
            { question: 'Сколько часов в двух днях?', answer: '48' },
            { question: 'Сколько минут в 3 часах?', answer: '180' },
            { question: 'Если сейчас 15:00, сколько времени будет через 2.5 часа?', answer: '17:30' }
        ];
        
        const time = times[Math.floor(Math.random() * times.length)];
        
        return {
            type: 'time',
            question: time.question,
            answer: time.answer,
            instruction: 'Решите временную задачу'
        };
    },

    generateGeographyCaptcha() {
        const geography = [
            { question: 'Какая самая длинная река в мире?', answer: 'Нил', options: ['Нил', 'Амазонка', 'Волга', 'Миссисипи'] },
            { question: 'Столица Франции?', answer: 'Париж', options: ['Париж', 'Лондон', 'Берлин', 'Мадрид'] },
            { question: 'Самая высокая гора в мире?', answer: 'Эверест', options: ['Эверест', 'Килиманджаро', 'Монблан', 'Фудзияма'] }
        ];
        
        const geo = geography[Math.floor(Math.random() * geography.length)];
        
        return {
            type: 'geography',
            question: geo.question,
            answer: geo.answer,
            options: geo.options.sort(() => Math.random() - 0.5),
            instruction: 'Ответьте на вопрос по географии'
        };
    },

    generateScienceCaptcha() {
        const science = [
            { question: 'Сколько планет в Солнечной системе?', answer: '8', options: ['8', '9', '7', '10'] },
            { question: 'Какой газ растения поглощают из атмосферы?', answer: 'CO2', options: ['CO2', 'O2', 'N2', 'H2'] },
            { question: 'Самое твердое природное вещество?', answer: 'Алмаз', options: ['Алмаз', 'Сталь', 'Гранит', 'Кварц'] }
        ];
        
        const sci = science[Math.floor(Math.random() * science.length)];
        
        return {
            type: 'science',
            question: sci.question,
            answer: sci.answer,
            options: sci.options.sort(() => Math.random() - 0.5),
            instruction: 'Ответьте на научный вопрос'
        };
    },

    generateProgrammingCaptcha() {
        const programming = [
            { question: 'Какой язык программирования начинается с буквы "J"?', answer: 'JavaScript', options: ['JavaScript', 'Python', 'C++', 'Ruby'] },
            { question: 'Что означает HTML?', answer: 'HyperText Markup Language', options: ['HyperText Markup Language', 'HighTech Modern Language', 'HyperTransfer Markup Language', 'Home Tool Markup Language'] },
            { question: 'Какой оператор используется для присваивания в JavaScript?', answer: '=', options: ['=', '==', '===', ':='] }
        ];
        
        const prog = programming[Math.floor(Math.random() * programming.length)];
        
        return {
            type: 'programming',
            question: prog.question,
            answer: prog.answer,
            options: prog.options.sort(() => Math.random() - 0.5),
            instruction: 'Ответьте на вопрос по программированию'
        };
    },

    generateCryptoCaptcha() {
        const cryptos = [
            { encoded: 'R3Jlegor', decoded: 'Grey', instruction: 'Расшифруйте текст (Base64)' },
            { encoded: 'Q2FwdGNoYQ==', decoded: 'Captcha', instruction: 'Расшифруйте закодированный текст' },
            { encoded: 'MTIzNDU=', decoded: '12345', instruction: 'Что закодировано в Base64?' }
        ];
        
        const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
        
        return {
            type: 'crypto',
            encoded: crypto.encoded,
            answer: crypto.decoded,
            instruction: crypto.instruction
        };
    },

    generateAnalogyCaptcha() {
        const analogies = [
            { analogy: 'Солнце : День = Луна : ?', answer: 'Ночь', options: ['Ночь', 'Звезды', 'Небо', 'Темнота'] },
            { analogy: 'Холодно : Лед = Горячо : ?', answer: 'Огонь', options: ['Огонь', 'Пар', 'Вода', 'Солнце'] },
            { analogy: 'Кошка : Мяу = Собака : ?', answer: 'Гав', options: ['Гав', 'Мяу', 'Чик', 'Му'] }
        ];
        
        const analogy = analogies[Math.floor(Math.random() * analogies.length)];
        
        return {
            type: 'analogy',
            question: analogy.analogy,
            answer: analogy.answer,
            options: analogy.options.sort(() => Math.random() - 0.5),
            instruction: 'Завершите аналогию'
        };
    },

    generateWordCaptcha() {
        const words = [
            { instruction: 'Напишите слово "Проверка" наоборот', answer: 'акреворП' },
            { instruction: 'Какое слово лишнее: яблоко, груша, морковь, апельсин?', answer: 'морковь', options: ['яблоко', 'груша', 'морковь', 'апельсин'] },
            { instruction: 'Составьте слово из букв: Т,С,О,О,Л', answer: 'СТОЛ' }
        ];
        
        const word = words[Math.floor(Math.random() * words.length)];
        
        return {
            type: 'word',
            instruction: word.instruction,
            answer: word.answer,
            options: word.options ? word.options.sort(() => Math.random() - 0.5) : undefined
        };
    },

    generateSpatialCaptcha() {
        const spatials = [
            { question: 'Если вы смотрите на север, то где находится ваша правая рука?', answer: 'Восток', options: ['Восток', 'Запад', 'Север', 'Юг'] },
            { question: 'Сколько кубиков в кубе 3x3x3?', answer: '27', options: ['27', '9', '18', '36'] },
            { question: 'Какая фигура имеет больше углов: пятиугольник или шестиугольник?', answer: 'Шестиугольник', options: ['Шестиугольник', 'Пятиугольник', 'Одинаково', 'Зависит от размера'] }
        ];
        
        const spatial = spatials[Math.floor(Math.random() * spatials.length)];
        
        return {
            type: 'spatial',
            question: spatial.question,
            answer: spatial.answer,
            options: spatial.options.sort(() => Math.random() - 0.5),
            instruction: 'Ответьте на вопрос про пространство'
        };
    },

    generateColorCaptcha() {
        const colors = [
            { 
                instruction: 'Выберите все теплые цвета', 
                colors: ['🔴', '🟠', '🟡', '🔵', '🟢', '🟣'],
                answer: ['🔴', '🟠', '🟡']
            },
            { 
                instruction: 'Выберите основные цвета', 
                colors: ['🔴', '🟢', '🔵', '🟡', '🟠', '🟣'],
                answer: ['🔴', '🟢', '🔵']
            }
        ];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return {
            type: 'color',
            instruction: color.instruction,
            colors: color.colors.sort(() => Math.random() - 0.5),
            answer: color.answer,
            options: color.colors
        };
    },

    generateObservationCaptcha() {
        const observations = [
            { instruction: 'Опишите что изменилось между двумя изображениями', answer: 'поменялись цвета' },
            { instruction: 'Что появилось нового?', answer: 'добавилась звезда' },
            { instruction: 'Какая деталь отсутствует?', answer: 'не хватает круга' }
        ];
        
        const observation = observations[Math.floor(Math.random() * observations.length)];
        
        return {
            type: 'observation',
            instruction: observation.instruction,
            answer: observation.answer
        };
    },

    // СУЩЕСТВУЮЩИЕ ГЕНЕРАТОРЫ (для обратной совместимости)
    generateMathCaptcha() {
        const operations = ['+', '-', '*'];
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        let question, answer;
        
        switch(op) {
            case '+':
                question = `${a} + ${b} = ?`;
                answer = (a + b).toString();
                break;
            case '-':
                question = `${a} - ${b} = ?`;
                answer = (a - b).toString();
                break;
            case '*':
                question = `${a} × ${b} = ?`;
                answer = (a * b).toString();
                break;
        }
        
        return {
            type: 'math',
            question: question,
            answer: answer,
            instruction: 'Решите математический пример'
        };
    },

    generatePuzzleCaptcha() {
        const numbers = ['1', '2', '3', '4'];
        const answer = [...numbers].sort(() => Math.random() - 0.5);
        
        return {
            type: 'puzzle',
            options: numbers,
            answer: answer,
            instruction: 'Расставьте числа по порядку от 1 до 4'
        };
    },

    generateImageCaptcha() {
        const emojis = ['🐱', '🐶', '🐭', '🐹', '🐰'];
        const correctEmojis = [emojis[0], emojis[1]];
        const options = [
            { emoji: emojis[0], correct: true },
            { emoji: emojis[1], correct: true },
            { emoji: emojis[2], correct: false },
            { emoji: emojis[3], correct: false }
        ].sort(() => Math.random() - 0.5);
        
        return {
            type: 'image',
            options: options,
            answer: correctEmojis,
            instruction: 'Выберите всех животных из семейства кошачьих и собачьих'
        };
    },

    generateSequenceCaptcha() {
        const sequences = [
            { sequence: ['2', '4', '6', '8'], next: '10', instruction: 'Какое число будет следующим?' },
            { sequence: ['A', 'B', 'C', 'D'], next: 'E', instruction: 'Какая буква будет следующей?' },
            { sequence: ['▲', '►', '▼', '◄'], next: '▲', instruction: 'Какая фигура будет следующей?' }
        ];
        
        const seq = sequences[Math.floor(Math.random() * sequences.length)];
        const wrongOptions = this.generateWrongOptions(seq.next, ['12', 'F', '●']);
        
        return {
            type: 'sequence',
            sequence: seq.sequence,
            answer: seq.next,
            options: [seq.next, ...wrongOptions].sort(() => Math.random() - 0.5),
            instruction: seq.instruction
        };
    },

    generateLogicCaptcha() {
        const logicQuestions = [
            {
                question: 'Что тяжелее: 1 кг пуха или 1 кг железа?',
                options: ['1 кг пуха', '1 кг железа', 'Одинаково'],
                answer: 'Одинаково'
            },
            {
                question: 'Сколько месяцев в году имеют 28 дней?',
                options: ['1', '2', '12', '6'],
                answer: '12'
            },
            {
                question: 'Что не тонет в воде?',
                options: ['Камень', 'Металл', 'Дерево', 'Стекло'],
                answer: 'Дерево'
            }
        ];
        
        const logic = logicQuestions[Math.floor(Math.random() * logicQuestions.length)];
        
        return {
            type: 'logic',
            question: logic.question,
            options: logic.options.sort(() => Math.random() - 0.5),
            answer: logic.answer,
            instruction: 'Решите логическую задачу'
        };
    },

    generateMemoryCaptcha() {
        const items = ['🔴', '🟢', '🔵', '🟡'];
        const sequence = [];
        
        for (let i = 0; i < 3; i++) {
            sequence.push(items[Math.floor(Math.random() * items.length)]);
        }
        
        return {
            type: 'memory',
            sequence: sequence,
            answer: sequence.join(','),
            instruction: 'Запомните последовательность цветов'
        };
    },

    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    generateWrongOptions(correct, pool) {
        const wrong = [];
        const used = new Set([correct]);
        
        while (wrong.length < 3 && pool.length > 0) {
            const randomIndex = Math.floor(Math.random() * pool.length);
            const option = pool[randomIndex];
            
            if (!used.has(option)) {
                wrong.push(option);
                used.add(option);
                pool.splice(randomIndex, 1);
            }
        }
        
        return wrong;
    },

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    // ВАЛИДАЦИЯ ОТВЕТОВ ДЛЯ ВСЕХ ТИПОВ КАПЧ
    validateAnswer(type, userInput, correctAnswer, options = null) {
        const validators = {
            'math': (input, answer) => input.trim() === answer,
            'puzzle': (input, answer) => JSON.stringify(input) === JSON.stringify(answer),
            'image': (input, answer) => JSON.stringify(input.sort()) === JSON.stringify(answer.sort()),
            'sequence': (input, answer) => input === answer,
            'logic': (input, answer) => input === answer,
            'memory': (input, answer) => input === answer,
            'pattern': (input, answer) => input === answer,
            'rotation': (input, answer) => input === answer,
            'find_difference': (input, answer) => input === answer,
            'count': (input, answer) => input === answer,
            'sorting': (input, answer) => JSON.stringify(input) === JSON.stringify(answer),
            'matching': (input, answer) => JSON.stringify(input) === JSON.stringify(answer),
            'time': (input, answer) => input.trim() === answer,
            'geography': (input, answer) => input === answer,
            'science': (input, answer) => input === answer,
            'programming': (input, answer) => input === answer,
            'crypto': (input, answer) => input.trim().toLowerCase() === answer.toLowerCase(),
            'analogy': (input, answer) => input === answer,
            'word': (input, answer, opts) => {
                if (opts) {
                    return input === answer; // Для вариантов ответов
                }
                return input.trim().toLowerCase() === answer.toLowerCase(); // Для текстового ввода
            },
            'spatial': (input, answer) => input === answer,
            'color': (input, answer) => JSON.stringify(input.sort()) === JSON.stringify(answer.sort()),
            'observation': (input, answer) => input.trim().toLowerCase().includes(answer.toLowerCase())
        };

        const validator = validators[type] || validators.math;
        return validator(userInput, correctAnswer, options);
    }
};

// ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на странице капчи
    if (document.getElementById('captchaCard')) {
        window.captchaSystem = new CaptchaSystem();
    }
    
    // Инициализируем загрузчик для защищенных страниц
    if (!window.location.pathname.includes('captcha.html')) {
        window.captchaLoader = new CaptchaLoader();
    }
});

// CaptchaManager для управления состоянием системы
window.CaptchaManager = {
    completeVerification() {
        // Обновляем статус верификации
        const verification = {
            timestamp: Date.now(),
            type: 'completed',
            userAgent: navigator.userAgent
        };
        
        localStorage.setItem('captcha_verification', JSON.stringify(verification));
        sessionStorage.setItem('captcha_passed', 'true');
        
        // Отправляем событие для других модулей
        window.dispatchEvent(new CustomEvent('captchaVerified'));
    },
    
    forceRecaptcha() {
        // Принудительно показываем капчу
        localStorage.removeItem('captcha_verification');
        sessionStorage.removeItem('captcha_passed');
        sessionStorage.removeItem('captcha_session');
        window.location.href = 'captcha.html';
    },
    
    getVerificationStatus() {
        const verification = localStorage.getItem('captcha_verification');
        if (!verification) return 'not_verified';
        
        try {
            const data = JSON.parse(verification);
            const now = Date.now();
            const hoursPassed = (now - data.timestamp) / (1000 * 60 * 60);
            
            return hoursPassed < 24 ? 'verified' : 'expired';
        } catch {
            return 'not_verified';
        }
    }
};

// Экспорты для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CaptchaSystem, CaptchaLoader, CaptchaUtils, CaptchaRenderer };
}