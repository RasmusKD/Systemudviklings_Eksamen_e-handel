const express = require('express');
const router = express.Router();
const itemRoutes = require('./itemRoutes');
const userRoutes = require('./userRoutes');
const chatRoutes = require('./chatRoutes');

// API routes
router.use('/items', itemRoutes);
router.use('/users', userRoutes);
router.use('/chats', chatRoutes);

// Export router
module.exports = router;
