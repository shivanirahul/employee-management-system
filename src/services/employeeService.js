import apiClient from './api';

export const getCountries = () => apiClient.get('/api/countries');

export const getDesignations = () => apiClient.get('/api/designations');

export const getCourses = () => apiClient.get('/api/courses');

export const getSpecializations = () => apiClient.get('/api/specializations');

export const getInstitutions = () => apiClient.get('/api/institutions');

export const getCompanies = () => apiClient.get('/api/companies');

export const createEmployee = (employeeData) => apiClient.post('/api/employee', employeeData);

export const getEmployeeById = (id) => apiClient.get(`/api/employee/${id}`);

export const updateEmployee = (id, data) => apiClient.put(`/api/employee/${id}`, data);