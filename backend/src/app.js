require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const rateLimiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3001', // Allow frontend origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

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

// Socket.IO for real-time chat
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinRoom', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('sendMessage', ({ roomId, message }) => {
        io.to(roomId).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
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
    server.listen(PORT, () => { // Use server.listen instead of app.listen
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
