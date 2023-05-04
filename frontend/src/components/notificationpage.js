import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/NotificationPage.css';
import NavBar from './navbar';


const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const fetchNotifications = async (url = '{BASE_URL}/notifications/view/') => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(url, { headers });

      setNotifications(response.data.results);
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleClearNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete('{BASE_URL}/notifications/clear/', { headers });

      fetchNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const handlePagination = async (url) => {
    if (url) {
      fetchNotifications(url);
    }
  };

  return (
    <div className="notification-page">
      <NavBar />
      <h1>Notifications</h1>
      <div className="notification-list">
        {notifications.map((notification) => (
          <div key={notification.id} className={`notification-item${notification.is_read ? ' read' : ''}`}>
            <p>{notification.content}</p>
            <span className="notification-time">{new Date(notification.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="pagination-buttons">
        <button onClick={() => handlePagination(previousPage)} disabled={!previousPage}>
          Previous
        </button>
        <button onClick={() => handlePagination(nextPage)} disabled={!nextPage}>
          Next
        </button>
      </div>
      <button onClick={handleClearNotifications} className="clear-notifications">
        Clear Notifications
      </button>
    </div>
  );
};

export default NotificationPage;
