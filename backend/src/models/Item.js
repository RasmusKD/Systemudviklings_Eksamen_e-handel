const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    canBeSent: { type: Boolean, default: false },
    image: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Item', itemSchema);
