import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({ onLogout }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/activities")
      .then((res) => setActivities(res.data))
      .catch((err) => console.error("Error fetching activities:", err));
  }, []);

  const totalPoints = activities.reduce((sum, a) => sum + a.points, 0);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🎓 Student Dashboard</h1>
      <p>Welcome back, Student!</p>

      <h3>Extra-Curricular Activities</h3>
      <table border="1" cellPadding="10" style={{ marginTop: "10px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Activity</th>
            <th>Status</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.status}</td>
              <td>{a.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "20px" }}>Total Points: {totalPoints}</h3>

      <button onClick={onLogout} style={{ marginTop: "20px", padding: "8px 16px" }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
