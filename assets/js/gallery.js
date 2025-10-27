// Функционал галереи
class Gallery {
    constructor() {
        this.currentFilter = 'all';
        this.visibleItems = 6;
        this.itemsPerLoad = 6;
        this.allItems = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initStats();
        this.initModal();
        this.preloadImages();
    }

    bindEvents() {
        // Фильтрация
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Загрузка больше
        document.getElementById('loadMore').addEventListener('click', () => this.loadMore());

        // Закрытие модального окна
        document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        document.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.closeModal();
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    initStats() {
        const totalItems = document.querySelectorAll('.gallery-item').length;
        const categories = {
            builds: document.querySelectorAll('[data-category="builds"]').length,
            nature: document.querySelectorAll('[data-category="nature"]').length,
            events: document.querySelectorAll('[data-category="events"]').length,
            players: document.querySelectorAll('[data-category="players"]').length
        };

        document.querySelector('.stat-total .stat-number').textContent = totalItems;
        document.querySelector('.stat-builds .stat-number').textContent = categories.builds;
        document.querySelector('.stat-nature .stat-number').textContent = categories.nature;
        document.querySelector('.stat-events .stat-number').textContent = categories.events;
    }

    initModal() {
        this.modal = document.querySelector('.modal-overlay');
        this.modalImage = this.modal.querySelector('.modal-image');
        this.modalTitle = this.modal.querySelector('.modal-title');
        this.modalDescription = this.modal.querySelector('.modal-description');
        this.modalStats = this.modal.querySelector('.modal-stats');
    }

    preloadImages() {
        // Предзагрузка изображений для лучшего UX
        const images = document.querySelectorAll('.image-container img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('data:')) {
                const preload = new Image();
                preload.src = src;
            }
        });
    }

    handleFilter(e) {
        const button = e.currentTarget;
        const filter = button.getAttribute('data-filter');

        // Обновляем активную кнопку
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.currentFilter = filter;
        this.visibleItems = 6; // Сбрасываем счетчик
        this.applyFilter();
    }

    applyFilter() {
        const items = document.querySelectorAll('.gallery-item');
        let visibleCount = 0;

        items.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            
            if (this.currentFilter === 'all' || category === this.currentFilter) {
                if (visibleCount < this.visibleItems) {
                    item.classList.remove('hidden');
                    // Добавляем задержку для анимации
                    item.style.transitionDelay = `${index * 0.1}s`;
                    visibleCount++;
                } else {
                    item.classList.add('hidden');
                }
            } else {
                item.classList.add('hidden');
            }
        });

        this.updateLoadMoreButton();
        this.animateItems();
    }

    animateItems() {
        const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        
        visibleItems.forEach((item, index) => {
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = `itemAppear 0.6s ease-out ${index * 0.1}s both`;
            }, 50);
        });
    }

    async loadMore() {
        if (this.isLoading) return;

        const loadMoreBtn = document.getElementById('loadMore');
        this.isLoading = true;
        
        // Показываем индикатор загрузки
        loadMoreBtn.classList.add('loading');
        loadMoreBtn.disabled = true;

        try {
            // Имитация загрузки с сервера
            await this.simulateLoad();
            
            this.visibleItems += this.itemsPerLoad;
            this.applyFilter();
            
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            this.showError('Ошибка загрузки изображений');
        } finally {
            this.isLoading = false;
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.disabled = false;
        }
    }

    simulateLoad() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // В реальном приложении здесь будет AJAX запрос
                resolve();
            }, 1500);
        });
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMore');
        const totalFiltered = document.querySelectorAll(`.gallery-item${this.currentFilter === 'all' ? '' : `[data-category="${this.currentFilter}"]`}`).length;
        
        if (this.visibleItems >= totalFiltered) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
        }
    }

    openModal(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        const stats = item.querySelectorAll('.stat');

        this.modalImage.src = img.src;
        this.modalImage.alt = img.alt;
        this.modalTitle.textContent = title;
        this.modalDescription.textContent = description;

        // Обновляем статистику в модальном окне
        this.modalStats.innerHTML = '';
        stats.forEach(stat => {
            const statElement = document.createElement('span');
            statElement.className = 'stat';
            statElement.textContent = stat.textContent;
            this.modalStats.appendChild(statElement);
        });

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Сбрасываем атрибуты после закрытия
        setTimeout(() => {
            this.modalImage.src = '';
            this.modalImage.alt = '';
        }, 300);
    }

    showError(message) {
        // Создаем уведомление об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--hell-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 3000);
    }
}

// Инициализация галереи при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Gallery();

    // Добавляем обработчики клика на карточки
    document.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', function() {
            gallery.openModal(this.closest('.gallery-item'));
        });
    });

    // Добавляем обработчики клавиатуры для навигации
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            // Навигация между изображениями (можно доработать)
            e.preventDefault();
        }
    });

    // Lazy loading для изображений
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// CSS анимация для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .gallery-item {
        view-timeline-name: --item;
        view-timeline-axis: block;
    }
`;
document.head.appendChild(style);