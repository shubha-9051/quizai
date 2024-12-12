import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuestionsFromPromt } from './utils/prompt.js'; // Adjust the path as needed

function Practice() {
  const [prompt, setPrompt] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [timer, setTimer] = useState('none');
  const [remainingTime, setRemainingTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (remainingTime > 0) {
      const timerId = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (remainingTime === 0) {
      handleSubmitQuiz();
    }
  }, [remainingTime]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleTimerChange = (e) => {
    setTimer(e.target.value);
  };

  const handleGenerateQuiz = async () => {
    try {
      const generatedQuiz = await generateQuestionsFromPromt(prompt);
      const parsedQuiz = JSON.parse(generatedQuiz);
      setQuiz(parsedQuiz);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setScore(null);
      if (timer !== 'none') {
        const timeInSeconds = parseInt(timer) * 60;
        setRemainingTime(timeInSeconds);
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz');
    }
  };

  const handleAnswerChange = (index) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = index;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmitQuiz = () => {
    const correctAnswers = quiz.questions.filter((q, index) => q.correctOption === answers[index]);
    setScore(correctAnswers.length);
  };

  const handleReturnToQuizList = () => {
    navigate('/quiz-list');
  };

  const progress = quiz ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100 : 0;

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            {!quiz ? (
              <div className="space-y-4">
                <div className="space-y-4">
  <textarea
    placeholder="Enter prompt to generate quiz"
    value={prompt}
    onChange={handlePromptChange}
    rows="5"
    className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#e6e0db] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
  />
</div>
                <select
                  value={timer}
                  onChange={handleTimerChange}
                  className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#f5f2f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="none">No Timer</option>
                  <option value="5">5 Minutes</option>
                  <option value="10">10 Minutes</option>
                  <option value="15">15 Minutes</option>
                </select>
                <button
                  onClick={handleGenerateQuiz}
                  className="w-full px-4 py-2 font-semibold text-white bg-[#f2800d] rounded-lg hover:bg-[#e06c0b] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Generate Quiz
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {remainingTime !== null && (
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
                )}
                <div className="flex flex-col gap-3 p-4">
                  <div className="flex gap-6 justify-between">
                    <p className="text-[#181411] text-base font-medium leading-normal">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                  </div>
                  <div className="rounded bg-[#e6e0db]">
                    <div className="h-2 rounded bg-[#181411]" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
                <h1 className="text-[#181411] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">{quiz.questions[currentQuestionIndex].question}</h1>
                <div className="flex flex-col gap-3 p-4">
                  {quiz.questions[currentQuestionIndex].options.map((option, oIndex) => (
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
                {score !== null && (
                  <div className="mt-6 text-center">
                    <p className="text-2xl font-semibold text-gray-700">Your Score: {score} / {quiz.questions.length}</p>
                    <div className="mt-4 space-y-4">
                      {quiz.questions.map((question, qIndex) => (
                        <div key={qIndex} className="p-4 bg-[#f5f2f0] rounded-lg shadow-sm">
                          <p className="mb-2 text-lg font-medium text-[#181411]">Question {qIndex + 1}: {question.question}</p>
                          <ul className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <li key={oIndex} className={`flex items-center p-2 rounded-lg ${answers[qIndex] === oIndex ? (question.correctOption === oIndex ? 'bg-green-200' : 'bg-red-200') : (question.correctOption === oIndex ? 'bg-green-200' : 'bg-[#f5f2f0]')}`}>
                                <span className="text-[#181411]">{option}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleReturnToQuizList}
                      className="mt-4 px-4 py-2 font-semibold text-white bg-[#f2800d] rounded-lg hover:bg-[#e06c0b] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      Return to Quiz List
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Practice;