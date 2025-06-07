import { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

function NewGroupModal({ onClose }) {
  const { allUsers, currentUser, socket } = useChat();
  const [name, setName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter users based on search term and exclude current user
  const filteredUsers = allUsers.filter(user =>
    user._id !== currentUser?._id &&
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter a group name');
      return;
    }
    if (selectedUsers.length === 0) {
      setError('Please select at least one member');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/chats/group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          participants: [...selectedUsers, currentUser._id] // Include current user
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create group');
      }
      
      const newGroup = await res.json();
      
      // Emit socket event for new group
      socket.emit('newGroup', newGroup);
      
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1e293b] text-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-400">Create New Group</h2>
          <button onClick={onClose} className="text-white hover:text-red-500 text-2xl font-semibold transition">
            &times;
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white text-sm rounded-md px-4 py-2 mb-4">
            {error}
          </div>
        )}

        {/* Group Name */}
        <div className="mb-5">
          <label className="block text-blue-300 mb-1 font-medium">Group Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter group name"
            className="w-full px-4 py-2 bg-[#334155] border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-blue-200"
          />
        </div>

        {/* Search & User List */}
        <div className="mb-5">
          <label className="block text-blue-300 mb-1 font-medium">Add Members</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full px-4 py-2 mb-4 bg-[#334155] border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-blue-200"
          />

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
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{user.name}</h4>
                    <p className="text-sm text-blue-200">{user.email}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    readOnly
                    className="form-checkbox text-blue-500 accent-blue-500 w-5 h-5"
                  />
                </div>
              ))
            ) : (
              <div className="text-blue-300 text-sm text-center">No users found</div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md transition disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className={`px-4 py-2 rounded-md font-medium transition ${
              isLoading || !name.trim() || selectedUsers.length === 0
                ? 'bg-blue-700 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            disabled={!name.trim() || selectedUsers.length === 0 || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>

  );
}

export default NewGroupModal;