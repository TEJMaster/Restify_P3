import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from './navbar';
import './css/UpdateProperty.css';

const UpdateProperty = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [propertyImages, setPropertyImages] = useState([]);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    const response = await fetch(`http://localhost:8000/property/update/${name}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setProperty(data);
      setPropertyImages(data.images);
    } else {
      console.error('Error fetching property:', response.statusText);
    }
  };

const handleImageDelete = async (imageId) => {
    try {
      const response = await fetch(`http://localhost:8000/property/image/${imageId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        // Remove the image from the property images state
        setPropertyImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
      } else {
        console.error('Error deleting image:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const authToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://localhost:8000/property/update/${name}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate('/my_property');
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

  if (!property) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <NavBar />
      <div className="UpdateProperty">
        <h1>Update Property</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="label-input">
              <label htmlFor="owner_first_name">Owner First Name:</label>
              <input type="text" id="owner_first_name" name="owner_first_name" defaultValue={property.owner_first_name} required />
            </div>

            <div className="label-input">
              <label htmlFor="owner_last_name">Owner Last Name:</label>
              <input type="text" id="owner_last_name" name="owner_last_name" defaultValue={property.owner_last_name} required />
            </div>

            <div className="label-input">
              <label htmlFor="location">Property Address:</label>
              <input type="text" id="location" name="location" defaultValue={property.location} required />
            </div>

            <div className="label-input">
              <label htmlFor="guests">Number of Guests:</label>
              <input type="number" id="guests" name="guests" defaultValue={property.guests} required />
            </div>

            <div className="label-input">
              <label htmlFor="number_of_bedrooms">Number of Bedrooms:</label>
              <input type="number" id="number_of_bedrooms" name="number_of_bedrooms" defaultValue={property.number_of_bedrooms} required />
            </div>

            <div className="label-input">
              <label htmlFor="number_of_washrooms">Number of Washrooms:</label>
              <input type="number" id="number_of_washrooms" name="number_of_washrooms" defaultValue={property.number_of_washrooms} required />
            </div>

            <div className="label-input">
              <label htmlFor="contact_number">Contact Number:</label>
              <input type="tel" id="contact_number" name="contact_number" defaultValue={property.contact_number} required />
            </div>

            <div className="label-input">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" defaultValue={property.email} required />
            </div>

            <div className="label-input">
              <label htmlFor="from_date">From Date:</label>
              <input
                type="date"
                id="from_date"
                name="from_date"
                defaultValue={property.from_date}
                ref={startDateRef}
                onChange={validateDates}
                required
              />
            </div>

            <div className="label-input">
              <label htmlFor="to_date">To Date:</label>
              <input
                type="date"
                id="to_date"
                name="to_date"
                defaultValue={property.to_date}
                ref={endDateRef}
                onChange={validateDates}
                required
              />
            </div>
            
            <div className="property-images">
              {propertyImages.map((image) => (
                <div key={image.id} className="property-image">
                  <img src={image.image} alt="property" />
                  <button onClick={() => handleImageDelete(image.id)}>Delete</button>
                </div>
              ))}
            </div>


            <div className="label-input">
              <label htmlFor="images">Upload Images:</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                name="images"
                multiple
                onChange={validateImages}
              />
            </div>

            <div className="label-input">
              <label htmlFor="amenities">Amenities:</label>
              <input type="text" id="amenities" name="amenities" defaultValue={property.amenities} required />
            </div>

            <div className="label-input">
              <label htmlFor="price">Price:</label>
              <input type="number" id="price" name="price" defaultValue={property.price} required />
            </div>
          </div>

          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit">Update Property</button>
        </form>
      </div>
    </>
  );
};

export default UpdateProperty;
