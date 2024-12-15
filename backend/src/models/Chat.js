const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    messages: [
        {
            senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            text: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
});

chatSchema.methods.addMessage = async function (senderId, text) {
    this.messages.push({ senderId, text });
    await this.save();
};

module.exports = mongoose.model('Chat', chatSchema);
