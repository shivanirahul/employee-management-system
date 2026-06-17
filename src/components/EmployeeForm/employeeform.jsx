import { useState, useEffect } from 'react';
import PersonalInfoStep from './PersonalInfoStep';
import ContactDetailsStep from './ContactDetailsStep';
import JobDetailsStep from './JobDetailsStep';
import { getCountries, getDesignations } from '../../services/masterService';
import { createEmployee } from '../../services/employeeService';
import './EmployeeForm.css';

const initialFormData = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  personalEmail: '',
  mobileNumber: '',
  postalAddress: '',
  city: '',
  country: '',
  designation: '',
  basicPay: '',
};

const steps = ['Personal Information', 'Contact Details', 'Job Details'];

export default function EmployeeForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [countries, setCountries] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load both dropdowns once, in parallel, when the page mounts
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [countriesRes, designationsRes] = await Promise.all([
          getCountries(),
          getDesignations(),
        ]);
        setCountries(countriesRes.data);
        setDesignations(designationsRes.data);
      } catch (err) {
        console.error('Failed to load dropdown data:', err);
      }
    };
    loadDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    }
    if (step === 2) {
      if (!formData.personalEmail.trim()) newErrors.personalEmail = 'Email is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await createEmployee(formData);
      setSubmitSuccess(true);
      setFormData(initialFormData);
      setStep(1);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to add employee. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-employee-page">
      <div className="add-employee-header">
        <button className="back-link" type="button" onClick={() => window.history.back()}>
          &larr; Back
        </button>
        <h1>Add New Employee</h1>
      </div>

      <div className="stepper">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          return (
            <div
              key={label}
              className={
                'stepper-item' +
                (step === stepNumber ? ' active' : '') +
                (step > stepNumber ? ' completed' : '')
              }
            >
              <span className="stepper-circle">{stepNumber}</span>
              <span className="stepper-label">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="form-card">
        {step === 1 && (
          <PersonalInfoStep formData={formData} errors={errors} onChange={handleChange} />
        )}
        {step === 2 && (
          <ContactDetailsStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            countries={countries}
          />
        )}
        {step === 3 && (
          <JobDetailsStep
            formData={formData}
            errors={errors}
            onChange={handleChange}
            designations={designations}
          />
        )}

        {submitError && <p className="form-error">{submitError}</p>}
        {submitSuccess && <p className="form-success">Employee added successfully!</p>}

        <div className="form-nav">
          {step > 1 && (
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              Previous
            </button>
          )}
          {step < 3 && (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Next
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Employee'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}