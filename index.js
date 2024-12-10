const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Для работы с путями
const app = express();

// Настройка body-parser для обработки POST-запросов
app.use(bodyParser.urlencoded({ extended: true }));

// Указываем Express использовать статические файлы из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страница с формой
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Обработка формы и отображение приветствия
app.post('/greet', (req, res) => {
    const name = req.body.name;
    res.send(`<h1>Привет, ${name}!</h1><a href="/">Вернуться на главную страницу</a>`);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});