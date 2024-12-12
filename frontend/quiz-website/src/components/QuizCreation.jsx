import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { extractTextFromPDF } from './utils/pdfUtils'; // Adjust the path as needed
import { generateQuestionsFromPromt } from './utils/prompt';
import { generateQuestionsFromText } from './utils/groqUtils'; // Adjust the path as needed

function QuizCreation() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(null);
  const [image, setImage] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [timer, setTimer] = useState('none');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    console.log('Questions state updated:', questions); // Debugging: Log questions array whenever it updates
  }, [questions]);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion(e.target.value);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (index) => {
    setCorrectOption(index);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleAddQuestion = () => {
    if (!currentQuestion || options.some(option => option === '') || correctOption === null) {
      alert('Please fill in all fields and select the correct option.');
      return;
    }

    const newQuestion = {
      question: currentQuestion,
      options: options,
      correctOption: correctOption,
      image: image, // Store the file object itself
    };

    setQuestions((prevQuestions) => {
      const updatedQuestions = editIndex !== null ? [...prevQuestions] : [...prevQuestions, newQuestion];
      if (editIndex !== null) {
        updatedQuestions[editIndex] = newQuestion;
        setEditIndex(null);
      }
      console.log('Questions after adding new question:', updatedQuestions); // Debugging: Log questions array
      return updatedQuestions;
    });

    // Reset the form for a new question
    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectOption(null);
    setImage(null);
  };

  const handleEditQuestion = (index) => {
    const question = questions[index];
    setCurrentQuestion(question.question);
    setOptions(question.options);
    setCorrectOption(question.correctOption);
    setImage(null); // Reset image input
    setEditIndex(index);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions.filter((_, i) => i !== index);
      console.log('Questions after removing question:', updatedQuestions); // Debugging: Log questions array
      return updatedQuestions;
    });
  };

  const handleSubmitQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      if (questions.length === 0) {
        alert('Quiz must have at least one question');
        return;
      }

      const formData = new FormData();
      formData.append('timer', timer);
      formData.append('questions', JSON.stringify(questions.map((q, index) => ({
        ...q,
        image: q.image ? `image-${index}` : null,
      }))));

      questions.forEach((q, index) => {
        if (q.image) {
          formData.append(`image-${index}`, q.image);
        }
      });

      console.log('Submitting quiz:', questions); // Debugging: Log questions array before submission
      const response = await axios.post('http://localhost:3000/quizzes', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Quiz submitted successfully');
      console.log('Quiz submitted:', response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error.response ? error.response.data : error.message);
      alert('Failed to submit quiz');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      console.log('File selected:', file.name); // Log the selected file name
      const reader = new FileReader(); // Create a new FileReader instance
      reader.onload = async (event) => {
        const fileBuffer = event.target.result; // Get the file buffer from the reader
        console.log('File read as array buffer:', fileBuffer); // Log the file buffer
        try {
          const text = await extractTextFromPDF(fileBuffer); // Extract text from the PDF
          console.log('Extracted text:', text); // Log the extracted text
          const generatedQuestions = await generateQuestionsFromText(text); // Generate questions from the extracted text
          console.log('Generated questions:', generatedQuestions); // Log the generated questions
          
          // Assuming the generated questions are in a structured JSON format
          const parsedQuestions = JSON.parse(generatedQuestions); // Parse the generated questions
          setQuestions(parsedQuestions.questions); // Update the state with the parsed questions
          console.log('Questions state updated:', parsedQuestions); // Log the updated questions state
        } catch (error) {
          console.error('Error processing file:', error); // Log any errors
          alert('Failed to process file'); // Alert the user if there's an error
        }
      };
      reader.readAsArrayBuffer(file); // Read the file as an array buffer
    }
  };

  const handleTimerChange = (e) => {
    setTimer(e.target.value);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleGenerateQuestions = async () => {
    try {
      const generatedQuestions = await generateQuestionsFromPromt(prompt);
      const parsedQuestions = JSON.parse(generatedQuestions);
      setQuestions(parsedQuestions.questions);
      console.log('Questions generated from prompt:', parsedQuestions);
    } catch (error) {
      console.error('Error generating questions from prompt:', error);
      alert('Failed to generate questions from prompt');
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
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#181411] text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-[#181411] text-sm font-medium leading-normal" href="#">Discover</a>
              <a className="text-[#181411] text-sm font-medium leading-normal" href="#">Create</a>
            </div>
            <div className="flex gap-2">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f2800d] text-[#181411] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Log in</span>
              </button>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f5f2f0] text-[#181411] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Sign up</span>
              </button>
            </div>
          </div>
        </header>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#181411] text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">Create a Quiz</p>
            </div>
            <div className="flex space-x-4 px-4 py-3">
              <select
                value={timer}
                onChange={handleTimerChange}
                className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#f5f2f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="none">No Timer</option>
                <option value="10min">10 Minutes</option>
                <option value="30min">30 Minutes</option>
                <option value="1hr">1 Hour</option>
                <option value="2hr">2 Hours</option>
              </select>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#f5f2f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="text"
                placeholder="Enter prompt to generate questions"
                value={prompt}
                onChange={handlePromptChange}
                className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#f5f2f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={handleGenerateQuestions}
                className="px-4 py-2 font-semibold text-black bg-[#f2800d] rounded-lg hover:bg-[#e06c0b] focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Generate
              </button>
            </div>
            <div className="space-y-4 px-4 py-3">
              <input
                type="text"
                placeholder="Question"
                value={currentQuestion}
                onChange={handleQuestionChange}
                required
                className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#f5f2f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                    className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#f5f2f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctOption === index}
                    onChange={() => handleCorrectOptionChange(index)}
                    className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="text-[#181411]">Correct</span>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="px-4 py-2 font-semibold text-[#181411] border border-[#f2800d] rounded-lg hover:bg-[#f5f2f0] focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Add Option
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 text-[#181411] bg-[#f5f2f0] border border-[#f5f2f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full px-4 py-2 font-semibold text-black bg-[#f2800d] rounded-lg hover:bg-[#e06c0b] focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {editIndex !== null ? 'Update Question' : 'Add Question'}
              </button>
            </div>
            <div className="mt-6 px-4">
              <h3 className="mb-4 text-xl font-semibold text-[#181411]">Previous Questions</h3>
              {questions.length === 0 ? (
                <p className="text-center text-gray-500">No questions added yet</p>
              ) : (
                <ul className="space-y-4">
                  {questions.map((question, index) => (
                    <li key={index} className="p-4 bg-[#f5f2f0] rounded-lg shadow-sm">
                      <div className="flex justify-between">
                        <p className="mb-2 text-lg font-medium text-[#181411]">Question {index + 1}: {question.question}</p>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditQuestion(index)}
                            className="px-2 py-1 text-sm font-semibold text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          >
                            Modify
                          </button>
                          <button
                            onClick={() => handleRemoveQuestion(index)}
                            className="px-2 py-1 text-sm font-semibold text-red-500 border border-red-500 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {question.image && <img src={URL.createObjectURL(question.image)} alt="Question" className="mb-4 rounded-lg" />}
                      <ul className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <li key={oIndex} className={`flex items-center ${question.correctOption === oIndex ? 'text-green-600' : 'text-[#181411]'}`}>
                            <span>{option}</span>
                            {question.correctOption === oIndex && <span className="ml-2">(Correct)</span>}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              onClick={handleSubmitQuiz}
              disabled={questions.length === 0}
              className="w-full px-4 py-2 mt-6 font-semibold text-black bg-[#f2800d] rounded-lg hover:bg-[#e06c0b] focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}export default QuizCreation;