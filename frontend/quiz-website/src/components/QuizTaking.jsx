import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function QuizTaking() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
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
        setRemainingTime(convertTimerToSeconds(response.data.timer));
      } catch (error) {
        console.error('Error fetching quiz:', error.response ? error.response.data : error.message);
        alert('Failed to fetch quiz');
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (remainingTime === null) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingTime]);

  const convertTimerToSeconds = (timer) => {
    switch (timer) {
      case '10min':
        return 10 * 60;
      case '30min':
        return 30 * 60;
      case '1hr':
        return 60 * 60;
      case '2hr':
        return 2 * 60 * 60;
      default:
        return null;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-blue-600">Take Quiz</h2>
        {remainingTime !== null && (
          <div className="mb-4 text-center text-red-600">
            Time Remaining: {formatTime(remainingTime)}
          </div>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="mb-4 text-center text-gray-600">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
        <div className="mb-6">
          <p className="mb-4 text-lg font-medium text-gray-800">{currentQuestion.question}</p>
          {currentQuestion.image && <img src={`http://localhost:3000${currentQuestion.image}`} alt="Question" className="mb-4 rounded-lg" />}
          <ul className="space-y-2">
            {currentQuestion.options.map((option, oIndex) => (
              <li key={oIndex} className="flex items-center">
                <label className="flex items-center w-full p-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    checked={answers[currentQuestionIndex] === oIndex}
                    onChange={() => handleAnswerChange(oIndex)}
                    className="mr-2 text-blue-600 border-gray-300 focus:ring-blue-500"
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
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          >
            Previous
          </button>
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="px-4 py-2 font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
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