const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

        if (!uri) {
            throw new Error('MongoDB URI not defined');
        }

        // Connect without deprecated options
        await mongoose.connect(uri);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
