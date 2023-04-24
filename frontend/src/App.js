import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/homepage';
import SignUpPage from './components/signuppage';
import LoginPage from './components/loginpage';
import LoggedMainPage from './components/loggedmainpage';
import ProfilePage from './components/profilepage';
import ReservationPage from './components/reservationpage';
import MyPropertyPage from './components/mypropertypage';
import CreateProperty from './components/createpropertypage';
import PropertyCommentPage from './components/propertycomment';
import HostCommentPage from './components/hostcomment';
import PropertyDetail from './components/propertydetailpage';


function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logged_main" element={<LoggedMainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/my_property" element={<MyPropertyPage />} />
          <Route path="/create_property" element={<CreateProperty />} />
          <Route path="/comment_property/:propertyName" element={<PropertyCommentPage />} />
          <Route path="/comment_user/:targetUsername" element={<HostCommentPage />} />
          <Route path="/property/:name" element={<PropertyDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
