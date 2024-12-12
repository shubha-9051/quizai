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

  const handleAttemptQuiz = (quizId) => {
    navigate(`/quiz-taking/${quizId}`);
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
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#181411] text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-[#181411] text-sm font-medium leading-normal" href="#">Discover</a>
              <a className="text-[#181411] text-sm font-medium leading-normal" href="#">Create</a>
            </div>
            <div className="flex gap-2">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f2800d] text-[#181411] text-sm font-bold leading-normal tracking-[0.015em]"
              onClick={() => navigate('/practice')}
              >
                <span className="truncate">Practice</span>
              </button>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f5f2f0] text-[#181411] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#181411] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Discover quizzes</p>
            </div>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div
                    className="text-[#8a7560] flex border-none bg-[#f5f2f0] items-center justify-center pl-4 rounded-l-xl border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search for quizzes..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#181411] focus:outline-0 focus:ring-0 border-none bg-[#f5f2f0] focus:border-none h-full placeholder:text-[#8a7560] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value=""
                  />
                </div>
              </label>
            </div>
            <div className="flex gap-3 p-3 flex-wrap pr-4">
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f5f2f0] pl-4 pr-4">
                <p className="text-[#181411] text-sm font-medium leading-normal">All Quizzes</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f5f2f0] pl-4 pr-4">
                <p className="text-[#181411] text-sm font-medium leading-normal">Featured</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f5f2f0] pl-4 pr-4">
                <p className="text-[#181411] text-sm font-medium leading-normal">Top Rated</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f5f2f0] pl-4 pr-4">
                <p className="text-[#181411] text-sm font-medium leading-normal">Most Played</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f5f2f0] pl-4 pr-4">
                <p className="text-[#181411] text-sm font-medium leading-normal">New</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f5f2f0] pl-4 pr-4">
                <p className="text-[#181411] text-sm font-medium leading-normal">Categories</p>
              </div>
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl bg-[#f5f2f0] pl-4 pr-4">
                <p className="text-[#181411] text-sm font-medium leading-normal">Top Creators</p>
              </div>
            </div>
            <h2 className="text-[#181411] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Top Quizzes</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {quizzes.length === 0 ? (
                <p className="text-center text-gray-500">No quizzes available</p>
              ) : (
                quizzes.map((quiz, index) => (
                  <div key={quiz._id} className="flex flex-col gap-3 pb-3">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                      style={{ backgroundImage: `url(${imageLinks[index % imageLinks.length]})` }}
                    ></div>
                    <div>
                      <p className="text-[#181411] text-base font-medium leading-normal">{quiz.title || `Quiz ${index + 1}`}</p>
                      <p className="text-[#8a7560] text-sm font-normal leading-normal">by: {quiz.createdBy.username}</p>
                      <div className="mt-2 space-y-2">
                        <button
                          onClick={() => handleAttemptQuiz(quiz._id)}
                          className="w-full px-4 py-2 font-semibold text-[#181411] bg-[#f2800d] rounded-lg hover:bg-[#e06c0b] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          Attempt
                        </button>
                        <button
                          onClick={() => handleViewLeaderboard(quiz._id)}
                          className="w-full px-4 py-2 font-semibold text-[#181411] bg-[#f5f2f0] rounded-lg hover:bg-[#e5e2df] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                          Leaderboard
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizList;