const Item = require('../models/Item');

// Get all items
exports.getItems = async (req, res, next) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

// Create item
exports.createItem = async (req, res, next) => {
    try {
        const newItem = await Item.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        next(error);
    }
};
