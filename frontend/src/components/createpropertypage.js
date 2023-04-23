import React, { useRef }from 'react';
import NavBar from './navbar';
import './css/CreatePropertyPage.css';
import { useNavigate } from 'react-router-dom';

const CreatePropertyPage = () => {
    const navigate = useNavigate();
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const authToken = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://localhost:8000/property/create/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authToken}` // Add the Authorization header with the token
          },
        body: formData,
      });

      if (response.ok) {
        // Navigate to the desired page after successful submission
        navigate('/my_property'); // Update '/your-desired-page' with the correct path
      } else {
        console.error('Error submitting form:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const validateImages = (e) => {
    if (e.target.files.length < 3) {
      e.target.setCustomValidity('You must upload at least 3 images.');
    } else {
      e.target.setCustomValidity('');
    }
  };
  
  const validatePropertyName = async (e) => {
    const value = e.target.value;
  
    // Simulated API call to check if the property name is unique
    const checkUniquePropertyName = async (propertyName) => {
      // Replace this with a real API call to your backend
      const response = await fetch(`http://localhost:8000/property/check_unique_name/${propertyName}/`);
      if (response.ok) {
        const data = await response.json();
        return data.is_unique;
      }
      return false;
    };
  
    const isUnique = await checkUniquePropertyName(value);
    if (!isUnique) {
      e.target.setCustomValidity('Property name must be unique');
    } else {
      e.target.setCustomValidity('');
    }
  };
  

  const validateDates = () => {
    const currentDate = new Date();
    const startDate = new Date(startDateRef.current.value);
    const endDate = new Date(endDateRef.current.value);
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    if (startDate < today || endDate < today) {
      startDateRef.current.setCustomValidity('Start and end dates must be later than today');
      endDateRef.current.setCustomValidity('Start and end dates must be later than today');
    } else {
      startDateRef.current.setCustomValidity('');
      endDateRef.current.setCustomValidity('');
    }

    if (endDate <= startDate) {
      endDateRef.current.setCustomValidity('End date must be later than the start date');
    } else {
      endDateRef.current.setCustomValidity('');
    }
  };

  return (
    <div className="main-container">
      <NavBar />
      {/* Main page content */}
      <div className="house">
      <form onSubmit={handleSubmit} className="form-container">
      <div className="btn-field">
          <div className="input-group">
            <div className="input-pair">
              <p> Property Name: </p>
              <div className="input-field" style={{ width: '190%' }}>
                <i className="fa-solid fa-location"></i>
                <input type="text" name="name" required onBlur={validatePropertyName} />
              </div>
            </div>
            <div className="input-pair">
              <p>Owner First Name: </p>
              <div className="input-field">
                <i className="fa-solid fa-edit"></i>
                <input type="text" name="owner_first_name" required/>
              </div>
              <p>Owner Last Name: </p>
              <div className="input-field">
                <i className="fa-solid fa-edit"></i>
                <input type="text" name="owner_last_name" required/>
              </div>
            </div>

            <div className="input-pair">
              <p> Property Address: </p>
              <div className="input-field" style={{ width: '190%' }}>
                <i className="fa-solid fa-location"></i>
                <input type="text" name="location" required/>
              </div>
            </div>

            <div className="input-pair">
              <p>Number of Guests: </p>
              <div className="input-field">
                <i className="fa-solid fa-question"></i>
                <input type="number" name="guests" required/>
              </div>
            </div>

            <div className="input-pair">
              <p>Number of Bedrooms: </p>
              <div className="input-field">
                <i className="fa-solid fa-question"></i>
                <input type="number" name="number_of_bedrooms" required/>
              </div>
              <p>Number of Washrooms:: </p>
              <div className="input-field">
                <i className="fa-solid fa-question"></i>
                <input type="number" name="number_of_washrooms" required/>
              </div>
            </div>

            <div className="input-pair">
              <p>Contact Number: </p>
              <div className="input-field" style={{ width: '190%' }}>
                <i className="fa-solid fa-phone"></i>
                <input type="tel" name="contact_number" required/>
              </div>
            </div>


            <div className="input-pair">
              <p>Email: </p>
              <div className="input-field" style={{ width: '190%' }}>
                <i className="fa-solid fa-envelope"></i>
                <input type="email" name="email" required/>
              </div>
            </div>

            <div className="input-pair">
                <p>From Date: </p>
                <div className="input-field">
                    <i className="fa-solid fa-calendar"></i>
                    <input type="date" name="from_date" required ref={startDateRef} onChange={validateDates} />
                </div>
                <p>To Date: </p>
                <div className="input-field">
                    <i className="fa-solid fa-calendar"></i>
                    <input type="date" name="to_date" required ref={endDateRef} onChange={validateDates} />
                </div>
            </div>
            <div className="input-pair">
                <p>Upload Images: </p>
                <div className="input-field" style={{ width: '190%' }}>
                <i className="fa-solid fa-image"></i>
                <input
                    type="file"
                    accept="image/*"
                    name="images"
                    multiple
                    required
                    onChange={validateImages}
                    />
                </div>
            </div>
          <div className="input-pair">
            <p>Amenities: </p>
            <div className="input-field" style={{ width: '190%' }}>
              <i className="fa-solid fa-check"></i>
              <input type="text" name="amenities" required/>
            </div>
          </div>

          <div className="input-pair">
            <p>Price: </p>
            <div className="input-field">
              <i className="fa-solid fa-dollar"></i>
              <input type="number" name="price" required/>
            </div>
          </div>
        </div>
            <button
              type="button"
              onClick={handleCancel}
            >
              <span></span>Cancel
            </button>
            </div>
            <button type="submit" id="signinBtn">
              <span></span>Create Property
            </button>
            
        </form>
        </div>
    </div>
  );
};

export default CreatePropertyPage;
