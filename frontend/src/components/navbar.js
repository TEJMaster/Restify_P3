import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/NavBar.css';
import logo from './images/nav_bar/web_logo.png';
import bellIcon from './images/nav_bar/bell.png';
import defaultUserAvatar from './images/user.png';
import profileIcon from './images/nav_bar/profile.png';
import messageIcon from './images/nav_bar/message.png';
import logoutIcon from './images/nav_bar/logout.png';

const NavBar = () => {
  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('http://localhost:8000/account/profile/', { headers });
        setUserAvatar(`http://localhost:8000${response.data.avatar}`);
        setUserName(response.data.username);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="header">
      <div className="logged_nav">
        <nav className="nav-bar">
          <Link to="/logged_main">
            <img src={logo} className="logo" alt="logo" />
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
                src={bellIcon}
                className="bell"
                alt="bell"
              />
            </li>
          </ul>
          <img
            src={userAvatar || defaultUserAvatar}
            className="user-pic"
            alt="user"
            onClick={toggleDropdown} />

          {isDropdownOpen && (
            <div className={`sub-menu-wrap${isDropdownOpen ? " open" : ""}`}>
              <div className="sub-menu">
                <div className="user-info">
                  <img src={userAvatar || defaultUserAvatar} alt="user" />
                  <h3>{userName}</h3>
                </div>
                <hr />

                <Link to="/profile" className="sub-menu-link">
                  <img src={profileIcon} alt="edit-profile" />
                  <p>Edit Profile</p>
                </Link>
                <Link to="/comments" className="sub-menu-link">
                  <img src={messageIcon} alt="comments" />
                  <p>Comments</p>
                </Link>
                <Link to="/home" className="sub-menu-link">
                  <img src={logoutIcon} alt="logout" />
                  <p>Logout</p>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
