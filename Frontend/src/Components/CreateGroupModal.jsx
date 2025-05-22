import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';

const CreateGroupModal = ({ onClose }) => {
  const { allUsers, currentUser, socket } = useChat();
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch('http://localhost:5000/api/chats/group', {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Group</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Group Name</label>
            <input
              type="text"
              className="form-input"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>

          <div className="form-group">
            <label>Search Members</label>
            <input
              type="text"
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
            />
          </div>

          <div className="users-list">
            {filteredUsers.map(user => (
              <div
                key={user._id}
                className={`user-item ${selectedUsers.includes(user._id) ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user._id)}
              >
                <div className="user-avatar">
                  <img src={user.profilePicture || 'https://via.placeholder.com/40'} alt={user.name} />
                </div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
                <div className="user-select">
                  {selectedUsers.includes(user._id) && (
                    <i className="fas fa-check"></i>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className={`create-btn ${isLoading ? 'loading' : ''}`}
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