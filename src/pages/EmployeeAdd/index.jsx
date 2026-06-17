import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm';
import { createEmployee } from '../../services/employeeService';

export default function EmployeeAdd() {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState('');

  const handleFormSubmit = async (formData) => {
    try {
      setBackendError('');
      const response = await createEmployee(formData);
      
      if (response) {
        navigate('/dashboard/employees');
      }
    } catch (err) {
      console.error("Failed to save employee to MongoDB:", err);
      setBackendError(err.response?.data?.message || 'Failed to save employee record.');
    }
  };

  return (
    <div className="page-container" style={{ padding: '20px' }}>
      <h2>📋 Add New Employee</h2>
      <EmployeeForm onSubmit={handleFormSubmit} backendError={backendError} />
    </div>
  );
}