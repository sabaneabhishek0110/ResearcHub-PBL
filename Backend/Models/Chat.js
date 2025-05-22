const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  file: {
    url: String,
    type: { type: String, 
      enum: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ] 
    },
    name: String
  },
  content: { 
    type: String, 
    required: function() {
      return !this.file; 
    }
  },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read'], 
    default: 'sent' 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const chatSchema = new mongoose.Schema({
  isGroup: { 
    type: Boolean, 
    default: false 
  },
  name: { 
    type: String, 
    required: function() { 
      return this.isGroup 
    }
  },
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }],
  admin: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: function() { 
      return this.isGroup 
    }
  },
  messages: [messageSchema],
  lastMessage: {
    content: String,
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    timestamp: Date
  }
}, {
  timestamps: true
});

// Update lastMessage when a new message is added
chatSchema.pre('save', function(next) {
  if (this.messages.length > 0) {
    const lastMsg = this.messages[this.messages.length - 1];
    this.lastMessage = {
      content: lastMsg.content,
      sender: lastMsg.sender,
      timestamp: lastMsg.timestamp
    };
  }
  next();
});

module.exports = mongoose.model('Chat', chatSchema);