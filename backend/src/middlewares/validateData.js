const validateData = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            error: 'Validation failed',
            details: error.details.map((e) => e.message),
        });
    }
    next();
};

module.exports = validateData;
