import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import Layout from '../../components/Layout/Layout';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="dashboard-container">
        <h2 className="dashboard-title">📋 Dashboard</h2>

      </div>
    </Layout>
  );
};

export default Dashboard;