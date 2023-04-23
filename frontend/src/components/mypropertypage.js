import React from 'react';
import NavBar from './navbar';
import './css/MyPropertyPage.css';
import { Link } from 'react-router-dom';


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
            <Link to="/create_property"><button className="add-button">Add New Property</button></Link>
            </div>
        </div>
      </div>
    </div>
    );
};

export default LoggedMainPage;
