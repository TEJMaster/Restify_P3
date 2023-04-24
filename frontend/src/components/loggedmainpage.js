import React, { useState } from 'react';
import NavBar from './navbar';
import './css/LoggedMainPage.css';
import { useNavigate } from 'react-router-dom';


const LoggedMainPage = () => {

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    location: '',
    from_date: '',
    to_date: '',
    num_guests: '',
    amenities: '',
    ordering: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchSearchResults(`http://localhost:8000/property/search/?${new URLSearchParams(searchParams).toString()}`);
    console.log(searchResults);
  };

  const fetchSearchResults = async (url) => {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data.results);
      setNextPage(data.links.next);
      setPreviousPage(data.links.previous);
    } else {
      console.error('Error fetching search results:', response.statusText);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      fetchSearchResults(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      fetchSearchResults(previousPage);
    }
  };

  return (
    <div>
      <NavBar />
      {/* Main page content */}
      <div className="container1">
        <h1>Explore Your Next Place With Restify</h1>
        <div className="search-bar">
          <form onSubmit={handleSearchSubmit}>
            <div className="location-input">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={searchParams.location}
                onChange={handleChange}
                placeholder="Where are you going?"
              />
            </div>
            <div>
              <label>Check in</label>
              <input
                type="date"
                name="from_date"
                value={searchParams.from_date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Check out</label>
              <input
                type="date"
                name="to_date"
                value={searchParams.to_date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Guest</label>
              <select
                id="guest"
                name="num_guests"
                value={searchParams.num_guests}
                onChange={handleChange}
                className="guest"
              >
                <option value="">Select guests number</option>
                <option value="1">1 guest</option>
                <option value="2">2 guests</option>
                <option value="3">3 guests</option>
                <option value="4">4 guests</option>
                <option value="5">5 guests +</option>
              </select>
            </div>
            <div>
              <label>Sort By</label>
              <select
                id="ordering"
                name="ordering"
                value={searchParams.ordering}
                onChange={handleChange}
              >
                <option value="">Sort By</option>
                <option value="-price">Price (high to low)</option>
                <option value="price">Price (low to high)</option>
                <option value="-rate">Rate (high to low)</option>
                <option value="rate">Rate (low to high)</option>
              </select>
            </div>
            <button type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
      <div className="container">
      {searchResults.map((result) => (
        
        
        <div key={result.id} className="search-result">
          {result.images.length > 0 && (
            <img
                key={result.images[0].image} 
              src={result.images[0].image}
              alt={`${result.name} property`}
              className="property-image"
            />
          )}

          <div className="result-content"> {/* Add this div */}
            <h3>{result.name}</h3>
            <h2>{result.location}</h2>
            <p>$ {result.price} / day</p>
            <p>{result.guests} Guest</p>
            <button
            className="view-button"
            onClick={() => {
              navigate(`/property/${result.name}`);
            }}
          >
            View
          </button>
          </div>
          

        </div>
      ))}

        </div>
        <div>
          <button onClick={handlePreviousPage} disabled={!previousPage}>
            Previous
          </button>
          <button onClick={handleNextPage} disabled={!nextPage}>
            Next
          </button>
        </div>
      </div>

  );
};

export default LoggedMainPage;