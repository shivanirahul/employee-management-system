import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📋 Dashboard (Protected Area)</h2>
      <p>Welcome! If you see this, your JWT authentication token is working.</p>

      <button onClick={handleLogout} className="logout-button">
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;