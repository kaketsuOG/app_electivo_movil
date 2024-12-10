import axios from 'axios';

const BASE_URL = 'http://192.168.0.4:8000';  // Ajusta esto según la configuración de tu servidor

export const fetchPointsOfInterest = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/points`);
        return response.data;
    } catch (error) {
        console.error('Error fetching points of interest:', error);
        return [];
    }
};