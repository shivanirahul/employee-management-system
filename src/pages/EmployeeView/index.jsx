import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCountries, getDesignations, getCourses, getSpecializations, getInstitutions, getCompanies } from '../../services/masterService';
import { getEmployeeById } from '../../services/employeeService';
import './index.css';

// Helper: find display name from a lookup array by matching _id
const resolve = (arr, id, ...fields) => {
  const found = arr.find((item) => (item._id || item.id) === id);
  if (!found) return id || '—';
  for (const f of fields) {
    if (found[f]) return found[f];
  }
  return '—';
};

// Format ISO date string to dd/mm/yyyy
const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB');
};

export default function EmployeeView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lookup arrays — same ones the form uses
  const [countries, setCountries] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [
          empRes,
          countriesRes,
          designationsRes,
          coursesRes,
          specializationsRes,
          institutionsRes,
          companiesRes,
        ] = await Promise.all([
          getEmployeeById(id),
          getCountries(),
          getDesignations(),
          getCourses(),
          getSpecializations(),
          getInstitutions(),
          getCompanies(),
        ]);

        // Unwrap employee — backend returns { success, data: {...} }
        setEmployee(empRes.data?.data || empRes.data);

        // Unwrap lookup arrays using same defensive pattern as EmployeeForm
        const unwrap = (res) => {
          const d = res?.data?.data || res?.data || res || [];
          return Array.isArray(d) ? d : (d.data || []);
        };

        setCountries(unwrap(countriesRes));
        setDesignations(unwrap(designationsRes));
        setCourses(unwrap(coursesRes));
        setSpecializations(unwrap(specializationsRes));
        setInstitutions(unwrap(institutionsRes));
        setCompanies(unwrap(companiesRes));
      } catch (err) {
        console.error('EmployeeView load error:', err);
        setError('Could not load employee details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id]);

  if (loading) return <div className="ev-loading">Loading employee profile...</div>;
  if (error)   return <div className="ev-error">{error}</div>;
  if (!employee) return <div className="ev-error">Employee not found.</div>;

  const emp = employee;

  return (
    <div className="ev-page">

      {/* ── Header ── */}
      <div className="ev-header">
        <button className="ev-back-btn" onClick={() => navigate(-1)}>← Back</button>
        <div className="ev-title-block">
          <div className="ev-avatar">
            {emp.FirstName?.[0]}{emp.LastName?.[0]}
          </div>
          <div>
            <h1 className="ev-name">{emp.FirstName} {emp.LastName}</h1>
            <p className="ev-sub">
              {resolve(designations, emp.Designation,
                'DesignationName', 'Title', 'Name', 'designationName', 'name')}
            </p>
          </div>
        </div>
        <button
          className="ev-edit-btn"
          onClick={() => navigate(`/employees/edit/${id}`)}
        >
          ✏️ Edit
        </button>
      </div>

      {/* ── Personal Information ── */}
      <section className="ev-card">
        <h2 className="ev-section-title">👤 Personal Information</h2>
        <div className="ev-grid">
          <div className="ev-field">
            <span className="ev-label">First Name</span>
            <span className="ev-value">{emp.FirstName || '—'}</span>
          </div>
          <div className="ev-field">
            <span className="ev-label">Last Name</span>
            <span className="ev-value">{emp.LastName || '—'}</span>
          </div>
          <div className="ev-field">
            <span className="ev-label">Gender</span>
            <span className="ev-value">{emp.Gender || '—'}</span>
          </div>
          <div className="ev-field">
            <span className="ev-label">Date of Birth</span>
            <span className="ev-value">{formatDate(emp.DOB)}</span>
          </div>
        </div>
      </section>

      {/* ── Contact Information ── */}
      <section className="ev-card">
        <h2 className="ev-section-title">📞 Contact Information</h2>
        <div className="ev-grid">
          <div className="ev-field">
            <span className="ev-label">Personal Email</span>
            <span className="ev-value">{emp.PersonalEmail || '—'}</span>
          </div>
          <div className="ev-field">
            <span className="ev-label">Mobile Number</span>
            <span className="ev-value">{emp.MobileNumber || '—'}</span>
          </div>
          <div className="ev-field">
            <span className="ev-label">Postal Address</span>
            <span className="ev-value">{emp.PostalAddress || '—'}</span>
          </div>
          <div className="ev-field">
            <span className="ev-label">City</span>
            <span className="ev-value">{emp.City || '—'}</span>
          </div>
          <div className="ev-field">
            <span className="ev-label">Country</span>
            <span className="ev-value">
              {resolve(countries, emp.Country, 'Name', 'name')}
            </span>
          </div>
        </div>
      </section>

      {/* ── Employment Information ── */}
      <section className="ev-card">
        <h2 className="ev-section-title">💼 Employment Information</h2>
        <div className="ev-grid">
          <div className="ev-field">
            <span className="ev-label">Designation</span>
            <span className="ev-value">
              {resolve(designations, emp.Designation,
                'DesignationName', 'Title', 'Name', 'designationName', 'name')}
            </span>
          </div>
          <div className="ev-field">
            <span className="ev-label">Basic Pay</span>
            <span className="ev-value">
              {emp.BasicPay ? `₹ ${emp.BasicPay.toLocaleString('en-IN')}` : '—'}
            </span>
          </div>
        </div>
      </section>

      {/* ── Education ── */}
      <section className="ev-card">
        <h2 className="ev-section-title">🎓 Education</h2>
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
                    <span className="ev-value">
                      {resolve(courses, edu.Course, 'Name', 'name')}
                    </span>
                  </div>
                  <div className="ev-field">
                    <span className="ev-label">Specialization</span>
                    <span className="ev-value">
                      {resolve(specializations, edu.Specialization, 'Specialization', 'Name', 'name')}
                    </span>
                  </div>
                  <div className="ev-field">
                    <span className="ev-label">Institution</span>
                    <span className="ev-value">
                      {resolve(institutions, edu.Institution, 'Name', 'name')}
                    </span>
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
      </section>

      {/* ── Work Experience ── */}
      <section className="ev-card">
        <h2 className="ev-section-title">🏢 Work Experience</h2>
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
                    <span className="ev-value">
                      {resolve(companies, exp.Company, 'Name', 'name')}
                    </span>
                  </div>
                  <div className="ev-field">
                    <span className="ev-label">Last Designation</span>
                    <span className="ev-value">{exp.LastDesignation || '—'}</span>
                  </div>
                  <div className="ev-field">
                    <span className="ev-label">Duration</span>
                    <span className="ev-value">
                      {exp.DurationMonths ? `${exp.DurationMonths} months` : '—'}
                    </span>
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
      </section>

    </div>
  );
}