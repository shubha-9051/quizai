import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      console.log('Login response:', response); // Log the response
      localStorage.setItem('token', response.data.token);
      console.log('User role:', response.data.role); // Log the user role
      if (response.data.role === 'student') {
        console.log('Navigating to /quiz-list'); // Log navigation
        navigate('/quiz-list');
      } else if (response.data.role === 'teacher') {
        console.log('Navigating to /teacher-dashboard'); // Log navigation
        navigate('/teacher-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message); // Log the error
      alert('Invalid credentials');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
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
            <img src="https://img.freepik.com/premium-photo/dedicated-student-studying_810293-7791.jpg?w=826" alt="Login Illustration" className="max-w-full h-auto" />
          </div>
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md animate-fade-in">
              <h2 className="mb-6 text-2xl font-semibold text-center text-[#181411]">Login</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#e6e0db] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#e6e0db] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-semibold text-white bg-[#f2800d] rounded-lg hover:bg-[#e06c0b] focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Login
                </button>
              </form>
              <button
                onClick={handleRegisterRedirect}
                className="w-full px-4 py-2 mt-4 font-semibold text-[#f2800d] border border-[#f2800d] rounded-lg hover:bg-[#f5f2f0] focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;