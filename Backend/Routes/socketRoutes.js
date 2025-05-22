const Document = require('../Models/Document');
const yourDocumentController = require('../Controllers/yourDocumentsController');
const jwt = require('jsonwebtoken');
const Chat = require('../Models/Chat');

const JWT_SECRET = process.env.JWT_SECRET;
const activeUsers = new Set();

const socketRoutes = (socket, io) => {
    console.log("User connected with ID:", socket.id);

    // Since user is already authenticated through middleware, add to active users
    activeUsers.add(socket.userId);
    io.emit('userOnline', socket.userId);
    io.emit('activeUsers', Array.from(activeUsers));

    socket.on('get-document', async (documentId) => {
        try {
            const document = await Document.findById(documentId)
            .populate({
              path: 'versions.updated_by',
              select: 'name email' 
            });
            console.log(document);
            if (!document) {
                socket.emit('document-not-found');
                return;
            }
    
            socket.join(documentId);
            socket.emit('load-content', document);
    
        } catch (error) {
            console.error("Error fetching document:", error);
            socket.emit('error', 'Failed to load document.');
        }
    });
    
    // Send changes to other users in the same document room
    socket.on('send-changes', (data) => {
        const { documentId, changes } = data;
        socket.broadcast.to(documentId).emit('receive-changes', changes);
    });
    
    // Save document content
    socket.on('save-document', async ({ documentId, content,title }) => {
        try {
            const updatedDoc = await Document.findByIdAndUpdate(
                documentId,
                { content,title},
                { new: true } // 👈 this returns the updated document
            );
            console.log(updatedDoc.content);
        } catch (error) {
            console.error("Error saving document:", error);
            socket.emit('error', 'Failed to save document.');
        }
    });
    
    // Save document title
    socket.on('save-title', async ({ documentId, title }) => {
        try {
            await Document.findByIdAndUpdate(documentId, { title: title });
        } catch (error) {
            console.error("Error saving title:", error);
            socket.emit('error', 'Failed to save title.');
        }
    });
    
    // Save a new version of the document
    socket.on('save-version', async ({ documentId, content,title,token }) => {
        try {
            console.log("kdhksjhdjshdjksk",content);
            const decoded = jwt.verify(token, JWT_SECRET); // Decode token to get userId
            const userId = decoded.userId;
            await yourDocumentController.saveVersion(documentId, content,title,userId,socket);
        } catch (error) {
            console.error("Error saving version:", error);
            socket.emit('error', 'Failed to save document version.');
        }
    });
    
    // Handle user registration
    socket.on('register', async (token) => {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            socket.userId = decoded.userId;
            activeUsers.add(decoded.userId);
            io.emit('userOnline', decoded.userId);
            io.emit('activeUsers', Array.from(activeUsers));
        } catch (error) {
            console.error('Error registering user:', error);
        }
    });

    // Handle joining a chat room
    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
    });

    // Handle leaving a chat room
    socket.on('leaveChat', (chatId) => {
        socket.leave(chatId);
    });

    // Handle sending messages
    socket.on('sendMessage', async ({ chatId, content, file, timestamp }) => {
        try {
            const chat = await Chat.findById(chatId);
            
            if (!chat) {
                socket.emit('error', { message: 'Chat not found' });
                return;
            }

            // Check if user is a participant
            if (!chat.participants.includes(socket.userId)) {
                socket.emit('error', { message: 'Not authorized to send messages in this chat' });
                return;
            }

            const messageContent = content || (file ? "File Shared " : "");

            const message = {
                sender: socket.userId,
                content : messageContent,
                timestamp: timestamp || new Date(),
                status: 'sent'
            };

            // Add file information if present
            if (file) {
                message.file = {
                    url: file.url,
                    type: file.type,
                    name: file.name
                };
            }

            chat.messages.push(message);
            await chat.save();

            const savedMessage = chat.messages[chat.messages.length - 1];

            // Notify all participants except sender
            chat.participants.forEach(participantId => {
                if (participantId.toString() !== socket.userId) {
                    io.to(participantId.toString()).emit('newMessage', {
                        chatId,
                        message: {
                            ...message,
                            _id: savedMessage._id
                        }
                    });
                }
            });

            // Confirm message sent to sender
            socket.emit('messageSent', {
                chatId,
                message: {
                    ...message,
                    _id: savedMessage._id
                }
            });

        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Error sending message' });
        }
    });

    // Handle message status updates
    socket.on('updateMessageStatus', async ({ chatId, messageId, status }) => {
        try {
            const chat = await Chat.findById(chatId);
            
            if (!chat) {
                socket.emit('error', { message: 'Chat not found' });
                return;
            }

            const message = chat.messages.id(messageId);
            if (!message) {
                socket.emit('error', { message: 'Message not found' });
                return;
            }

            message.status = status;
            await chat.save();

            // Notify sender about status update
            io.to(message.sender.toString()).emit('messageStatusUpdated', {
                chatId,
                messageId,
                status
            });
        } catch (error) {
            console.error('Error updating message status:', error);
            socket.emit('error', { message: 'Error updating message status' });
        }
    });

    // Handle typing indicators
    socket.on('typing', ({ chatId, isTyping }) => {
        socket.to(chatId).emit('typing', {
            userId: socket.userId,
            isTyping
        });
    });

    // Handle new group creation
    socket.on('newGroup', (group) => {
        group.participants.forEach(userId => {
            io.to(userId.toString()).emit('groupCreated', group);
        });
    });

    // Handle group updates
    socket.on('groupUpdated', ({ chatId, updates }) => {
        io.to(chatId).emit('groupUpdated', updates);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        activeUsers.delete(socket.userId);
        io.emit('userOffline', socket.userId);
        io.emit('activeUsers', Array.from(activeUsers));
        console.log("User disconnected:", socket.id);
    });
}

module.exports = socketRoutes;