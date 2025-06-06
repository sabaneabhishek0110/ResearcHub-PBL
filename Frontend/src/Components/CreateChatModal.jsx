import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

const CreateChatModal = ({ onClose }) => {
  const { allUsers, currentUser, socket } = useChat();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = "https://researchub-pbl.onrender.com";

  const filteredUsers = allUsers.filter(user =>
    user._id !== currentUser?._id &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUserSelect = (userId) => {
    setSelectedUserId(prev => prev === userId ? '' : userId);
  };

  const handleCreateChat = async () => {
    if (!selectedUserId) {
      setError('Please select a user to start chat with.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/chats/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          participant: selectedUserId
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to start chat');
      }

      const newChat = await response.json();
      // socket?.emit('newPrivateChat', newChat);

      onClose();
    } catch (error) {
      console.error('Error creating chat:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-opacity-60 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1e293b] text-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400">Start New Chat</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-red-500 transition"
          >
            &times;
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-600 text-white text-sm rounded-md px-4 py-2 mb-4">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-5">
          <label className="block text-blue-300 mb-1 font-medium">
            Search Users
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-[#334155] border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-blue-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email"
          />
        </div>

        {/* User List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`flex items-center gap-4 p-3 rounded-md cursor-pointer transition duration-200 border ${
                  selectedUserId === user._id
                    ? 'bg-blue-700 border-blue-500'
                    : 'bg-[#1e293b] hover:bg-blue-900 border-gray-700'
                }`}
                onClick={() => handleUserSelect(user._id)}
              >
                <img
                  src={user.profilePicture || 'https://via.placeholder.com/40'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-sm text-blue-200">{user.email}</div>
                </div>
                {selectedUserId === user._id && (
                  <i className="fas fa-check text-green-400 text-xl"></i>
                )}
              </div>
            ))
          ) : (
            <div className="text-blue-300 text-sm text-center">No users found</div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition disabled:opacity-50"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition ${
              isLoading || !selectedUserId
                ? 'bg-blue-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            onClick={handleCreateChat}
            disabled={isLoading || !selectedUserId}
          >
            {isLoading ? 'Starting...' : 'Start Chat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;
