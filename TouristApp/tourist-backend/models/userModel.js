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
    },
    findById: (id) => {
        const query = 'SELECT id, username, email, password FROM users WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },
    updateUsername: (id, username) => {
        const query = 'UPDATE users SET username = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [username, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    updateEmail: (id, email) => {
        const query = 'UPDATE users SET email = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [email, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    updateProfile: (id, username, email) => {
        const query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [username, email, id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
    
    
};

module.exports = User;