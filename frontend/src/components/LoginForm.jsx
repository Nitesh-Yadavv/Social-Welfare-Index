// src/components/LoginForm.jsx
import React, { useState } from "react";
import axios from "axios";

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/login", { email, password });
      if (res.data.status === "success") {
        setMessage("Login successful!");
        onLoginSuccess(); // 👈 redirect to dashboard
      } else {
        setMessage("Login failed: Invalid credentials");
      }
    } catch (err) {
      setMessage("Login failed: " + err.message);
    }
  };

  return (
    <div style={{ margin: "80px auto", width: "350px", textAlign: "center" }}>
      <h2>Student Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <button type="submit" style={{ width: "100%", padding: "8px" }}>
          Login
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default LoginForm;
