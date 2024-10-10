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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleRegisterRedirect}
          className="w-full px-4 py-2 mt-4 font-semibold text-indigo-500 border border-indigo-500 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;