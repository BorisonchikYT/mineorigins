// Данные о расах
const raceData = {
    hell: {
        title: "ДЕМОНЫ",
        subtitle: "Родина - Ад",
        description: "Могущественные существа из глубин Ада, обладающие темной магией и способностью управлять огнем. Их сила проистекает из самой сущности хаоса и разрушения.",
        abilities: ["Летать", "Жить в аду", "Темная магия", "Засекречено"],
        bonuses: ["Засекречено", "Засекречено", "Засекречено"]
    },
    heaven: {
        title: "АНГЕЛЫ", 
        subtitle: "Родина - Рай",
        description: "Божественные существа, наделенные светлой магией. Они защищают небесные сферы и несут свет во тьму.",
        abilities: ["Летать", "Ангельская магия", "Засекречено", "Засекречено"],
        bonuses: ["Засекречено", "Засекречено", "Засекречено"]
    },
    earth: {
        title: "ЗЕМНЫЕ",
        subtitle: "Родина - Земля", 
        description: "Мастера ремесел и магии, способные преобразовывать ресурсы и создавать удивительные сооружения. Их сила в знаниях и трудолюбии.",
        abilities: ["Земная магия", "Ремесленное мастерство", "Добыча ресурсов", "Строительство"],
        bonuses: ["Засекречено", "Засекречено", "Засекречено"]
    },
    timer: {
        title: "ХРАНИТЕЛИ ВРЕМЕНИ",
        subtitle: "Родина - Не известно", 
        description: "Засекречено",
        abilities: ["Не известно", "Не известно"],
        bonuses: ["Не известно", "Не известно"]
    },
    ii: {
        title: "ЧУЖИЕ",
        subtitle: "Родина - Не известно", 
        description: "Засекречено",
        abilities: ["Не известно", "Не известно"],
        bonuses: ["Не известно", "Не известно"]
    }
};

// Открытие модального окна
document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const race = this.dataset.race;
        openRaceModal(race);
    });
});

// Функция открытия модалки
function openRaceModal(race) {
    const data = raceData[race];
    const modal = document.getElementById('raceModal');
    
    // Заполняем данные
    modal.querySelector('.modal-race-icon').innerHTML = document.querySelector(`[data-race="${race}"] .race-icon`).innerHTML;
    modal.querySelector('.modal-title').textContent = data.title;
    modal.querySelector('.modal-subtitle').textContent = data.subtitle;
    
    // Обработка описания (засекречено или нет)
    const descriptionElement = modal.querySelector('.race-description');
    descriptionElement.textContent = data.description;
    if (data.description.includes('Засекречено') || data.description.includes('Не известно')) {
        descriptionElement.classList.add('secret');
    } else {
        descriptionElement.classList.remove('secret');
    }
    
    // Заполняем способности с проверкой на засекреченность
    const abilitiesList = modal.querySelector('.abilities-list');
    abilitiesList.innerHTML = data.abilities.map(ability => {
        const isSecret = ability.includes('Засекречено') || ability.includes('Не известно');
        return `<div class="ability-item ${isSecret ? 'secret' : ''}">${ability}</div>`;
    }).join('');
    
    // Заполняем бонусы с проверкой на засекреченность
    const bonusesList = modal.querySelector('.bonuses-list');
    bonusesList.innerHTML = data.bonuses.map(bonus => {
        const isSecret = bonus.includes('Засекречено') || bonus.includes('Не известно');
        return `<div class="bonus-item ${isSecret ? 'secret' : ''}">${bonus}</div>`;
    }).join('');
    
    // Скрываем кнопку выбора расы для засекреченных рас
    const selectButton = modal.querySelector('.select-race-btn');
    if (selectButton) {
        if (data.description.includes('Засекречено') || data.description.includes('Не известно')) {
            selectButton.style.display = 'none';
        } else {
            selectButton.style.display = 'block';
        }
    }
    
    // Показываем модалку
    modal.classList.add('active');
}

// Функция для проверки и обновления кнопок засекреченных рас
function updateSecretRaceButtons() {
    document.querySelectorAll('.race-card').forEach(card => {
        const race = card.dataset.race;
        const data = raceData[race];
        const button = card.querySelector('.details-btn');
        
        if (data.description.includes('Засекречено') || data.description.includes('Не известно')) {
            button.classList.add('disabled');
            button.innerHTML = 'Засекречено 🔒';
        } else {
            button.classList.remove('disabled');
            button.innerHTML = 'Подробнее';
        }
    });
}

// Вызываем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateSecretRaceButtons();
});

// Закрытие модального окна
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.getElementById('raceModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

function closeModal() {
    document.getElementById('raceModal').classList.remove('active');
}
