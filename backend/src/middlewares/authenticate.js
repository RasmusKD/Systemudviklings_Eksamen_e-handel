const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(401).json({ error: 'Unauthorized' });
    }
};
