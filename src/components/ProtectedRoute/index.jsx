import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    // No token? Boot them back to login page
    return <Navigate to="/login" replace />;
  }

  // Token exists? Let them view the page
  return children;
}