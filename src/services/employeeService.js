import apiClient from './api';

/**
 * All employee-related API calls live here, built on top of the shared
 * apiClient your teammate set up (baseURL + auth token interceptor).
 *
 * Adjust the endpoint paths below ('/countries', '/designations', '/employees')
 * to match whatever routes your teammate actually exposed on the backend.
 */

// GET list of countries -> used to populate the Country dropdown
export const getCountries = () => apiClient.get('/countries');

// GET list of designations -> used to populate the Designation dropdown
export const getDesignations = () => apiClient.get('/designations');

// POST a new employee document to MongoDB
export const createEmployee = (employeeData) => apiClient.post('/employees', employeeData);