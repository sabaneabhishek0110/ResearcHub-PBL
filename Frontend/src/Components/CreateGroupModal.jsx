import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';


const CreateGroupModal = ({ onClose }) => {
  const { allUsers, currentUser, socket } = useChat();
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = "https://researchub-pbl.onrender.com"


  // Filter users based on search term and exclude current user
  const filteredUsers = allUsers.filter(user =>
    user._id !== currentUser?._id &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }
    if (selectedUsers.length < 2) {
      setError('Please select at least 2 members for the group');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/chats/group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: groupName,
          participants: [...selectedUsers, currentUser._id] // Include current user in participants
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create group');
      }

      // const newGroup = await response.json();
      
      // Emit socket event for new group
      // socket?.emit('newGroup', newGroup);
      
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm  bg-opacity-60 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1e293b] text-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400">Create New Group</h2>
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

        {/* Group Name */}
        <div className="mb-5">
          <label className="block text-blue-300 mb-1 font-medium">
            Group Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 bg-[#334155] border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-blue-200"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
          />
        </div>

        {/* Search */}
        <div className="mb-5">
          <label className="block text-blue-300 mb-1 font-medium">
            Search Members
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
                  selectedUsers.includes(user._id)
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
                {selectedUsers.includes(user._id) && (
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
              isLoading || !groupName.trim() || selectedUsers.length < 2
                ? 'bg-blue-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            onClick={handleCreateGroup}
            disabled={isLoading || !groupName.trim() || selectedUsers.length < 2}
          >
            {isLoading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>

  );
};

export default CreateGroupModal; 