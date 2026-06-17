import React, { useState, useEffect } from 'react';
import { getCountries, getDesignations } from '../../services/masterService';

const EmployeeForm = ({ onSubmit, backendError }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    phone: '',
    countryId: '',
    designationId: '',
    joiningDate: '',
    salary: ''
  });

  const [countries, setCountries] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        console.log("Form mounted. Dispatching API requests to proxy...");
        const [countriesRes, designationsRes] = await Promise.all([
          getCountries(),
          getDesignations()
        ]);
        
        console.log("--- API RAW RESPONSE SUCCESS ---");
        console.log("Countries Server Output:", countriesRes);
        console.log("Designations Server Output:", designationsRes);

        // Dig deep to handle nested Axios or Express API wrapping structures
        const cData = countriesRes?.data?.data || countriesRes?.data || countriesRes || [];
        const dData = designationsRes?.data?.data || designationsRes?.data || designationsRes || [];

        // Secondary fallback checking for explicitly named properties inside responses
        const finalCountries = Array.isArray(cData) ? cData : (cData.countries || cData.data || []);
        const finalDesignations = Array.isArray(dData) ? dData : (dData.designations || dData.data || []);

        setCountries(finalCountries);
        setDesignations(finalDesignations);
      } catch (err) {
        console.error("--- DETECTED PROXY / BACKEND CRASH ---");
        console.error("Error Message:", err.message);
        if (err.response) {
          console.error("Server Status Code:", err.response.status);
          console.error("Server Returned Data:", err.response.data);
        } else {
          console.error("No response received. The frontend cannot see the backend server.");
        }
        setCountries([]);
        setDesignations([]);
      }
    };
    fetchLookups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) tempErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) tempErrors.lastName = 'Last Name is required';
    if (!formData.gender) tempErrors.gender = 'Gender is required';
    if (!formData.dob) tempErrors.dob = 'Date of Birth is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) tempErrors.phone = 'Phone number is required';
    if (!formData.countryId) tempErrors.countryId = 'Country is required';
    if (!formData.designationId) tempErrors.designationId = 'Designation is required';
    if (!formData.joiningDate) tempErrors.joiningDate = 'Joining Date is required';
    if (!formData.salary || Number(formData.salary) <= 0) tempErrors.salary = 'Valid salary is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="employee-form">
      {backendError && <div className="backend-error-alert">{backendError}</div>}

      <div className="form-section">
        <h3>👤 Personal Information</h3>
        <div className="form-group">
          <label>First Name *</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label>Gender *</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="error-text">{errors.gender}</span>}
        </div>
        <div className="form-group">
          <label>Date of Birth *</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          {errors.dob && <span className="error-text">{errors.dob}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3>📞 Contact Information</h3>
        <div className="form-group">
          <label>Email Address *</label>
          <input type="text" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Phone Number *</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label>Country *</label>
          <select name="countryId" value={formData.countryId} onChange={handleChange}>
            <option value="">Select Country</option>
            {countries && countries.map((c) => (
              <option key={c._id || c.id} value={c._id || c.id}>
                {c.Name}
              </option>
            ))}
          </select>
          {errors.countryId && <span className="error-text">{errors.countryId}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3>💼 Employment Information</h3>
        <div className="form-group">
          <label>Designation *</label>
          <select name="designationId" value={formData.designationId} onChange={handleChange}>
            <option value="">Select Designation</option>
            {designations && designations.map((d) => (
              <option key={d._id || d.id} value={d._id || d.id}>
                {d.DesignationName || d.Title || d.Name || d.designationName || d.title || d.name}
              </option>
            ))}
          </select>
          {errors.designationId && <span className="error-text">{errors.designationId}</span>}
        </div>
        <div className="form-group">
          <label>Joining Date *</label>
          <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
          {errors.joiningDate && <span className="error-text">{errors.joiningDate}</span>}
        </div>
        <div className="form-group">
          <label>Salary *</label>
          <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
          {errors.salary && <span className="error-text">{errors.salary}</span>}
        </div>
      </div>

      <button type="submit" className="submit-button">Save Employee</button>
    </form>
  );
};

export default EmployeeForm;