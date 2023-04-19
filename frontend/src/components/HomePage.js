import React from 'react';
import './HomePage.css'; // You'll create this file in the next step

const HomePage = () => {
  return (
    <div className="index_head">
      <video autoplay loop muted playsInline className="back-video">
        <source src="images/Video.mp4" type="video/mp4" />
      </video>

      <nav>
        <img src="images/logo.png" className="logo" alt="logo" />
        <ul>
          <li>
            <a href="home.html">HOME</a>
          </li>
          <li>
            <a href="signup.html">SIGN UP</a>
          </li>
          <li>
            <a href="login.html">LOG IN</a>
          </li>
        </ul>
      </nav>
      <div className="content">
        <h1>Restify</h1>
        <a href="home.html">
          <span></span>Explore your place
        </a>
      </div>
    </div>
  );
};

export default HomePage;
