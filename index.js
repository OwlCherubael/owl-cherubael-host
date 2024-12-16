require('dotenv').config(); // Подключаем dotenv для работы с переменными окружения

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Используем promise-версию
const path = require('path');
const app = express();

// Получение URL подключения из переменных окружения
const dbUrl = process.env.JAWSDB_URL/*||"mysql://itqdzakzp3o8dnvx:ervwgfvt4yrmcygz@tyduzbv3ggpf15sx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/ofg65703uwlrn8ck"*/;

// Настройка пула соединений
const pool = mysql.createPool({
    uri: dbUrl, // Обратите внимание, что этот параметр можно убрать
    connectionLimit: 10, // Максимальное количество соединений в пуле
});

// Создание таблицы
(async () => {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS names (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            )
        `);
        console.log('Таблица "names" проверена/создана.');
    } catch (err) {
        console.error('Ошибка при создании таблицы:', err);
    }
})();

// Настройка body-parser для обработки POST-запросов
app.use(bodyParser.urlencoded({ extended: true }));
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
app.post('/greet', async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    const correctPassword = process.env.CORRECT_PASSWORD || 'CherubaelCursedGod!';

    // Проверка пароля
    if (password !== correctPassword) {
        return res.status(403).send(`
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ошибка</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="errorName">
                    <h1 class="errorNameText">У вас нет истинного имени <span id="name">${name}</span>!</h1>
                </div>
            </body>
            </html>
        `);
    }

    // Сохранение имени в базе данных
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query("INSERT INTO names (name) VALUES (?)", [name]);
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
                    <h1 class="greeting">Привет, <span id="name">${name}</span>!</h1>
                    <a href="/" class="button">Вернуться на главную страницу</a>
                    <a href="/heroes" class="button">Герои</a>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Ошибка при сохранении имени:', err);
        res.status(500).send('Ошибка при сохранении имени');
    } finally {
        if (connection) connection.release(); // Освобождаем соединение
    }
});

// Страница героев
app.get('/heroes', async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.query("SELECT name FROM names");
        let namesList = results.map(row => `<li>${row.name}</li>`).join('');
        
        res.send(`
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Герои</title>
                <link rel="stylesheet" href="styles.css">
            </head>
            <body>
                <div class="container">
                    <h1>Золотой список имен</h1>
                    <ul>
                        ${namesList}
                    </ul>
                    <a href="/" class="button">Вернуться на главную страницу</a>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Ошибка при получении имен:', err);
        res.status(500).send('Ошибка при получении имен');
    } finally {
        if (connection) connection.release(); // Освобождаем соединение
    }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});