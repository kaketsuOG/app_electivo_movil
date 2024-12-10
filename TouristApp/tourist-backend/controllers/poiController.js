const PointOfInterest = require('../models/poiModel'); // Asumiendo que este modelo está bien definido
const haversine = require('haversine-distance');

const PoiController = {
    getAllPoints: async (req, res) => {
        try {
            const { type } = req.query; // Recibe el tipo como un parámetro de query
            const points = type && type !== 'all' ?
                await PointOfInterest.findByType(type) : // Método hipotético para filtrar por tipo
                await PointOfInterest.findAll();
            res.json(points);
        } catch (error) {
            console.error('Error fetching points of interest:', error);
            res.status(500).json({ error: 'Error fetching points of interest' });
        }
    },

    getNearbyPoints: async (req, res) => {
        const { lat, lon, radius } = req.query;
        const userLocation = { latitude: parseFloat(lat), longitude: parseFloat(lon) };

        try {
            const points = await PointOfInterest.findAll();
            const nearbyPoints = points.filter(point => {
                const pointLocation = { latitude: parseFloat(point.latitude), longitude: parseFloat(point.longitude) };
                const distance = haversine(userLocation, pointLocation);
                return distance <= radius;
            });

            res.json(nearbyPoints);
        } catch (error) {
            console.error('Error al obtener puntos de interés:', error);
            res.status(500).json({ error: 'Error al obtener puntos de interés' });
        }
    }
};

module.exports = PoiController;