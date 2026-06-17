import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import EmployeeList from '../pages/EmployeeList';
import EmployeeAdd from '../pages/EmployeeAdd/employeeAdd';
import EmployeeEdit from '../pages/EmployeeEdit';
import EmployeeView from '../pages/EmployeeView';
// Import the guard component you built earlier:
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Core Application Routes (Now securely locked!) */}
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
        <Route path="/employee-add" element={<EmployeeAddPage />} />

        {/* Redirect any unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
