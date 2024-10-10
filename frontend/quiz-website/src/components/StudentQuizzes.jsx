import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentQuizzes() {
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [submittedQuizzes, setSubmittedQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:3000/student/quizzes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAvailableQuizzes(response.data.availableQuizzes);
        setSubmittedQuizzes(response.data.submittedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error.response ? error.response.data : error.message);
        alert('Failed to fetch quizzes');
      }
    };

    fetchQuizzes();
  }, []);

  const handleTakeQuiz = (quizId) => {
    navigate(`/quiz-taking/${quizId}`);
  };

  const handleViewLeaderboard = (quizId) => {
    navigate(`/quiz-leaderboard/${quizId}`);
  };

  return (
    <div>
      <h2>Available Quizzes</h2>
      {availableQuizzes.length === 0 ? (
        <p>No quizzes available</p>
      ) : (
        availableQuizzes.map((quiz) => (
          <div key={quiz._id}>
            <h3>{quiz.name}</h3>
            <button onClick={() => handleTakeQuiz(quiz._id)}>Take Quiz</button>
          </div>
        ))
      )}
      <h2>Submitted Quizzes</h2>
      {submittedQuizzes.length === 0 ? (
        <p>No quizzes submitted</p>
      ) : (
        submittedQuizzes.map((submission) => (
          <div key={submission._id}>
            <h3>{submission.quiz.name}</h3>
            <button onClick={() => handleViewLeaderboard(submission.quiz._id)}>View Leaderboard</button>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentQuizzes;