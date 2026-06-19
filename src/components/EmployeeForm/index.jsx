import React, { useState, useEffect } from 'react';
import { getCountries, getDesignations, getCourses, getSpecializations, getInstitutions, getCompanies } from '../../services/masterService';
import './index.css';

const EmployeeForm = ({ onSubmit, backendError }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    phone: '',
    postalAddress: '', // <-- Added
    city: '',          // <-- Added
    countryId: '',
    designationId: '',
    joiningDate: '',
    salary: ''
  });

  const [countries, setCountries] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        console.log("Form mounted. Dispatching API requests to proxy...");
        const [countriesRes, designationsRes, coursesRes, specializationsRes, institutionsRes, companiesRes] = await Promise.all([
          getCountries(),
          getDesignations(),
          getCourses(),
          getSpecializations(),
          getInstitutions(),
          getCompanies()
        ]);

        console.log("--- API RAW RESPONSE SUCCESS ---");
        
        const cData = countriesRes?.data?.data || countriesRes?.data || countriesRes || [];
        const dData = designationsRes?.data?.data || designationsRes?.data || designationsRes || [];
        const courseData = coursesRes?.data?.data || coursesRes?.data || coursesRes || [];
        const specData = specializationsRes?.data?.data || specializationsRes?.data || specializationsRes || [];
        const instData = institutionsRes?.data?.data || institutionsRes?.data || institutionsRes || [];
        const compData = companiesRes?.data?.data || companiesRes?.data || companiesRes || [];

        const finalCourses = Array.isArray(courseData) ? courseData : (courseData.courses || courseData.data || []);
        const finalSpecializations = Array.isArray(specData) ? specData : (specData.specializations || specData.data || []);
        const finalInstitutions = Array.isArray(instData) ? instData : (instData.institutions || instData.data || []);
        const finalCompanies = Array.isArray(compData) ? compData : (compData.companies || compData.data || []);
        const finalCountries = Array.isArray(cData) ? cData : (cData.countries || cData.data || []);
        const finalDesignations = Array.isArray(dData) ? dData : (dData.designations || dData.data || []);

        setCountries(finalCountries);
        setDesignations(finalDesignations);
        setCourses(finalCourses);
        setSpecializations(finalSpecializations);
        setInstitutions(finalInstitutions);
        setCompanies(finalCompanies);

      } catch (err) {
        console.error("--- DETECTED PROXY / BACKEND CRASH ---");
        setCountries([]);
        setDesignations([]);
        setCourses([]);
        setSpecializations([]);
        setInstitutions([]);
        setCompanies([]);
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

  const generateId = (prefix) =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? `${prefix}-${crypto.randomUUID()}`
      : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const addEducation = () =>
    setEducation((prev) => [...prev, { id: generateId('edu'), course: '', specialization: '', institution: '', grade: '' }]);
  const removeEducation = (id) => setEducation((prev) => prev.filter((e) => e.id !== id));
  const updateEducation = (id, field, value) =>
    setEducation((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const addExperience = () =>
    setWorkExperience((prev) => [...prev, { id: generateId('exp'), company: '', lastDesignation: '', duration: '', remarks: '' }]);
  const removeExperience = (id) => setWorkExperience((prev) => prev.filter((e) => e.id !== id));
  const updateExperience = (id, field, value) =>
    setWorkExperience((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const validateForm = () => {
    const tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) tempErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) tempErrors.lastName = 'Last Name is required';

    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    const payload = {
      FirstName:     formData.firstName,
      LastName:      formData.lastName,
      Gender:        formData.gender,
      DOB:           formData.dob,
      PersonalEmail: formData.email,
      MobileNumber:  formData.phone,
      PostalAddress: formData.postalAddress,
      City:          formData.city,
      Country:     formData.countryId || undefined,
      Designation: formData.designationId || undefined,
      BasicPay:      Number(formData.salary),

      Education: education.map(({ id, ...e }) => ({
        Course:         e.course || undefined,
        Specialization: e.specialization || undefined,
        Institution:    e.institution || undefined,
        Grade:          e.grade ? Number(e.grade) : undefined,
  })),

  WorkExperience: workExperience.map(({ id, ...w }) => ({
  Company:         w.company || undefined,
  LastDesignation: w.lastDesignation || undefined,
  DurationMonths:  w.duration ? Number(w.duration) : undefined,
  Remarks:         w.remarks,
  })),
    };

    onSubmit(payload);
  }
};
  return (
    <form onSubmit={handleSubmit} className="employee-form">
      {backendError && <div className="backend-error-alert">{backendError}</div>}
      
      {/* Container row holding the back button tightly next to the title text */}
      <div className="form-header">
        <button type="button" className="back-btn" onClick={() => window.history.back()}>
          ← Back
        </button>
        <h2> Add New Employee</h2>
      </div>

      {/* Personal Information */}
      <div className="form-section">
        <h3> Personal Information</h3>
        <div className="form-group">
          <label>First Name <span style={{ color: '#dc2626' }}>*</span></label>
          <input 
            type="text" 
            name="firstName" 
            placeholder="e.g. Jennifer"
            value={formData.firstName} 
            onChange={handleChange} 
            className={errors.firstName ? 'input-error' : ''} 
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}
        </div>
        <div className="form-group">
          <label>Last Name <span style={{ color: '#dc2626' }}>*</span></label>
          <input 
            type="text" 
            name="lastName" 
            placeholder="e.g. Doe"
            value={formData.lastName} 
            onChange={handleChange} 
            className={errors.lastName ? 'input-error' : ''} 
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label>Gender </label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="error-text">{errors.gender}</span>}
        </div>
        <div className="form-group">
          <label>Date of Birth </label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          {errors.dob && <span className="error-text">{errors.dob}</span>}
        </div>
      </div>

      
      {/* Contact Information */}
      <div className="form-section">
        <h3> Contact Information</h3>
        <div className="form-group">
          <label>Email Address <span style={{ color: '#dc2626' }}>*</span></label>
          <input 
            type="text" 
            name="email" 
            placeholder="e.g. Jennie09@gmail.com" 
            value={formData.email} 
            onChange={handleChange} 
            className={errors.email ? 'input-error' : ''} 
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label>Phone Number </label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        {/* --- Added Postal Address --- */}
        <div className="form-group">
          <label>Postal Address </label>
          <input 
            type="text" 
            name="postalAddress" 
            placeholder="Street/Building/Area" 
            value={formData.postalAddress} 
            onChange={handleChange} 
          />
        </div>

        {/* --- Added City --- */}
        <div className="form-group">
          <label>City </label>
          <input 
            type="text" 
            name="city" 
            placeholder="e.g. Kochi" 
            value={formData.city} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>Country </label>
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

      {/* Employment Information */}
      <div className="form-section">
        <h3> Employment Information</h3>
        <div className="form-group">
          <label>Designation </label>
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
          <label>Joining Date </label>
          <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
          {errors.joiningDate && <span className="error-text">{errors.joiningDate}</span>}
        </div>
        <div className="form-group">
          <label>Salary </label>
          <input 
            type="number" 
            name="salary" 
            placeholder="e.g. 30000" 
            value={formData.salary} 
            onChange={handleChange} 
            className={errors.salary ? 'input-error' : ''} 
          />
          {errors.salary && <span className="error-text">{errors.salary}</span>}
        </div>
      </div> {/* <-- Added missing closing div here */}

      {/* Education */}
      <div className="form-section">
        <h3>Education</h3>
        <button type="button" onClick={addEducation}>+ Add</button>

        {education.length === 0 && (
          <p className="empty-notice-text">No education records yet. Click Add to include one.</p>
        )}
        {education.map((edu, index) => (
          <div className="form-group" key={edu.id}>
            <strong>Education #{index + 1}</strong>{' '}
            <button type="button" onClick={() => removeEducation(edu.id)}>🗑</button>

            <label>Course</label>
            <select value={edu.course} onChange={(e) => updateEducation(edu.id, 'course', e.target.value)}>
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.Name || c.name}</option>
              ))}
            </select>

            <label>Specialization</label>
            <select value={edu.specialization} onChange={(e) => updateEducation(edu.id, 'specialization', e.target.value)}>
              <option value="">Select Specialization</option>
              {specializations.map((s) => (
                <option key={s._id || s.id} value={s._id || s.id}>{s.Specialization}</option>
              ))}
            </select>

            <label>Institution</label>
            <select value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}>
              <option value="">Select Institution</option>
              {institutions.map((i) => (
                <option key={i._id || i.id} value={i._id || i.id}>{i.Name || i.name}</option>
              ))}
            </select>

            <label>Grade / CGPA</label>
            <input
              type="text"
              placeholder="e.g. 8.5"
              value={edu.grade}
              onChange={(e) => updateEducation(edu.id, 'grade', e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Work Experience */}
      <div className="form-section">
        <h3> Work Experience</h3>
        <button type="button" onClick={addExperience}>+ Add</button>

        {workExperience.length === 0 && (
          <p className="empty-notice-text">No work experience yet. Click Add to include one.</p>
        )}

        {workExperience.map((exp, index) => (
          <div className="form-group" key={exp.id}>
            <strong>Experience #{index + 1}</strong>{' '}
            <button type="button" onClick={() => removeExperience(exp.id)}>🗑</button>

            <label>Company</label>
            <select value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}>
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.Name || c.name}</option>
              ))}
            </select>

            <label>Last Designation</label>
            <input
              type="text"
              placeholder="e.g. Senior Developer"
              value={exp.lastDesignation}
              onChange={(e) => updateExperience(exp.id, 'lastDesignation', e.target.value)}
            />

            <label>Duration (Months)</label>
            <input
              type="number"
              placeholder="e.g. 24"
              value={exp.duration}
              onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
            />

            <label>Remarks</label>
            <textarea
              placeholder="Any notes about this role..."
              value={exp.remarks}
              onChange={(e) => updateExperience(exp.id, 'remarks', e.target.value)}
            />
          </div>
        ))}
      </div>

      <button type="submit" className="submit-button">Save Employee</button>
    </form>
  );
};

export default EmployeeForm;