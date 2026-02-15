# 💰 Expense Tracker

A full-stack MERN application for tracking personal expenses with user authentication and transaction management.

## 🚀 Features

- **User Authentication** - Secure login and registration with JWT
- **Transaction Management** - Add, view, and manage income/expense transactions
- **Transaction Explorer** - Browse and filter all transactions
- **Responsive Design** - Modern UI with React and CSS

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios
- Vite

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/expense-tracker-app.git
   cd expense-tracker-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend` folder (use `.env.example` as template):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## 🏃 Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:5000`

3. **Start Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on `http://localhost:5173`

## 📁 Project Structure

```
expense-tracker-app/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.jsx      # Main app component
│   └── index.html
└── README.md
```


