import React, { useState } from 'react';
import './css/SignUpPage.css';
import logo from './images/blue_merged_logo.jpg';
import { Link, useNavigate } from 'react-router-dom';


const SignUpPage = () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      password_repeat: '',
    });
  
    const [errors, setErrors] = useState({
      username: '',
      email: '',
      password: '',
      password_repeat: '',
    });

    const navigate = useNavigate();
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const validateFormData = () => {
      const usernameRegex = /^[a-zA-Z0-9@./+-_]{1,150}$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      let isValid = true;
      let newErrors = {
        username: '',
        email: '',
        password: '',
        password_repeat: '',
      };
  
      if (!usernameRegex.test(formData.username)) {
        newErrors.username = 'Invalid username';
        isValid = false;
      }
  
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email address';
        isValid = false;
      }
  
      if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long';
        isValid = false;
      }
  
      if (formData.password !== formData.password_repeat) {
        newErrors.password_repeat = "Passwords don't match";
        isValid = false;
      }
  
      setErrors(newErrors);
      return isValid;
    };
  

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      if (!validateFormData()) {
        return;
      }
    
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
          // Redirect to the login page after successful registration
          navigate('/login');
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
    <div className="signup-container">
      <div className="login-form-box">
        <Link to="/">
            <img src={logo} alt="logo" className="login_logo" />
        </Link>

        <h1 id="title">Sign Up</h1>

        <form onSubmit={handleSubmit} className='login-form'>
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
            <div className="error-text">{errors.username}</div>

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
            <div className="error-text">{errors.email}</div>

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
            <div className="error-text">{errors.password}</div>

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
            <div className="error-text">{errors.password_repeat}</div>
          </div>
          <div className="signup-btn-field">
            <button type="submit" id="signinBtn">
              <span></span>Submit
            </button>
          </div>
        </form>
        <br />

        <p>Login to existing account <Link to="/login">Sign in</Link></p>

      </div>
    </div>
  );
};

export default SignUpPage;
