import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function QuizLeaderboard() {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [studentSubmission, setStudentSubmission] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get(`http://localhost:3000/quizzes/${quizId}/leaderboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaderboard(response.data.leaderboard);
        setStudentSubmission(response.data.studentSubmission);
      } catch (error) {
        console.error('Error fetching leaderboard:', error.response ? error.response.data : error.message);
        alert('Failed to fetch leaderboard');
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  return (
    <div>
      <h2>Quiz Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p>No leaderboard available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.student.username}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {studentSubmission && (
        <div>
          <h3>Your Score</h3>
          <p>{studentSubmission.score}</p>
        </div>
      )}
    </div>
  );
}

export default QuizLeaderboard;