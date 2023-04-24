import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/PropertyDetail.css';
import axios from 'axios';
import NavBar from './navbar';

const PropertyDetail = (props) => {
  const [property, setProperty] = useState(null);
  const [comments, setComments] = useState([]);
  const { name } = useParams();
  const [errorMessage, setErrorMessage] = useState('');

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    fetchProperty(name);
  }, [name]);

  useEffect(() => {
    if (property) {
      fetchComments(property.id, currentPage);
    }
  }, [property, currentPage]);

  const fetchProperty = async (name) => {
    const response = await fetch(`http://localhost:8000/property/${name}/`);
    if (response.ok) {
      const data = await response.json();
      console.log('Property data:', data);
      setProperty(data);
    } else {
      console.error('Error fetching property details:', response.statusText);
    }
  };

  const fetchComments = async (propertyId, page) => {
    try {
      const response = await axios.get(`http://localhost:8000/comments/view/property/${propertyId}?page=${page}`);
      if (response.status === 200) {
        console.log('Response data:', response.data);
        setComments(response.data.results);
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      setCurrentPage(currentPage - 1);
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
        // const data = await response.json();
        // console.log('Reservation created successfully:', data);
        navigate('/reservation');
      } else {
        const errorData = await response.json();
        console.error('Error creating reservation:', response.statusText, errorData);
        setErrorMessage('Reservation failed, please check your dates and Logged in status');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Reservation failed');
    }
  };
  
  


  if (!property) return <div>Loading...</div>;

  return (
    <>
    <NavBar />
    <div className="container">
      <h2 className="prop-title">{property.name}</h2>
      <p>Location: {property.location}</p>
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
      
      <div class="list-details">
            <h2>Hosted by {property.owner_first_name}</h2>
            <p>{property.guests} guest / {property.number_of_bedrooms} bed / {property.number_of_washrooms} bathroom</p>
            
            <p>Amenities: {property.amenities}</p>
            <p>Avaliable dates: {property.from_date} - {property.to_date}
            </p>
            <h4>$ {property.price} / day</h4>
      </div>
      
      
      <div className="reservation">
        <h3>Make a Reservation</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="reservation-form" onSubmit={handleReservationSubmit}>
          <div>
          <label htmlFor="checkIn">Check-in:</label>
          <input type="date" id="checkIn" name="checkIn" onChange={handleCheckInChange} />
          </div>
          <div>
          <label htmlFor="checkOut">Check-out:</label>
          <input type="date" id="checkOut" name="checkOut" onChange={handleCheckOutChange} />
          </div>
          <button type="submit">Book Now</button>
        </form>
      </div>

      <div className="comment">
        <h3>Comments:</h3>
        <div class="review-details">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <p className='comment-user'>
                  <strong>
                    {comment.user}:</strong> 
                </p>
                <h2>Reviewed on {comment.created_at}</h2>
                <p className='ratings'>Rating: {comment.rate} stars</p>
                <h4>{comment.content}</h4>
              </div>
            ))
          ) : (
            <p>No comments.</p>
          )}
        </div>
      </div>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={!prevPage}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={!nextPage}>
            Next
          </button>
        </div>
    </div>
    </>
  );
};

export default PropertyDetail;
