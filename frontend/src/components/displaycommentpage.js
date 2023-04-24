import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './css/DisplayCommentsPage.css';
import NavBar from './navbar';

const DisplayCommentsPage = () => {
  const { target_username } = useParams(); // Extract the target username from the URL
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };
  
        const response = await axios.get(
          `http://localhost:8000/comments/view/user/${target_username}`,
          { headers } // Pass the headers object with the request
        );
  
        if (response.status === 200) {
          setComments(response.data.results);
          console.log('Comments fetched:', response.data.results);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
  
    fetchComments();
  }, [target_username]);
  
  

  return (
    <>
    <NavBar />
    <div className="display-comments-page">
      <h2>Comments for {target_username}:</h2>
      {comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div className="comment-author">
                <span> User: {comment.author.username}</span>
              </div>
              <div className="comment-content">
                <p>Comment: {comment.content}</p>
              </div>
              <div className="comment-rating">
                <span>Rating: {comment.rate} stars</span>
              </div>
              <div className="comment-date">
                <span>Posted on: {new Date(comment.created_at).toLocaleDateString()}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments found.</p>
      )}
    </div>
    </>
  );
};

export default DisplayCommentsPage;
