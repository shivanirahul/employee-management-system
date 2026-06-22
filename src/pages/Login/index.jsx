import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './LoginStyles.css';
import logoIcon from './logo.jpeg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await authService.login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-banner-section">
          <div className="banner-content">
            
            <div className="banner-logo-circle">
              <img src={logoIcon} alt="EmpTrack Logo" className="banner-logo-img" />
            </div>

            <span className="banner-small-text">WELCOME TO THE</span>
            <h1 className="banner-main-title">EMPTRACK</h1>
          </div>

          <div className="vector-mountain-layer"></div>
        </div>

        <div className="login-form-section">
          <h2 className="user-login-heading">USER LOGIN</h2>

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="stacked-form-layout">
            
            <div className="form-group-accent">
              <div className="input-icon-block">👤</div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="form-input-accent"
                placeholder="Username"
                required
              />
            </div>

            <div className="form-group-accent">
              <div className="input-icon-block">🔒</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="form-input-accent"
                placeholder="Password"
                required
              />
            </div>

            <div className="form-options-row">
              <label className="checkbox-label">
                <input type="checkbox" className="remember-me-check" />
                <span>Remember</span>
              </label>
              <a href="#forgot" className="forgot-password-link">Forgot password ?</a>
            </div>

            <div className="button-alignment-wrapper">
              <button
                type="submit"
                disabled={loading}
                className="login-button-accent"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}