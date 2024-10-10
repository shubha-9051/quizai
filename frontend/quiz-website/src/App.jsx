import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import QuizCreation from './components/QuizCreation';
import QuizList from './components/QuizList';
import QuizTaking from './components/QuizTaking';
import Leaderboard from './components/Leaderboard';
import TeacherDashboard from './components/TeacherDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz-creation" element={<ProtectedRoute component={QuizCreation} />} />
        <Route path="/quiz-list" element={<ProtectedRoute component={QuizList} />} />
        <Route path="/quiz-taking/:quizId" element={<ProtectedRoute component={QuizTaking} />} />
        <Route path="/leaderboard/:quizId" element={<ProtectedRoute component={Leaderboard} />} />
        <Route path="/teacher-dashboard" element={<ProtectedRoute component={TeacherDashboard} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;