import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function QuizTaking() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        const response = await axios.get(`http://localhost:3000/quizzes/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuiz(response.data);
        setAnswers(new Array(response.data.questions.length).fill(null));
      } catch (error) {
        console.error('Error fetching quiz:', error.response ? error.response.data : error.message);
        alert('Failed to fetch quiz');
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      const response = await axios.post(`http://localhost:3000/quizzes/${quizId}/submit`, { answers }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setScore(response.data.score);
      alert(`You scored ${response.data.score} out of ${response.data.totalQuestions}`);
      navigate('/quiz-list');
    } catch (error) {
      console.error('Error submitting quiz:', error.response ? error.response.data : error.message);
      alert('Failed to submit quiz');
    }
  };

  if (!quiz) {
    return <p>Loading...</p>;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">Take Quiz</h2>
        <div className="mb-4 text-center text-gray-600">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
        <div className="mb-6">
          <p className="mb-4 text-lg font-medium text-gray-800">{currentQuestion.question}</p>
          {currentQuestion.image && <img src={currentQuestion.image} alt="Question" className="mb-4 rounded-lg" />}
          <ul className="space-y-2">
            {currentQuestion.options.map((option, oIndex) => (
              <li key={oIndex} className="flex items-center">
                <label className="flex items-center w-full p-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    checked={answers[currentQuestionIndex] === oIndex}
                    onChange={() => handleAnswerChange(oIndex)}
                    className="mr-2 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          >
            Previous
          </button>
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-4 py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizTaking;