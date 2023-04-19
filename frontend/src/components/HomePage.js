import React from 'react';
import './HomePage.css';
import logo from './images/logo.png'; // Import the logo
import videoSource from './images/Video.mp4'; // Import the video source

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
            <a href="home.html">HOME</a>
          </li>
          <li>
            <a href="signup.html">SIGN UP</a>
          </li>
          <li>
            <a href="signin.html">SIGN IN</a>
          </li>
        </ul>
      </nav>

      <div className="content">
        <h1>WELCOME</h1>
        <a href="properties.html">
          <span></span>SEARCH PROPERTIES
        </a>
      </div>
    </div>
  );
};

export default HomePage;
