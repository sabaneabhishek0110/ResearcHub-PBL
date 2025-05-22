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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Group</h2>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="modal-body">
          <div className="form-group">
            <label>Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>Add Members</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="form-input"
            />
            
            <div className="users-list">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div 
                    key={user._id} 
                    className={`user-item ${selectedUsers.includes(user._id) ? 'selected' : ''}`}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <img 
                      src={user.avatar || '/default-avatar.png'} 
                      alt={user.name}
                      className="user-avatar"
                    />
                    <div className="user-info">
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      readOnly
                      className="checkbox"
                    />
                  </div>
                ))
              ) : (
                <div className="no-users">No users found</div>
              )}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="cancel-btn"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || selectedUsers.length === 0 || isLoading}
            className={`create-btn ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewGroupModal;