import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getCountries, getDesignations, getCourses, getSpecializations, getInstitutions, getCompanies } from '../../services/masterService';
import { getEmployeeById } from '../../services/employeeService';
import apiClient from '../../services/api';
import './index.css';

const resolve = (arr, id, ...fields) => {
  const found = arr.find((item) => (item._id || item.id) === id);
  if (!found) return id || '—';
  for (const f of fields) { if (found[f]) return found[f]; }
  return '—';
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function EmployeeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [countries, setCountries] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
  if (location.state?.successMessage) {
    setSuccessMessage(location.state.successMessage);

    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 4000);

    return () => clearTimeout(timer);
  }
  }, [location]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [empRes, cR, dR, coR, spR, iR, compR] = await Promise.all([
          getEmployeeById(id),
          getCountries(), getDesignations(), getCourses(),
          getSpecializations(), getInstitutions(), getCompanies(),
        ]);

        setEmployee(empRes.data?.data || empRes.data);

        const unwrap = (res) => {
          const d = res?.data?.data || res?.data || res || [];
          return Array.isArray(d) ? d : (d.data || []);
        };

        setCountries(unwrap(cR));
        setDesignations(unwrap(dR));
        setCourses(unwrap(coR));
        setSpecializations(unwrap(spR));
        setInstitutions(unwrap(iR));
        setCompanies(unwrap(compR));
      } catch (err) {
        console.error('EmployeeView load error:', err);
        setError('Could not load employee details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiClient.delete(`/api/employee/${id}`);
      navigate('/employees');
    } catch (err) {
      console.error('Delete failed:', err);
      setDeleting(false);
      setShowConfirm(false);
      alert('Failed to delete employee. Please try again.');
    }
  };

  if (loading) return <div className="ev-loading">Loading employee profile...</div>;
  if (error)   return <div className="ev-error">{error}</div>;
  if (!employee) return <div className="ev-error">Employee not found.</div>;

  const emp = employee;

  return (
    <div className="ev-page">
      {successMessage && <div className="success-alert">{successMessage}</div>}
      {showConfirm && (
        <div className="ev-confirm-overlay">
          <div className="ev-confirm-box">
            <h3>Delete Employee?</h3>
            <p>This will permanently remove <strong>{emp.FirstName} {emp.LastName}</strong> from the system. This action cannot be undone.</p>
            <div className="ev-confirm-actions">
              <button className="ev-confirm-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className="ev-confirm-delete" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

     
      <div className="ev-header">
        <button className="ev-back-btn" onClick={() => navigate(`/employees`)}>← Back</button>

        <div className="ev-title-block">
          <div className="ev-avatar">{emp.FirstName?.[0]}{emp.LastName?.[0]}</div>
          <div>
            <h1 className="ev-name">{emp.FirstName} {emp.LastName}</h1>
            <p className="ev-sub">
              {resolve(designations, emp.Designation, 'DesignationName', 'Title', 'Name', 'name')}
            </p>
          </div>
        </div>

        <div className="ev-action-group">
          <button className="ev-edit-btn" onClick={() => navigate(`/employees/edit/${id}`)}>
            ✏️ Edit
          </button>
          <button className="ev-delete-btn" onClick={() => setShowConfirm(true)}>
            🗑 Delete
          </button>
        </div>
      </div>

     
      <div className="ev-row">
        <div className="ev-card">
          <div className="ev-section-title">Personal</div>
          <div className="ev-grid">
            <div className="ev-field">
              <span className="ev-label">Date of Birth</span>
              <span className="ev-value">{formatDate(emp.DOB)}</span>
            </div>
            <div className="ev-field">
              <span className="ev-label">Gender</span>
              <span className="ev-value">{emp.Gender || '—'}</span>
            </div>
            <div className="ev-field">
              <span className="ev-label">Basic Pay</span>
              <span className="ev-value">
                {emp.BasicPay ? `₹ ${emp.BasicPay.toLocaleString('en-IN')}` : '—'}
              </span>
            </div>
            <div className="ev-field">
              <span className="ev-label">Designation</span>
              <span className="ev-value">
                {resolve(designations, emp.Designation, 'DesignationName', 'Title', 'Name', 'name')}
              </span>
            </div>
          </div>
        </div>

        <div className="ev-card">
          <div className="ev-section-title">Contact</div>
          <div className="ev-grid">
            <div className="ev-field">
              <span className="ev-label">Email</span>
              <span className="ev-value">{emp.PersonalEmail || '—'}</span>
            </div>
            <div className="ev-field">
              <span className="ev-label">Mobile</span>
              <span className="ev-value">{emp.MobileNumber || '—'}</span>
            </div>
            <div className="ev-field">
              <span className="ev-label">Address</span>
              <span className="ev-value">{emp.PostalAddress || '—'}</span>
            </div>
            <div className="ev-field">
              <span className="ev-label">City</span>
              <span className="ev-value">{emp.City || '—'}</span>
            </div>
            <div className="ev-field">
              <span className="ev-label">Country</span>
              <span className="ev-value">{resolve(countries, emp.Country, 'Name', 'name')}</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="ev-card">
        <div className="ev-section-title">Education</div>
        {(!emp.Education || emp.Education.length === 0) ? (
          <p className="ev-empty">No education records.</p>
        ) : (
          <div className="ev-entry-list">
            {emp.Education.map((edu, i) => (
              <div className="ev-entry-card" key={edu._id || i}>
                <div className="ev-entry-label">Education #{i + 1}</div>
                <div className="ev-grid">
                  <div className="ev-field">
                    <span className="ev-label">Course</span>
                    <span className="ev-value">{resolve(courses, edu.Course, 'Name', 'name')}</span>
                  </div>
                  <div className="ev-field">
                    <span className="ev-label">Specialization</span>
                    <span className="ev-value">{resolve(specializations, edu.Specialization, 'Specialization', 'Name', 'name')}</span>
                  </div>
                  <div className="ev-field">
                    <span className="ev-label">Institution</span>
                    <span className="ev-value">{resolve(institutions, edu.Institution, 'Name', 'name')}</span>
                  </div>
                  <div className="ev-field">
                    <span className="ev-label">Grade / CGPA</span>
                    <span className="ev-value">{edu.Grade ?? '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      
      <div className="ev-card">
        <div className="ev-section-title">Work Experience</div>
        {(!emp.WorkExperience || emp.WorkExperience.length === 0) ? (
          <p className="ev-empty">No work experience records.</p>
        ) : (
          <div className="ev-entry-list">
            {emp.WorkExperience.map((exp, i) => (
              <div className="ev-entry-card" key={exp._id || i}>
                <div className="ev-entry-label">Experience #{i + 1}</div>
                <div className="ev-grid">
                  <div className="ev-field">
                    <span className="ev-label">Company</span>
                    <span className="ev-value">{resolve(companies, exp.Company, 'Name', 'name')}</span>
                  </div>
                  <div className="ev-field">
                    <span className="ev-label">Last Designation</span>
                    <span className="ev-value">{exp.LastDesignation || '—'}</span>
                  </div>
                  <div className="ev-field">
                    <span className="ev-label">Duration</span>
                    <span className="ev-value">{exp.DurationMonths ? `${exp.DurationMonths} months` : '—'}</span>
                  </div>
                  <div className="ev-field ev-field-full">
                    <span className="ev-label">Remarks</span>
                    <span className="ev-value">{exp.Remarks || '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}