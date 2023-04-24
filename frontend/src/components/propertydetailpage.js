
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/PropertyDetail.css'
import axios from 'axios';
import NavBar from './navbar';

const PropertyDetail = (props) => {
  const [property, setProperty] = useState(null);
  const [comments, setComments] = useState([]);
  const { name } = useParams();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    fetchProperty(name);
  }, [name]);

  const fetchProperty = async (name) => {
    const response = await fetch(`http://localhost:8000/property/${name}/`);
    if (response.ok) {
      const data = await response.json();
      console.log('Property data:', data); // Add this line
      setProperty(data);
      fetchComments(data.id); // Check if the property name is correct
    } else {
      console.error('Error fetching property details:', response.statusText);
    }
  };
  

  const fetchComments = async (propertyId) => {
    try {
      const response = await axios.get(`http://localhost:8000/comments/view/property/${propertyId}`);
      if (response.status === 200) {
        console.log('Response data:', response.data);
        setComments(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  
  


  const handleCheckInChange = (e) => {
    setCheckIn(e.target.value);
  };

  const handleCheckOutChange = (e) => {
    setCheckOut(e.target.value);
  };



  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');
    const reservationData = {
      
      property: property.id, 
      from_date: checkIn, 
      to_date: checkOut, 
    };
    console.log('Sending reservationData:', reservationData);
    try {
      const response = await fetch('http://localhost:8000/reservation/reserve/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reservationData),
    });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Reservation created successfully:', data);
        // Show a success message or redirect the user to another page
      } else {
        console.error('Error creating reservation:', response.statusText);
        // Show an error message or handle the error
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle the error
    }
  };
  


  if (!property) return <div>Loading...</div>;

  return (
    <>
    <NavBar />
    <div className="container">
      <h2 className="prop-title">{property.name}</h2>
      <p>{property.location}</p>
      <p>Price: {property.price}</p>
      <p>Guests: {property.guests}</p>
      <p>Amenities: {property.amenities}</p>
      <p>Avaliable dates: 
        {property.from_date} - {property.to_date}
      </p>
      <div className="picture">
        {property.images.map((image) => (
          <img
            key={image.image}
            src={image.image}
            alt={`${property.name} property`}
            className="property-image"
          />
        ))}
      </div>
      <div className="reservation">
        <h3>Make a Reservation</h3>
        <form className="reservation-form" onSubmit={handleReservationSubmit}>
          <label htmlFor="checkIn">Check-in:</label>
          <input type="date" id="checkIn" name="checkIn" onChange={handleCheckInChange} />
          <label htmlFor="checkOut">Check-out:</label>
          <input type="date" id="checkOut" name="checkOut" onChange={handleCheckOutChange} />
          
          <button type="submit">Book Now</button>
        </form>
      </div>

      <div className="comment">
      <h3>Comments:</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <p>
          <strong>{comment.user}:</strong> {comment.content}

          </p>
          <p>Rating: {comment.rate} stars</p>
          <p>Created at: {comment.created_at}</p>
        </div>
      ))}
    </div>
    </div>
    </>
  );
};

export default PropertyDetail;
