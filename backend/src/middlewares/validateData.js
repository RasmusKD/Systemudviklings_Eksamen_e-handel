const validateData = (schema) => (req, res, next) => {
    if (!schema || !schema.validate) {
        return res.status(500).json({ error: 'Validation schema is invalid.' });
    }

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
