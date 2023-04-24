import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/DisplayCommentsPage.css';
import NavBar from './navbar';

const DisplayCommentsPage = () => {
  const { target_username } = useParams(); // Extract the target username from the URL
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    const fetchComments = async (page) => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
          `http://localhost:8000/comments/view/user/${target_username}?page=${page}`,
          { headers } // Pass the headers object with the request
        );

        if (response.status === 200) {
          setComments(response.data.results);
          setNextPage(response.data.next);
          setPrevPage(response.data.previous);
          console.log('Comments fetched:', response.data.results);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments(currentPage);
  }, [target_username, currentPage]);

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (prevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <NavBar />
      <div className="display-comments-page container">
        <h2 className="comments-heading">Comments for {target_username}:</h2>
        {comments.length > 0 ? (
          <ul className="comments-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div className="comment-author">
                  <span> User: {comment.author.username}</span>
                </div>
                
                <div className="comment-rating">
                  <span>Rating: {comment.rate} stars</span>
                </div>
                <div className="comment-content">
                  <p>Comment: {comment.content}</p>
                </div>
                <div className="comment-date">
                  <span>
                    Posted on: {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-comments-message">No comments found.</p>
        )}
        <div className="pagination">
          <button className="pagination-button" onClick={handlePrevPage} disabled={!prevPage}>
            Previous
          </button>
          <button className="pagination-button" onClick={handleNextPage} disabled={!nextPage}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default DisplayCommentsPage;
