import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from './notification.js';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const headers = { Authorization: `Bearer ${localStorage.getItem('access_token')}` };
        const response = await axios.get('http://localhost:8000/notifications/view/', { headers });
        console.log(response.data); // Add this line to inspect the response data
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-list">
      {Array.isArray(notifications) && notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationList;