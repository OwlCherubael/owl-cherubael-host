// index.js
require('dotenv').config(); // Подключаем dotenv для работы с переменными окружения
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');

const app = express();

// Настройка body-parser для обработки POST-запросов
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mainRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});