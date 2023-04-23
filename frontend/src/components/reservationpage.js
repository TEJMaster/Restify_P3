import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/ReservationPage.css';
import './css/NavBar.css';
import NavBar from './navbar';
import { Link } from 'react-router-dom';


const ReservationPage = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showCancellationSubmitted, setShowCancellationSubmitted] = useState(false);
    const [reservationIdToCancel, setReservationIdToCancel] = useState(null);
    const [userId, setUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [propertyIdToCancel, setPropertyIdToCancel] = useState(null);
    const [selectedState, setSelectedState] = useState('');
    const [houseimage, setHouseImage] = useState('');





    function handleStateFilterChange(e) {
      setSelectedState(e.target.value);
    }
    

    // const fetchReservations = async (page = 1) => {
    //   try {
    //     const response = await axios.get(`http://localhost:8000/reservation/?amenities=${selectedAmenities.join(',')}&page=${page}`);
  
    //     // Handle successful fetch
    //     if (response.status === 200) {

    //       // const userReservations = response.data.results.filter(
    //       //   (reservation) => reservation.user === userId
    //       // );

    //       const userReservations = response.data.results;
    //       setReservations(userReservations);
    //       setTotalPages(Math.ceil(response.data.count / response.data.page_size));
    //     }
    //   } catch (error) {
    //     setError('Error fetching reservations');
    //   }
    // };
  
    // useEffect(() => {
    //   fetchReservations();
    // }, [selectedAmenities]);

    useEffect(() => {
      const fetchReservations = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get('http://localhost:8000/reservation/', { headers });
    
          const tokenParts = token.split('.');
          const tokenPayload = tokenParts[1];
          const tokenPayloadJson = atob(tokenPayload);
          const tokenPayloadArray = JSON.parse(tokenPayloadJson);
    
          const UserId = tokenPayloadArray.user_id;

          
          

    
          let userReservations = response.data.results
            .filter((reservation) => reservation.user === UserId)
            .map((reservation) => {
          return {
            ...reservation,
            property: {
            ...reservation.property,
            image: `http://localhost:8000/property_images${response.data.image}`,
            },
          };
          });

    
          if (selectedState) {
            userReservations = userReservations.filter(
              (reservation) => reservation.state === selectedState
            );
          }
    
          setReservations(userReservations);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      };
    
      fetchReservations();
    }, [selectedState]);
    
    
    function handleCancelClick(reservationId, propertyId) {
      setReservationIdToCancel(reservationId);
      setPropertyIdToCancel(propertyId);
      setShowConfirmation(true);
    }
    

    async function handleCancelConfirmation(reservationId) {
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.put(`http://localhost:8000/reservation/cancel/${reservationId}/`, { property: propertyIdToCancel }, { headers });
    
        if (response.status === 200) {
          setShowConfirmation(false);
          setShowCancellationSubmitted(true);
        }
      } catch (error) {
        console.error("Error canceling reservation:", error.response.data);
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

    // function handlePaginationClick(newPage) {
    //   setCurrentPage(newPage);
    //   fetchReservations(newPage);
    // }
  
    function ReservationFilter({ selectedState, handleStateFilterChange }) {
      return (
        <div className="reservation-filter">
          <label htmlFor="state-filter">Filter by state: </label>
          <select
            id="state-filter"
            value={selectedState}
            onChange={handleStateFilterChange}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Denied">Denied</option>
            <option value="Canceled">Canceled</option>
            <option value="Terminated">Terminated</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
            <option value="Pending Cancel">Pending Cancel</option>
          </select>
        </div>
      );
    }
    

  
  return (
    
    <div className="reservation-page">
            <NavBar />
        <section className="banner">
        <div className="banner-image"></div>
        <div className="banner-text">
            <h1>Find your perfect stay</h1>
            <p>Explore our collection of amazing properties.</p>
            <Link to="/logged_main" className="button">
              Get started
            </Link>

  </div>
        </section>
        <section className="my-stays">
        <h2>My Reservations</h2>
        <ReservationFilter
        selectedState={selectedState}
        handleStateFilterChange={handleStateFilterChange}
      />
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
          <button className="cancel-button" onClick={() => handleCancelClick(reservation.id, reservation.property.id)}>Cancel</button>

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
      


      {/* <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => handlePaginationClick(page)}
        >
          {page}
        </button>
      ))}
    </div> */}
    </div>

    
  );
};

export default ReservationPage;
