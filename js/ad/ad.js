// =============================================
// 1. КОНФИГУРАЦИЯ РЕКЛАМЫ
// =============================================

const adConfig = {
    enabled: true,
    closeDelay: 5,
    showInterval: 30,
    firstShowDelay: 10000,
    position: 'bottom-right',
    offset: { x: 20, y: 20 },
    autoClose: false,
    autoCloseDelay: 15,
    maxShowsPerSession: 5,
    respectDNT: true,
    animations: {
        duration: 400
    },
    ads: [
        {
            id: 1,
            image: "assets/images/MineOriginsAvaAd.png",
            title: "DISCORD СООБЩЕСТВО", 
            description: "Присоединяйся к нашему Discord серверу!",
            link: "https://discord.gg/KK4dCevPah",
            chance: 35,
            target: '_blank',
            category: 'community'
        },
        {
            id: 2,
            image: "assets/images/MineOriginsAvaAd.png",
            title: "TELEGRAM КАНАЛ",
            description: "Будь в курсе всех новостей сервера!",
            link: "https://t.me/mine_origins", 
            chance: 25,
            target: '_blank',
            category: 'news'
        }
    ],
    i18n: {
        adLabel: "РЕКЛАМА",
        learnMore: "Узнать больше", 
        adNote: "Реклама помогает развивать сервер",
        close: "Закрыть",
        seconds: "с."
    }
};

// =============================================
// 2. ОПТИМИЗИРОВАННЫЙ AD MANAGER
// =============================================

class AdManager {
    constructor(config) {
        this.config = config;
        this.currentAd = null;
        this.timers = {};
        this.state = {
            isVisible: false,
            showsCount: 0,
            lastShowTime: 0,
            userPreferences: this.loadUserPreferences()
        };
        this.elements = {};
        
        this.init();
    }
    
    init() {
        if (!this.config.enabled || (this.config.respectDNT && this.hasDoNotTrack())) {
            return;
        }
        
        if (this.state.userPreferences.adsDisabled) {
            return;
        }
        
        this.createAdContainer();
        this.startAdCycle();
    }
    
    createAdContainer() {
        const adHTML = `
            <div id="adContainer" class="ad-container ad-position-${this.config.position}" style="display:none">
                <div class="ad-content-wrapper">
                    <div class="ad-header">
                        <span class="ad-label">${this.config.i18n.adLabel}</span>
                        <button class="ad-close" id="adClose" aria-label="${this.config.i18n.close}">
                            <span class="close-timer" id="closeTimer">${this.config.closeDelay}${this.config.i18n.seconds}</span>
                            <span class="close-icon">✕</span>
                        </button>
                    </div>
                    <div class="ad-body">
                        <div class="ad-image-container">
                            <img class="ad-image" id="adImage" alt="" loading="lazy">
                        </div>
                        <div class="ad-text-content">
                            <h3 class="ad-title" id="adTitle"></h3>
                            <p class="ad-description" id="adDescription"></p>
                            <div class="ad-actions">
                                <a href="#" class="ad-link" id="adLink" target="_blank">
                                    ${this.config.i18n.learnMore}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="ad-footer">
                        <span class="ad-note">${this.config.i18n.adNote}</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', adHTML);
        this.cacheElements();
        this.bindEvents();
    }
    
    cacheElements() {
        this.elements = {
            container: document.getElementById('adContainer'),
            closeBtn: document.getElementById('adClose'),
            closeTimer: document.getElementById('closeTimer'),
            adImage: document.getElementById('adImage'),
            adTitle: document.getElementById('adTitle'),
            adDescription: document.getElementById('adDescription'),
            adLink: document.getElementById('adLink')
        };
    }
    
    bindEvents() {
        this.elements.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.closeAd();
        });
        
        this.elements.adLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentAd) {
                window.open(this.currentAd.link, '_blank');
            }
        });
        
        this.elements.adImage.addEventListener('error', () => {
            this.elements.adImage.style.display = 'none';
        });
    }
    
    showAd() {
        if (this.state.isVisible || !this.canShowAd()) return;
        
        this.currentAd = this.selectAd();
        if (!this.currentAd) return;
        
        this.elements.adImage.src = this.currentAd.image;
        this.elements.adImage.alt = this.currentAd.title;
        this.elements.adTitle.textContent = this.currentAd.title;
        this.elements.adDescription.textContent = this.currentAd.description;
        this.elements.adLink.href = this.currentAd.link;
        
        this.elements.container.style.display = 'block';
        
        requestAnimationFrame(() => {
            this.elements.container.classList.add('ad-visible');
            this.state.isVisible = true;
            this.state.showsCount++;
            this.state.lastShowTime = Date.now();
            this.startCloseTimer();
        });
    }
    
    selectAd() {
        if (this.config.ads.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.config.ads.length);
        return this.config.ads[randomIndex];
    }
    
    startCloseTimer() {
        let timeLeft = this.config.closeDelay;
        this.elements.closeBtn.disabled = true;
        this.updateCloseTimer(timeLeft);
        
        this.timers.close = setInterval(() => {
            timeLeft--;
            this.updateCloseTimer(timeLeft);
            
            if (timeLeft <= 0) {
                this.enableCloseButton();
                clearInterval(this.timers.close);
            }
        }, 1000);
    }
    
    updateCloseTimer(timeLeft) {
        this.elements.closeTimer.textContent = `${timeLeft}${this.config.i18n.seconds}`;
    }
    
    enableCloseButton() {
        this.elements.closeBtn.disabled = false;
        this.elements.closeBtn.classList.add('close-enabled');
        this.elements.closeTimer.style.display = 'none';
    }
    
    closeAd() {
        if (!this.state.isVisible) return;
        
        this.elements.container.classList.remove('ad-visible');
        this.elements.container.classList.add('ad-hiding');
        
        setTimeout(() => {
            this.elements.container.style.display = 'none';
            this.elements.container.classList.remove('ad-hiding');
            this.state.isVisible = false;
            this.resetCloseTimer();
        }, this.config.animations.duration);
    }
    
    resetCloseTimer() {
        if (this.timers.close) clearInterval(this.timers.close);
        this.elements.closeBtn.disabled = true;
        this.elements.closeBtn.classList.remove('close-enabled');
        this.elements.closeTimer.style.display = 'block';
        this.elements.closeTimer.textContent = `${this.config.closeDelay}${this.config.i18n.seconds}`;
    }
    
    canShowAd() {
        return this.state.showsCount < this.config.maxShowsPerSession &&
               !this.state.userPreferences.adsDisabled &&
               (Date.now() - this.state.lastShowTime) >= this.config.showInterval * 1000;
    }
    
    startAdCycle() {
        setTimeout(() => this.showAd(), this.config.firstShowDelay);
        this.timers.cycle = setInterval(() => {
            if (!this.state.isVisible) this.showAd();
        }, this.config.showInterval * 1000);
    }
    
    hasDoNotTrack() {
        return navigator.doNotTrack === '1' || window.doNotTrack === '1';
    }
    
    loadUserPreferences() {
        try {
            return JSON.parse(localStorage.getItem('adPreferences')) || {};
        } catch {
            return {};
        }
    }
    
    saveUserPreferences() {
        try {
            localStorage.setItem('adPreferences', JSON.stringify(this.state.userPreferences));
        } catch (error) {
            // Silent fail
        }
    }
    
    disableAds() {
        this.state.userPreferences.adsDisabled = true;
        this.saveUserPreferences();
        this.closeAd();
    }
    
    enableAds() {
        this.state.userPreferences.adsDisabled = false;
        this.saveUserPreferences();
    }
}

// =============================================
// 3. ОПТИМИЗИРОВАННЫЕ CSS СТИЛИ
// =============================================

const adStyles = `.ad-container{position:fixed;z-index:10000;max-width:380px;width:90%;opacity:0;transform:translateY(100px);transition:all .4s cubic-bezier(.4,0,.2,1);pointer-events:none}.ad-container.ad-visible{opacity:1;transform:translateY(0);pointer-events:all}.ad-container.ad-hiding{opacity:0;transform:translateY(100px)}.ad-position-bottom-right{bottom:20px;right:20px}.ad-content-wrapper{background:rgba(15,15,25,.95);border:1px solid rgba(126,87,194,.4);border-radius:16px;backdrop-filter:blur(20px);box-shadow:0 20px 40px rgba(0,0,0,.6);overflow:hidden}.ad-header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:rgba(126,87,194,.1);border-bottom:1px solid rgba(126,87,194,.2)}.ad-label{color:#7e57c2;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px}.ad-close{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:50%;width:32px;height:32px;color:rgba(255,255,255,.7);cursor:not-allowed;display:flex;align-items:center;justify-content:center;position:relative;transition:all .3s ease;font-size:.875rem}.ad-close.close-enabled{cursor:pointer;background:rgba(255,255,255,.12)}.ad-close.close-enabled:hover{background:rgba(255,68,68,.2);border-color:rgba(255,68,68,.4);color:#ff4444;transform:scale(1.1)}.close-timer{position:absolute;font-size:.7rem;font-weight:700}.close-icon{opacity:0;transition:opacity .3s ease}.ad-close.close-enabled .close-icon{opacity:1}.ad-close.close-enabled .close-timer{opacity:0}.ad-image-container{width:100%;height:160px;overflow:hidden}.ad-image{width:100%;height:100%;object-fit:cover}.ad-text-content{padding:20px}.ad-title{color:#fff;font-size:1.125rem;font-weight:700;margin:0 0 8px;line-height:1.3;background:linear-gradient(45deg,#7e57c2,#9575cd);-webkit-background-clip:text;background-clip:text;color:transparent}.ad-description{color:rgba(255,255,255,.8);font-size:.875rem;line-height:1.5;margin:0 0 20px}.ad-actions{display:flex;justify-content:flex-end}.ad-link{display:inline-block;background:linear-gradient(45deg,#7e57c2,#5e35b1);color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:.875rem;font-weight:600;transition:all .3s ease}.ad-link:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(126,87,194,.4)}.ad-footer{padding:12px 16px;background:rgba(0,0,0,.2);border-top:1px solid rgba(255,255,255,.05);text-align:center}.ad-note{color:rgba(255,255,255,.5);font-size:.75rem}@media (max-width:768px){.ad-container{max-width:calc(100vw - 40px);left:20px;right:20px}.ad-position-bottom-right{bottom:80px}.ad-image-container{height:140px}.ad-text-content{padding:16px}.ad-title{font-size:1rem}.ad-description{font-size:.8rem}.ad-link{padding:8px 16px;font-size:.8rem}}@media (max-width:480px){.ad-container{max-width:calc(100vw - 32px);left:16px;right:16px}.ad-image-container{height:120px}.ad-header{padding:10px 12px}.ad-text-content{padding:12px}}`;

// =============================================
// 4. ИНИЦИАЛИЗАЦИЯ
// =============================================

const styleElement = document.createElement('style');
styleElement.textContent = adStyles;
document.head.appendChild(styleElement);

document.addEventListener('DOMContentLoaded', function() {
    try {
        window.adManager = new AdManager(adConfig);
    } catch (error) {
        // Silent initialization
    }
});