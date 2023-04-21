import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/NavBar.css';

const NavBar = () => {
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('http://localhost:8000/account/profile/', { headers });
        setUserAvatar(response.data.avatar);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
  
    fetchUserProfile();
  }, []);
  

  const toggleMenu = () => {
    document.getElementById('subMenu').classList.toggle('open-menu');
  };

  const toggleBell = () => {
    document.getElementById('notify').classList.toggle('open-menu');
  };

  return (
    <div className="header">
      <div className="logged_nav">
        <nav>
          <Link to="/logged_main">
            <img src="images/nav_bar/web_logo.png" className="logo" alt="logo" />
          </Link>
          <ul>
            <li>
              <Link to="/stays">Explore</Link>
            </li>
            <li>
              <Link to="/listing">My reservation</Link>
            </li>
            <li>
              <Link to="/hosts">My property</Link>
            </li>
            <li>
              <img
                src="images/nav_bar/bell.png"
                className="bell"
                alt="bell"
                onClick={toggleBell}
              />
            </li>
          </ul>
          <img
            src={userAvatar || 'images/user.png'}
            className="user-pic"
            alt="user"
            onClick={toggleMenu}
          />

          {/* Other parts of the NavBar component */}
          {/* ... */}
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
