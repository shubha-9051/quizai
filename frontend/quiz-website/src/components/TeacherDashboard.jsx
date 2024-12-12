import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function TeacherDashboard() {
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

  const handleCreateQuiz = () => {
    navigate('/quiz-creation');
  };

  const handleViewLeaderboard = (quizId) => {
    navigate(`/leaderboard/${quizId}`);
  };

  const imageLinks = [
    
    'https://cdn.usegalileo.ai/sdxl10/a9400a27-634e-4819-b178-01a67e9cdbc2.png',
    'https://cdn.usegalileo.ai/sdxl10/d7c8efbc-a6f8-4dfc-b13b-ef70acdce1cf.png',
    'https://cdn.usegalileo.ai/sdxl10/484bcb9b-de97-41da-8eda-5efd63d8dd6e.png',
    'https://cdn.usegalileo.ai/sdxl10/a9703560-3b29-497b-be19-6c0d2855d100.png',
    'https://cdn.usegalileo.ai/sdxl10/84273756-60f0-4ee7-a7c7-939a221deb76.png',
    'https://cdn.usegalileo.ai/sdxl10/bb4c71d7-682a-49b6-aa75-e591a2e67ac1.png',
    'https://cdn.usegalileo.ai/sdxl10/8ac12097-d20c-4f86-a741-c9c7d6eefe9e.png'
      ];

  return (
    <div className="relative flex min-h-screen flex-col bg-white overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f5f2f0] px-10 py-3">
          <div className="flex items-center gap-4 text-[#181411]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path></svg>
            </div>
            <h2 className="text-[#181411] text-lg font-bold leading-tight tracking-[-0.015em]">QuizBee</h2>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#181411] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">My Quizzes</p>
            </div>
            <button
              onClick={handleCreateQuiz}
              className="w-full px-4 py-2 mb-6 font-semibold text-white bg-[#f2800d] rounded-lg hover:bg-[#e06c0b] focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Create New Quiz
            </button>
            {quizzes.length === 0 ? (
              <p className="text-center text-gray-500">No quizzes created yet</p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                {quizzes.map((quiz, index) => (
                  <div key={quiz._id} className="flex flex-col gap-3 pb-3">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                      style={{ backgroundImage: `url(${imageLinks[index % imageLinks.length]})` }} // Replace with actual image URL if available
                    ></div>
                    <div>
                      <p className="text-[#181411] text-base font-medium leading-normal">Quiz {index + 1}</p>
                      <p className="text-[#8a7560] text-sm font-normal leading-normal">{quiz.questions.length} questions</p>
                      <div className="mt-2 space-y-2">
                        <button
                          onClick={() => handleViewLeaderboard(quiz._id)}
                          className="w-full px-4 py-2 font-semibold text-[#181411] bg-[#f5f2f0] rounded-lg hover:bg-[#e5e2df] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          View Leaderboard
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;