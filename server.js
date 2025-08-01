const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require("cors");

dotenv.config();
connectDB();

const app = express(); 
const movieRoutes = require('./routes/movies');
app.use('/api/movies', movieRoutes);
app.use('/api/recommendations', require('./routes/recommendations'));


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
