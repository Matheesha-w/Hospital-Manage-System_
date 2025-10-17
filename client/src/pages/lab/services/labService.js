import axios from 'axios';

// API abstraction for lab endpoints, using axios with proper authentication
export const labService = {
  async summary() {
    const response = await axios.get('/lab/reports/summary');
    return response.data;
  },
  async list() {
    const response = await axios.get('/lab/reports');
    return response.data;
  },
  async byStatus(status) {
    const response = await axios.get(`/lab/reports/status/${status}`);
    return response.data;
  },
  async search(keyword) {
    const response = await axios.get(`/lab/reports/search?keyword=${encodeURIComponent(keyword)}`);
    return response.data;
  },
  async upload(data, file) {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    if (file) formData.append('file', file);
    const response = await axios.post('/lab/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  async updateStatus(id, status) {
    const response = await axios.patch(`/lab/reports/${id}/status?status=${encodeURIComponent(status)}`);
    return response.data;
  }
};

export default labService;


