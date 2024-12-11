const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// Получение URL подключения из переменных окружения
const dbUrl = process.env.JAWSDB_URL || 'mysql://itqdzakzp3o8dnvx:ervwgfvt4yrmcygz@tyduzbv3ggpf15sx.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/ofg65703uwlrn8ck';

// Настройка базы данных
const db = mysql.createConnection(dbUrl);

// Подключение к базе данных
db.connect(err => {
    if (err) {
        console.error('Ошибка подключения к БД: ' + err.stack);
        return;
    }
    console.log('Подключено к MySQL с ID: ' + db.threadId);
});

// Создание таблицы
db.query(`CREATE TABLE IF NOT EXISTS names (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL)`, (err, results) => {
    if (err) throw err;
    console.log('Таблица "names" проверена/создана.');
});

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

    // Сохранение имени в базе данных
    db.query("INSERT INTO names (name) VALUES (?)", [name], (err, results) => {
        if (err) {
            return res.status(500).send('Ошибка при сохранении имени');
        }

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
        <h1>⚔️ Привет, ${name}! ⚔️</h1>
        <div class="buttons">
            <a href="/" class="button">🔙 Вернуться на главную страницу</a>
            <a href="/heroes" class="button">⚔️ Герои ⚔️</a>
        </div>
    </div>
</body>
</html>
        `);
    });
});

// Страница героев
app.get('/heroes', (req, res) => {
    db.query("SELECT name FROM names", (err, results) => {
        if (err) {
            return res.status(500).send('Ошибка при получении имен');
        }

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
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});