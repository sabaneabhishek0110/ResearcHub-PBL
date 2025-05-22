// import { useState, useEffect, useRef } from 'react';
// import { useChat } from '../context/ChatContext';

// function ChatWindow() {
//   const { socket, currentChat, currentUser, activeUsers } = useChat();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const [file, setFile] = useState(null);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     if (!currentChat) return;
    
//     // Load messages
//     const fetchMessages = async () => {
//       try {
//         const res = await fetch(`/api/chats/${currentChat._id}/messages`);
//         const data = await res.json();
//         setMessages(data);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };
//     fetchMessages();

//     // Socket listeners
//     socket?.on('newMessage', (incoming) => {
//       if (incoming.chatId === currentChat._id) {
//         setMessages(prev => [...prev, incoming.message]);
//       }
//     });

//     return () => {
//       socket?.off('newMessage');
//     };
//   }, [currentChat, socket]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSend = async () => {
//     if (!newMessage.trim() && !file) return;

//     try {
//       // Upload file if exists
//       let fileData = null;
//       if (file) {
//         const formData = new FormData();
//         formData.append('file', file);
//         const res = await fetch('/api/upload', {
//           method: 'POST',
//           body: formData
//         });
//         fileData = await res.json();
//       }

//       // Send via socket
//       socket.emit('sendMessage', {
//         chatId: currentChat._id,
//         content: newMessage,
//         file: fileData
//       });

//       // Optimistic update
//       setMessages(prev => [...prev, {
//         sender: currentUser._id,
//         content: newMessage,
//         file: fileData,
//         timestamp: new Date(),
//         status: 'sent'
//       }]);

//       setNewMessage('');
//       setFile(null);
//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   if (!currentChat) {
//     return (
//       <div className="no-chat-selected">
//         <img src="/whatsapp-logo.png" alt="WhatsApp" />
//         <h3>Select a chat to start messaging</h3>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         <div className="chat-title">
//           <h3>
//             {currentChat.isGroup 
//               ? currentChat.name 
//               : currentChat.participants[0].name}
//           </h3>
//           <span className="online-status">
//             {currentChat.isGroup 
//               ? `${currentChat.participants.length} members`
//               : activeUsers.includes(currentChat.participants[0]._id) 
//                 ? 'Online' 
//                 : 'Offline'}
//           </span>
//         </div>
//       </div>

//       <div className="messages">
//         {messages.map((msg, index) => (
//           <div 
//             key={index} 
//             className={`message ${msg.sender === currentUser._id ? 'sent' : 'received'}`}
//           >
//             {msg.file && (
//               msg.file.type.startsWith('image/') ? (
//                 <img 
//                   src={msg.file.url} 
//                   alt="Shared content" 
//                   className="message-file"
//                 />
//               ) : (
//                 <a 
//                   href={msg.file.url} 
//                   download
//                   className="message-file"
//                 >
//                   <i className="fas fa-file"></i> {msg.file.name}
//                 </a>
//               )
//             )}
//             <p>{msg.content}</p>
//             <span className="timestamp">
//               {new Date(msg.timestamp).toLocaleTimeString([], { 
//                 hour: '2-digit', 
//                 minute: '2-digit' 
//               })}
//               {msg.status === 'read' && <i className="fas fa-check-double"></i>}
//             </span>
            
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="message-input">
//         <label className="file-input">
//           <i className="fas fa-paperclip"></i>
//           <input
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//             style={{ display: 'none' }}
//           />
//         </label>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//           placeholder="Type a message..."
//         />
//         <button onClick={handleSend}>
//           <i className="fas fa-paper-plane"></i>
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;



import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { Paperclip, Send, CheckCheck,Users,User } from 'lucide-react';

function ChatWindow() {
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
        const res = await fetch(`http://localhost:5000/api/chats/${currentChat._id}/messages`, {
          method : "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type' : 'application/json',
          }
        });
        if (!res.ok) {
          const text = await res.text(); // Get the actual response
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
        const res = await fetch('/api/upload', {
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
        sender: currentUser._id,  // Make sure to include sender
        isGroup: currentChat.isGroup,
        file: fileData,
        timestamp: new Date()
      };

      socket.emit('sendMessage', messageData);

      setMessages(prev => [...prev, {
        ...messageData,
        sender: currentUser._id,
        status: 'sent',
        _id: Date.now().toString(), // temporary ID
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

  // Get other participant for 1:1 chat
  // const otherParticipant = !currentChat.isGroup 
  //   ? allUsers.find(user => 
  //       currentChat.participants.includes(user._id) && 
  //       user._id !== currentUser._id
  //     )
  //   : null;

  const otherParticipant = !currentChat.isGroup 
    ? currentChat.participants.find(p => p._id !== currentUser._id)
    : null;
  console.log("jdndussn",otherParticipant);
  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b">
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
            // <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center mr-3">
              // {/* {otherParticipant?.profilePicture?( */}
              // {/* (
              //   <User size={20}/>
              // )} */}
            // </div>
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
          
          return (
            <div 
              key={index} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                  isCurrentUser 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-gray-500 text-gray-800 rounded-tl-none'
                }`}
              >
                {currentChat.isGroup && !isCurrentUser && (
                  <p className="font-medium text-xs mb-1">
                    {sender?.name || 'Unknown'}
                  </p>
                )}
                
                {msg.file && (
                  msg.file.type.startsWith('image/') ? (
                    <img 
                      src={msg.file.url} 
                      alt="Shared content" 
                      className="rounded-lg mb-2 max-h-60 object-contain"
                    />
                  ) : (
                    <a 
                      href={msg.file.url} 
                      download
                      className="flex items-center gap-2 text-white hover:underline"
                    >
                      <Paperclip size={16} />
                      {msg.file.name}
                    </a>
                  )
                )}
                
                <p className="whitespace-pre-wrap text-white">{msg.content}</p>
                
                <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${
                  isCurrentUser ? 'text-blue-100' : 'text-gray-700'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {msg.status === 'read' && <CheckCheck size={14} className="ml-1" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex items-center p-3 border-t">
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