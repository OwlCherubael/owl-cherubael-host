const express = require('express');
const app = express();

// Определяем корневой маршрут
app.get('/', (req, res) => {
    res.send('Hello, this is the root route!');
});

// Убедитесь, что у вас есть другие необходимые маршруты
app.get('/about', (req, res) => {
    res.send('This is the about page.');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});