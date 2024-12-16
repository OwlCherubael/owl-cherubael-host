// controllers/greetController.js
const NameModel = require('../models/nameModel');

const greetUser = async (req, res) => {
    const { name, password } = req.body;
    const correctPassword = process.env.CORRECT_PASSWORD || 'CherubaelCursedGod!';

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

    try {
        await NameModel.insertName(name);
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
    }
};

const getAllNames = async (req, res) => {
    try {
        const names = await NameModel.getAllNames();
        let namesList = names.map(row => `<li>${row.name}</li>`).join('');

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
                    <ul>${namesList}</ul>
                    <a href="/" class="button">Вернуться на главную страницу</a>
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Ошибка при получении имен:', err);
        res.status(500).send('Ошибка при получении имен');
    }
};

module.exports = { greetUser, getAllNames };