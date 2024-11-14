import axios from 'axios';

const API_URL = 'http://192.168.1.82:3000/auth';

const register = async (username, email, password) => {
    const response = await axios.post(`${API_URL}/signup`, { username, email, password });
    return response.data;
};

const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
};

export default {
    register,
    login
};