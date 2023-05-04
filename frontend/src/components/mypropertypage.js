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
    const response = await fetch('{BASE_URL}/property/my_property/', {
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
    const confirmed = window.confirm("Are you sure you want to delete this property? This action cannot be undone.");
  
    if (confirmed) {
      const response = await fetch(`{BASE_URL}/property/delete/${propertyName}/`, {
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
    }
  };
  
  

  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="list-container">
          <div className="prop-lists">
            <h1>Your Properties</h1>
            <Link to="/create_property">
                  <button className="add-button">Add New Property</button>
            </Link>
            {Array.isArray(properties.results) &&
              properties.results.map((property) => (
                <div key={property.name} className="property">
                  <h3>{property.name}</h3>
                  <p>{property.location}</p>
                  <div className="property-controls">
                    <img
                      src={property.images.length > 0 ? property.images[0].image : ''}
                      alt={`${property.name} property`}
                      className="property-image"
                    />
                    <div className="buttons">
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
                  </div>

                </div>
              ))}
              
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPropertyPage;
