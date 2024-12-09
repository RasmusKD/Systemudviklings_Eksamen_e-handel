require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);

app.use(cors({
    origin: '*', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true, // Allow credentials
    exposedHeaders: ['Content-Type'], // Expose Content-Type header
}));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(rateLimiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.png')) {
            res.set('Content-Type', 'image/png');
        } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
            res.set('Content-Type', 'image/jpeg');
        }
    }
}));

// API Routes
app.use('/api', routes);

// Serve React frontend for all other routes
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Debug Logging
if (process.env.NODE_ENV === 'development') {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Working directory:', process.cwd());
}

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
