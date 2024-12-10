const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Настройка body-parser для обработки POST-запросов
app.use(bodyParser.urlencoded({ extended: true }));

// Главная страница
app.get('/', (req, res) => {
    res.send(`
        <h1>Добро пожаловать на главную страницу!</h1>
        <a href="/form">Перейти на страницу с формой</a>
    `);
});

// Страница с формой
app.get('/form', (req, res) => {
    res.send(`
        <h1>Введите ваше имя</h1>
        <form action="/greet" method="POST">
            <input type="text" name="name" placeholder="Ваше имя" required>
            <button type="submit">Отправить</button>
        </form>
    `);
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