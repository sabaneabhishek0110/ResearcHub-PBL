const Chat = require('../Models/Chat');
const User = require('../Models/User');

// Get all chats for current user
exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
    .populate('participants', 'name email profilePicture')
    .populate('admin', 'name email profilePicture')
    .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
};

// Get a specific chat
exports.getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name email profilePicture')
      .populate('admin', 'name email profilePicture');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ message: 'Error fetching chat' });
  }
};

// Get messages for a chat
exports.getMessages = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    res.json(chat.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// Create a new chat (1:1)
exports.createChat = async (req, res) => {
  try {
    const { participants } = req.body;

    // Check if participants array has exactly 2 users
    if (participants.length !== 2) {
      return res.status(400).json({ message: '1:1 chat requires exactly 2 participants' });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      isGroup: false,
      participants: { $all: participants }
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    const chat = new Chat({
      isGroup: false,
      participants
    });

    await chat.save();
    await chat.populate('participants', 'name email profilePicture');

    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
};

// Create a new group chat
exports.createGroupChat = async (req, res) => {
  try {
    const { name, participants } = req.body;

    if (!name || !participants || participants.length < 2) {
      return res.status(400).json({ message: 'Group chat requires a name and at least 2 participants' });
    }

    const chat = new Chat({
      isGroup: true,
      name,
      participants: [...participants, req.user._id], // Include creator
      admin: req.user._id
    });

   
    await chat.save();
    const populatedChat = await Chat.populate(chat, [
      { path: 'participants', select: 'name email avatar' },
      { path: 'admin', select: 'name email avatar' }
    ]);

    const io = req.app.get('io');
    // Emit to all participants
    io.emit('newGroup', populatedChat);

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Error creating group chat:', error);
    res.status(500).json({ message: 'Error creating group chat' });
  }
};

// Add user to group
exports.addToGroup = async (req, res) => {
  try {
    const { userId } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is admin
    if (chat.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can add users' });
    }

    // Check if user is already in group
    if (chat.participants.includes(userId)) {
      return res.status(400).json({ message: 'User already in group' });
    }

    chat.participants.push(userId);
    await chat.save();
    await chat.populate('participants', 'name email avatar');

    res.json(chat);
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(500).json({ message: 'Error adding user to group' });
  }
};

// Remove user from group
exports.removeFromGroup = async (req, res) => {
  try {
    const { userId } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is admin
    if (chat.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can remove users' });
    }

    // Cannot remove admin
    if (userId === chat.admin.toString()) {
      return res.status(400).json({ message: 'Cannot remove admin from group' });
    }

    chat.participants = chat.participants.filter(p => p.toString() !== userId);
    await chat.save();
    await chat.populate('participants', 'name email avatar');

    res.json(chat);
  } catch (error) {
    console.error('Error removing user from group:', error);
    res.status(500).json({ message: 'Error removing user from group' });
  }
};

// Leave group
exports.leaveGroup = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // If user is admin, assign new admin or delete group if last member
    if (chat.admin.toString() === req.user._id.toString()) {
      if (chat.participants.length === 1) {
        await chat.remove();
        return res.json({ message: 'Group deleted' });
      }

      // Assign new admin (first other participant)
      const newAdmin = chat.participants.find(p => p.toString() !== req.user._id.toString());
      chat.admin = newAdmin;
    }

    chat.participants = chat.participants.filter(p => p.toString() !== req.user._id.toString());
    await chat.save();
    await chat.populate('participants', 'name email avatar');

    res.json(chat);
  } catch (error) {
    console.error('Error leaving group:', error);
    res.status(500).json({ message: 'Error leaving group' });
  }
};

// Update group name
exports.updateGroupName = async (req, res) => {
  try {
    const { name } = req.body;
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is admin
    if (chat.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can update group name' });
    }

    chat.name = name;
    await chat.save();

    res.json(chat);
  } catch (error) {
    console.error('Error updating group name:', error);
    res.status(500).json({ message: 'Error updating group name' });
  }
}; 