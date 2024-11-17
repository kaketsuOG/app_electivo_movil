const db = require('../config/db');

const User = {
    create: (username, email, password) => {
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [username, email, password], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    findByEmail: (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
};

module.exports = User;