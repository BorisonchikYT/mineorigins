// Функционал галереи с улучшенным отображением и модальным окном
class Gallery {
    constructor() {
        this.currentFilter = 'all';
        this.visibleItems = 6;
        this.itemsPerLoad = 6;
        this.isLoading = false;
        this.currentModalIndex = 0;
        this.currentModalItems = [];
        this.init();
    }

    init() {
        this.processGalleryItems();
        this.bindEvents();
        this.initStats();
        this.initModal();
        this.preloadImages();
    }

    // Обработка элементов галереи для улучшенного отображения
    processGalleryItems() {
        document.querySelectorAll('.gallery-item').forEach(item => {
            const images = item.querySelectorAll('img');
            
            // Проверяем, не обработан ли уже этот элемент
            if (!item.classList.contains('processed')) {
                if (images.length > 0) {
                    this.setupMultipleImages(item, images);
                }
                item.classList.add('processed'); // Помечаем как обработанный
            }
        });
    }

// Настройка отображения нескольких изображений
setupMultipleImages(item, images) {
    const imageContainer = item.querySelector('.image-container');
    const mainImage = images[0];
    
    // Сохраняем оверлей
    const originalOverlay = imageContainer.querySelector('.image-overlay');
    
    // Очищаем контейнер
    imageContainer.innerHTML = '';
    
    // Добавляем основное изображение
    const primaryImg = document.createElement('img');
    primaryImg.src = mainImage.src;
    primaryImg.alt = mainImage.alt;
    primaryImg.className = 'primary-image';
    imageContainer.appendChild(primaryImg);
    
    // Помечаем карточку как имеющую несколько изображений
    item.querySelector('.gallery-card').classList.add('multiple-images');
    
    // Создаем бейдж количества изображений
    const countBadge = document.createElement('div');
    countBadge.className = 'image-count-badge';
    countBadge.textContent = `${images.length} фото`;
    imageContainer.appendChild(countBadge);
    
    // Добавляем дополнительные изображения
    for (let i = 1; i < Math.min(images.length, 4); i++) {
        const secondaryImage = document.createElement('img');
        secondaryImage.src = images[i].src;
        secondaryImage.alt = images[i].alt;
        
        // Распределяем позиции для дополнительных изображений
        if (i === 1) {
            secondaryImage.className = 'secondary-image top-right';
        } else if (i === 2) {
            secondaryImage.className = 'secondary-image bottom-right';
        } else if (i === 3) {
            secondaryImage.className = 'secondary-image bottom-left';
        }
        
        imageContainer.appendChild(secondaryImage);
    }
    
    // Восстанавливаем оверлей (клонируем оригинальный)
    if (originalOverlay) {
        imageContainer.appendChild(originalOverlay.cloneNode(true));
    }
}

    bindEvents() {
        // Фильтрация
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Загрузка больше
        const loadMoreBtn = document.getElementById('loadMore');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }

        // Обработчики для карточек
        document.querySelectorAll('.gallery-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleCardClick(e));
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'ArrowRight') this.nextImage();
            if (e.key === 'ArrowLeft') this.prevImage();
        });
    }

    initStats() {
        const totalItems = document.querySelectorAll('.gallery-item').length;
        const categories = {
            builds: document.querySelectorAll('[data-category="builds"]').length,
            nature: document.querySelectorAll('[data-category="nature"]').length,
            events: document.querySelectorAll('[data-category="events"]').length
        };

        document.querySelector('.stat-total .stat-number').textContent = totalItems;
        document.querySelector('.stat-builds .stat-number').textContent = categories.builds;
        document.querySelector('.stat-nature .stat-number').textContent = categories.nature;
        document.querySelector('.stat-events .stat-number').textContent = categories.events;
    }

    initModal() {
        // Создаем модальное окно если его нет
        if (!document.querySelector('.gallery-modal')) {
            this.createModal();
        }
        
        this.modal = document.querySelector('.gallery-modal');
        this.modalImages = this.modal.querySelector('.gallery-modal-images');
        this.modalTitle = this.modal.querySelector('.gallery-modal-title');
        this.modalDescription = this.modal.querySelector('.gallery-modal-description');
        this.modalDate = this.modal.querySelector('.gallery-modal-date');
        this.modalTags = this.modal.querySelector('.gallery-modal-tags');
        this.modalCounter = this.modal.querySelector('.gallery-modal-counter');
        
        // Навигация
        this.modal.querySelector('.gallery-modal-prev').addEventListener('click', () => this.prevImage());
        this.modal.querySelector('.gallery-modal-next').addEventListener('click', () => this.nextImage());
        this.modal.querySelector('.gallery-modal-close').addEventListener('click', () => this.closeModal());
        
        // Закрытие по клику на оверлей
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    createModal() {
        const modalHTML = `
            <div class="gallery-modal">
                <div class="gallery-modal-content">
                    <button class="gallery-modal-close">×</button>
                    <div class="gallery-modal-counter">1/1</div>
                    <div class="gallery-modal-nav">
                        <button class="gallery-modal-prev">‹</button>
                        <button class="gallery-modal-next">›</button>
                    </div>
                    <div class="gallery-modal-body">
                        <div class="gallery-modal-images"></div>
                        <div class="gallery-modal-info">
                            <h3 class="gallery-modal-title"></h3>
                            <p class="gallery-modal-description"></p>
                            <div class="gallery-modal-meta">
                                <div class="gallery-modal-date">
                                    <i class="fas fa-calendar"></i>
                                    <span class="date-text"></span>
                                </div>
                                <div class="gallery-modal-tags"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    preloadImages() {
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
        this.visibleItems = 6;
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

    handleCardClick(e) {
        const card = e.currentTarget;
        const item = card.closest('.gallery-item');
        this.openModal(item);
    }

    openModal(item) {
        // Собираем все изображения из элемента
        const images = Array.from(item.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt
        }));
        
        const title = item.querySelector('h3')?.textContent || 'Без названия';
        const description = item.querySelector('p')?.textContent || '';
        const stats = item.querySelectorAll('.stat');
        const category = item.getAttribute('data-category');

        this.currentModalItems = images;
        this.currentModalIndex = 0;

        this.updateModalContent(title, description, stats, category);
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    updateModalContent(title, description, stats, category) {
        // Очищаем контейнер изображений
        this.modalImages.innerHTML = '';
        
        // Добавляем изображения
        this.currentModalItems.forEach((image, index) => {
            const container = document.createElement('div');
            container.className = 'gallery-modal-image-container';
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            img.className = 'gallery-modal-image';
            
            container.appendChild(img);
            this.modalImages.appendChild(container);
        });

        // Обновляем информацию
        this.modalTitle.textContent = title;
        this.modalDescription.textContent = description;
        
        // Дата из описания (первая строка)
        const dateMatch = description.match(/\d{2}\.\d{2}\.\d{4}/);
        if (dateMatch) {
            this.modalDate.querySelector('.date-text').textContent = dateMatch[0];
        }
        
        // Теги из статистики
        this.modalTags.innerHTML = '';
        stats.forEach(stat => {
            const tag = document.createElement('span');
            tag.className = 'gallery-modal-tag';
            tag.textContent = stat.textContent;
            this.modalTags.appendChild(tag);
        });
        
        // Добавляем тег категории
        const categoryTag = document.createElement('span');
        categoryTag.className = `gallery-modal-tag category-${category}`;
        categoryTag.textContent = this.getCategoryName(category);
        this.modalTags.appendChild(categoryTag);

        this.updateModalCounter();
    }

    getCategoryName(category) {
        const names = {
            'builds': 'Постройки',
            'nature': 'Общие фото',
            'events': 'События',
            'players': 'Игроки'
        };
        return names[category] || category;
    }

    updateModalCounter() {
        this.modalCounter.textContent = `${this.currentModalIndex + 1}/${this.currentModalItems.length}`;
    }

    nextImage() {
        if (this.currentModalItems.length <= 1) return;
        
        this.currentModalIndex = (this.currentModalIndex + 1) % this.currentModalItems.length;
        this.scrollToCurrentImage();
        this.updateModalCounter();
    }

    prevImage() {
        if (this.currentModalItems.length <= 1) return;
        
        this.currentModalIndex = (this.currentModalIndex - 1 + this.currentModalItems.length) % this.currentModalItems.length;
        this.scrollToCurrentImage();
        this.updateModalCounter();
    }

    scrollToCurrentImage() {
        const containers = this.modalImages.querySelectorAll('.gallery-modal-image-container');
        if (containers[this.currentModalIndex]) {
            containers[this.currentModalIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.currentModalIndex = 0;
        this.currentModalItems = [];
    }

    async loadMore() {
        if (this.isLoading) return;

        const loadMoreBtn = document.getElementById('loadMore');
        this.isLoading = true;
        
        if (loadMoreBtn) {
            loadMoreBtn.classList.add('loading');
            loadMoreBtn.disabled = true;
        }

        try {
            await this.simulateLoad();
            this.visibleItems += this.itemsPerLoad;
            this.applyFilter();
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            this.showError('Ошибка загрузки изображений');
        } finally {
            this.isLoading = false;
            if (loadMoreBtn) {
                loadMoreBtn.classList.remove('loading');
                loadMoreBtn.disabled = false;
            }
        }
    }

    simulateLoad() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMore');
        if (!loadMoreBtn) return;
        
        const totalFiltered = document.querySelectorAll(
            `.gallery-item${this.currentFilter === 'all' ? '' : `[data-category="${this.currentFilter}"]`}`
        ).length;
        
        if (this.visibleItems >= totalFiltered) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'flex';
        }
    }

    showError(message) {
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

// Инициализация галереи
document.addEventListener('DOMContentLoaded', () => {
    new Gallery();
});

// Добавляем CSS анимации
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
`;
document.head.appendChild(style);












