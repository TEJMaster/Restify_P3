import React from 'react';
import './HomePage.css';
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
            <a href="#">HOME</a>
          </li>
          <li>
            <Link to="/signup">SIGN UP</Link>
          </li>
          <li>
            <a href="#">SIGN IN</a>
          </li>
        </ul>
      </nav>

      <div className="content">
        <h1>WELCOME</h1>
        <a href="#">
          <span></span>SEARCH PROPERTIES
        </a>
      </div>
    </div>
  );
};

export default HomePage;
