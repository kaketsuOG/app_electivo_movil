import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración de Firebase para el frontend (obtenida de Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyC4zJB0WGZ95TrTqdLEuAH4-RrMXObIhik",
    authDomain: "apptourist-d6baf.firebaseapp.com",
    projectId: "apptourist-d6baf",
    storageBucket: "apptourist-d6baf.firebasestorage.app",
    messagingSenderId: "20257060191",
    appId: "1:20257060191:web:a39b5e6f05559581cbf2ea",
    measurementId: "G-47M3NYRE96"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
const db = getFirestore(app);

export { auth, db };