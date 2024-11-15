const db = require('../config/firebase'); // Firebase config
const admin = require("firebase-admin");

const User = {
    create: async (username, email, password) => {
        try {
            const newUser = {
                username,
                email,
                password,
                created_at: admin.firestore.FieldValue.serverTimestamp(),
            };
            const userRef = await db.collection('users').add(newUser);
            return userRef.id;
        } catch (err) {
            throw new Error('Error creating user: ' + err.message);
        }
    },
    findByEmail: async (email) => {
        try {
            const snapshot = await db.collection('users').where('email', '==', email).get();
            if (snapshot.empty) return null;
            const userDoc = snapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        } catch (err) {
            throw new Error('Error finding user: ' + err.message);
        }
    }
};

module.exports = User;