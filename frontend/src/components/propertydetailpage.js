// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const PropertyDetail = (props) => {
//   const [property, setProperty] = useState(null);
//   const { name } = useParams();

//   useEffect(() => {
//     fetchProperty(name);
//   }, [name]);

//   const fetchProperty = async (name) => {
//     const response = await fetch(`http://localhost:8000/property/${name}/`);
//     if (response.ok) {
//       const data = await response.json();
//       setProperty(data); // Remove ".results[0]" from this line
//     } else {
//       console.error('Error fetching property details:', response.statusText);
//     }
//   };
  

//   if (!property) return <div>Loading...</div>;

//   return (
//     <div>
//       <h2>{property.name}</h2>
//       <p>{property.location}</p>
//       <p>Price: {property.price}</p>
//       <p>Guests: {property.guests}</p>
//       <p>Amenities: {property.amenities}</p>
//       {property.images.map((image) => (
//         <img
//           key={image.image}
//           src={image.image}
//           alt={`${property.name} property`}
//           className="property-image"
//         />
//       ))}
//     </div>
//   );
// };

// export default PropertyDetail;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/PropertyDetail.css'
import axios from 'axios';

const PropertyDetail = (props) => {
  const [property, setProperty] = useState(null);
  const { name } = useParams();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [comment, setComment] = useState('');
  const [propertyId, setPropertyId] = useState('');

  useEffect(() => {
    fetchProperty(name);
  }, [name]);

  const fetchProperty = async (name) => {
    const response = await fetch(`http://localhost:8000/property/${name}/`);
    if (response.ok) {
      const data = await response.json();
      setProperty(data);
    } else {
      console.error('Error fetching property details:', response.statusText);
    }
  };
  


  const handleCheckInChange = (e) => {
    setCheckIn(e.target.value);
  };

  const handleCheckOutChange = (e) => {
    setCheckOut(e.target.value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
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
  

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    // Implement your comment logic here
  };

  if (!property) return <div>Loading...</div>;

  return (
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
      <div className="write-review">
        <h3>Leave a Comment</h3>
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <label htmlFor="comment">Comment:</label>
          <textarea id="comment" name="comment" rows="4" onChange={handleCommentChange}></textarea>
          <button type="submit">Submit Comment</button>
        </form>
      </div>
    </div>
  );
};

export default PropertyDetail;
