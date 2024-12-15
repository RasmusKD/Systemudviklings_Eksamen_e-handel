const Item = require('../models/Item');
const User = require('../models/User');

// Create a new item
exports.createItem = async (req, res, next) => {
    try {
        const { title, description, price, category, canBeSent } = req.body;
        const userId = req.user.id;
        const image = req.file ? req.file.filename : null;

        const imageUrl = image ? `${req.protocol}://${req.get("host")}/uploads/${image}` : null;

        const newItem = await Item.create({
            title,
            description,
            price,
            category,
            canBeSent,
            image,
            imageUrl, // Store the correct full URL
            userId,
        });

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item:", error.message);
        next(error);
    }
};

exports.getItems = async (req, res, next) => {
    try {
        const items = await Item.find();

        // Ensure imageUrl is correct
        const updatedItems = items.map((item) => ({
            ...item._doc,
            imageUrl: item.image
                ? `${req.protocol}://${req.get("host")}/uploads/${item.image}`
                : null,
        }));

        res.status(200).json(updatedItems);
    } catch (error) {
        console.error("Error fetching items:", error.message);
        next(error);
    }
};

exports.getItemsByUser = async (req, res) => {
    try {
        console.log('Fetching items for user:', req.user.id);
        const items = await Item.find({ userId: req.user.id });
        console.log('Items found:', items);
        res.json(items);
    } catch (error) {
        console.error('Error in getItemsByUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get item by ID
exports.getItemById = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ message: 'Error fetching item' });
    }
};

// Update an item
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, canBeSent } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            {
                title,
                description,
                price,
                category,
                canBeSent,
                image: req.file ? `/uploads/${req.file.filename}` : undefined,
            },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating item:', error.message);
        res.status(500).json({ error: 'Failed to update item' });
    }
};

// Delete an item
exports.deleteItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Item.findByIdAndDelete(id);
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        next(error);
    }
};
