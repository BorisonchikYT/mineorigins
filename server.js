const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Указываем статические файлы
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Основные маршруты
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// Добавьте другие маршруты вашего сайта...

// Обработка 404 ошибок - ДОЛЖНА БЫТЬ ПОСЛЕДНЕЙ
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'error.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});