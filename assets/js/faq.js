// FAQ функциональность
document.addEventListener('DOMContentLoaded', function() {
    // Элементы FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.querySelector('.search-input');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const noResults = document.querySelector('.no-results');
    
    // Функция для переключения состояния FAQ элемента
    function toggleFaqItem(item) {
        const isActive = item.classList.contains('active');
        
        // Закрываем все открытые элементы
        document.querySelectorAll('.faq-item.active').forEach(activeItem => {
            if (activeItem !== item) {
                closeFaqItem(activeItem);
            }
        });
        
        // Переключаем текущий элемент
        if (!isActive) {
            openFaqItem(item);
        } else {
            closeFaqItem(item);
        }
    }
    
    // Функция открытия FAQ элемента
    function openFaqItem(item) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        
        // Добавляем плавную анимацию
        answer.style.transition = 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    // Функция закрытия FAQ элемента
    function closeFaqItem(item) {
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = null;
    }
    
    // Закрытие всех FAQ элементов
    function closeAllFaqItems() {
        faqItems.forEach(item => {
            closeFaqItem(item);
        });
    }
    
    // Обработчики кликов для FAQ вопросов
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFaqItem(item);
        });
    });
    
    // Закрытие FAQ при клике вне элемента
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.faq-item')) {
            closeAllFaqItems();
        }
    });
    
    // Поиск по FAQ
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        
        let visibleItems = 0;
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer-content').textContent.toLowerCase();
            const category = item.dataset.category;
            
            const matchesSearch = searchTerm === '' || question.includes(searchTerm) || answer.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;
            
            if (matchesSearch && matchesCategory) {
                item.style.display = 'block';
                item.style.opacity = '1';
                visibleItems++;
                
                // Подсветка найденного текста
                if (searchTerm !== '') {
                    highlightText(item, searchTerm);
                } else {
                    removeHighlight(item);
                }
            } else {
                item.style.display = 'none';
                item.style.opacity = '0';
                removeHighlight(item);
            }
        });
        
        // Показываем/скрываем сообщение "ничего не найдено"
        if (visibleItems === 0) {
            noResults.classList.add('active');
        } else {
            noResults.classList.remove('active');
        }
        
        // Закрываем все FAQ при поиске
        closeAllFaqItems();
    }
    
    // Подсветка найденного текста
    function highlightText(item, searchTerm) {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer-content');
        
        const questionText = question.textContent;
        const answerText = answer.textContent;
        
        // Восстанавливаем оригинальный текст перед подсветкой
        question.innerHTML = questionText;
        answer.innerHTML = answerText;
        
        // Подсветка в вопросе
        if (questionText.toLowerCase().includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            question.innerHTML = questionText.replace(regex, '<mark class="search-highlight">$1</mark>');
        }
        
        // Подсветка в ответе (только если ответ открыт)
        if (item.classList.contains('active') && answerText.toLowerCase().includes(searchTerm)) {
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            answer.innerHTML = answerText.replace(regex, '<mark class="search-highlight">$1</mark>');
        }
    }
    
    // Удаление подсветки
    function removeHighlight(item) {
        const question = item.querySelector('.faq-question h3');
        const answer = item.querySelector('.faq-answer-content');
        
        if (question.querySelector('mark')) {
            question.innerHTML = question.textContent;
        }
        if (answer.querySelector('mark')) {
            answer.innerHTML = answer.textContent;
        }
    }
    
    // Обработчик поиска с debounce
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });
    
    // Обработчик Enter в поиске
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Обработчики категорий
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            performSearch();
            
            // Анимация переключения категорий
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Автоматическое открытие FAQ при наличии якоря в URL
    function checkUrlAnchor() {
        const hash = window.location.hash;
        if (hash) {
            const targetItem = document.querySelector(hash);
            if (targetItem && targetItem.classList.contains('faq-item')) {
                // Прокручиваем к элементу и открываем его
                setTimeout(() => {
                    targetItem.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    
                    // Ждем завершения скролла и открываем элемент
                    setTimeout(() => {
                        openFaqItem(targetItem);
                    }, 800);
                }, 100);
            }
        }
    }
    
    // Проверяем якорь при загрузке
    checkUrlAnchor();
    
    // Добавляем обработчик для изменения хэша
    window.addEventListener('hashchange', checkUrlAnchor);
    
    // Анимация появления элементов при скролле
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 100;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    // Оптимизация скролла с requestAnimationFrame
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.cancelAnimationFrame(isScrolling);
        isScrolling = window.requestAnimationFrame(revealOnScroll);
    });
    
    // Инициализация при загрузке
    revealOnScroll();
    
    
    // Обработка изменения размера окна (пересчет высоты открытых элементов)
    window.addEventListener('resize', function() {
        document.querySelectorAll('.faq-item.active').forEach(item => {
            const answer = item.querySelector('.faq-answer');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        });
    });
    
    // Добавляем стили для подсветки поиска
    const style = document.createElement('style');
    style.textContent = `
        .search-highlight {
            background: linear-gradient(45deg, var(--mc-accent), var(--text-accent));
            color: var(--text-primary);
            padding: 0.1rem 0.2rem;
            border-radius: 3px;
            font-weight: bold;
        }
        
        .faq-item {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .faq-answer {
            transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
    `;
    document.head.appendChild(style);
    
    console.log('FAQ система инициализирована успешно!');
});