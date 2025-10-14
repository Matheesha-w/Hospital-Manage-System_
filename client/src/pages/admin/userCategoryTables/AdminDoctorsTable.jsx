import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDoctorsTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axios.get('/admin/users');
        const users = res.data?.data || [];
        const filtered = users.filter(u => Array.isArray(u.roles) && u.roles.includes('DOCTOR'));
        if (mounted) setDoctors(filtered);
      } catch {
        if (mounted) setDoctors([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Remove doctor
  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this doctor?')) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      setDoctors(doctors => doctors.filter(d => d.id !== id));
    } catch {
      alert('Failed to remove doctor.');
    }
  };

  // Open update modal
  const handleUpdate = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      email: doctor.email || '',
      phoneNumber: doctor.phoneNumber || '',
      department: doctor.department || '',
      specialization: doctor.specialization || '',
      status: doctor.status || 'active',
    });
    setModalOpen(true);
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // Submit update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/admin/users/${editingDoctor.id}`, form);
      setDoctors(doctors => doctors.map(d => d.id === editingDoctor.id ? { ...d, ...form } : d));
      setModalOpen(false);
      setEditingDoctor(null);
    } catch {
      alert('Failed to update doctor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Doctors</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Full Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Department</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Specialization</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Roles</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-green-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-6">No doctors found.</td>
              </tr>
            ) : (
              doctors.map((doctor, idx) => (
                <tr key={doctor.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{doctor.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{`${doctor.firstName || ''} ${doctor.lastName || ''}`.trim()}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{doctor.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{doctor.phoneNumber || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{doctor.department || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{doctor.specialization || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${doctor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {doctor.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">{Array.isArray(doctor.roles) ? doctor.roles.join(', ') : '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap space-x-2">
                    <button onClick={() => handleRemove(doctor.id)} className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition">Remove</button>
                    {/* ...existing code for status change... */}
                    <button onClick={() => handleUpdate(doctor)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition">Update</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Update Doctor</h3>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input name="firstName" value={form.firstName} onChange={handleFormChange} className="w-full border rounded px-2 py-1" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleFormChange} className="w-full border rounded px-2 py-1" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input name="email" value={form.email} onChange={handleFormChange} className="w-full border rounded px-2 py-1" type="email" required />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleFormChange} className="w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Department</label>
                <input name="department" value={form.department} onChange={handleFormChange} className="w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Specialization</label>
                <input name="specialization" value={form.specialization} onChange={handleFormChange} className="w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select name="status" value={form.status} onChange={handleFormChange} className="w-full border rounded px-2 py-1">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setModalOpen(false)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={loading} className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDoctorsTable;
