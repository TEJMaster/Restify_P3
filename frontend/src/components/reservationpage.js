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

    const [hostReservations, setHostReservations] = useState([]);


    function handleStateFilterChange(e) {
      setSelectedState(e.target.value);
    }
    

    useEffect(() => {
      const fetchReservations = async (page = 1) => {
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
          setTotalPages(Math.ceil(response.data.count / response.data.page_size));
          setCurrentPage(response.data.page);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      };

      const fetchHostReservations = async (page = 1) => {
          try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.get(
              "http://localhost:8000/reservation/",
              { headers }
            );

            const tokenParts = token.split('.');
            const tokenPayload = tokenParts[1];
            const tokenPayloadJson = atob(tokenPayload);
            const tokenPayloadArray = JSON.parse(tokenPayloadJson);
      
            const userId = tokenPayloadArray.user_id;

           
            let userHostReservations = response.data.results.filter(
              (reservation) => reservation.property.owner === userId
            );

            if (selectedState) {
              userHostReservations = userHostReservations.filter(
                (reservation) => reservation.state === selectedState
              );
            }

            setHostReservations(userHostReservations);
            setTotalPages(Math.ceil(response.data.count / response.data.page_size));
            setCurrentPage(response.data.page);
          } catch (error) {
            console.error("Error fetching host reservations:", error);
          }
      };

      fetchReservations(currentPage);
      fetchHostReservations();
      
    }, [selectedState, currentPage]);
    
    function handlePaginationClick(newPage) {
      setCurrentPage(newPage);
    }
    
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
    
    async function handleHostAction(reservationId, action) {
      try {
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };
        await axios.put(
          `http://localhost:8000/reservation/approve-deny-cancel/${reservationId}/`,
          { action },
          { headers }
        );
    
        // Refresh reservations to show the updated state
        const newHostReservations = hostReservations.map((reservation) => {
          if (reservation.id === reservationId) {
            return reservation;
          }
          return reservation;
        });
        setHostReservations(newHostReservations);
      } catch (error) {
        console.error("Error updating reservation state:", error.response.data);
      }
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
        <ReservationFilter
        selectedState={selectedState}
        handleStateFilterChange={handleStateFilterChange}
      />
        <h2>Your stays</h2>
        
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
          

          {reservation.state === "Pending" && (
          <>
            <button className="cancel-button" onClick={() => handleCancelClick(reservation.id, reservation.property.id)}>Cancel</button>
          </>
        )}
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
      
        <section className="host-stays">
  <h2>Reservations of Your Properties</h2>
  {hostReservations.map((reservation) => (
    <div key={reservation.id} className="stay">
      <img
        src={reservation.property.image}
        alt={reservation.property.name}
        className="stay-image"
      />

      <div className="stay-details">
        <h3>{reservation.property.name}</h3>
        <p>
          Date: {reservation.from_date} - {reservation.to_date}
        </p>
        <p>
          Price: {reservation.property.price}
        </p>
      </div>

      <div className="host-button-state-container">
        {reservation.state === "Pending" && (
          <>
            <button
              className="approve-button"
              onClick={() =>
                handleHostAction(reservation.id, "approve")
              }
            >
              Approve
            </button>
            <button
              className="deny-button"
              onClick={() =>
                handleHostAction(reservation.id, "deny")
              }
            >
              Deny
            </button>
          </>
        )}

        {reservation.state === "Pending Cancel" && (
          <>
            <button
              className="approve-cancel-button"
              onClick={() =>
                handleHostAction(reservation.id, "approve_cancel")
              }
            >
              Approve Cancel
            </button>
            <button
              className="deny-cancel-button"
              onClick={() =>
                handleHostAction(reservation.id, "deny_cancel")
              }
            >
              Deny Cancel
            </button>
          </>
        )}

        {reservation.state === "Approved" && (
          <>
            <button
              className="terminate-button"
              onClick={() =>
                handleHostAction(reservation.id, "terminate")
              }
            >
              Terminate
            </button>
          </>
        )}

        <p className="reservation-state">{reservation.state}</p>
      </div>
    </div>
  ))}
</section>

        <div className="pagination">
      <button
        className="prev"
        onClick={() => handlePaginationClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={page === currentPage ? 'active' : ''}
          onClick={() => handlePaginationClick(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="next"
        onClick={() => handlePaginationClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
    </div>

    
  );
};

export default ReservationPage;
