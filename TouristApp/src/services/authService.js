import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.82:3000'; // Ajusta esta URL si usas otro host o puerto

// Guardar token en el almacenamiento local
const setToken = async (token) => {
    console.log('Guardando token:', token);
    try {
        await AsyncStorage.setItem('userToken', token);
    } catch (error) {
        console.error('Error al guardar el token:', error);
    }
};

// Obtener token del almacenamiento local
const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('Obteniendo token:', token);
        return token;
    } catch (error) {
        console.error('Error al obtener el token:', error);
        return null;
    }
};

// Eliminar token (por ejemplo, al cerrar sesión)
const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('userToken');
        console.log('Token eliminado');
    } catch (error) {
        console.error('Error al eliminar el token:', error);
    }
};

// Obtener perfil del usuario
const getUserProfile = async () => {
    const token = await getToken();
    if (!token) {
        throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { 'x-access-token': token },
    });
    return response.data;
};

// Actualizar perfil del usuario
const updateUserProfile = async (data) => {
    const token = await getToken();
    if (!token) {
        throw new Error('Token no encontrado. Inicia sesión nuevamente.');
    }

    let endpoint = '/profile'; // Por defecto, el endpoint para actualizar el perfil completo
    if (data.email && !data.username) {
        endpoint = '/profile/email'; // Si solo se proporciona email, usa este endpoint
    } else if (data.username && !data.email) {
        endpoint = '/profile/username'; // Si solo se proporciona username, usa este endpoint
    }

    const response = await axios.put(`${API_URL}${endpoint}`, data, {
        headers: { 'x-access-token': token },
    });
    return response.data;
};

// Registro
const register = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/auth/signup`, { username, email, password });
    return response.data;
};

// Login con almacenamiento del token
const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
        await setToken(response.data.token); // Guarda el token al iniciar sesión
    } else {
        throw new Error('No se recibió un token del servidor.');
    }
    return response.data;
};

// Cerrar sesión
const logout = async () => {
    await removeToken();
};

export default {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    logout,
};