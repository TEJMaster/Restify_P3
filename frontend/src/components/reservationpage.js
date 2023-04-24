import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import './css/ReservationPage.css';
import './css/NavBar.css';
import NavBar from './navbar';
import { Link, useNavigate } from 'react-router-dom';




const ReservationPage = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showCancellationSubmitted, setShowCancellationSubmitted] = useState(false);
    const [reservationIdToCancel, setReservationIdToCancel] = useState(null);
    const [userId, setUserId] = useState(null);

    const [propertyIdToCancel, setPropertyIdToCancel] = useState(null);
    const [selectedState, setSelectedState] = useState('');
    const [houseimage, setHouseImage] = useState('');

    const [hostReservations, setHostReservations] = useState([]);

    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);


    function handleStateFilterChange(e) {
      setSelectedState(e.target.value);
    }
    
    const navigate = useNavigate();


    
    const fetchReservations = useCallback(async (url) => {
        try {
          const token = localStorage.getItem('access_token');
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get(url, { headers });
    
          const tokenParts = token.split('.');
          const tokenPayload = tokenParts[1];
          const tokenPayloadJson = atob(tokenPayload);
          const tokenPayloadArray = JSON.parse(tokenPayloadJson);
    
          const UserId = tokenPayloadArray.user_id;

    
        let userReservations = response.data.results.filter((reservation) => reservation.user === UserId);
  
    
          if (selectedState) {
            userReservations = userReservations.filter(
              (reservation) => reservation.state === selectedState
            );
          }
          setNextPage(response.data.next);
          setPreviousPage(response.data.previous);
          setReservations(userReservations);
        } catch (error) {
          console.error('Error fetching reservations:', error);
        }
      }, [selectedState]);

      const fetchHostReservations = useCallback(async (url) => {
          try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };

            const response = await axios.get(url, { headers });

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
            
            setNextPage(response.data.next);
            setPreviousPage(response.data.previous);
            setHostReservations(userHostReservations);

          } catch (error) {
            console.error("Error fetching host reservations:", error);
          }
      }, [selectedState]);

      

    useEffect(() => {
        const initialUrl = "http://localhost:8000/reservation/";
        fetchReservations(initialUrl);
        fetchHostReservations(initialUrl);
      }, [selectedState, fetchReservations, fetchHostReservations]);
      
    function loadNext() {
        if (nextPage) {
          fetchReservations(nextPage);
          fetchHostReservations(nextPage);
        }
    }
      
    function loadPrevious() {
        if (previousPage) {
          fetchReservations(previousPage);
          fetchHostReservations(previousPage);
        }
    }
    

    function handleCancelClick(reservationId, propertyId) {
      setReservationIdToCancel(reservationId);
      setPropertyIdToCancel(propertyId);
      setShowConfirmation(true);
    }
    

    function confirmcancelmsg() {
      setShowCancellationSubmitted(false);
      refreshPage();
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
    
    function refreshPage() {
      window.location.reload(false);
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
        refreshPage();
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
    <img src={reservation.property.images.length > 0
            ? reservation.property.images[0].image
            : ''} alt={reservation.property.name} className="stay-image" />

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
          <button
            className="guest-cancel-button"
            onClick={() =>
              handleCancelClick(reservation.id, reservation.property.id)
            }
          >
            Cancel
          </button>
        </>
      )}
      {reservation.state === "Terminated" && (
        <button
          className="guest-comment-button"
          onClick={() =>
            navigate(`/comment_property/${reservation.property.id}`)
          }
        >
          Comment
        </button>
      )}

      {reservation.state === "Completed" && (
        <button
          className="guest-comment-button"
          onClick={() =>
            navigate(`/comment_property/${reservation.property.id}`)
          }
        >
          Comment
        </button>
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
        onClose={confirmcancelmsg}
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
        src={
          reservation.property.images.length > 0
            ? reservation.property.images[0].image
            : ''
        }
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
    
<button className="pagination-button previous" onClick={loadPrevious} disabled={!previousPage}>
  Previous
</button>
<button className="pagination-button next" onClick={loadNext} disabled={!nextPage}>
  Next
</button>

      
    </div>
    
  );
};

export default ReservationPage;
