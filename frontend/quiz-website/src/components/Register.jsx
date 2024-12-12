import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default to student
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, role);
      alert('Registration successful');
      navigate('/login');
    } catch (error) {
      alert('Registration failed');
    }
  };

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
        <div className="flex flex-1">
          <div className="flex-1 bg-[#f5f2f0] flex items-center justify-center">
            <img src="https://cdn.usegalileo.ai/sdxl10/4d41e93d-132d-4e1f-a6ac-704a9ea1942c.png" alt="Register Illustration" className="max-w-full h-auto" />
          </div>
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md animate-fade-in">
              <h2 className="mb-6 text-2xl font-semibold text-center text-[#181411]">Register</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#e6e0db] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#e6e0db] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="student"
                      checked={role === 'student'}
                      onChange={() => setRole('student')}
                      className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-[#181411]">Student</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="teacher"
                      checked={role === 'teacher'}
                      onChange={() => setRole('teacher')}
                      className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-[#181411]">Teacher</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-semibold text-white bg-[#f2800d] rounded-lg hover:bg-[#e06c0b] focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;