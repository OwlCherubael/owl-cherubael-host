// routes/mainRoutes.js
const express = require('express');
const path = require('path');
const { greetUser, getAllNames } = require('../controllers/greetController');

const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Страница с формой
router.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'form.html'));
});

// Обработка формы
router.post('/greet', greetUser);

// Страница героев
router.get('/heroes', getAllNames);

module.exports = router;