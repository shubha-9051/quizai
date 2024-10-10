import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get('http://localhost:3000/quizzes', {
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

  const handleTakeQuiz = (quizId) => {
    navigate(`/quiz-taking/${quizId}`);
  };

  const handleViewLeaderboard = (quizId) => {
    navigate(`/leaderboard/${quizId}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">Available Quizzes</h2>
        {quizzes.length === 0 ? (
          <p className="text-center text-gray-500">No quizzes available</p>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz, index) => (
              <div key={quiz._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Quiz {index + 1}</h3>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleTakeQuiz(quiz._id)}
                    className="px-4 py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    Take Quiz
                  </button>
                  <button
                    onClick={() => handleViewLeaderboard(quiz._id)}
                    className="px-4 py-2 font-semibold text-indigo-500 border border-indigo-500 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    View Leaderboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizList;