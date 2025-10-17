import axios from 'axios';

export const getSurgeries = () => axios.get('/doctor/surgeries');
export const getCounts = () => axios.get('/doctor/surgeries/counts');
export const getPatients = () => axios.get('/doctor/surgeries/patients');
export const getSurgeryById = (id) => axios.get(`/doctor/surgeries/${id}`);
export const createSurgery = (payload) => axios.post('/doctor/surgeries', payload);
export const updateSurgery = (payload) => axios.put('/doctor/surgeries', payload);
export const deleteSurgery = (id) => axios.delete(`/doctor/surgeries/${id}`);
export const completeSurgery = (id) => axios.put(`/doctor/surgeries/${id}/complete`);
