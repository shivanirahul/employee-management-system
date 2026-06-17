import apiClient from './api';

export const getCountries = () => apiClient.get('/api/countries');
export const getDesignations = () => apiClient.get('/api/designations');
