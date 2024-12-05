
require('dotenv').config();
//hej test commit med mikkel
console.log('MONGO_URI:', process.env.MONGO_URI); //for at tjekke om vores .env blev indlæst korrekt, dette kan fjernes hvis det er
console.log('NODE_ENV:', process.env.NODE_ENV); //for at tjekke om vores .env blev indlæst korrekt, dette kan fjernes hvis det er
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
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(rateLimiter);

// API Routes
app.use('/api', routes);

// Serve React frontend for all other routes
app.use(express.static(path.join(__dirname, '../../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

// Error handling middleware
app.use(errorHandler);

console.log('Working directory:', process.cwd());

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 3002;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
