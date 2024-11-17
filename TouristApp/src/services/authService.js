import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.2:3000'; // Ajusta esta URL si usas otro host o puerto

// Guardar token en el almacenamiento local
const setToken = async (token) => {
    await AsyncStorage.setItem('userToken', token);
};

// Obtener token desde el almacenamiento local
const getToken = async () => {
    return await AsyncStorage.getItem('userToken');
};

// Eliminar token (por ejemplo, al cerrar sesión)
const removeToken = async () => {
    await AsyncStorage.removeItem('userToken');
};

// Obtener perfil del usuario
const getUserProfile = async () => {
    const token = await getToken();
    const response = await axios.get(`${API_URL}/profile`, {
        headers: { 'x-access-token': token },
    });
    return response.data;
};

// Actualizar perfil del usuario
const updateUserProfile = async (data) => {
    const token = await getToken();
    
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


// Registro y login (ya existentes)
const register = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/auth/signup`, { username, email, password });
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    await setToken(response.data.token); // Guarda el token al iniciar sesión
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
