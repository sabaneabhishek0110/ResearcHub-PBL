import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import CreateGroupModal from '../Components/CreateGroupModal';
import { FaPaperPlane, FaPaperclip, FaTimes } from 'react-icons/fa';
import {FileIcon, MessageSquarePlus, Search,Users,PanelLeftOpen ,ArrowLeft,MessageCircle,Menu } from 'lucide-react';
import '../CSS/Chat.css';
import ChatList from '../Components/ChatList';
import ChatWindow from '../Components/ChatWindow';
import CreateChatModal from '../Components/CreateChatModal';

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
  const [isOpen,setIsOpen] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);
  const [showCreateChat, setShowCreateChat] = useState(false); // For future chat modal


  const BASE_URL = "https://researchub-pbl.onrender.com";

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
        const res = await fetch(`${BASE_URL}/api/chats/${currentChat._id}/messages`, {
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

  useEffect(() => {
    if (!socket || !currentChat) return;

    socket.emit('joinChat', currentChat._id);

    return () => {
      socket.emit('leaveChat', currentChat._id);
    };
  }, [socket, currentChat]);


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
      const response = await fetch(`${BASE_URL}/api/upload`, {
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
    return <div className="chat-loading text-2xl">Loading...</div>;
  }

  if (error) {
    return <div className="chat-error">Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Mobile: Always full screen for either chat list or chat window */}
      <div className="w-full h-[100dvh] flex flex-col md:hidden overflow-hidden">
        {currentChat ? (
          <div className="h-full flex flex-col">
            {/* Mobile Chat Window */}
            <ChatWindow onBack={() => setCurrentChat(null)}/>
          </div>
        ) : (
          <div className="flex-1 relative flex flex-col bg-gray-900 text-white">
  {/* Header - Fixed */}
  <div className="bg-gray-800 p-4 border-b border-gray-700 sticky top-0 z-10">
    <h2 className="text-xl font-semibold mb-4">Contacts</h2>
    <div className="flex flex-col space-y-4">
      {/* Search and filter */}
      <div className="relative">
        <input
          type="text"
          className="w-full p-2 pl-8 rounded bg-gray-700 text-white text-sm"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="onlineOnly"
          className="mr-2"
          checked={showOnlineOnly}
          onChange={(e) => setShowOnlineOnly(e.target.checked)}
        />
        <label htmlFor="onlineOnly" className="text-sm">
          Online ({activeUsers.length})
        </label>
      </div>
    </div>
  </div>

  {/* Scrollable Chat List */}
  <div className="flex-1 overflow-y-auto">
    <ChatList searchQuery={searchQuery} />
  </div>

  {/* Floating Action Button - Fixed at Bottom Right */}
  <div className="fixed bottom-6 right-2 md:right-4 z-20">
    <button
      onClick={() => setShowFabMenu(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
    >
      <MessageSquarePlus size={24} />
    </button>
  </div>
</div>

        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex w-full h-full">
        {/* Desktop Sidebar - always visible but collapsible */}
        <div className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${currentChat ? 'w-20' : 'w-80'}`}>
          {!currentChat ? (
            <div className="h-full flex flex-col">
              {/* Expanded Sidebar Content */}
              <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Contacts</h2>
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2 pl-8 rounded bg-gray-700 text-white text-sm"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search 
                      className="w-4 h-4 absolute left-2 top-3 text-gray-400" 
                      size={16}
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="onlineOnly"
                      className="mr-2"
                      checked={showOnlineOnly}
                      onChange={(e) => setShowOnlineOnly(e.target.checked)}
                    />
                    <label htmlFor="onlineOnly" className="text-sm">
                      Online ({activeUsers.length})
                    </label>
                  </div>
                  
                  {/* <button
                    className="bg-blue-600 hover:bg-blue-700 flex justify-center items-center text-white py-2 px-4 rounded text-sm"
                    onClick={() => setShowCreateGroup(true)}
                  >
                    <div className='flex flex-row gap-2'>
                      <Users size={16} />
                      <p>Create Group</p>
                    </div>
                  </button> */}
                </div>
              </div>
              
              {/* Desktop Contacts List */}
              <div className="flex-1 overflow-y-auto">
                <ChatList searchQuery={searchQuery} />
                {/* Floating Action Button */}
                <div className="sticky bottom-6 right-2 md:right-4">
                  <button
                    onClick={() => setShowFabMenu(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
                  >
                    <MessageSquarePlus size={24} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between items-center pt-4 pb-4">
              {/* Collapsed Sidebar Icons */}
              <div className='flex flex-col items-center space-y-4'>
                <button 
                  onClick={() => setCurrentChat(null)}
                  className="p-2 rounded-full hover:bg-gray-700"
                >
                  <Menu size={24}/>
                </button>
                <button 
                  onClick={() => {/* Implement search functionality */}}
                  className="p-2 rounded-full hover:bg-gray-700"
                >
                  <Search size={24}/>
                </button>
                <button 
                  onClick={() => {/* Implement new chat functionality */}}
                  className="p-2 rounded-full hover:bg-gray-700"
                >
                  <MessageSquarePlus size={24}/>
                </button>
              </div>
              <button 
                onClick={() => setCurrentChat(null)}
                className="p-2 rounded-full hover:bg-gray-700"
              >
                <PanelLeftOpen size={24}/>
              </button>
            </div>
          )}
        </div>

        {/* Desktop Chat Area - should take remaining width */}
        <div className={`flex-1 flex flex-col bg-gray-900`}>
          {currentChat ? (
            <ChatWindow onBack={()=>{setCurrentChat(null)}}/>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center p-6 max-w-md">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No chat selected</h3>
                <p className="text-gray-500">Select a contact from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
      )}
      {/* Create Chat Modal */}
      {showCreateChat && (
        <CreateChatModal onClose={() => setShowCreateChat(false)} />
      )}

      {showFabMenu && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 z-50 flex justify-center items-center p-6">
          <div className="bg-gray-800 text-white rounded-lg p-4 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Choose Action</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowFabMenu(false);
                  setShowCreateChat(true);
                }}
                className="w-full text-left px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                ➕ Create New Chat
              </button>
              <button
                onClick={() => {
                  setShowFabMenu(false);
                  setShowCreateGroup(true);
                }}
                className="w-full text-left px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                👥 Create Group
              </button>
              <button
                onClick={() => setShowFabMenu(false)}
                className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ChatPage;





