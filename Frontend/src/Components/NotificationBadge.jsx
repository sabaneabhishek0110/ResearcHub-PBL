import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, AlertCircle, UserPlus, GitPullRequest } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function NotificationBadge({customFilter = {} }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = `http://localhost:5000/api/notification/unreadCount`;
      
      // Add custom filters if provided
      if (Object.keys(customFilter).length > 0) {
        const params = new URLSearchParams(customFilter);
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch unread count");
      const data = await response.json();
      setUnreadCount(data.count);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch unread notifications count", error);
      toast.error(error.message);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      let url = `http://localhost:5000/api/notification/user`;
      
      // Add custom filters if provided
      if (Object.keys(customFilter).length > 0) {
        const params = new URLSearchParams(customFilter);
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      toast.error(error.message);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/notifications/markAsRead/${notificationId}`, 
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error("Failed to mark as read");
      
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      toast.error(error.message);
    }
  };
  
  const handleAction = async (notification, action) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/notification/handleAction/${notification._id}`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ action })
        }
      );
      
      if (!response.ok) throw new Error("Failed to process action");
      
      // Update local state
      setNotifications(notifications.filter(n => n._id !== notification._id));
      setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
      toast.success(`Request ${action === 'approve' ? 'approved' : 'rejected'}`);
    } catch (error) {
      console.error("Failed to process notification action", error);
      toast.error(error.message);
    }
  };
  
  useEffect(() => {
    // if (userId) {
      fetchUnreadCount();
      fetchNotifications();
      
      const interval = setInterval(() => {
        fetchUnreadCount();
        fetchNotifications();
      }, 30000);
      
      return () => clearInterval(interval);
    // }
  }, [customFilter]);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    // Handle navigation based on notification type
    switch(notification.type) {
      case 'team_request':
        navigate(`/teams/${notification.relatedTeam}/requests`);
        break;
      case 'task_assignment':
        navigate(`/tasks/${notification.relatedTask}`);
        break;
      case 'task_update':
        navigate(`/tasks/${notification.relatedTask}`);
        break;
      case 'stage_update':
        navigate(`/tasks/${notification.relatedTask}?stage=${notification.relatedStage}`);
        break;
      default:
        // Default action
    }
    
    setShowNotifications(false);
  };
  
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'team_request':
        return <UserPlus size={16} className="text-blue-400" />;
      case 'task_assignment':
        return <Check size={16} className="text-green-400" />;
      case 'task_update':
        return <AlertCircle size={16} className="text-yellow-400" />;
      case 'stage_update':
        return <GitPullRequest size={16} className="text-purple-400" />;
      case 'stage_update_response':
        return <GitPullRequest size={16} className="text-indigo-400" />;
      default:
        return <Bell size={16} className="text-gray-400" />;
    }
  };
  
  const getActionButtons = (notification) => {
    switch(notification.type) {
      case 'team_request':
        return (
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(notification, 'approve');
              }}
              className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
            >
              Approve
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(notification, 'reject');
              }}
              className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
            >
              Reject
            </button>
          </div>
        );
      case 'stage_update':
        return (
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(notification, 'approve');
              }}
              className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 rounded"
            >
              Approve
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(notification, 'reject');
              }}
              className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 rounded"
            >
              Reject
            </button>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="relative">
      <div 
        className="relative cursor-pointer"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={24} className="text-gray-400 hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700">
          <div className="p-3 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-medium text-white">Notifications</h3>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-400 text-sm">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (!notification.isRead && (
                <div 
                key={notification._id}
                  className={`p-3 hover:bg-gray-700 cursor-pointer ${!notification.isRead ? 'bg-gray-750' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-white">
                          {notification.message}
                        </p>
                        {!notification.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                      {getActionButtons(notification)}
                    </div>
                  </div>
                </div>
              )
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBadge;