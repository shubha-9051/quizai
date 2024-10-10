import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Leaderboard() {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);

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
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error.response ? error.response.data : error.message);
        alert('Failed to fetch leaderboard');
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500">No submissions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left text-gray-600">Rank</th>
                  <th className="px-4 py-2 text-left text-gray-600">Username</th>
                  <th className="px-4 py-2 text-left text-gray-600">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry._id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{entry.student.username}</td>
                    <td className="px-4 py-2">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;