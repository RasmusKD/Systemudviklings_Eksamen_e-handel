const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    canBeSent: { type: Boolean, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    image: { type: String },
});

module.exports = mongoose.model('Item', itemSchema);
