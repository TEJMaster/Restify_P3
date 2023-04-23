import React, { useState } from 'react';
import NavBar from './navbar';

const LoggedMainPage = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    from_date: '',
    to_date: '',
    guests: '',
    amenities: '',
    ordering: '',
  });
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(searchParams).toString();
    const response = await fetch(`http://localhost:8000/property/search/?${queryParams}`);
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data.results);
    } else {
      console.error('Error fetching search results:', response.statusText);
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
              name="guests"
              value={searchParams.guests}
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
            <div key={result.id}>
              <h3>{result.name}</h3>
              <p>{result.location}</p>
              {/* Add more fields as needed */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoggedMainPage;
