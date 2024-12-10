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
    res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Приветствие</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div class="container">
            <h1>Привет, ${name}!</h1>
            <a href="/" class="button">Вернуться на главную страницу</a>
        </div>
    </body>
    </html>
    `);
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});