const express = require('express');
const Chat = require('../models/Chat');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

// Create or get a chat
router.post('/', authenticate, async (req, res) => {
    try {
        const { sellerId, itemId } = req.body;
        const buyerId = req.user.id;

        // Check if the chat already exists
        let chat = await Chat.findOne({ buyerId, sellerId, itemId });
        if (!chat) {
            chat = await Chat.create({ buyerId, sellerId, itemId });
        }

        res.status(201).json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all chats for a user
router.get('/', authenticate, async (req, res) => {
    try {
        const chats = await Chat.find({
            $or: [{ buyerId: req.user.id }, { sellerId: req.user.id }],
        })
            .populate('buyerId sellerId itemId')
            .sort({ updatedAt: -1 }); // Order by the latest updated

        res.json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Send a message
router.post('/:id/messages', authenticate, async (req, res) => {
    try {
        const { text } = req.body;
        const senderId = req.user.id;
        const chatId = req.params.id;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        const message = {
            senderId,
            text,
            timestamp: new Date(),
        };

        chat.messages.push(message);
        await chat.save();

        res.json(chat); // Return updated chat with messages
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;
