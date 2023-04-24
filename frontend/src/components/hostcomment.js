import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './css/HostComment.css';
import NavBar from './navbar';

const HostCommentPage = () => {
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  const { targetuserid } = useParams(); // Extract the user ID from the URL
  const navigate = useNavigate();

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.post(
        `http://localhost:8000/comments/comment/user/${targetuserid}`, // Use the user ID in the API endpoint URL
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
      console.error('Error submitting the host comment:', error);
    }
  };

  return (
    <>
    <NavBar />
    <div className="write-host-review">
      <h3>How was your experience with the user? You can comment here:</h3>
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
    </>
  );
};

export default HostCommentPage;
