const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
    points: 10, // 10 requests
    duration: 1, // per second
});

module.exports = (req, res, next) => {
    rateLimiter
        .consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).json({ error: 'Too many requests' });
        });
};
