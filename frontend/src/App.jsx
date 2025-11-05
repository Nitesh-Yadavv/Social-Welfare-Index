// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import SignupForm from "./components/SignupForm"; // ✅ NEW: Import SignupForm

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // ✅ NEW: Simple check if user is logged in (e.g., by checking localStorage)
  // This helps persist login state on refresh
  React.useEffect(() => {
    if (localStorage.getItem('user')) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
            )
          }
        />
        {/* ✅ NEW: Add the signup route */}
        <Route
          path="/signup"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <SignupForm />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={() => setIsLoggedIn(false)} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;