import axios from 'axios';

const API_URL = 'http://192.168.0.2:3000/auth';

const register = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/signup`, { username, email, password });
    return response.data; // Devuelve la respuesta, puedes incluir más lógica si es necesario
};

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // Devuelve la respuesta, puedes incluir más lógica si es necesario
};

export default {
    register,
    login
};