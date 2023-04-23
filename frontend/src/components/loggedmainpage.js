import React, { useState } from 'react';
import NavBar from './navbar';
import './css/LoggedMainPage.css';

const LoggedMainPage = () => {
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
      <div>
        <form onSubmit={handleSearchSubmit}>
        <label>
            Location contains:
            <input
              type="text"
              name="location"
              value={searchParams.location}
              onChange={handleChange}
            />
          </label>
          <label>
            From date is greater than or equal to:
            <input
              type="date"
              name="from_date"
              value={searchParams.from_date}
              onChange={handleChange}
            />
          </label>
          <label>
            To date is less than or equal to:
            <input
              type="date"
              name="to_date"
              value={searchParams.to_date}
              onChange={handleChange}
            />
          </label>
          <label>
            Guests is greater than or equal to:
            <input
              type="number"
              name="num_guests"
              value={searchParams.num_guests}
              onChange={handleChange}
            />
          </label>
          <label>
            Amenities contains:
            <input
              type="text"
              name="amenities"
              value={searchParams.amenities}
              onChange={handleChange}
            />
          </label>
          <label>
            Ordering:
            <select name="ordering" value={searchParams.ordering} onChange={handleChange}>
              <option value="">Select ordering</option>
              <option value="price">Price - Ascending</option>
              <option value="-price">Price - Descending</option>
              <option value="guests">Guests - Ascending</option>
              <option value="-guests">Guests - Descending</option>
            </select>
          </label>
          <button type="submit">Search</button>
        </form>
        <div>
        {searchResults.map((result) => (
          <div key={result.id} className="search-result">
            <h3>{result.name}</h3>
            <p>{result.location}</p>
            {/* Display the first image of the property */}
            {result.images.length > 0 && (
              <img
                src={result.images[0].image}
                alt={`${result.name} property`}
                className="property-image"
              />
            )}

            {/* View button */}
        <button
          className="view-button"
          onClick={() => {
            /* Implement view property functionality here */
          }}>
            View
          </button>
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
    </div>
  );
};

export default LoggedMainPage;
