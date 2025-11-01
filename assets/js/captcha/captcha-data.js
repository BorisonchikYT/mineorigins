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