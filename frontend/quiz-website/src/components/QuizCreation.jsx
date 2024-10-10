import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { extractTextFromPDF } from './utils/pdfUtils'; // Adjust the path as needed
import { generateQuestionsFromText } from './utils/groqUtils'; // Adjust the path as needed

function QuizCreation() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(null);
  const [image, setImage] = useState('');
  const [editIndex, setEditIndex] = useState(null);

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
    setImage(e.target.value);
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
      image: image,
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
    setImage('');
  };

  const handleEditQuestion = (index) => {
    const question = questions[index];
    setCurrentQuestion(question.question);
    setOptions(question.options);
    setCorrectOption(question.correctOption);
    setImage(question.image);
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
      console.log('Submitting quiz:', questions); // Debugging: Log questions array before submission
      const response = await axios.post('http://localhost:3000/quizzes', { questions }, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">Quiz Creation</h2>
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Question"
            value={currentQuestion}
            onChange={handleQuestionChange}
            required
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="radio"
                name="correctOption"
                checked={correctOption === index}
                onChange={() => handleCorrectOptionChange(index)}
                className="text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-700">Correct</span>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddOption}
            className="px-4 py-2 font-semibold text-indigo-500 border border-indigo-500 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Add Option
          </button>
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={image}
            onChange={handleImageChange}
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="button"
            onClick={handleAddQuestion}
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {editIndex !== null ? 'Update Question' : 'Add Question'}
          </button>
        </div>
        <div className="mt-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-700">Previous Questions</h3>
          {questions.length === 0 ? (
            <p className="text-center text-gray-500">No questions added yet</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((question, index) => (
                <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div className="flex justify-between">
                    <p className="mb-2 text-lg font-medium text-gray-800">Question {index + 1}: {question.question}</p>
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
                  {question.image && <img src={question.image} alt="Question" className="mb-4 rounded-lg" />}
                  <ul className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <li key={oIndex} className={`flex items-center ${question.correctOption === oIndex ? 'text-green-600' : 'text-gray-700'}`}>
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
          className="w-full px-4 py-2 mt-6 font-semibold text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizCreation;