import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import EmployeeList from '../pages/EmployeeList';
import EmployeeAdd from '../pages/EmployeeAdd/index';
import EmployeeEdit from '../pages/EmployeeEdit';
import EmployeeView from '../pages/EmployeeView';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/employees" element={
          <ProtectedRoute>
            <EmployeeList />
          </ProtectedRoute>
        } />
        
        <Route path="/employees/add" element={
          <ProtectedRoute>
            <EmployeeAdd />
          </ProtectedRoute>
        } />
        
        <Route path="/employees/edit/:id" element={
          <ProtectedRoute>
            <EmployeeEdit />
          </ProtectedRoute>
        } />
        
        <Route path="/employees/view/:id" element={
          <ProtectedRoute>
            <EmployeeView />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}