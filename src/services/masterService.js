import apiClient from './api';

export const getCountries = () => apiClient.get('/countries');
export const getDesignations = () => apiClient.get('/designations');