const Chat = require('../models/Chat');

// Get all chats for the logged-in user
exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
        }).populate('itemId').populate('buyerId sellerId', 'username email');
        res.json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Send a message in a specific chat
exports.sendMessage = async (req, res) => {
    try {
        const { itemId, sellerId } = req.params;
        const { message } = req.body;

        const chat = await Chat.findOneAndUpdate(
            { itemId, buyerId: req.user.id, sellerId },
            { $push: { messages: { sender: req.user.id, text: message } } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(chat);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
