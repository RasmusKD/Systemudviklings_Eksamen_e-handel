module.exports = (err, req, res, next) => {
    console.error('Unhandled Error:', err.message); // Log for debugging
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
};
