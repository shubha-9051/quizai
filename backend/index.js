const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the "uploads" directory

mongoose.connect(process.env.URI || 'mongodb+srv://shubhajit2003:9P24a7KVrFPIzGLT@cluster0.tu2ei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0b');

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String, // 'student' or 'teacher'
});

const User = mongoose.model('User', userSchema);

// Quiz Schema
const quizSchema = new mongoose.Schema({
  questions: [
    {
      question: String,
      options: [String],
      correctOption: Number,
      image: String,
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timer: { type: String, enum: ['none', '10min', '30min', '1hr', '2hr'], default: 'none' },
});

const Quiz = mongoose.model('Quiz', quizSchema);

// Submission Schema
const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  answers: [Number],
  score: Number,
});

const Submission = mongoose.model('Submission', submissionSchema);

// Secret key for JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Register route
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role });
  await user.save();
  res.status(201).send('User registered');
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send('Invalid credentials');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role }); // Include role in the response
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Access denied');
  }
  const token = authHeader.split(' ')[1]; // Extract the token from the "Bearer <token>" format
  if (!token) {
    return res.status(401).send('Access denied');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send('Invalid token');
  }
};

// Middleware to check if user is a teacher
const isTeacher = (req, res, next) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).send('Access denied');
  }
  next();
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Route to create a quiz (only for teachers)
app.post('/quizzes', authenticateJWT, isTeacher, upload.any(), async (req, res) => {
  const { questions, timer } = req.body;
  if (!questions || questions.length === 0) {
    return res.status(400).send('Quiz must have at least one question');
  }

  // Parse questions and attach image URLs
  const parsedQuestions = JSON.parse(questions);
  if (req.files) {
    req.files.forEach((file) => {
      const index = file.fieldname.split('-')[1];
      if (parsedQuestions[index]) {
        parsedQuestions[index].image = `/uploads/${file.filename}`;
      }
    });
  }

  try {
    const quiz = new Quiz({ questions: parsedQuestions, timer, createdBy: req.user.id });
    await quiz.save();
    res.status(201).send('Quiz created');
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to get all quizzes
app.get('/quizzes', authenticateJWT, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'username');
    res.json(quizzes);
  } catch (error) {
    console.error('Error retrieving quizzes:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/quizzes/:quizId', authenticateJWT, async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId).populate('createdBy', 'username');
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    res.json(quiz);
  } catch (error) {
    console.error('Error retrieving quiz:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to submit quiz answers
app.post('/quizzes/:quizId/submit', authenticateJWT, async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }

    // Check if the student has already taken the quiz
    const existingSubmission = await Submission.findOne({ student: req.user.id, quiz: quizId });
    if (existingSubmission) {
      return res.status(400).send('You have already taken this quiz');
    }

    // Calculate the score
    let score = 0;
    quiz.questions.forEach((question, index) => {
      if (question.correctOption === answers[index]) {
        score += 1;
      }
    });

    // Save the submission
    const submission = new Submission({
      student: req.user.id,
      quiz: quizId,
      answers: answers,
      score: score,
    });
    await submission.save();

    res.json({ score: score, totalQuestions: quiz.questions.length });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to get the leaderboard for a specific quiz
app.get('/quizzes/:quizId/leaderboard', authenticateJWT, async (req, res) => {
  const { quizId } = req.params;
  try {
    const leaderboard = await Submission.find({ quiz: quizId })
      .populate('student', 'username')
      .sort({ score: -1 })
      .exec();
    res.json(leaderboard);
  } catch (error) {
    console.error('Error retrieving leaderboard:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to get quizzes created by the logged-in teacher
app.get('/teacher/quizzes', authenticateJWT, isTeacher, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id }).populate('createdBy', 'username');
    const quizzesWithLeaderboard = await Promise.all(
      quizzes.map(async (quiz) => {
        const leaderboard = await Submission.find({ quiz: quiz._id })
          .populate('student', 'username')
          .sort({ score: -1 })
          .exec();
        return { ...quiz.toObject(), leaderboard };
      })
    );
    res.json(quizzesWithLeaderboard);
  } catch (error) {
    console.error('Error retrieving quizzes:', error);
    res.status(500).send('Internal server error');
  }
});

// Example protected route
app.get('/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});