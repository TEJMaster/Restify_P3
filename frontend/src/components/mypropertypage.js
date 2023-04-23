import React from 'react';
import NavBar from './navbar';
import './css/MyPropertyPage.css';


const LoggedMainPage = () => {
  return (
    <div>
      <NavBar />
      {/* my property page content */}
      <div className="container">
        <div className="list-container">
            <div className="prop-lists">
            <p></p>
            <h1>Your Properties</h1>
            <a href="new_house.html"><button className="add-button">Add New Property</button></a>
            </div>
        </div>
      </div>
    </div>
    );
};

export default LoggedMainPage;
