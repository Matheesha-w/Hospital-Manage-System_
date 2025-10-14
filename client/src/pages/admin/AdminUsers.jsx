import { useState } from 'react';
import { Users, Stethoscope, Heart, Microscope, UserPlus } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const categories = [
  { key: 'PATIENT', label: 'Patients', icon: Users, color: 'bg-blue-50', dot: 'text-blue-600' },
  { key: 'DOCTOR', label: 'Doctors', icon: Stethoscope, color: 'bg-green-50', dot: 'text-green-600' },
  { key: 'NURSE', label: 'Nurses', icon: Heart, color: 'bg-pink-50', dot: 'text-pink-600' },
  { key: 'LAB_TECHNICIAN', label: 'Lab Techs', icon: Microscope, color: 'bg-purple-50', dot: 'text-purple-600' }
];

export default function AdminUsers() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async (role) => {
    setLoading(true);
    try {
      const res = await axios.get(`/admin/users/${role}`);
      setUsers(res.data.data || []);
      setActiveCategory(role);
    } catch (e) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="mt-2 text-gray-600">Choose a category to view and manage users.</p>
          </div>
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            <UserPlus className="h-5 w-5" /> Add User
          </button>
        </div>

        {!activeCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(({ key, label, icon: Icon, color, dot }) => (
              <button key={key} onClick={() => loadUsers(key)} className={`border rounded-lg p-6 bg-white hover:shadow text-left`}>
                <div className={`inline-flex p-3 rounded-lg ${color} mb-3`}>
                  <Icon className={`h-6 w-6 ${dot}`} />
                </div>
                <div className="font-semibold text-gray-900">{label}</div>
                <div className="text-sm text-gray-600">View and manage all {label.toLowerCase()}</div>
              </button>
            ))}
          </div>
        )}

        {activeCategory && (
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{activeCategory.replace('_',' ')} List</h2>
              <button onClick={() => setActiveCategory(null)} className="text-sm text-blue-700">Back to categories</button>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6">Loading...</div>
              ) : users.length === 0 ? (
                <div className="p-6 text-gray-500">No users found</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</div>
                          <div className="text-sm text-gray-500">{u.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${u.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${u.approved ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {u.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                          <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



