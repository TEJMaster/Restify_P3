import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ProfilePage.css';
import NavBar from './navbar';
import profileIcon from './images/nav_bar/profile.png';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    avatar: '',
    phone_number: ''
  });

  const [updateProfile, setUpdateProfile] = useState('Update Profile');
  const [editableFields, setEditableFields] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get('http://localhost:8000/account/profile/', { headers });
        const userProfile = { ...response.data, avatar: `http://localhost:8000${response.data.avatar}` };
        setProfile(userProfile);
        setEditableFields({
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          email: userProfile.email,
          phone_number: userProfile.phone_number
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const onInputChange = (e) => {
    setEditableFields({ ...editableFields, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    if (updateProfile === 'Update Profile') {
      setUpdateProfile('Save');
    } else {
      setUpdateProfile('Update Profile');
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.put('http://localhost:8000/account/profile/', editableFields, { headers });
        const updatedProfile = { ...profile, ...response.data, avatar: `http://localhost:8000${response.data.avatar}` };
        setProfile(updatedProfile);
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
  
    const formData = new FormData();
    formData.append('avatar', file);
  
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };
      const response = await axios.put('http://localhost:8000/account/profile/', formData, { headers });
      const updatedProfile = { ...profile, avatar: `http://localhost:8000${response.data.avatar}` };
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };
  
  
  const { username, email, first_name, last_name, avatar, phone_number } = profile;

  return (
    <>
      <NavBar />
      <div className="profile">
        <div className="profile_left">
          <div className="profile_image">
            <img src={avatar || profileIcon} alt="profile" className="profile_pic" />
          </div>
          <div className="profile_info">
            <h1>User Name: {username || ''}</h1>
          </div>
          <div className="profile-btn-field">
          <label htmlFor="avatarInput" className="upload-avatar-label">
            <span></span>Update Photo
          </label>
          <input
            type="file"
            id="avatarInput"
            className="avatar-input"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
        </div>
        </div>

        <div className="profile_right">
          <div className="input-group">
            <div className="input-pair">
              <p>First Name: </p>
              <input
                type="text"
                name="first_name"
                value={updateProfile === 'Save' ? editableFields.first_name : first_name}
                onChange={onInputChange}
                readOnly={updateProfile !== 'Save'}
              />
            </div>
            <div className="input-pair">
              <p>Last Name: </p>
              <input
                type="text"
                name="last_name"
                value={updateProfile === 'Save' ? editableFields.last_name : last_name}
                onChange={onInputChange}
                readOnly={updateProfile !== 'Save'}
              />
            </div>

            <div className="input-pair">
              <p>Email: </p>
              <input
                type="email"
                name="email"
                value={updateProfile === 'Save' ? editableFields.email : email}
                onChange={onInputChange}
                readOnly={updateProfile !== 'Save'}
              />
            </div>

            <div className="input-pair">
              <p>Phone number: </p>
              <input
                type="text"
                name="phone_number"
                value={updateProfile === 'Save' ? editableFields.phone_number : phone_number}
                onChange={onInputChange}
                readOnly={updateProfile !== 'Save'}
              />
            </div>
          </div>

          <div className="profile-btn-field">
            <button type="button" id="signinBtn" onClick={handleUpdateProfile}>
              <span></span>{updateProfile}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
