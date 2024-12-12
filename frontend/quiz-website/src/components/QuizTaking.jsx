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
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="flex flex-col gap-3 p-4">
              <div className="flex gap-6 justify-between">
                <p className="text-[#181411] text-base font-medium leading-normal">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
              </div>
              <div className="rounded bg-[#e6e0db]">
                <div className="h-2 rounded bg-[#181411]" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
            <div className="flex gap-4 py-6 px-4">
              <div className="flex grow basis-0 flex-col items-stretch gap-4">
                <div className="flex h-14 grow items-center justify-center rounded-xl px-3 bg-[#f5f2f0]">
                  <p className="text-[#181411] text-lg font-bold leading-tight tracking-[-0.015em]">{Math.floor(remainingTime / 60)}</p>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-[#181411] text-sm font-normal leading-normal">Minutes</p>
                </div>
              </div>
              <div className="flex grow basis-0 flex-col items-stretch gap-4">
                <div className="flex h-14 grow items-center justify-center rounded-xl px-3 bg-[#f5f2f0]">
                  <p className="text-[#181411] text-lg font-bold leading-tight tracking-[-0.015em]">{remainingTime % 60}</p>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-[#181411] text-sm font-normal leading-normal">Seconds</p>
                </div>
              </div>
            </div>
            <h1 className="text-[#181411] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">{currentQuestion.question}</h1>
            {currentQuestion.image && <img src={`http://localhost:3000${currentQuestion.image}`} alt="Question" className="mb-4 rounded-lg" />}
            <div className="flex flex-col gap-3 p-4">
              {currentQuestion.options.map((option, oIndex) => (
                <label key={oIndex} className="flex items-center gap-4 rounded-xl border border-solid border-[#e6e0db] p-[15px]">
                  <input
                    type="radio"
                    className="h-5 w-5 border-2 border-[#e6e0db] bg-transparent text-transparent checked:border-[#181411] checked:bg-[image:--radio-dot-svg] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#181411]"
                    name={`question-${currentQuestionIndex}`}
                    checked={answers[currentQuestionIndex] === oIndex}
                    onChange={() => handleAnswerChange(oIndex)}
                  />
                  <div className="flex grow flex-col">
                    <p className="text-[#181411] text-sm font-medium leading-normal">{option}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f5f2f0] text-[#181411] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                >
                  <span className="truncate">Previous</span>
                </button>
                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f2800d] text-[#181411] text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Submit Quiz</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f2800d] text-[#181411] text-sm font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Next</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizTaking;