import React, { useState } from 'react';
import './SignUpPage.css';
import logo from './images/blue_merged_logo.jpg';


const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_repeat: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    
  
    try {
      const response = await fetch('http://localhost:8000/account/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('User created:', data);
        // Redirect to the homepage or another page after successful registration
      } else {
        console.error('Error creating user:', data);
  
        // Handle different types of errors
        if (data.username) {
          alert(`Username error: ${data.username}`);
        }
  
        if (data.email) {
          alert(`Email error: ${data.email}`);
        }
  
        if (data.password) {
          alert(`Password error: ${data.password}`);
        }
  
        if (data.password_repeat) {
          alert(`Password repeat error: ${data.password_repeat}`);
        }
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };
  

  return (
    <div className="container">
      <div className="form-box">
        <a href="home.html">
          <img src={logo} alt="logo" className="login_logo" />
        </a>

        <h1 id="title">Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group2">
            <div className="input-field" id="nameField">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                name="username"
                placeholder="User Name"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-field">
              <i className="fa-solid fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-field">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>


            <div className="input-field">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                name="password_repeat"
                placeholder="Confirm Password"
                value={formData.password_repeat}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="btn-field">
            <button type="submit" id="signinBtn">
              <span></span>Submit
            </button>
          </div>
        </form>
        <br />
        <p>
          Login to existing account{' '}
          <a href="./login.html">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
