import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/homepage';
import SignUpPage from './components/signuppage';
import LoginPage from './components/loginpage';
import LoggedMainPage from './components/loggedmainpage';
import ProfilePage from './components/profilepage';
import Comment_property_Page from './components/propertycomment';
import HostComment_Page from './components/hostcomment';

function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logged_main" element={<LoggedMainPage />} />
          <Route path="/comment_property" element={<Comment_property_Page />} />
          <Route path="/comment_user" element={<HostComment_Page />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
