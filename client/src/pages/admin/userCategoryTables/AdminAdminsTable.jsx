import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminAdminsTable = ({ onRemove, onStatusChange, onUpdate }) => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await axios.get('/admin/users');
        const users = res.data?.data || [];
        const filtered = users.filter(u => Array.isArray(u.roles) && u.roles.includes('ADMIN'));
        if (mounted) setAdmins(filtered);
      } catch {
        if (mounted) setAdmins([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2>Admins</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.id}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.status}</td>
              <td>
                <button onClick={() => onRemove(admin.id)}>Remove</button>
                <button onClick={() => onStatusChange(admin.id, admin.status === 'active' ? 'inactive' : 'active')}>
                  {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => onUpdate(admin)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAdminsTable;
