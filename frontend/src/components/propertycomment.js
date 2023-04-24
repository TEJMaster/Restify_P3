import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './css/PropertyComment.css';

const PropertyCommentPage = () => {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const { id } = useParams(); // Get the property ID from the URL
  const propertyId = id; // Directly use the property ID

  console.log('propertyId:', propertyId);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.post(
        `http://localhost:8000/comments/comment/property/${propertyId}`,
        {
          rate: rating,
          content: review,
        },
        { headers }
      );

      if (response.status === 201) {
        // Navigate the user to the desired page after successful submission
        navigate('/reservation');
      }
    } catch (error) {
      console.error('Error submitting the comment:', error);
    }
  };

  return (
    <div className="write-review">
      <h3>How was your experience? You can comment here:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="rating">Rating</label>
        <select
          id="rating"
          name="rating"
          className="rating"
          value={rating}
          onChange={handleRatingChange}
          required
        >
          <option value="">Select a rating</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
        <label htmlFor="review">Review</label>
        <textarea
          id="review"
          name="review"
          rows="5"
          value={review}
          onChange={handleReviewChange}
          required
        ></textarea>

        <button type="submit" className="submit-button">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default PropertyCommentPage;
