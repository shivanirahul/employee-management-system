import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm';
import { getEmployeeById, updateEmployee } from '../../services/employeeService';
import Layout from "../../components/Layout/Layout";

// Maps the API response (PascalCase) back to the form's shape (camelCase)
// This is the reverse of what handleSubmit does when sending to the backend
const mapApiToForm = (emp) => ({
  firstName:     emp.FirstName      || '',
  lastName:      emp.LastName       || '',
  gender:        emp.Gender         || '',
  dob:           emp.DOB ? emp.DOB.split('T')[0] : '',   // "1997-06-10T00:00:00.000Z" → "1997-06-10"
  email:         emp.PersonalEmail  || '',
  phone:         emp.MobileNumber   || '',
  postalAddress: emp.PostalAddress  || '',
  city:          emp.City           || '',
  countryId:     emp.Country        || '',
  designationId: emp.Designation    || '',
  joiningDate:   emp.JoiningDate ? emp.JoiningDate.split('T')[0] : '',
  salary:        emp.BasicPay       || '',

  // Education rows — map back to your form's internal shape
  // generateId gives each row a local id so add/remove still works
  education: (emp.Education || []).map((edu) => ({
    id:             `edu-prefill-${edu._id}`,
    course:         edu.Course         || '',
    specialization: edu.Specialization || '',
    institution:    edu.Institution    || '',
    grade:          edu.Grade != null ? String(edu.Grade) : '',
  })),

  // Work experience rows
  workExperience: (emp.WorkExperience || []).map((exp) => ({
    id:              `exp-prefill-${exp._id}`,
    company:         exp.Company         || '',
    lastDesignation: exp.LastDesignation || '',
    duration:        exp.DurationMonths  != null ? String(exp.DurationMonths) : '',
    remarks:         exp.Remarks         || '',
  })),
});

export default function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [backendError, setBackendError] = useState('');

  // Fetch existing employee on mount and map to form shape
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getEmployeeById(id);
        const emp = res.data?.data || res.data;
        setInitialData(mapApiToForm(emp));
      } catch (err) {
        console.error('EmployeeEdit fetch error:', err);
        setFetchError('Could not load employee data. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Called by EmployeeForm's handleSubmit — payload is already PascalCase mapped
  const handleSubmit = async (payload) => {
    try {
      setBackendError('');
      await updateEmployee(id, payload);
      alert("Employee updated successfully!");
      navigate(`/employees/view/${id}`);
    } catch (err) {
      console.error('EmployeeEdit update error:', err);
      setBackendError(
        err.response?.data?.message || 'Failed to update employee. Please try again.'
      );
    }
  };

  if (loading) {
    return (
      <Layout>
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6b6680' }}>
        Loading employee data...
      </div>
      </Layout>
    );
  }

  if (fetchError) {
    return (
      <Layout>
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#b3273f' }}>
        {fetchError}
      </div>
      </Layout>
    );
  }

  return (

    <Layout>
    <div style={{ padding: '20px' }}>
      <EmployeeForm
        onSubmit={handleSubmit}
        backendError={backendError}
        initialData={initialData}
        isEditMode={true}
      />
    </div>
    </Layout>
  );
}
