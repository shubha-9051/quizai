import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function QuizResults() {
  const { quizId } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get(`http://localhost:3000/quizzes/${quizId}/results`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error.response ? error.response.data : error.message);
        alert('Failed to fetch results');
      }
    };

    fetchResults();
  }, [quizId]);

  return (
    <div>
      <h2>Quiz Results</h2>
      {results.length === 0 ? (
        <p>No results available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result._id}>
                <td>{result.student.username}</td>
                <td>{result.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QuizResults;