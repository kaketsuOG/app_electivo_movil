const db = require('../config/db');

const PointOfInterest = {
    create: (name, description, latitude, longitude, type, imageUrl) => {
        const query = 'INSERT INTO points_of_interest (name, description, latitude, longitude, type, image_url) VALUES (?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            db.query(query, [name, description, latitude, longitude, type, imageUrl], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    findAll: () => {
        const query = 'SELECT * FROM points_of_interest';
        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },
    findById: (id) => {
        const query = 'SELECT * FROM points_of_interest WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    },
    findByType: (type) => {
        const query = 'SELECT * FROM points_of_interest WHERE type = ?';
        return new Promise((resolve, reject) => {
            db.query(query, [type], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
};

module.exports = PointOfInterest;