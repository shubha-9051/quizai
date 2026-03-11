# Quiz App 🎉

Welcome to the **Quiz App**! This application allows users to take quizzes on various topics and track their scores. It's a fun and interactive way to test your knowledge! 🧠

## Tech Stack 🛠️

- **Frontend**: React.js ⚛️
- **Backend**: Node.js with Express.js 🚀
- **Database**: MongoDB 🍃
- **Authentication**: JWT (JSON Web Tokens) 🔐
- **Styling**: Tailwind CSS 🎨
- **AI Integration**: LLM + Retrieval Augmented Generation (RAG) 🤖
- **Vector Storage**: Embeddings for semantic search

## Features 🌟

- **User Authentication**: Secure login and registration system.
- **Dynamic Quizzes**: Quizzes are fetched from the database and can be updated easily.
- **Score Tracking**: Users can see their scores and track their progress over time.
- **Leaderboard**: See how you rank against other users.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

### 🤖 AI-Powered Quiz Generation (RAG)

Teachers can upload **textbooks, PDFs, or study material**, and the system automatically generates quiz questions using a **Retrieval-Augmented Generation (RAG)** pipeline.

#### How it works

1. **Document Upload**
   - Teachers upload textbooks or study material (PDFs).

2. **Document Parsing**
   - The document is parsed and split into smaller chunks.

3. **Embedding Generation**
   - Each chunk is converted into **vector embeddings** using an embedding model.

4. **Vector Storage**
   - Embeddings are stored in a **vector database** for semantic search.

5. **Context Retrieval**
   - When generating questions, the system retrieves the most relevant chunks from the textbook.

6. **LLM Question Generation**
   - The retrieved context is passed to an **LLM** which generates:
     - Multiple choice questions
     - Answer options
     - Correct answers
     - Explanations

This ensures that the generated questions are **grounded in the uploaded study material**, making quizzes highly relevant and accurate.

### Example Flow

Upload textbook → Parse text → Generate embeddings → Store in vector DB → Retrieve relevant context → LLM generates quiz questions.

## Getting Started 🚀

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/quiz-app.git
    ```
2. **Install dependencies**:
    ```bash
    cd quiz-app
    npm install
    ```
3. **Start the development server**:
    ```bash
    npm start
    ```

## Screenshots 📸

## Screenshots 📸

![Home Page](./screenshots/Screenshot%202024-12-12%20222423.png)
![Quiz Page](./screenshots/Screenshot%202024-12-12%20222537.png)
![Login](./screenshots/Screenshot%202024-12-12%20222519.png)


## Contributing 🤝

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more details.

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Happy quizzing! 🎉
