document.addEventListener('DOMContentLoaded', function() {
        initSettlementsPage();
        initSettlementsStats();
        initMapInteractions();
        initSettlementsFilter();
        });

        function initSettlementsPage() {
            
            const cards = document.querySelectorAll('.settlement-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }

        function initSettlementsStats() {
            const statNumbers = document.querySelectorAll('.stat-number[data-target]');
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target, 2000);
            });
        }

        function animateCounter(element, target, duration) {
            let start = 0;
            const increment = target / (duration / 16);
            
            function update() {
                start += increment;
                if (start < target) {
                    element.textContent = Math.floor(start);
                    requestAnimationFrame(update);
                } else {
                    element.textContent = target;
                }
            }
            
            update();
        }

        function initMapInteractions() {
            const mapContainer = document.querySelector('.map-container');
            if (!mapContainer) return;

            const mapPoints = document.querySelectorAll('.map-point');
            mapPoints.forEach(point => {
                point.addEventListener('click', function() {
                    const settlementName = this.getAttribute('data-settlement');
                    showSettlementDetailsByName(settlementName);
                });

                point.addEventListener('mouseenter', function() {
                    const settlementName = this.getAttribute('data-settlement');
                    showMapTooltip(settlementName, this);
                });

                point.addEventListener('mouseleave', function() {
                    hideMapTooltip();
                });
            });

            let scale = 1;
            const minScale = 0.5;
            const maxScale = 3;

            mapContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                const delta = -e.deltaY * 0.01;
                scale = Math.min(maxScale, Math.max(minScale, scale + delta));
                
                mapContainer.style.transform = `scale(${scale})`;
            });

            mapContainer.style.cursor = 'grab';
        }

        function showMapTooltip(settlementName, pointElement) {
            let tooltip = document.querySelector('.map-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'map-tooltip';
                document.body.appendChild(tooltip);
            }

            const settlementInfo = getSettlementInfo(settlementName);
            
            tooltip.innerHTML = `
                <div class="tooltip-content">
                    <strong>${settlementInfo.name}</strong>
                    <span>${settlementInfo.raceIcon} ${settlementInfo.race}</span>
                    <span>👑 ${settlementInfo.leader}</span>
                    <span>👥 ${settlementInfo.population} жителей</span>
                    <span>📍 ${settlementInfo.location}</span>
                </div>
            `;
            
            const rect = pointElement.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            
            const tooltipWidth = 200;
            const tooltipHeight = 150;
            
            let left = rect.left + scrollLeft + (rect.width / 2);
            let top = rect.top + scrollTop - tooltipHeight - 10;
            
            if (left - tooltipWidth / 2 < 10) {
                left = tooltipWidth / 2 + 10;
            }
            if (left + tooltipWidth / 2 > window.innerWidth - 10) {
                left = window.innerWidth - tooltipWidth / 2 - 10;
            }
            if (top < 10) {
                top = rect.bottom + scrollTop + 10;
            }
            
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.classList.add('visible');
        }

        function hideMapTooltip() {
            const tooltip = document.querySelector('.map-tooltip');
            if (tooltip) {
                tooltip.classList.remove('visible');
            }
        }

        function getSettlementInfo(name) {
            const settlements = {
                'ФрикБургская Империя': {
                    name: 'ФрикБургская Империя',
                    race: '',
                    raceIcon: '<img src="assets/images/icons/icon_demon.gif" class="resized-image_map"> Демоны, <img src="assets/images/icons/icon_terrestrial.gif" class="resized-image2"> Земные, <img src="assets/images/icons/icon_angel.gif" class="resized-image2"> Ангелы',
                    leader: '_Kot_Baris_',
                    population: 8,
                    location: 'Земля',
                },
                'Логово Хантера': {
                    name: 'Логово Хантера',
                    race: '<img src="assets/images/icons/icon_demon.gif" class="resized-image_map"> Демоны, <img src="assets/images/icons/icon_terrestrial.gif" class="resized-image2"> Земные',
                    raceIcon: '',
                    leader: 'stalker_hunter_',
                    population: 1,
                    location: 'Под землёй',
                },
                'База Тропика': {
                    name: 'База Тропика',
                    race: '',
                    raceIcon: '<img src="assets/images/icons/icon_terrestrial.gif" class="resized-image_map2"> Земные',
                    leader: 'tropic_yt2021',
                    population: 1,
                    location: 'Земля',
                },
                'ВДНХ': {
                    name: 'ВДНХ',
                    race: '',
                    raceIcon: '<img src="assets/images/icons/icon_terrestrial.gif" class="resized-image_map2"> Земные',
                    leader: 'jdh16',
                    population: 1,
                    location: 'Земля',
                },
                'База Ангелов': {
                    name: 'База Ангелов',
                    race: '',
                    raceIcon: '<img src="assets/images/icons/icon_angel.gif" class="resized-image_map"> Ангелы',
                    leader: 'amidamaru3434',
                    population: 4,
                    location: 'Земля',
                },
                'Максимка': {
                    name: 'Максимка',
                    race: '',
                    raceIcon: '<img src="assets/images/icons/icon_terrestrial.gif" class="resized-image2"> Земные',
                    leader: 'maxxaumka',
                    population: 1,
                    location: 'Земля',
                },
                'База механиков': {
                    name: 'База механиков',
                    race: '<img src="assets/images/icons/icon_angel.gif" class="resized-image2"> Ангел, <img src="assets/images/icons/icon_terrestrial.gif" class="resized-image2"> Земной',
                    raceIcon: '',
                    leader: 'maxxaumka и snekky_offc',
                    population: 2,
                    location: 'Земля',
                }
            };
            
            return settlements[name] || {
                name: name,
                race: 'Неизвестно',
                raceIcon: '🏰',
                leader: 'Неизвестно',
                population: 0,
                location: 'Неизвестно',
                level: 0
            };
        }

        function showSettlementDetailsByName(settlementName) {
        }

        function initSettlementsFilter() {
            const filterButtons = document.querySelectorAll('.settlement-filter-btn');
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-filter');
                    applyFilters();
                });
            });

            const searchInput = document.querySelector('.settlements-search');
            if (searchInput) {
                searchInput.addEventListener('input', () => {
                    applyFilters();
                });
            }
        }

        function applyFilters() {
            const activeRaceFilter = document.querySelector('.settlement-filter-btn.active').getAttribute('data-filter');
            const searchTerm = document.querySelector('.settlements-search').value.toLowerCase();

            const settlementCards = document.querySelectorAll('.settlement-card');
            
            settlementCards.forEach(card => {
                const race = card.getAttribute('data-race');
                const name = card.querySelector('.settlement-name').textContent.toLowerCase();
                const leader = card.querySelector('.leader-name').textContent.toLowerCase();
                const location = card.querySelector('.location-text').textContent.toLowerCase();

                let show = true;

                if (activeRaceFilter !== 'all' && race !== activeRaceFilter) {
                    show = false;
                }

                if (searchTerm && !name.includes(searchTerm) && !leader.includes(searchTerm) && !location.includes(searchTerm)) {
                    show = false;
                }

                if (show) {
                    card.style.display = 'flex';
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.classList.remove('visible');
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });

            updateFilteredStats();
        }

        function updateFilteredStats() {
            const visibleCards = document.querySelectorAll('.settlement-card[style*="display: flex"]');
            const totalPopulation = Array.from(visibleCards).reduce((sum, card) => {
                return sum + parseInt(card.querySelector('.population-badge').textContent.match(/\d+/)[0]);
            }, 0);
            
            const activeProjects = Array.from(visibleCards).filter(card => {
                const level = parseInt(card.querySelector('.level-badge').textContent.match(/\d+/)[0]);
                return level >= 3;
            }).length;

            const statNumbers = document.querySelectorAll('.settlements-stats .stat-number');
            if (statNumbers[0]) statNumbers[0].textContent = visibleCards.length;
            if (statNumbers[1]) statNumbers[1].textContent = totalPopulation;
            if (statNumbers[2]) statNumbers[2].textContent = activeProjects;
        }

        function showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'toast-notification';
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 3000);
        }

        const toastStyles = document.createElement('style');
        toastStyles.textContent = `
            .toast-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #7e57c2;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                z-index: 10001;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                font-family: 'Orbitron', sans-serif;
            }
            
            .toast-notification.show {
                transform: translateX(0);
            }
            
            .war-status-badge {
                position: absolute;
                bottom: 1rem;
                left: 1rem;
                padding: 0.4rem 0.8rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
                border: 2px solid;
            }
            
            .war-status-badge.peace {
                background: rgba(76, 175, 80, 0.2);
                border-color: #4caf50;
                color: #4caf50;
            }
            
            .war-status-badge.defensive {
                background: rgba(255, 193, 7, 0.2);
                border-color: #ffc107;
                color: #ffc107;
            }
            
            .war-status-badge.aggressive {
                background: rgba(244, 67, 54, 0.2);
                border-color: #f44336;
                color: #f44336;
            }
            
            .war-status-badge.neutral {
                background: rgba(158, 158, 158, 0.2);
                border-color: #9e9e9e;
                color: #9e9e9e;
            }
            
            .settlement-coordinates {
                margin: 1rem 0;
                padding: 0.8rem;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .coordinates-label {
                display: block;
                font-size: 0.8rem;
                color: #b0b0b0;
                margin-bottom: 0.3rem;
            }
            
            .coordinates-value {
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                color: #d4b3ff;
                background: rgba(0, 0, 0, 0.3);
                padding: 0.3rem 0.6rem;
                border-radius: 5px;
            }
        `;
        document.head.appendChild(toastStyles);

        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const settlementId = this.getAttribute('data-settlement-id');
                const settlementCard = this.closest('.settlement-card');
                const settlementName = settlementCard.querySelector('.settlement-name').textContent;
                showSettlementDetailsByName(settlementName);
            });
        });

        document.querySelectorAll('.settlement-card').forEach(card => {
            card.addEventListener('click', function() {
                const settlementName = this.querySelector('.settlement-name').textContent;
                showSettlementDetailsByName(settlementName);
            });
        });

        document.addEventListener('mousemove', function(e) {
            const cursor = document.querySelector('.minecraft-cursor');
            if (cursor) {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            }
        });