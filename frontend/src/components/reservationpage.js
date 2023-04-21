import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ReservationPage.css';
import './css/NavBar.css';

const ReservationPage = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showCancellationSubmitted, setShowCancellationSubmitted] = useState(false);
    const [reservationIdToCancel, setReservationIdToCancel] = useState(null);

    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/reservation/');
  
        // Handle successful fetch
        if (response.status === 200) {
          setReservations(response.data.results);
        }
      } catch (error) {
        setError('Error fetching reservations');
      }
    };
  
    useEffect(() => {
      fetchReservations();
    }, []);
    
    function handleCancelClick(reservationId) {
      setReservationIdToCancel(reservationId);
      setShowConfirmation(true);
    }

    async function handleCancelConfirmation(reservationId) {
      try {
        const response = await axios.get(
          `http://localhost:8000/reservation/cancel/${reservationId}/`
        );
    
        if (response.status === 200) {
          setShowConfirmation(false);
          setShowCancellationSubmitted(true);
        }
      } catch (error) {
        console.error("Error canceling reservation:", error);
      }
      
    }

    function ConfirmPopup({ message, reservationId, onYes, onClose }) {
      return (
        <div className="popup-container">
          <div className="popup">
            <p>{message}</p>
            <button onClick={() => onYes(reservationId)}>Yes</button>
            {onClose && <button onClick={onClose}>No</button>}
          </div>
        </div>
      );
    }

    function FinishPopup({ message, onClose }) {
      return (
        <div className="popup-container">
          <div className="popup">
            <p>{message}</p>
            {onClose && <button onClick={onClose}>Close</button>}
          </div>
        </div>
      );
    }

  return (
    
    <div className="reservation-page">
            <nav className="navbar">
              <a href="/">Home</a>
              <a href="/reservations">My Reservations</a>
            </nav>
        <section className="banner">
        <div className="banner-image"></div>
        <div className="banner-text">
            <h1>Find your perfect stay</h1>
            <p>Explore our collection of amazing properties.</p>
            <a href="stays.html" className="button">
                Get started
            </a>
  </div>
        </section>
        <section className="my-stays">
        <h2>My Reservations</h2>
        {reservations.map((reservation) => (
      <div key={reservation.id} className="stay">
        <img src={reservation.property.image} alt={reservation.property.name} className="stay-image" />
        <div className="stay-details">
          <h3>{reservation.property.name}</h3>
          <p>
            Date: {reservation.from_date} - {reservation.to_date}
          </p>
          <p>
            Price: {reservation.property.price}
          </p>
        </div>
          <div className="button-state-container">
            <button className="cancel-button" onClick={() => handleCancelClick(reservation.id)}>Cancel</button>
            <p className="reservation-state">{reservation.state}</p>
          </div>

        {showConfirmation && (
            <ConfirmPopup
            reservationId={reservationIdToCancel}
            message="Are you sure you want to cancel this reservation?"
            onYes={handleCancelConfirmation}
            onClose={() => setShowConfirmation(false)}
          />
        )}

        {showCancellationSubmitted && (
          <FinishPopup
          message="Your cancellation request has been submitted, please wait for the property owner to confirm."
          onClose={() => setShowCancellationSubmitted(false)}
          />
        )}
      </div>
      
      ))}

        </section>
    </div>
  );
};

export default ReservationPage;
