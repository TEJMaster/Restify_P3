import React from 'react';
import './css/Notification.css';

const Notification = ({ notification }) => {
  return (
    <div className="notification-item">
      <h4>{notification.title}</h4>
      <p>{notification.content}</p>
    </div>
  );
};

export default Notification;
