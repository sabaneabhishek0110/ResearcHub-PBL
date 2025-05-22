const express = require('express');
const router = express.Router();
const chatController = require('../Controllers/chatController');
const auth = require('../Middlewares/auth');

// Get all chats for current user
router.get('/', auth, chatController.getChats);

// Get a specific chat
router.get('/:chatId', auth, chatController.getChat);

// Get messages for a chat
router.get('/:chatId/messages', auth, chatController.getMessages);

// Create a new chat (1:1)
router.post('/', auth, chatController.createChat);

// Create a new group chat
router.post('/group', auth, chatController.createGroupChat);

// Add user to group
router.post('/group/:chatId/add', auth, chatController.addToGroup);

// Remove user from group
router.post('/group/:chatId/remove', auth, chatController.removeFromGroup);

// Leave group
router.post('/group/:chatId/leave', auth, chatController.leaveGroup);

// Update group name
router.put('/group/:chatId/name', auth, chatController.updateGroupName);

module.exports = router; 