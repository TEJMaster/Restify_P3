import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetail = (props) => {
  const [property, setProperty] = useState(null);
  const { name } = useParams();

  useEffect(() => {
    fetchProperty(name);
  }, [name]);

  const fetchProperty = async (name) => {
    const response = await fetch(`http://localhost:8000/property/${name}/`);
    if (response.ok) {
      const data = await response.json();
      setProperty(data); // Remove ".results[0]" from this line
    } else {
      console.error('Error fetching property details:', response.statusText);
    }
  };
  

  if (!property) return <div>Loading...</div>;

  return (
    <div>
      <h2>{property.name}</h2>
      <p>{property.location}</p>
      <p>Price: {property.price}</p>
      <p>Guests: {property.guests}</p>
      <p>Amenities: {property.amenities}</p>
      {property.images.map((image) => (
        <img
          key={image.image}
          src={image.image}
          alt={`${property.name} property`}
          className="property-image"
        />
      ))}
    </div>
  );
};

export default PropertyDetail;
