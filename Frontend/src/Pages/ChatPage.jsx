import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import CreateGroupModal from '../Components/CreateGroupModal';
import { FaPaperPlane, FaPaperclip, FaTimes } from 'react-icons/fa';
import {FileIcon} from 'lucide-react';
import '../CSS/Chat.css';
import ChatList from '../Components/ChatList';
import ChatWindow from '../Components/ChatWindow';

const ChatPage = () => {
  const { 
    currentUser, 
    allUsers, 
    activeUsers, 
    currentChat, 
    setCurrentChat, 
    startNewChat,
    socket,
    error,
    loading 
  } = useChat();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);


  // Filter users based on search and online status
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    if (showOnlineOnly) {
      return matchesSearch && activeUsers.includes(user._id);
    }
    return matchesSearch;
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (data) => {
      if (currentChat && data.chatId === currentChat._id) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    socket.on('typing', ({ userId, isTyping }) => {
      if (currentChat && currentChat.participants.includes(userId)) {
        setTyping(isTyping);
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('typing');
    };
  }, [socket, currentChat]);

  // Load messages when chat changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentChat) return;

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/chats/${currentChat._id}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to load messages');
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
  }, [currentChat]);

  const handleUserClick = async (user) => {
    try {
      const chat = await startNewChat(user._id);
      setCurrentChat(chat);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // If it's an image, you might want to show a preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // You can add preview functionality here if needed
      };
      reader.readAsDataURL(file);
    }
  };

  
  const uploadFile = async (file) => {
    try {
      // console.log("fkhdfkjhd",file);
      const formData = new FormData();
      formData.append('file', file);
      console.log("File being uploaded:", file.name, file.size, file.type);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`${percentCompleted}% uploaded`);
        }
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !currentChat) return;

    try {
      if (!socket) {
        throw new Error('Socket connection not established');
      }

      let fileUrl = null;
      let fileType = null;
      let fileName = null;

      // const fileData = null;

      if (selectedFile) {
        setIsUploading(true);
        try {
          // console.log("kdhsdjsj",selectedFile);
          fileUrl = await uploadFile(selectedFile);
          fileType = selectedFile.type;
          fileName = selectedFile.name;
          // fileData = {
          //   url: fileUrl,
          //   type: selectedFile.type,
          //   name: selectedFile.name
          // };
        } 
        finally {
          setIsUploading(false);
        }
        // catch (error) {
        //   alert('Failed to upload file: ' + error.message);
        //   setIsUploading(false);
        //   return;
        // }
        // setIsUploading(false);
      }

      // Emit the message with proper structure
      socket.emit('sendMessage', {
        chatId: currentChat._id,
        content: message,
        file: fileUrl ? {
          url: fileUrl,
          type: fileType,
          name: fileName
        } : null,
        timestamp: new Date()
      });

      // Optimistically add message to UI
      const newMessage = {
        sender: currentUser._id,
        content: message,
        file: fileUrl ? {
          url: fileUrl,
          type: fileType,
          name: fileName
        } : null,
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages(prev => [...prev, newMessage]);

      setMessage('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + error.message);
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (socket && currentChat) {
      socket.emit('typing', {
        chatId: currentChat._id,
        isTyping: e.target.value.length > 0
      });
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <div className="chat-loading">Loading...</div>;
  }

  if (error) {
    return <div className="chat-error">Error: {error}</div>;
  }

  return (
    <div className="chat-container overflow-y-auto overflow-hidden">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h2>Contacts</h2>
          <div className="chat-search">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="online-toggle">
            <input
              type="checkbox"
              id="onlineOnly"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
            />
            <label htmlFor="onlineOnly">Show online only ({activeUsers.length})</label>
          </div>
          <button 
            className="create-group-btn"
            onClick={() => setShowCreateGroup(true)}
          >
            Create Group
          </button>
        </div>
        
        {/* <div className="users-list">
          {filteredUsers.map(user => (
            <div
              key={user._id}
              className={`user-item ${currentChat?.participants.includes(user._id) ? 'active' : ''}`}
              onClick={() => handleUserClick(user)}
            >
              <div className="user-avatar">
                <img src={user.profilePicture || 'https://via.placeholder.com/40'} alt={user.name} />
                <div className={`status-indicator ${activeUsers.includes(user._id) ? 'online' : 'offline'}`} />
              </div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          ))}
        </div> */}

        <ChatList searchQuery={searchQuery} />
      </div>

      {/* Main Chat Area */}
      {/* <div className="chat-main">
        {currentChat ? (
          <>
            <div className="chat-header">
              <h3>{currentChat.isGroup ? currentChat.name : 
                allUsers.find(u => u._id === currentChat.participants.find(p => p !== currentUser._id))?.name
              }</h3>
            </div>
            
            <div className="messages-container">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.sender === currentUser._id ? 'sent' : 'received'}`}
                >
                  <div className="message-content">
                    {msg.content}
                    {msg.file && (
                      <div className="message-file">

                      {msg.file && (
                        <div className="message-file">
                          {msg.file.type.startsWith('image/') ? (
                            <img src={msg.file.url} alt="Attachment" />
                          ) : (
                            <a href={msg.file.url} target="_blank" rel="noopener noreferrer">
                              <FileIcon type={msg.file.type} />
                              {msg.file.name}
                            </a>
                          )}
                        </div>
                      )}
                      </div>
                    )}
                  </div>
                  <div className="message-time">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="typing-indicator">
                  <span>Typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                className="attach-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <FaPaperclip />
              </button>
              {selectedFile && (
                <div className="selected-file">
                  <span>{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)}>
                    <FaTimes />
                  </button>
                </div>
              )}
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping(e);
                }}
                placeholder="Type a message..."
                disabled={isUploading}
              />
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={isUploading || (!message.trim() && !selectedFile)}
              >
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <h3>Select a contact to start chatting</h3>
          </div>
        )}
      </div> */}

      <div className='chat-main'>
        {currentChat ? (
          <ChatWindow />
        ) : (
          <div className="no-chat-selected">
            <h3>Select a contact to start chatting</h3>
          </div>
        )}
      </div>

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
      )}
    </div>
  );
};

export default ChatPage;