import React, { useState } from 'react';
import './css/Comment.css';

const CommentPage = () => {
    const [rating, setRating] = useState('');
    const [review, setReview] = useState('');

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleReviewChange = (e) => {
        setReview(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic to submit the review and rating
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

export default CommentPage;