const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const poiRoutes = require('./routes/poiRoutes');  // Añadido
const reviewRoutes = require('./routes/reviewRoutes');  // Añadido
const profileRoutes = require('./routes/profileRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/poi', poiRoutes);  // Modificado para usar poiRoutes
app.use('/review', reviewRoutes);  // Modificado para usar reviewRoutes
app.use('/profile', profileRoutes);
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});