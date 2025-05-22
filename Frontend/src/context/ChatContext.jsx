import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token ? token.substring(0, 20) + '...' : 'Missing');

        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        // Initialize socket connection
        const newSocket = io('http://localhost:5000', {
          auth: {
            token: token
          },
          withCredentials: true,
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
          console.log('Socket connected successfully');
          // Register the socket with user token
          newSocket.emit('register', token);
        });

        newSocket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          setError('Failed to connect to chat server. Please check if the server is running.');
        });

        newSocket.on('error', (error) => {
          console.error('Socket error:', error);
          setError(typeof error === 'string' ? error : error.message || 'An error occurred');
        });

        newSocket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            // the disconnection was initiated by the server, you need to reconnect manually
            newSocket.connect();
          }
        });

        newSocket.on('messageSent', ({ chatId, message }) => {
          if (currentChat?._id === chatId) {
            setMessages(prev => prev.map(msg => 
              msg.timestamp === message.timestamp && msg.sender === message.sender
                ? { ...msg, _id: message._id, status: message.status }
                : msg
            ));
          }
        });

        setSocket(newSocket);

        // Fetch current user data
        console.log('Fetching user data with token:', token.substring(0, 20) + '...');
        const userRes = await fetch('http://localhost:5000/api/users/me', {
          method : "GET",
          headers: {
            'Content-Type' : "application/json",
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!userRes.ok) {
          const errorData = await userRes.json();
          console.error('Error response from /api/users/me:', errorData);
          throw new Error(errorData.message || 'Failed to fetch user data');
        }
        
        const userData = await userRes.json();
        console.log('User data received:', userData);
        setCurrentUser(userData);

        // Fetch all users
        const usersRes = await fetch('http://localhost:5000/api/users/all', {
          method : "GET",
          headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!usersRes.ok) {
          const errorData = await usersRes.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        
        const usersData = await usersRes.json();
        setAllUsers(usersData);

        // Fetch initial chats
        const chatsRes = await fetch('http://localhost:5000/api/chats/', {
          method : "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!chatsRes.ok) {
          const errorData = await chatsRes.json();
          throw new Error(errorData.message || 'Failed to fetch chats');
        }
        
        const chatsData = await chatsRes.json();
        // setChats(chatsData);
        // console.log("Chat Data : ",chats);

        setChats(prev => {
          // console.log("Setting chats with:", chats);
          return chatsData;
        });
        console.log("Setting chats with:", chats);
        setError(null);
        setLoading(false);

        // Socket event listeners
        newSocket.on('userOnline', (userId) => {
          setActiveUsers(prev => [...new Set([...prev, userId])]);
        });

        newSocket.on('userOffline', (userId) => {
          setActiveUsers(prev => prev.filter(id => id !== userId));
        });

        newSocket.on('newChat', (chat) => {
          setChats(prev => [...prev, chat]);
        });

        return () => {
          newSocket.disconnect();
        };
      } catch (error) {
        console.error('Error initializing chat:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  // In your ChatPage component
  useEffect(() => {
    if (!socket) return;

    const handleNewGroup = (newGroup) => {
      setChats(prevChats => {
        // Check if group already exists to prevent duplicates
        const exists = prevChats.some(chat => chat._id === newGroup._id);
        return exists ? prevChats : [...prevChats, newGroup];
      });
    };

    socket.on('groupCreated', handleNewGroup);

    return () => {
      socket.off('groupCreated', handleNewGroup);
    };
  }, [socket]);

  const startNewChat = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ participants: [currentUser._id, userId] })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create chat');
      }

      const newChat = await res.json();
      setChats(prev => [...prev, newChat]);
      setCurrentChat(newChat);
      setError(null);
      return newChat;
    } catch (error) {
      console.error('Error starting new chat:', error);
      setError(error.message);
      throw error;
    }
  };

  return (
    <ChatContext.Provider value={{
      socket,
      activeUsers,
      chats,
      currentChat,
      setCurrentChat,
      setChats,
      allUsers,
      currentUser,
      startNewChat,
      error,
      loading
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);