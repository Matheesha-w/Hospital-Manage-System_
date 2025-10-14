import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminLabStaffTable = ({ onRemove, onStatusChange, onUpdate }) => {
  const [labStaff, setLabStaff] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axios.get('/admin/users');
        const users = res.data?.data || [];
        const filtered = users.filter(u => Array.isArray(u.roles) && u.roles.includes('LAB_TECHNICIAN'));
        if (mounted) setLabStaff(filtered);
      } catch {
        if (mounted) setLabStaff([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Lab Staff</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">ID</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Full Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Email</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Department</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Specialization</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Roles</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {labStaff.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center text-gray-500 py-6">No lab staff found.</td>
              </tr>
            ) : (
              labStaff.map((staff, idx) => (
                <tr key={staff.id} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{staff.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">{`${staff.firstName || ''} ${staff.lastName || ''}`.trim()}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{staff.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{staff.phoneNumber || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{staff.department || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{staff.specialization || '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${staff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-700">{Array.isArray(staff.roles) ? staff.roles.join(', ') : '-'}</td>
                  <td className="px-4 py-2 whitespace-nowrap space-x-2">
                    <button onClick={() => onRemove(staff.id)} className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition">Remove</button>
                    <button onClick={() => onStatusChange(staff.id, staff.status === 'active' ? 'inactive' : 'active')} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 transition">
                      {staff.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => onUpdate(staff)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition">Update</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLabStaffTable;
