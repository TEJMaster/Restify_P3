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
    const [userId, setUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [tempSelectedAmenities, setTempSelectedAmenities] = useState([]);



    function handleAmenityChange(e) {
      const amenityId = parseInt(e.target.value);
      if (e.target.checked) {
        setTempSelectedAmenities([...tempSelectedAmenities, amenityId]);
      } else {
        setTempSelectedAmenities(tempSelectedAmenities.filter((id) => id !== amenityId));
      }
    }
    
    function handleFilterConfirm() {
      setSelectedAmenities(tempSelectedAmenities);
    }

    const fetchReservations = async (page = 1) => {
      try {
        const response = await axios.get(`http://localhost:8000/reservation/?amenities=${selectedAmenities.join(',')}&page=${page}`);
  
        // Handle successful fetch
        if (response.status === 200) {

          // const userReservations = response.data.results.filter(
          //   (reservation) => reservation.user === userId
          // );

          const userReservations = response.data.results;
          setReservations(userReservations);
          setTotalPages(Math.ceil(response.data.count / response.data.page_size));
        }
      } catch (error) {
        setError('Error fetching reservations');
      }
    };
  
    useEffect(() => {
      fetchReservations();
    }, [selectedAmenities]);
    
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

    function handlePaginationClick(newPage) {
      setCurrentPage(newPage);
      fetchReservations(newPage);
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

          <section className="filter-bar">
      <div className="ticks">
        <h2>Filter</h2>
        <h3>Property Type</h3>
        <div className="filter">
          <input type="checkbox" /> <p>House</p>
        </div>
        <div className="filter">
          <input type="checkbox" /> <p>Hostel</p>
        </div>
        <div className="filter">
          <input type="checkbox" /> <p>Condo</p>
        </div>

        <h3>Amenities</h3>
        <div className="filter">
          <input type="checkbox" /> <p>Wifi</p>
        </div>
        <div className="filter">
          <input type="checkbox" /> <p>Tub</p>
        </div>
        <div className="filter">
          <input type="checkbox" /> <p>Balcony</p>
        </div>
        <div className="filter">
          <input type="checkbox" /> <p>Kitchen</p>
        </div>
      </div>
    </section>

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
      


      <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => handlePaginationClick(page)}
        >
          {page}
        </button>
      ))}
    </div>
    </div>

    
  );
};

export default ReservationPage;
