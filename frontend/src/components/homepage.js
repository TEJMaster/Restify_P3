import React from 'react';
import './css/HomePage.css';
import { Link } from 'react-router-dom';
import logo from './images/logo.png'; 
import videoSource from './images/Video.mp4'; 

const HomePage = () => {
  return (
    <div className="index_head">
      <video autoPlay loop muted playsInline className="back-video">
        <source src={videoSource} type="video/mp4" />
      </video>

      <nav>
        <img src={logo} className="logo" alt="logo" />
        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/signup">SIGN UP</Link>
          </li>
          <li>
            <Link to="/login">SIGN IN</Link>
          </li>
        </ul>
      </nav>

      <div className="content">
        <h1>WELCOME</h1>
        <Link to="/">
          <span></span>SEARCH PROPERTIES
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
