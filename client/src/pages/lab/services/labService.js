import axios from 'axios';

// SRP: This module handles only communication with the Lab Report API endpoints
// DIP: Components using this service depend on this abstraction, not directly on axios
export const labService = {
  // SRP: Fetch summary of lab reports
  async summary() {
    const response = await axios.get('/lab/reports/summary');
    return response.data;
  },

  // SRP: List all lab reports
  async list() {
    const response = await axios.get('/lab/reports');
    return response.data;
  },

  // SRP: List lab reports filtered by status
  async byStatus(status) {
    const response = await axios.get(`/lab/reports/status/${status}`);
    return response.data;
  },

  // SRP: Search lab reports by patient name or keyword
  async search(keyword) {
    const response = await axios.get(`/lab/reports/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },

  // SRP & OCP: Handles uploading a new lab report with optional file
  // OCP: Can support new fields or file types without changing the function signature
  async upload(data, file) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    if (file) formData.append('file', file);
    const response = await axios.post('/lab/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // SRP: Updates status of a specific lab report
  async updateStatus(id, status) {
    const response = await axios.patch(`/lab/reports/${id}/status?status=${encodeURIComponent(status)}`);
    return response.data;
  },

  // SRP: Fetches list of patients for lab report uploads
  async listPatients() {
    const response = await axios.get('/lab/reports/patients');
    return response.data;
  }
};

// SRP: Default export provides a single, reusable abstraction for Lab Report API
export default labService;
