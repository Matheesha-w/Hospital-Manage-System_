import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPharmacistsTable = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [editingPharmacist, setEditingPharmacist] = useState(null);
  const [form, setForm] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axios.get('/admin/users');
        const users = res.data?.data || [];
        const filtered = users.filter(u => Array.isArray(u.roles) && u.roles.includes('PHARMACIST'));
        if (mounted) setPharmacists(filtered);
      } catch {
        if (mounted) setPharmacists([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Remove pharmacist
  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this pharmacist?')) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      setPharmacists(pharmacists => pharmacists.filter(p => p.id !== id));
    } catch {
      alert('Failed to remove pharmacist.');
    }
  };

  // Open update modal
  const handleUpdate = (pharmacist) => {
    setEditingPharmacist(pharmacist);
    setForm({
      firstName: pharmacist.firstName || '',
      lastName: pharmacist.lastName || '',
      email: pharmacist.email || '',
      phoneNumber: pharmacist.phoneNumber || '',
      department: pharmacist.department || '',
      specialization: pharmacist.specialization || '',
      status: pharmacist.status || 'active',
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
      await axios.put(`/admin/users/${editingPharmacist.id}`, form);
      setPharmacists(pharmacists => pharmacists.map(p => p.id === editingPharmacist.id ? { ...p, ...form } : p));
      setModalOpen(false);
      setEditingPharmacist(null);
    } catch {
      alert('Failed to update pharmacist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-orange-700">Pharmacists</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Full Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Department</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Specialization</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Roles</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {pharmacists.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-6">No pharmacists found.</td>
              </tr>
            ) : (
              pharmacists.map((pharmacist, idx) => (
                <tr key={pharmacist.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{pharmacist.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{`${pharmacist.firstName || ''} ${pharmacist.lastName || ''}`.trim()}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{pharmacist.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{pharmacist.phoneNumber || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{pharmacist.department || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{pharmacist.specialization || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${pharmacist.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {pharmacist.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">{Array.isArray(pharmacist.roles) ? pharmacist.roles.join(', ') : '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap space-x-2">
                    <button onClick={() => handleRemove(pharmacist.id)} className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition">Remove</button>
                    <button onClick={() => handleUpdate(pharmacist)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition">Update</button>
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
            <h3 className="text-lg font-bold mb-4">Update Pharmacist</h3>
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
                <input name="specialization" value={form.specialization} onChange={handleFormChange} className="w-full border rounded px-2 py-1" placeholder="e.g., Clinical Pharmacy" />
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
                <button type="submit" disabled={loading} className="px-3 py-1 rounded bg-orange-600 text-white hover:bg-orange-700">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPharmacistsTable;
