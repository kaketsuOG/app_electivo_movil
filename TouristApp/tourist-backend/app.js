const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const mapRoutes = require('./routes/mapRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/map', mapRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});