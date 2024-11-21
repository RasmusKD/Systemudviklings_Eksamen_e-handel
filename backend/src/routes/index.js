const express = require('express');
const router = express.Router();
const itemRoutes = require('./itemRoutes');
const userRoutes = require('./userRoutes');

// API routes
router.use('/items', itemRoutes);
router.use('/users', userRoutes);

// Export router
module.exports = router;
