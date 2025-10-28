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
        return JSON.parse(localStorage.getItem('captcha_verification'));
    }

    isVerificationValid(verification) {
        const now = Date.now();
        const verificationTime = verification.timestamp;
        const hoursPassed = (now - verificationTime) / (1000 * 60 * 60);
        return hoursPassed < 24; // Действует 24 часа
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

        switch (this.currentCaptcha.type) {
            case 'math':
                this.renderMathCaptcha(container);
                break;
            case 'puzzle':
                this.renderPuzzleCaptcha(container);
                break;
            case 'image':
                this.renderImageCaptcha(container);
                break;
            case 'sequence':
                this.renderSequenceCaptcha(container);
                break;
            case 'logic':
                this.renderLogicCaptcha(container);
                break;
            case 'memory':
                this.renderMemoryCaptcha(container);
                break;
        }
    }

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

                // Проверка правильности текущего выбора
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

    renderSequenceCaptcha(container) {
        container.classList.add('sequence-captcha');
        
        const instruction = document.createElement('div');
        instruction.className = 'sequence-instruction';
        instruction.textContent = this.currentCaptcha.instruction;

        const display = document.createElement('div');
        display.className = 'sequence-display';
        display.textContent = this.currentCaptcha.sequence.join(' ');

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'sequence-input';
        input.placeholder = 'Повторите последовательность...';
        input.addEventListener('input', (e) => {
            this.userInput = e.target.value;
            this.updateVerifyButton();
        });

        container.appendChild(instruction);
        container.appendChild(display);
        container.appendChild(input);
    }

    renderLogicCaptcha(container) {
        container.classList.add('logic-captcha');
        
        const question = document.createElement('div');
        question.className = 'logic-question';
        question.textContent = this.currentCaptcha.question;

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'logic-options';

        this.currentCaptcha.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'logic-option';
            optionElement.textContent = option;

            optionElement.addEventListener('click', () => {
                optionsContainer.querySelectorAll('.logic-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                optionElement.classList.add('selected');
                this.userInput = option;
                this.updateVerifyButton();
            });

            optionsContainer.appendChild(optionElement);
        });

        container.appendChild(question);
        container.appendChild(optionsContainer);
    }

    renderMemoryCaptcha(container) {
        container.classList.add('memory-captcha');
        
        const instruction = document.createElement('div');
        instruction.className = 'memory-instruction';
        instruction.textContent = this.currentCaptcha.instruction;

        const sequenceDisplay = document.createElement('div');
        sequenceDisplay.className = 'memory-sequence';
        
        // Показываем последовательность на короткое время
        sequenceDisplay.innerHTML = this.currentCaptcha.sequence
            .map(item => `<span>${item}</span>`)
            .join('');
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'memory-input';
        input.placeholder = 'Повторите последовательность...';
        input.style.opacity = '0';
        
        container.appendChild(instruction);
        container.appendChild(sequenceDisplay);
        container.appendChild(input);

        // Скрываем последовательность через заданное время
        setTimeout(() => {
            sequenceDisplay.innerHTML = '??? ??? ???';
            input.style.opacity = '1';
            
            input.addEventListener('input', (e) => {
                this.userInput = e.target.value;
                this.updateVerifyButton();
            });
        }, this.currentCaptcha.displayTime);
    }

    updateVerifyButton() {
        const verifyBtn = document.getElementById('verifyCaptcha');
        if (!verifyBtn) return;

        const hasInput = this.userInput !== null && 
                        this.userInput !== '' && 
                        this.userInput.length > 0;
        
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
            if (e.key === 'Enter' && !document.getElementById('verifyCaptcha').disabled) {
                this.verifyCaptcha();
            }
        });
    }

    verifyCaptcha() {
        if (!this.currentCaptcha || !this.userInput) return;

        const isValid = this.validateAnswer();
        
        if (isValid) {
            this.handleSuccess();
        } else {
            this.handleFailure();
        }
    }

    validateAnswer() {
        switch (this.currentCaptcha.type) {
            case 'math':
                return CaptchaUtils.validateMathAnswer(this.userInput, this.currentCaptcha.answer);
            case 'puzzle':
                return CaptchaUtils.validatePuzzleAnswer(this.userInput, this.currentCaptcha.answer);
            case 'image':
                return CaptchaUtils.validateImageAnswer(this.userInput, this.currentCaptcha.options);
            case 'sequence':
                return CaptchaUtils.validateSequenceAnswer(this.userInput, this.currentCaptcha.answer);
            case 'logic':
                return CaptchaUtils.validateLogicAnswer(this.userInput, this.currentCaptcha.answer);
            case 'memory':
                return CaptchaUtils.validateMemoryAnswer(this.userInput, this.currentCaptcha.answer);
            default:
                return false;
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
    }

    redirectToMain() {
        // Редирект на главную страницу или продолжение загрузки
        const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
        window.location.href = returnUrl;
    }
}

// Инициализация системы капчи
document.addEventListener('DOMContentLoaded', function() {
    window.captchaSystem = new CaptchaSystem();
});