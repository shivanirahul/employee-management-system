import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import EmployeeList from '../pages/EmployeeList';
import EmployeeAdd from '../pages/EmployeeAdd';
import EmployeeEdit from '../pages/EmployeeEdit';
import EmployeeView from '../pages/EmployeeView';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Core Application Routes (Protected routes placeholder) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/add" element={<EmployeeAdd />} />
        <Route path="/employees/edit/:id" element={<EmployeeEdit />} />
        <Route path="/employees/view/:id" element={<EmployeeView />} />

        {/* Redirect any unknown paths to login or dashboard */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}