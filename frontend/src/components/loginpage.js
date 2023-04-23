import React, { useState } from 'react';
import axios from 'axios';
import './css/LoginPage.css';
import { Link } from 'react-router-dom';
import logo from './images/blue_merged_logo.jpg';
import { useNavigate } from 'react-router-dom';


// Add this prop to the function arguments
function LoginPage({ setAuthStatus }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/account/login/', {
        username: username,
        password: password,
      });

      // Handle successful login
      if (response.status === 200) {
        setError('');
        console.log('Login successful');

        // Store the access token in localStorage
        localStorage.setItem('access_token', response.data.access_token);


        // You can redirect to the main page or another route here
        navigate('/logged_main');
      }
    } catch (error) {
      setError('Invalid username or password');
    }
  };
  
  const navigate = useNavigate();
  
  return (
    <div className="container">
      <div className="form-box">
        <Link to="/">
            <img src={logo} alt="logo" className="login_logo" />
        </Link>

        <h1>Log in</h1>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <div className="input-field" id="nameField">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-field">
              <i className="fa-solid fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <br />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="btn-field">
            <button type="submit" id="signinBtn">
              <span></span>Sign In
            </button>
          </div>
        </form>
        <br />

        <p>Create new account <Link to="/signup">Sign Up</Link></p>

      </div>
    </div>
  );
}

export default LoginPage;
