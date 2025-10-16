import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { labService } from './services/labService';
import axios from 'axios';

const UploadReport = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    testName: '',
    description: '',
  });
  const [file, setFile] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('No authentication token available');
      return;
    }

    if (!formData.patientId || !formData.patientName || !formData.testName || !formData.description || !file) {
      setError('All fields and file are required');
      return;
    }

    const extOk = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!extOk.includes(file.type)) {
      setError('Only PDF or image files are allowed');
      return;
    }

    try {
      setLoading(true);
      const response = await labService.upload(formData, file);
      if (response.success) {
        setSuccess('Report uploaded successfully');
        setFormData({ patientId: '', patientName: '', testName: '', description: '' });
        setFile(null);
      } else {
        setError(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadPatients = async () => {
      if (!token) return;

      try {
        const response = await axios.get('/lab/reports/patients');
        if (response.data.success) setPatients(response.data.data || []);
      } catch (error) {
        console.error('Error loading patients:', error);
      }
    };
    loadPatients();
  }, [token]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Lab Report</h1>
      {error && <div className="mb-4 bg-red-50 text-red-700 border border-red-200 p-3 rounded">{error}</div>}
      {success && <div className="mb-4 bg-green-50 text-green-700 border border-green-200 p-3 rounded">{success}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Patient</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={formData.patientId}
            onChange={(e)=>{
              const pid = e.target.value;
              const p = patients.find(x=>x.patientId === pid);
              setFormData(prev=>({ ...prev, patientId: pid, patientName: p?.name || '' }));
            }}
            required
          >
            <option value="">Select a patient</option>
            {patients.map(p => (
              <option key={p.patientId} value={p.patientId}>{p.name} ({p.patientId})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Test Name</label>
          <input name="testName" value={formData.testName} onChange={handleChange} className="w-full border rounded px-3 py-2" type="text" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Remarks</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows="4" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Report File (PDF/Image)</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} className="w-full" />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default UploadReport;


