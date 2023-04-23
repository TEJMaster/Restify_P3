import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/homepage';
import SignUpPage from './components/signuppage';
import LoginPage from './components/loginpage';
import LoggedMainPage from './components/loggedmainpage';
import ProfilePage from './components/profilepage';
import CommentPage from './components/commentpage';


function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logged_main" element={<LoggedMainPage />} />
          <Route path="/comment" element={<CommentPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
