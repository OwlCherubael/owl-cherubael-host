// models/nameModel.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    uri: process.env.JAWSDB_URL,
    connectionLimit: 10,
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

const NameModel = {
    async insertName(name) {
        const connection = await pool.getConnection();
        await connection.query("INSERT INTO names (name) VALUES (?)", [name]);
        connection.release();
    },
    
    async getAllNames() {
        const connection = await pool.getConnection();
        const [results] = await connection.query("SELECT name FROM names");
        connection.release();
        return results;
    }
};

module.exports = NameModel;