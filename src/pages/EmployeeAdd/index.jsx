import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm';
import { createEmployee } from '../../services/employeeService';
import Layout from "../../components/Layout/Layout";

export default function EmployeeAdd() {
  const navigate = useNavigate();
  const [backendError, setBackendError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      await createEmployee(formData);
      navigate('/employees', { 
     state: { successMessage: 'Employee added successfully!' } 
  });
  }
    catch (err) {
      setBackendError(err.response?.data?.message || 'Failed to save employee.');
    }
  };

  return (
    <Layout>
      <div className="page-container" style={{ padding: '20px' }}>
        <EmployeeForm onSubmit={handleSubmit} backendError={backendError} />
      </div>
    </Layout>
  );
}