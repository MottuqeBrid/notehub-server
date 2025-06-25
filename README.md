# 🗂️ NoteHub – Backend Server

This is the backend for **NoteHub**, a note management web application where users can register, login, and manage their notes securely. The server is built using Node.js, Express, and MongoDB and includes JWT-based authentication, role-based access, and RESTful APIs.

---

---

## 🛠️ Tech Stack

### 🔧 Backend

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for MongoDB
- **JWT (jsonwebtoken)** – Secure authentication
- **Bcrypt.js** – Password hashing
- **Dotenv** – Environment variable management
- **Cors** – Enable cross-origin requests
- **Nodemon** – Development server reloading

---

## 🌟 Main Features

### 🔐 Authentication

- User registration & login
- Password encryption with bcrypt
- Secure authentication using JWT
- Role-based route access

### 📝 Note Management

- Create, update, delete, get single and all notes
- Filter notes based on user
- Search and sort capabilities (optional)

### 👤 User Roles

- **Admin**: Can manage all users and notes
- **User**: Can manage personal notes

---

## 🔗 API Endpoints

### Auth

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/user/register` | Register a new user   |
| POST   | `/user/login`    | Login and receive JWT |

### Notes

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `/note/notes`     | Get all notes for a user |
| GET    | `/note/notes/:id` | Get single note by ID    |
| POST   | `/note/notes`     | Create a new note        |
| PUT    | `/note/notes/:id` | Update a note by ID      |
| DELETE | `/note/notes/:id` | Delete a note by ID      |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

# Clone the repository

git clone https://github.com/MottuqeBrid/notehub-server.git

# Navigate to the server folder

cd notehub-server

# Install dependencies

npm install
