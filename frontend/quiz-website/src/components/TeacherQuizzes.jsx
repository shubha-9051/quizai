import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:3000/teacher/quizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error.response ? error.response.data : error.message);
        alert('Failed to fetch quizzes');
      }
    };

    fetchQuizzes();
  }, []);

  const handleViewResults = (quizId) => {
    navigate(`/quiz-results/${quizId}`);
  };

  return (
    <div>
      <h2>Your Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes available</p>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz._id}>
            <h3>{quiz.name}</h3>
            <button onClick={() => handleViewResults(quiz._id)}>View Results</button>
          </div>
        ))
      )}
    </div>
  );
}

export default TeacherQuizzes;