var admin = require("firebase-admin");

var serviceAccount = require("./firebaseServiceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apptourist-3574f-default-rtdb.firebaseio.com"
});

const db = admin.firestore();
module.exports = db;