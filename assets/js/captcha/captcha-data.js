// ОГРОМНАЯ база данных капч разных типов
const CAPTCHA_DATABASE = {
    math: [
        // Легкие математические задания
        { id: 1, type: 'math', question: '7 + 3 = ?', answer: '10', difficulty: 'easy' },
        { id: 2, type: 'math', question: '15 - 8 = ?', answer: '7', difficulty: 'easy' },
        { id: 3, type: 'math', question: '5 × 4 = ?', answer: '20', difficulty: 'easy' },
        { id: 4, type: 'math', question: '12 ÷ 3 = ?', answer: '4', difficulty: 'easy' },
        { id: 5, type: 'math', question: '9 + 6 = ?', answer: '15', difficulty: 'easy' },
        { id: 6, type: 'math', question: '20 - 5 = ?', answer: '15', difficulty: 'easy' },
        { id: 7, type: 'math', question: '3 × 7 = ?', answer: '21', difficulty: 'easy' },
        { id: 8, type: 'math', question: '18 ÷ 2 = ?', answer: '9', difficulty: 'easy' },
        { id: 9, type: 'math', question: '8 + 9 = ?', answer: '17', difficulty: 'easy' },
        { id: 10, type: 'math', question: '25 - 7 = ?', answer: '18', difficulty: 'easy' },

        // Средние математические задания
        { id: 11, type: 'math', question: '8 + 6 - 3 = ?', answer: '11', difficulty: 'medium' },
        { id: 12, type: 'math', question: '2 × 3 + 5 = ?', answer: '11', difficulty: 'medium' },
        { id: 13, type: 'math', question: '20 - 7 + 3 = ?', answer: '16', difficulty: 'medium' },
        { id: 14, type: 'math', question: '9 ÷ 3 × 2 = ?', answer: '6', difficulty: 'medium' },
        { id: 15, type: 'math', question: '15 + 8 - 4 = ?', answer: '19', difficulty: 'medium' },
        { id: 16, type: 'math', question: '4 × 3 + 7 = ?', answer: '19', difficulty: 'medium' },
        { id: 17, type: 'math', question: '24 ÷ 4 × 2 = ?', answer: '12', difficulty: 'medium' },
        { id: 18, type: 'math', question: '18 - 5 + 3 = ?', answer: '16', difficulty: 'medium' },
        { id: 19, type: 'math', question: '6 × 2 + 8 = ?', answer: '20', difficulty: 'medium' },
        { id: 20, type: 'math', question: '30 ÷ 5 × 3 = ?', answer: '18', difficulty: 'medium' },

        // Сложные математические задания
        { id: 21, type: 'math', question: '(5 + 3) × 2 = ?', answer: '16', difficulty: 'hard' },
        { id: 22, type: 'math', question: '12 ÷ (4 - 1) = ?', answer: '4', difficulty: 'hard' },
        { id: 23, type: 'math', question: '3² + 4² = ?', answer: '25', difficulty: 'hard' },
        { id: 24, type: 'math', question: '√16 + √9 = ?', answer: '7', difficulty: 'hard' },
        { id: 25, type: 'math', question: '15% от 200 = ?', answer: '30', difficulty: 'hard' },
        { id: 26, type: 'math', question: '2³ × 3 = ?', answer: '24', difficulty: 'hard' },
        { id: 27, type: 'math', question: '5! ÷ 10 = ?', answer: '12', difficulty: 'hard' },
        { id: 28, type: 'math', question: '3 × (8 - 2) + 4 = ?', answer: '22', difficulty: 'hard' },
        { id: 29, type: 'math', question: '7² - 3² = ?', answer: '40', difficulty: 'hard' },
        { id: 30, type: 'math', question: '100 ÷ (5 × 2) = ?', answer: '10', difficulty: 'hard' },

        // Очень сложные математические задания
        { id: 31, type: 'math', question: '2x + 5 = 15, x = ?', answer: '5', difficulty: 'expert' },
        { id: 32, type: 'math', question: '3² + 4² - 5² = ?', answer: '0', difficulty: 'expert' },
        { id: 33, type: 'math', question: 'sin(30°) = ?', answer: '0.5', difficulty: 'expert' },
        { id: 34, type: 'math', question: 'log₁₀100 = ?', answer: '2', difficulty: 'expert' },
        { id: 35, type: 'math', question: 'π (округлить до 2 знаков) = ?', answer: '3.14', difficulty: 'expert' },
        { id: 36, type: 'math', question: '2⁴ + 3³ = ?', answer: '43', difficulty: 'expert' },
        { id: 37, type: 'math', question: '√144 - √64 = ?', answer: '4', difficulty: 'expert' },
        { id: 38, type: 'math', question: '15 × 0.2 = ?', answer: '3', difficulty: 'expert' },
        { id: 39, type: 'math', question: '3/4 + 1/2 = ?', answer: '1.25', difficulty: 'expert' },
        { id: 40, type: 'math', question: '2⁻² = ?', answer: '0.25', difficulty: 'expert' }
    ],

    puzzle: [
        // Числовые последовательности
        { id: 1, type: 'puzzle', instruction: 'Нажмите на числа в порядке возрастания', sequence: [1, 2, 3, 4, 5, 6], options: [3, 1, 5, 2, 6, 4], answer: [1, 2, 3, 4, 5, 6] },
        { id: 2, type: 'puzzle', instruction: 'Нажмите на числа от меньшего к большему', sequence: [2, 4, 6, 8, 10], options: [6, 2, 10, 4, 8], answer: [2, 4, 6, 8, 10] },
        { id: 3, type: 'puzzle', instruction: 'Выберите числа по порядку', sequence: [5, 10, 15, 20], options: [10, 20, 5, 15], answer: [5, 10, 15, 20] },
        { id: 4, type: 'puzzle', instruction: 'Расставьте числа от 1 до 8', sequence: [1, 2, 3, 4, 5, 6, 7, 8], options: [5, 2, 7, 1, 8, 3, 6, 4], answer: [1, 2, 3, 4, 5, 6, 7, 8] },
        { id: 5, type: 'puzzle', instruction: 'Числа по возрастанию: 3, 6, 9, 12', sequence: [3, 6, 9, 12], options: [9, 3, 12, 6], answer: [3, 6, 9, 12] },

        // Буквенные последовательности
        { id: 6, type: 'puzzle', instruction: 'Алфавитный порядок: A, B, C, D', sequence: ['A', 'B', 'C', 'D'], options: ['C', 'A', 'D', 'B'], answer: ['A', 'B', 'C', 'D'] },
        { id: 7, type: 'puzzle', instruction: 'Буквы в алфавитном порядке', sequence: ['M', 'N', 'O', 'P'], options: ['O', 'N', 'P', 'M'], answer: ['M', 'N', 'O', 'P'] },
        { id: 8, type: 'puzzle', instruction: 'Расставьте буквы: X, Y, Z', sequence: ['X', 'Y', 'Z'], options: ['Z', 'X', 'Y'], answer: ['X', 'Y', 'Z'] },

        // Цветовые последовательности
        { id: 9, type: 'puzzle', instruction: 'Цвета радуги по порядку', sequence: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'], options: ['🟡', '🔴', '🔵', '🟠', '🟣', '🟢'], answer: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'] },
        { id: 10, type: 'puzzle', instruction: 'Теплые цвета сначала', sequence: ['🔴', '🟠', '🟡', '🟢', '🔵'], options: ['🟢', '🔴', '🔵', '🟠', '🟡'], answer: ['🔴', '🟠', '🟡', '🟢', '🔵'] },

        // Специальные последовательности
        { id: 11, type: 'puzzle', instruction: 'Фигуры по размеру (маленькие сначала)', sequence: ['⚪', '🔴', '🔵', '🟡'], options: ['🔴', '⚪', '🟡', '🔵'], answer: ['⚪', '🔴', '🔵', '🟡'] },
        { id: 12, type: 'puzzle', instruction: 'Эмодзи по смыслу: завтрак, обед, ужин', sequence: ['🍳', '🍲', '🍽️'], options: ['🍲', '🍽️', '🍳'], answer: ['🍳', '🍲', '🍽️'] },
        { id: 13, type: 'puzzle', instruction: 'Времена года по порядку', sequence: ['🌱', '☀️', '🍂', '❄️'], options: ['☀️', '❄️', '🌱', '🍂'], answer: ['🌱', '☀️', '🍂', '❄️'] },
        { id: 14, type: 'puzzle', instruction: 'Дни недели: Пн, Вт, Ср', sequence: ['📅1', '📅2', '📅3'], options: ['📅2', '📅3', '📅1'], answer: ['📅1', '📅2', '📅3'] },
        { id: 15, type: 'puzzle', instruction: 'Планеты: Меркурий, Венера, Земля', sequence: ['☿', '♀', '🜨'], options: ['♀', '🜨', '☿'], answer: ['☿', '♀', '🜨'] }
    ],

    image: [
        // Транспорт
        { id: 1, type: 'image', instruction: 'Выберите все изображения с машинами', options: [
            { emoji: '🚗', correct: true }, { emoji: '🐱', correct: false },
            { emoji: '🚙', correct: true }, { emoji: '🐶', correct: false },
            { emoji: '🚐', correct: true }, { emoji: '🌳', correct: false }
        ]},
        { id: 2, type: 'image', instruction: 'Найдите весь транспорт', options: [
            { emoji: '🚗', correct: true }, { emoji: '🚲', correct: true },
            { emoji: '✈️', correct: true }, { emoji: '🏠', correct: false },
            { emoji: '🚂', correct: true }, { emoji: '📱', correct: false }
        ]},
        { id: 3, type: 'image', instruction: 'Выберите воздушный транспорт', options: [
            { emoji: '✈️', correct: true }, { emoji: '🚗', correct: false },
            { emoji: '🚁', correct: true }, { emoji: '🚂', correct: false },
            { emoji: '🛸', correct: true }, { emoji: '🚢', correct: false }
        ]},

        // Животные
        { id: 4, type: 'image', instruction: 'Выберите животных', options: [
            { emoji: '🐯', correct: true }, { emoji: '📚', correct: false },
            { emoji: '🐰', correct: true }, { emoji: '✏️', correct: false },
            { emoji: '🐻', correct: true }, { emoji: '💻', correct: false }
        ]},
        { id: 5, type: 'image', instruction: 'Найдите домашних животных', options: [
            { emoji: '🐶', correct: true }, { emoji: '🐯', correct: false },
            { emoji: '🐱', correct: true }, { emoji: '🐻', correct: false },
            { emoji: '🐰', correct: true }, { emoji: '🐺', correct: false }
        ]},
        { id: 6, type: 'image', instruction: 'Выберите морских обитателей', options: [
            { emoji: '🐠', correct: true }, { emoji: '🐶', correct: false },
            { emoji: '🐙', correct: true }, { emoji: '🐱', correct: false },
            { emoji: '🐬', correct: true }, { emoji: '🐰', correct: false }
        ]},

        // Еда
        { id: 7, type: 'image', instruction: 'Найдите все фрукты', options: [
            { emoji: '🍎', correct: true }, { emoji: '🚲', correct: false },
            { emoji: '🍌', correct: true }, { emoji: '🏠', correct: false },
            { emoji: '🍇', correct: true }, { emoji: '📱', correct: false }
        ]},
        { id: 8, type: 'image', instruction: 'Выберите овощи', options: [
            { emoji: '🥕', correct: true }, { emoji: '🍎', correct: false },
            { emoji: '🍅', correct: true }, { emoji: '🍌', correct: false },
            { emoji: '🥦', correct: true }, { emoji: '🍇', correct: false }
        ]},
        { id: 9, type: 'image', instruction: 'Найдите сладости', options: [
            { emoji: '🍰', correct: true }, { emoji: '🥕', correct: false },
            { emoji: '🍫', correct: true }, { emoji: '🍅', correct: false },
            { emoji: '🍭', correct: true }, { emoji: '🥦', correct: false }
        ]},

        // Спорт
        { id: 10, type: 'image', instruction: 'Выберите спортивный инвентарь', options: [
            { emoji: '⚽', correct: true }, { emoji: '📚', correct: false },
            { emoji: '🏀', correct: true }, { emoji: '✏️', correct: false },
            { emoji: '🎾', correct: true }, { emoji: '💻', correct: false }
        ]},
        { id: 11, type: 'image', instruction: 'Найдите зимние виды спорта', options: [
            { emoji: '⛷️', correct: true }, { emoji: '🏊', correct: false },
            { emoji: '🏂', correct: true }, { emoji: '⚽', correct: false },
            { emoji: '🎿', correct: true }, { emoji: '🏀', correct: false }
        ]},

        // Природа
        { id: 12, type: 'image', instruction: 'Выберите деревья и растения', options: [
            { emoji: '🌲', correct: true }, { emoji: '🏠', correct: false },
            { emoji: '🌳', correct: true }, { emoji: '🚗', correct: false },
            { emoji: '🌴', correct: true }, { emoji: '📱', correct: false }
        ]},
        { id: 13, type: 'image', instruction: 'Найдите небесные тела', options: [
            { emoji: '☀️', correct: true }, { emoji: '🌳', correct: false },
            { emoji: '🌙', correct: true }, { emoji: '🌲', correct: false },
            { emoji: '⭐', correct: true }, { emoji: '🌴', correct: false }
        ]},

        // Технологии
        { id: 14, type: 'image', instruction: 'Выберите электронные устройства', options: [
            { emoji: '📱', correct: true }, { emoji: '📚', correct: false },
            { emoji: '💻', correct: true }, { emoji: '✏️', correct: false },
            { emoji: '⌚', correct: true }, { emoji: '📖', correct: false }
        ]},
        { id: 15, type: 'image', instruction: 'Найдите музыкальные инструменты', options: [
            { emoji: '🎸', correct: true }, { emoji: '📱', correct: false },
            { emoji: '🎹', correct: true }, { emoji: '💻', correct: false },
            { emoji: '🥁', correct: true }, { emoji: '⌚', correct: false }
        ]}
    ],

    sequence: [
        // Буквенные последовательности
        { id: 1, type: 'sequence', instruction: 'Запомните и повторите последовательность', sequence: ['A', 'B', 'C'], answer: 'ABC' },
        { id: 2, type: 'sequence', instruction: 'Повторите буквенную последовательность', sequence: ['X', 'Y', 'Z'], answer: 'XYZ' },
        { id: 3, type: 'sequence', instruction: 'Запомните порядок букв', sequence: ['M', 'N', 'O', 'P'], answer: 'MNOP' },
        { id: 4, type: 'sequence', instruction: 'Повторите алфавитный порядок', sequence: ['C', 'D', 'E', 'F'], answer: 'CDEF' },

        // Цифровые последовательности
        { id: 5, type: 'sequence', instruction: 'Повторите цифровую последовательность', sequence: ['3', '7', '1', '9'], answer: '3719' },
        { id: 6, type: 'sequence', instruction: 'Запомните числа', sequence: ['5', '2', '8', '4', '1'], answer: '52841' },
        { id: 7, type: 'sequence', instruction: 'Повторите последовательность цифр', sequence: ['9', '6', '3', '0', '7'], answer: '96307' },
        { id: 8, type: 'sequence', instruction: 'Запомните числовой ряд', sequence: ['1', '4', '7', '2', '5', '8'], answer: '147258' },

        // Символьные последовательности
        { id: 9, type: 'sequence', instruction: 'Повторите символы', sequence: ['@', '#', '$', '%'], answer: '@#$%' },
        { id: 10, type: 'sequence', instruction: 'Запомните специальные символы', sequence: ['&', '*', '(', ')'], answer: '&*()' },

        // Эмодзи последовательности
        { id: 11, type: 'sequence', instruction: 'Запомните эмодзи', sequence: ['😊', '🎮', '🚀'], answer: '😊🎮🚀' },
        { id: 12, type: 'sequence', instruction: 'Повторите смайлики', sequence: ['🐱', '🐶', '🐭', '🐹'], answer: '🐱🐶🐭🐹' },
        { id: 13, type: 'sequence', instruction: 'Запомните фрукты', sequence: ['🍎', '🍌', '🍇', '🍓'], answer: '🍎🍌🍇🍓' },
        { id: 14, type: 'sequence', instruction: 'Повторите транспорт', sequence: ['🚗', '🚂', '✈️', '🚢'], answer: '🚗🚂✈️🚢' },
        { id: 15, type: 'sequence', instruction: 'Запомните цвета', sequence: ['🔴', '🟢', '🔵', '🟡'], answer: '🔴🟢🔵🟡' },

        // Сложные последовательности
        { id: 16, type: 'sequence', instruction: 'Смешанная последовательность', sequence: ['A', '1', '😊', '🔴'], answer: 'A1😊🔴' },
        { id: 17, type: 'sequence', instruction: 'Чередование букв и цифр', sequence: ['A', '2', 'B', '4', 'C', '6'], answer: 'A2B4C6' },
        { id: 18, type: 'sequence', instruction: 'Длинная последовательность', sequence: ['1', '2', '3', '4', '5', '6', '7'], answer: '1234567' },
        { id: 19, type: 'sequence', instruction: 'Разнообразные символы', sequence: ['⭐', '🔺', '🔷', '💠', '🔶'], answer: '⭐🔺🔷💠🔶' },
        { id: 20, type: 'sequence', instruction: 'Музыкальные символы', sequence: ['🎵', '🎶', '🎸', '🎹', '🥁'], answer: '🎵🎶🎸🎹🥁' }
    ],

    logic: [
        // Загадки и логика
        { id: 1, type: 'logic', question: 'Что тяжелее: 1 кг пуха или 1 кг железа?', options: ['1 кг пуха', '1 кг железа', 'Одинаково'], answer: 'Одинаково' },
        { id: 2, type: 'logic', question: 'Сколько месяцев в году имеют 28 дней?', options: ['1 месяц', '2 месяца', 'Все месяцы'], answer: 'Все месяцы' },
        { id: 3, type: 'logic', question: 'Что можно увидеть с закрытыми глазами?', options: ['Сон', 'Темноту', 'Ничего'], answer: 'Сон' },
        { id: 4, type: 'logic', question: 'Что принадлежит вам, но другие используют это чаще?', options: ['Имя', 'Телефон', 'Деньги'], answer: 'Имя' },
        { id: 5, type: 'logic', question: 'Что идет вверх и вниз, но не двигается?', options: ['Лестница', 'Температура', 'Лифт'], answer: 'Лестница' },
        { id: 6, type: 'logic', question: 'Что имеет города, но нет домов?', options: ['Карта', 'Сон', 'Мечта'], answer: 'Карта' },
        { id: 7, type: 'logic', question: 'Что можно разбить, не касаясь?', options: ['Обещание', 'Стекло', 'Сердце'], answer: 'Обещание' },
        { id: 8, type: 'logic', question: 'Что становится мокрым при сушке?', options: ['Полотенце', 'Волосы', 'Тело'], answer: 'Полотенце' },
        { id: 9, type: 'logic', question: 'Что имеет ключ, но не может открыть замок?', options: ['Клавиатура', 'Пианино', 'Карта'], answer: 'Клавиатура' },
        { id: 10, type: 'logic', question: 'Что полное дыр, но держит воду?', options: ['Губка', 'Решето', 'Сетка'], answer: 'Губка' },

        // Математическая логика
        { id: 11, type: 'logic', question: 'Если 2x = 10, то x = ?', options: ['4', '5', '6'], answer: '5' },
        { id: 12, type: 'logic', question: 'Сколько углов у треугольника?', options: ['3', '4', '5'], answer: '3' },
        { id: 13, type: 'logic', question: 'Что больше: 3/4 или 2/3?', options: ['3/4', '2/3', 'Одинаково'], answer: '3/4' },
        { id: 14, type: 'logic', question: 'Сколько секунд в 2 минутах?', options: ['120', '100', '60'], answer: '120' },
        { id: 15, type: 'logic', question: 'Что идет после 999?', options: ['1000', '999.1', '100'], answer: '1000' },

        // Программирование и технологии
        { id: 16, type: 'logic', question: 'Какой язык программирования начинается с "J"?', options: ['Java', 'Python', 'C++'], answer: 'Java' },
        { id: 17, type: 'logic', question: 'Что такое HTML?', options: ['Язык разметки', 'Язык программирования', 'База данных'], answer: 'Язык разметки' },
        { id: 18, type: 'logic', question: 'Сколько битов в байте?', options: ['8', '16', '32'], answer: '8' },
        { id: 19, type: 'logic', question: 'Что означает CPU?', options: ['Центральный процессор', 'Оперативная память', 'Жесткий диск'], answer: 'Центральный процессор' },
        { id: 20, type: 'logic', question: 'Какой протокол используется для веб-страниц?', options: ['HTTP', 'FTP', 'SMTP'], answer: 'HTTP' },

        // Наука и природа
        { id: 21, type: 'logic', question: 'Сколько планет в Солнечной системе?', options: ['8', '9', '10'], answer: '8' },
        { id: 22, type: 'logic', question: 'Какая планета известна кольцами?', options: ['Сатурн', 'Юпитер', 'Уран'], answer: 'Сатурн' },
        { id: 23, type: 'logic', question: 'Что измеряется в герцах?', options: ['Частота', 'Скорость', 'Температура'], answer: 'Частота' },
        { id: 24, type: 'logic', question: 'Какой газ мы вдыхаем?', options: ['Кислород', 'Углекислый газ', 'Азот'], answer: 'Кислород' },
        { id: 25, type: 'logic', question: 'Что такое H₂O?', options: ['Вода', 'Воздух', 'Огонь'], answer: 'Вода' },

        // География
        { id: 26, type: 'logic', question: 'Столица Франции?', options: ['Париж', 'Лондон', 'Берлин'], answer: 'Париж' },
        { id: 27, type: 'logic', question: 'Самая длинная река в мире?', options: ['Нил', 'Амазонка', 'Янцзы'], answer: 'Нил' },
        { id: 28, type: 'logic', question: 'Сколько континентов на Земле?', options: ['7', '6', '5'], answer: '7' },
        { id: 29, type: 'logic', question: 'Самая большая страна по площади?', options: ['Россия', 'Канада', 'Китай'], answer: 'Россия' },
        { id: 30, type: 'logic', question: 'В какой стране находится пирамида Хеопса?', options: ['Египет', 'Мексика', 'Китай'], answer: 'Египет' }
    ],

    memory: [
        // Короткие последовательности
        { id: 1, type: 'memory', instruction: 'Запомните последовательность цветов', sequence: ['🔴', '🟢', '🔵', '🟡'], displayTime: 3000, answer: '🔴🟢🔵🟡' },
        { id: 2, type: 'memory', instruction: 'Запомните порядок фигур', sequence: ['⭐', '🔺', '🔷', '💠', '🔶'], displayTime: 4000, answer: '⭐🔺🔷💠🔶' },
        { id: 3, type: 'memory', instruction: 'Запомните последовательность эмодзи', sequence: ['😊', '🎮', '🚀', '📚', '🎵', '🏆'], displayTime: 5000, answer: '😊🎮🚀📚🎵🏆' },

        // Числовые последовательности памяти
        { id: 4, type: 'memory', instruction: 'Запомните цифры', sequence: ['7', '2', '9', '4'], displayTime: 3000, answer: '7294' },
        { id: 5, type: 'memory', instruction: 'Запомните числовой ряд', sequence: ['3', '8', '1', '6', '2'], displayTime: 4000, answer: '38162' },
        { id: 6, type: 'memory', instruction: 'Запомните длинное число', sequence: ['5', '9', '2', '7', '4', '1'], displayTime: 5000, answer: '592741' },

        // Буквенные последовательности памяти
        { id: 7, type: 'memory', instruction: 'Запомните буквы', sequence: ['C', 'A', 'T'], displayTime: 3000, answer: 'CAT' },
        { id: 8, type: 'memory', instruction: 'Запомните слово', sequence: ['D', 'O', 'G'], displayTime: 3000, answer: 'DOG' },
        { id: 9, type: 'memory', instruction: 'Запомните аббревиатуру', sequence: ['U', 'S', 'A'], displayTime: 3000, answer: 'USA' },

        // Смешанные последовательности
        { id: 10, type: 'memory', instruction: 'Запомните цифры и буквы', sequence: ['A', '1', 'B', '2'], displayTime: 4000, answer: 'A1B2' },
        { id: 11, type: 'memory', instruction: 'Запомните разнообразные символы', sequence: ['🔴', 'A', '3', '⭐'], displayTime: 4000, answer: '🔴A3⭐' },
        { id: 12, type: 'memory', instruction: 'Запомните последовательность', sequence: ['7', '🔵', 'X', '🎵'], displayTime: 5000, answer: '7🔵X🎵' },

        // Тематические последовательности
        { id: 13, type: 'memory', instruction: 'Запомните фрукты', sequence: ['🍎', '🍌', '🍇', '🍓'], displayTime: 4000, answer: '🍎🍌🍇🍓' },
        { id: 14, type: 'memory', instruction: 'Запомните транспорт', sequence: ['🚗', '🚂', '✈️', '🚢'], displayTime: 4000, answer: '🚗🚂✈️🚢' },
        { id: 15, type: 'memory', instruction: 'Запомните животных', sequence: ['🐱', '🐶', '🐭', '🐹'], displayTime: 4000, answer: '🐱🐶🐭🐹' },

        // Сложные последовательности
        { id: 16, type: 'memory', instruction: 'Длинная последовательность эмодзи', sequence: ['😊', '🌟', '🚀', '📱', '💻', '🎮', '🏆'], displayTime: 6000, answer: '😊🌟🚀📱💻🎮🏆' },
        { id: 17, type: 'memory', instruction: 'Числа и символы', sequence: ['1', '🔴', '2', '🟢', '3', '🔵'], displayTime: 5000, answer: '1🔴2🟢3🔵' },
        { id: 18, type: 'memory', instruction: 'Разнообразная последовательность', sequence: ['A', '7', '😊', '🔴', 'Z', '9'], displayTime: 6000, answer: 'A7😊🔴Z9' },
        { id: 19, type: 'memory', instruction: 'Музыкальная тема', sequence: ['🎵', '🎸', '🎹', '🥁', '🎤'], displayTime: 5000, answer: '🎵🎸🎹🥁🎤' },
        // Сложные последовательности памяти
        { id: 20, type: 'memory', instruction: 'Запомните математические символы', sequence: ['➕', '➖', '✖️', '➗'], displayTime: 4000, answer: '➕➖✖️➗' },
        { id: 21, type: 'memory', instruction: 'Запомните погодные условия', sequence: ['☀️', '🌧️', '⛈️', '❄️'], displayTime: 4000, answer: '☀️🌧️⛈️❄️' },
        { id: 22, type: 'memory', instruction: 'Запомните спортивные эмодзи', sequence: ['⚽', '🏀', '🎾', '🏐'], displayTime: 4000, answer: '⚽🏀🎾🏐' },
        { id: 23, type: 'memory', instruction: 'Запомните технические символы', sequence: ['📱', '💻', '⌚', '📷'], displayTime: 4000, answer: '📱💻⌚📷' },
        { id: 24, type: 'memory', instruction: 'Запомните праздничные эмодзи', sequence: ['🎄', '🎁', '🎅', '⭐'], displayTime: 4000, answer: '🎄🎁🎅⭐' },
    
        // Очень длинные последовательности
        { id: 25, type: 'memory', instruction: 'Запомните длинную числовую последовательность', sequence: ['2', '4', '6', '8', '0', '1', '3', '5'], displayTime: 7000, answer: '24680135' },
        { id: 26, type: 'memory', instruction: 'Запомните алфавитный порядок', sequence: ['A', 'B', 'C', 'D', 'E', 'F'], displayTime: 6000, answer: 'ABCDEF' },
        { id: 27, type: 'memory', instruction: 'Запомните разноцветную последовательность', sequence: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'], displayTime: 6000, answer: '🔴🟠🟡🟢🔵🟣' },
        { id: 28, type: 'memory', instruction: 'Запомните смешанную последовательность', sequence: ['1', 'A', '🔴', '2', 'B', '🟢', '3', 'C', '🔵'], displayTime: 8000, answer: '1A🔴2B🟢3C🔵' },
        { id: 29, type: 'memory', instruction: 'Запомните музыкальные инструменты', sequence: ['🎸', '🎹', '🥁', '🎺', '🎻', '🎷'], displayTime: 6000, answer: '🎸🎹🥁🎺🎻🎷' },
        { id: 30, type: 'memory', instruction: 'Запомните сложную комбинацию', sequence: ['⭐', '7', '🔺', 'B', '💠', '3', '🔶', '9'], displayTime: 7000, answer: '⭐7🔺B💠3🔶9' }
    ],

    // ДОПОЛНИТЕЛЬНЫЕ ТИПЫ КАПЧ
    pattern: [
        // Визуальные паттерны
        { id: 1, type: 'pattern', instruction: 'Повторите паттерн: ▲ ▼ ▲ ▼', pattern: ['▲', '▼', '▲', '▼'], options: ['▲▼▲▼', '▼▲▼▲', '▲▲▼▼'], answer: '▲▼▲▼' },
        { id: 2, type: 'pattern', instruction: 'Продолжите последовательность: ● ■ ● ■', pattern: ['●', '■', '●', '■'], options: ['●', '■', '▲'], answer: '●' },
        { id: 3, type: 'pattern', instruction: 'Какой фигуры не хватает: ◆ ◆ ◇ ◆', pattern: ['◆', '◆', '◇', '◆'], options: ['◆', '◇', '◎'], answer: '◆' },
        { id: 4, type: 'pattern', instruction: 'Завершите паттерн: ♠ ♣ ♠ ♣', pattern: ['♠', '♣', '♠', '♣'], options: ['♠', '♣', '♥'], answer: '♠' },
        { id: 5, type: 'pattern', instruction: 'Продолжите: 🔴 🟢 🔴 🟢', pattern: ['🔴', '🟢', '🔴', '🟢'], options: ['🔴', '🟢', '🔵'], answer: '🔴' }
    ],

    rotation: [
        // Задания с вращением и ориентацией
        { id: 1, type: 'rotation', instruction: 'Выберите фигуру, повернутую на 90°', base: '▲', options: ['▲', '►', '▼'], answer: '►' },
        { id: 2, type: 'rotation', instruction: 'Какая стрелка смотрит вправо?', base: '➡️', options: ['⬆️', '➡️', '⬇️'], answer: '➡️' },
        { id: 3, type: 'rotation', instruction: 'Найдите перевернутую фигуру', base: '🔺', options: ['🔺', '🔻', '🔶'], answer: '🔻' },
        { id: 4, type: 'rotation', instruction: 'Выберите треугольник вершиной вниз', base: '▲', options: ['▲', '▼', '◄'], answer: '▼' },
        { id: 5, type: 'rotation', instruction: 'Какая стрелка указывает вверх?', base: '⬆️', options: ['⬅️', '⬆️', '➡️'], answer: '⬆️' }
    ],

    find_difference: [
        // Найди отличия
        { id: 1, type: 'find_difference', instruction: 'Найдите лишний транспорт', items: ['🚗', '🚂', '✈️', '🍎'], answer: '🍎' },
        { id: 2, type: 'find_difference', instruction: 'Что не является фруктом?', items: ['🍎', '🍌', '🚗', '🍇'], answer: '🚗' },
        { id: 3, type: 'find_difference', instruction: 'Найдите не животное', items: ['🐱', '🐶', '🏠', '🐭'], answer: '🏠' },
        { id: 4, type: 'find_difference', instruction: 'Что не относится к спорту?', items: ['⚽', '📚', '🏀', '🎾'], answer: '📚' },
        { id: 5, type: 'find_difference', instruction: 'Найдите не геометрическую фигуру', items: ['●', '■', '😊', '▲'], answer: '😊' }
    ],

    count: [
        // Задания на подсчет
        { id: 1, type: 'count', instruction: 'Сколько здесь яблок? 🍎🍎🍎', items: ['🍎', '🍎', '🍎'], answer: '3' },
        { id: 2, type: 'count', instruction: 'Посчитайте машины: 🚗🚙🚗', items: ['🚗', '🚙', '🚗'], answer: '3' },
        { id: 3, type: 'count', instruction: 'Сколько сердец? ❤️❤️❤️❤️', items: ['❤️', '❤️', '❤️', '❤️'], answer: '4' },
        { id: 4, type: 'count', instruction: 'Посчитайте звезды: ⭐⭐⭐⭐', items: ['⭐', '⭐', '⭐', '⭐'], answer: '4' },
        { id: 5, type: 'count', instruction: 'Сколько треугольников? ▲▲▲', items: ['▲', '▲', '▲'], answer: '3' }
    ],

    sorting: [
        // Задания на сортировку
        { id: 1, type: 'sorting', instruction: 'Отсортируйте числа по возрастанию', items: ['5', '2', '8', '1'], answer: ['1', '2', '5', '8'] },
        { id: 2, type: 'sorting', instruction: 'Отсортируйте буквы по алфавиту', items: ['C', 'A', 'D', 'B'], answer: ['A', 'B', 'C', 'D'] },
        { id: 3, type: 'sorting', instruction: 'Разместите фигуры от маленькой к большой', items: ['🔴', '🔵', '🟡', '🟢'], answer: ['🔴', '🟢', '🟡', '🔵'] },
        { id: 4, type: 'sorting', instruction: 'Отсортируйте цвета радуги', items: ['🟢', '🔴', '🔵', '🟡'], answer: ['🔴', '🟡', '🟢', '🔵'] },
        { id: 5, type: 'sorting', instruction: 'Разместите числа от 1 до 4', items: ['3', '1', '4', '2'], answer: ['1', '2', '3', '4'] }
    ],

    matching: [
        // Задания на сопоставление
        { id: 1, type: 'matching', instruction: 'Сопоставьте животное с его следом', pairs: [['🐱', '🐾'], ['🐶', '🐕'], ['🐦', '🕊️']], answer: ['🐱🐾', '🐶🐕', '🐦🕊️'] },
        { id: 2, type: 'matching', instruction: 'Сопоставьте транспорт со звуком', pairs: [['🚗', '🚘'], ['🚂', '🚆'], ['✈️', '🛩️']], answer: ['🚗🚘', '🚂🚆', '✈️🛩️'] },
        { id: 3, type: 'matching', instruction: 'Сопоставьте фрукт с деревом', pairs: [['🍎', '🌳'], ['🍌', '🌴'], ['🍇', '🍇']], answer: ['🍎🌳', '🍌🌴', '🍇🍇'] },
        { id: 4, type: 'matching', instruction: 'Сопоставьте страну с флагом', pairs: [['🇷🇺', 'Россия'], ['🇺🇸', 'США'], ['🇫🇷', 'Франция']], answer: ['🇷🇺Россия', '🇺🇸США', '🇫🇷Франция'] },
        { id: 5, type: 'matching', instruction: 'Сопоставьте погоду с одеждой', pairs: [['☀️', '👕'], ['🌧️', '🌂'], ['❄️', '🧤']], answer: ['☀️👕', '🌧️🌂', '❄️🧤'] }
    ],

    time: [
        // Задания на время
        { id: 1, type: 'time', instruction: 'Сколько минут в 2 часах?', question: '2 часа = ? минут', answer: '120' },
        { id: 2, type: 'time', instruction: 'Сколько секунд в 5 минутах?', question: '5 минут = ? секунд', answer: '300' },
        { id: 3, type: 'time', instruction: 'Сколько часов в сутках?', question: '1 сутки = ? часов', answer: '24' },
        { id: 4, type: 'time', instruction: 'Сколько дней в неделе?', question: '1 неделя = ? дней', answer: '7' },
        { id: 5, type: 'time', instruction: 'Сколько месяцев в году?', question: '1 год = ? месяцев', answer: '12' }
    ],

    geography: [
        // Географические задания
        { id: 1, type: 'geography', instruction: 'Столица России?', question: 'Главный город России', options: ['Москва', 'Санкт-Петербург', 'Казань'], answer: 'Москва' },
        { id: 2, type: 'geography', instruction: 'Самая длинная река в мире?', question: 'Какая река самая длинная?', options: ['Нил', 'Амазонка', 'Янцзы'], answer: 'Нил' },
        { id: 3, type: 'geography', instruction: 'Самая высокая гора?', question: 'Самая высокая точка Земли', options: ['Эверест', 'Килиманджаро', 'Эльбрус'], answer: 'Эверест' },
        { id: 4, type: 'geography', instruction: 'Самый большой океан?', question: 'Какой океан самый большой?', options: ['Тихий', 'Атлантический', 'Индийский'], answer: 'Тихий' },
        { id: 5, type: 'geography', instruction: 'Столица Франции?', question: 'Главный город Франции', options: ['Париж', 'Лондон', 'Берлин'], answer: 'Париж' }
    ],

    science: [
        // Научные задания
        { id: 1, type: 'science', instruction: 'Сколько планет в Солнечной системе?', question: 'Количество планет', options: ['8', '9', '10'], answer: '8' },
        { id: 2, type: 'science', instruction: 'Химическая формула воды?', question: 'Из чего состоит вода?', options: ['H₂O', 'CO₂', 'O₂'], answer: 'H₂O' },
        { id: 3, type: 'science', instruction: 'Самая близкая звезда к Земле?', question: 'Ближайшая звезда', options: ['Солнце', 'Сириус', 'Полярная'], answer: 'Солнце' },
        { id: 4, type: 'science', instruction: 'Какой газ мы вдыхаем?', question: 'Основной газ для дыхания', options: ['Кислород', 'Углекислый газ', 'Азот'], answer: 'Кислород' },
        { id: 5, type: 'science', instruction: 'Сколько хромосом у человека?', question: 'Число хромосом', options: ['46', '23', '48'], answer: '46' }
    ],

    programming: [
        // Программирование
        { id: 1, type: 'programming', instruction: 'Какой язык для веб-страниц?', question: 'Основной язык разметки', options: ['HTML', 'Python', 'Java'], answer: 'HTML' },
        { id: 2, type: 'programming', instruction: 'Что означает CSS?', question: 'Расшифровка CSS', options: ['Cascading Style Sheets', 'Computer Style System', 'Creative Style Sheets'], answer: 'Cascading Style Sheets' },
        { id: 3, type: 'programming', instruction: 'Язык для стилей веб-страниц?', question: 'Язык стилизации', options: ['CSS', 'HTML', 'JavaScript'], answer: 'CSS' },
        { id: 4, type: 'programming', instruction: 'Основной язык веб-программирования?', question: 'Язык для интерактивности', options: ['JavaScript', 'Python', 'C++'], answer: 'JavaScript' },
        { id: 5, type: 'programming', instruction: 'Что такое переменная?', question: 'Определение переменной', options: ['Контейнер для данных', 'Функция', 'Цикл'], answer: 'Контейнер для данных' }
    ],

    crypto: [
        // Шифры и коды
        { id: 1, type: 'crypto', instruction: 'Расшифруйте код: A=1, B=2, C=3. Что такое "1-3-2"?', answer: 'ACB' },
        { id: 2, type: 'crypto', instruction: 'Шифр Цезаря: A→B, B→C. Что такое "BDF"?', answer: 'ACE' },
        { id: 3, type: 'crypto', instruction: 'Двоичный код: 1010 = ?', answer: '10' },
        { id: 4, type: 'crypto', instruction: 'Азбука Морзе: ••• --- ••• = ?', answer: 'SOS' },
        { id: 5, type: 'crypto', instruction: 'ROT13: "URYYB" = ?', answer: 'HELLO' }
    ],

    analogy: [
        // Аналогии
        { id: 1, type: 'analogy', instruction: 'Яблоко → фрукт, Морковь → ?', options: ['Овощ', 'Фрукт', 'Ягода'], answer: 'Овощ' },
        { id: 2, type: 'analogy', instruction: 'Солнце → день, Луна → ?', options: ['Ночь', 'День', 'Утро'], answer: 'Ночь' },
        { id: 3, type: 'analogy', instruction: 'Холодно → льдина, Горячо → ?', options: ['Огонь', 'Лед', 'Вода'], answer: 'Огонь' },
        { id: 4, type: 'analogy', instruction: 'Птица → гнездо, Собака → ?', options: ['Будка', 'Гнездо', 'Нора'], answer: 'Будка' },
        { id: 5, type: 'analogy', instruction: 'Учитель → школа, Врач → ?', options: ['Больница', 'Школа', 'Офис'], answer: 'Больница' }
    ],

    word: [
        // Словесные задания
        { id: 1, type: 'word', instruction: 'Напишите слово "КОМПЬЮТЕР" задом наперед', answer: 'РЕТЬЮПМОК' },
        { id: 2, type: 'word', instruction: 'Сколько букв в слове "ПРОГРАММИРОВАНИЕ"?', answer: '15' },
        { id: 3, type: 'word', instruction: 'Какое слово лишнее: стол, стул, диван, облако?', answer: 'облако' },
        { id: 4, type: 'word', instruction: 'Составьте слово из букв: К,А,Ш,А,Р', answer: 'ШАРКА' },
        { id: 5, type: 'word', instruction: 'Найдите антоним к слову "ХОЛОДНЫЙ"', options: ['Горячий', 'Ледяной', 'Морозный'], answer: 'Горячий' }
    ],

    spatial: [
        // Пространственное мышление
        { id: 1, type: 'spatial', instruction: 'Какая фигура получится если сложить ▲ и ▼?', options: ['◆', '●', '■'], answer: '◆' },
        { id: 2, type: 'spatial', instruction: 'Как будет выглядеть ▲ после поворота на 180°?', options: ['▼', '►', '◄'], answer: '▼' },
        { id: 3, type: 'spatial', instruction: 'Соберите куб из развертки', pattern: ['◼️◼️◼️', '◼️◼️', '◼️◼️◼️'], answer: 'cube' },
        { id: 4, type: 'spatial', instruction: 'Какая фигура следующая: ◯ △ □ ◯ ?', options: ['△', '□', '◯'], answer: '△' },
        { id: 5, type: 'spatial', instruction: 'Найдите зеркальное отражение: ◣', options: ['◢', '◤', '◥'], answer: '◢' }
    ],

    color: [
        // Цветовые задания
        { id: 1, type: 'color', instruction: 'Какой цвет получится если смешать 🔴 и 🟢?', answer: '🟡' },
        { id: 2, type: 'color', instruction: 'Найдите дополнительный цвет к 🔵', options: ['🟠', '🟢', '🟣'], answer: '🟠' },
        { id: 3, type: 'color', instruction: 'Укажите теплые цвета', colors: ['🔴', '🟠', '🟡', '🔵'], answer: ['🔴', '🟠', '🟡'] },
        { id: 4, type: 'color', instruction: 'Расположите цвета от темного к светлому', colors: ['⚫', '⚪', '🔴'], answer: ['⚫', '🔴', '⚪'] },
        { id: 5, type: 'color', instruction: 'Найдите цвет не входящий в радугу', colors: ['🔴', '🟢', '🔵', '🟤'], answer: '🟤' }
    ],

    observation: [
        // Наблюдательность
        { id: 1, type: 'observation', instruction: 'Что изменилось на картинке?', before: '🌲🌳🏠', after: '🌲🏠🌳', answer: 'поменялись местами' },
        { id: 2, type: 'observation', instruction: 'Найдите отличия: 🔴🟢🔵 и 🔴🔵🟢', answer: 'поменялись цвета' },
        { id: 3, type: 'observation', instruction: 'Какой объект появился новый?', original: ['🌲', '🏠', '🚗'], updated: ['🌲', '🏠', '🚗', '🌳'], answer: '🌳' },
        { id: 4, type: 'observation', instruction: 'Что исчезло? 🔴🟢🔵🟡 → 🔴🟢🔵', answer: '🟡' },
        { id: 5, type: 'observation', instruction: 'Сколько 🔴 на картинке? 🟢🔴🟢🔴🟢', answer: '2' }
    ]
};

// ТИПЫ КАПЧ ДЛЯ РАНДОМНОГО ВЫБОРА
const CAPTCHA_TYPES = [
    'math', 'puzzle', 'image', 'sequence', 'logic', 'memory',
    'pattern', 'rotation', 'find_difference', 'count', 'sorting', 
    'matching', 'time', 'geography', 'science', 'programming',
    'crypto', 'analogy', 'word', 'spatial', 'color', 'observation'
];

// УТИЛИТЫ ДЛЯ РАБОТЫ С КАПЧАМИ
class CaptchaUtils {
    // ГЕНЕРАТОР СЛУЧАЙНЫХ МАТЕМАТИЧЕСКИХ КАПЧ
    static generateRandomMath() {
        const operations = ['+', '-', '×', '÷'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        let a, b, answer;
        
        switch(op) {
            case '+':
                a = Math.floor(Math.random() * 50) + 1;
                b = Math.floor(Math.random() * 50) + 1;
                answer = (a + b).toString();
                break;
            case '-':
                a = Math.floor(Math.random() * 50) + 10;
                b = Math.floor(Math.random() * 10) + 1;
                answer = (a - b).toString();
                break;
            case '×':
                a = Math.floor(Math.random() * 10) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                answer = (a * b).toString();
                break;
            case '÷':
                b = Math.floor(Math.random() * 10) + 1;
                a = b * (Math.floor(Math.random() * 10) + 1);
                answer = (a / b).toString();
                break;
        }
        
        return {
            type: 'math',
            question: `${a} ${op} ${b} = ?`,
            answer: answer,
            difficulty: 'easy'
        };
    }

    static getRandomCaptcha() {
        const type = CAPTCHA_TYPES[Math.floor(Math.random() * CAPTCHA_TYPES.length)];
        const captchas = CAPTCHA_DATABASE[type];
        
        if (!captchas || captchas.length === 0) {
            return this.generateRandomMath();
        }
        
        return captchas[Math.floor(Math.random() * captchas.length)];
    }

    static shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // ВАЛИДАЦИЯ ДЛЯ ВСЕХ ТИПОВ КАПЧ
    static validateMathAnswer(input, answer) {
        return input.trim() === answer;
    }

    static validatePuzzleAnswer(selected, answer) {
        return JSON.stringify(selected) === JSON.stringify(answer);
    }

    static validateImageAnswer(selected, options) {
        const correctAnswers = options.filter(opt => opt.correct).map(opt => opt.emoji);
        return JSON.stringify(selected.sort()) === JSON.stringify(correctAnswers.sort());
    }

    static validateSequenceAnswer(input, answer) {
        return input.toUpperCase().replace(/\s/g, '') === answer.toUpperCase().replace(/\s/g, '');
    }

    static validateLogicAnswer(selected, answer) {
        return selected === answer;
    }

    static validateMemoryAnswer(input, answer) {
        return input.replace(/\s/g, '') === answer.replace(/\s/g, '');
    }

    static validatePatternAnswer(selected, answer) {
        return selected === answer;
    }

    static validateRotationAnswer(selected, answer) {
        return selected === answer;
    }

    static validateFindDifferenceAnswer(selected, answer) {
        return selected === answer;
    }

    static validateCountAnswer(input, answer) {
        return input.trim() === answer;
    }

    static validateSortingAnswer(selected, answer) {
        return JSON.stringify(selected) === JSON.stringify(answer);
    }

    static validateMatchingAnswer(selected, answer) {
        return JSON.stringify(selected.sort()) === JSON.stringify(answer.sort());
    }

    static validateTimeAnswer(input, answer) {
        return input.trim() === answer;
    }

    static validateGeographyAnswer(selected, answer) {
        return selected === answer;
    }

    static validateScienceAnswer(selected, answer) {
        return selected === answer;
    }

    static validateProgrammingAnswer(selected, answer) {
        return selected === answer;
    }

    static validateCryptoAnswer(input, answer) {
        return input.toUpperCase().replace(/\s/g, '') === answer.toUpperCase().replace(/\s/g, '');
    }

    static validateAnalogyAnswer(selected, answer) {
        return selected === answer;
    }

    static validateWordAnswer(input, answer) {
        return input.toUpperCase().replace(/\s/g, '') === answer.toUpperCase().replace(/\s/g, '');
    }

    static validateSpatialAnswer(selected, answer) {
        return selected === answer;
    }

    static validateColorAnswer(selected, answer) {
        if (Array.isArray(answer)) {
            return JSON.stringify(selected.sort()) === JSON.stringify(answer.sort());
        }
        return selected === answer;
    }

    static validateObservationAnswer(input, answer) {
        return input.toLowerCase().includes(answer.toLowerCase());
    }

    // УНИВЕРСАЛЬНЫЙ ВАЛИДАТОР
    static validateAnswer(captchaType, userInput, correctAnswer, options = null) {
        switch (captchaType) {
            case 'math': return this.validateMathAnswer(userInput, correctAnswer);
            case 'puzzle': return this.validatePuzzleAnswer(userInput, correctAnswer);
            case 'image': return this.validateImageAnswer(userInput, options);
            case 'sequence': return this.validateSequenceAnswer(userInput, correctAnswer);
            case 'logic': return this.validateLogicAnswer(userInput, correctAnswer);
            case 'memory': return this.validateMemoryAnswer(userInput, correctAnswer);
            case 'pattern': return this.validatePatternAnswer(userInput, correctAnswer);
            case 'rotation': return this.validateRotationAnswer(userInput, correctAnswer);
            case 'find_difference': return this.validateFindDifferenceAnswer(userInput, correctAnswer);
            case 'count': return this.validateCountAnswer(userInput, correctAnswer);
            case 'sorting': return this.validateSortingAnswer(userInput, correctAnswer);
            case 'matching': return this.validateMatchingAnswer(userInput, correctAnswer);
            case 'time': return this.validateTimeAnswer(userInput, correctAnswer);
            case 'geography': return this.validateGeographyAnswer(userInput, correctAnswer);
            case 'science': return this.validateScienceAnswer(userInput, correctAnswer);
            case 'programming': return this.validateProgrammingAnswer(userInput, correctAnswer);
            case 'crypto': return this.validateCryptoAnswer(userInput, correctAnswer);
            case 'analogy': return this.validateAnalogyAnswer(userInput, correctAnswer);
            case 'word': return this.validateWordAnswer(userInput, correctAnswer);
            case 'spatial': return this.validateSpatialAnswer(userInput, correctAnswer);
            case 'color': return this.validateColorAnswer(userInput, correctAnswer);
            case 'observation': return this.validateObservationAnswer(userInput, correctAnswer);
            default: return false;
        }
    }
}

// ЭКСПОРТ ДЛЯ ИСПОЛЬЗОВАНИЯ
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CAPTCHA_DATABASE, CAPTCHA_TYPES, CaptchaUtils };
}