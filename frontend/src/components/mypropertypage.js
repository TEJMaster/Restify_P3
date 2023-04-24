import React, { useState, useEffect } from 'react';
import NavBar from './navbar';
import './css/MyPropertyPage.css';
import { Link, useNavigate} from 'react-router-dom';


const MyPropertyPage = () => {
  const [properties, setProperties] = useState({});

  useEffect(() => {
    fetchProperties();
  }, []);

  const navigate = useNavigate();


  const fetchProperties = async () => {
    const response = await fetch('http://localhost:8000/property/my_property/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setProperties(data);
    } else {
      console.error('Error fetching properties:', response.statusText);
    }
  };

  const updateProperty = (propertyName) => {
    navigate(`/update_property/${propertyName}`);
  };
  
  

  const deleteProperty = async (propertyName) => {
    const response = await fetch(`http://localhost:8000/property/delete/${propertyName}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (response.ok) {
      setProperties((prevProperties) => {
        const updatedResults = prevProperties.results.filter(
          (property) => property.name !== propertyName
        );
        return { ...prevProperties, results: updatedResults };
      });
    } else {
      console.error('Error deleting property:', response.statusText);
    }
  };
  

  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="list-container">
          <Link to="/create_property">
            <button className="add-button">Add New Property</button>
          </Link>
          <div className="prop-lists">
            <h1>Your Properties</h1>
            {Array.isArray(properties.results) &&
              properties.results.map((property) => (
                <div key={property.name} className="property">
                  <h3>{property.name}</h3>
                  <p>{property.location}</p>
                  <img
                    src={property.images.length > 0 ? property.images[0].image : ''}
                    alt={`${property.name} property`}
                    className="property-image"
                  />
                  <button
                    className="update-button"
                    onClick={() => updateProperty(property.name)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteProperty(property.name)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPropertyPage;
