import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { Paperclip, Send, CheckCheck,Users,User ,ArrowLeft} from 'lucide-react';

const BASE_URL = "https://researchub-pbl.onrender.com"


function ChatWindow({onBack = () => {}}) {
  const { socket, currentChat, currentUser, activeUsers, allUsers } = useChat();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentChat) return;
    
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/api/chats/${currentChat._id}/messages`, {
          method : "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type' : 'application/json',
          }
        });
        if (!res.ok) {
          const text = await res.text(); 
          console.error('Server returned:', text);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setMessages(data);
        console.log(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    const handleNewMessage = (incoming) => {
      if (incoming.chatId === currentChat._id) {
        setMessages(prev => [...prev, incoming.message]);
      }
    };

    socket?.on('newMessage', handleNewMessage);

    return () => {
      socket?.off('newMessage', handleNewMessage);
    };
  }, [currentChat, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!newMessage.trim() && !file) return;

    try {
      let fileData = null;
      if (file) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (!res.ok) throw new Error('File upload failed');
        fileData = await res.json();
      }
      console.log("Message Data : ",newMessage)
      const messageData = {
        chatId: currentChat._id,
        content: newMessage,
        sender: currentUser._id, 
        isGroup: currentChat.isGroup,
        file: fileData,
        timestamp: new Date()
      };

      socket.emit('sendMessage', messageData);

      setMessages(prev => [...prev, {
        ...messageData,
        sender: currentUser._id,
        status: 'sent',
        _id: Date.now().toString(),
        chat: currentChat._id
      }]);

      setNewMessage('');
      setFile(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50">
        <img 
          src="/whatsapp-logo.png" 
          alt="WhatsApp" 
          className="w-32 h-32 mb-4"
        />
        <h3 className="text-lg text-gray-600">Select a chat to start messaging</h3>
      </div>
    );
  }

  const otherParticipant = !currentChat.isGroup 
    ? currentChat.participants.find(p => p._id !== currentUser._id)
    : null;

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b shrink-0">
        <button className="hover:bg-gray-800 p-2 mr-1 rounded-full" onClick={onBack}>
          <ArrowLeft size={24}/>
        </button>
        <div className="flex items-center">
          {currentChat.isGroup ? (
            <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center mr-3">
              <Users className="text-gray-200" size={20} />
            </div>
          ) : (
              <img 
                src={otherParticipant?.profilePicture} 
                alt={otherParticipant?.name} 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
          )}
          <div>
            <h3 className="font-medium">
              {currentChat.isGroup ? currentChat.name : otherParticipant?.name || "Unknown User"}
            </h3>
            <p className="text-xs text-gray-500">
              {currentChat.isGroup 
                ? `${currentChat.participants.length} members`
                : activeUsers.includes(otherParticipant?._id) 
                  ? 'Online' 
                  : 'Last seen recently'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => {
          const sender = allUsers.find(u => u._id === msg.sender);
          const isCurrentUser = msg.sender === currentUser._id;
          const messageDate = new Date(msg.timestamp);
          const today = new Date();
          const isToday = 
            messageDate.getDate() === today.getDate() &&
            messageDate.getMonth() === today.getMonth() &&
            messageDate.getFullYear() === today.getFullYear();
          
          return (
            <div 
              key={index} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  isCurrentUser 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-gray-500 text-white rounded-tl-none'
                }`}
              >
                {currentChat.isGroup && !isCurrentUser && (
                  <p className="font-medium text-xs mb-1">
                    {sender?.name || 'Unknown'}
                  </p>
                )}
                
                {msg.file && (
                  <div className="mb-2">
                    {msg.file.type.startsWith('image/') ? (
                      <>
                        <img 
                          src={msg.file.url} 
                          alt="Shared content" 
                          className="rounded-lg max-h-60 object-contain"
                        />
                        <p className="text-xs mt-1 text-white/80 truncate">
                          {msg.file.name}
                        </p>
                      </>
                    ) : (
                      <a 
                        href={msg.file.url} 
                        download
                        className="flex items-center gap-2 hover:underline"
                      >
                        <Paperclip size={16} />
                        <span className="truncate max-w-[200px]">
                          {msg.file.name}
                        </span>
                      </a>
                    )}
                  </div>
                )}
                
                {msg.content && (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
                
                <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                  isCurrentUser ? 'text-blue-100' : 'text-gray-300'
                }`}>
                  {isToday ? (
                    new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                  ) : (
                    new Date(msg.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  )}
                  {msg.status === 'read' && <CheckCheck size={14} className="ml-1" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {file && (
        <div className="flex items-center gap-2 p-2 border-t bg-gray-800">
          {file.type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="h-20 w-auto rounded"
            />
          ) : (
            <div className="flex items-center text-sm text-white gap-2">
              <Paperclip size={16} />
              <span>{file.name}</span>
            </div>
          )}
          <button
            onClick={() => setFile(null)}
            className="text-xs text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-center p-3 border-t shrink-0">
        <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
          <Paperclip className="text-gray-500" size={20} />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />
        </label>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isUploading && handleSend()}
          placeholder="Type a message..."
          className="flex-1 mx-3 py-2 px-4 rounded-full border focus:outline-none focus:border-blue-500"
          disabled={isUploading}
        />
        <button
          onClick={handleSend}
          disabled={isUploading || (!newMessage.trim() && !file)}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;