const db = require('../config/db');

const Review = {
    addReview: (userId, pointId, rating, comment) => {
        const query = 'INSERT INTO reviews (user_id, point_id, rating, comment) VALUES (?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [userId, pointId, rating, comment], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    findByUserId: (userId) => {
        const query = 'SELECT * FROM reviews WHERE user_id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    findByPointId: (pointId) => {
        const query = 'SELECT * FROM reviews WHERE point_id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [pointId], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
};

module.exports = Review;