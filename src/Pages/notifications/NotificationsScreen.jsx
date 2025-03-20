import React, { useEffect, useState, useContext } from 'react';
import { db } from '@/Firebase/FirebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { AuthContext } from '@/Context/UserContext';
import { Bell, Trash2, Check } from 'lucide-react';
import './NotificationsScreen.css';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const { User } = useContext(AuthContext);

  useEffect(() => {
    fetchNotifications();
  }, [User]);

  const fetchNotifications = async () => {
    try {
      const notificationRef = doc(db, "Notifications", User.uid);
      const notificationDoc = await getDoc(notificationRef);
      
      if (notificationDoc.exists()) {
        setNotifications(notificationDoc.data().messages || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "Notifications", User.uid);
      const updatedMessages = notifications.map(msg => 
        msg.id === notificationId ? { ...msg, read: true } : msg
      );
      
      await updateDoc(notificationRef, {
        messages: updatedMessages
      });
      
      setNotifications(updatedMessages);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const notificationRef = doc(db, "Notifications", User.uid);
      const messageToDelete = notifications.find(msg => msg.id === notificationId);
      
      await updateDoc(notificationRef, {
        messages: arrayRemove(messageToDelete)
      });
      
      setNotifications(notifications.filter(msg => msg.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <Bell className="text-red-600" size={24} />
        <h1>Notifications</h1>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <Bell size={48} />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.timestamp?.toDate()).toLocaleString()}
                </span>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="mark-read-btn"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(notification.id)}
                  className="delete-btn"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
