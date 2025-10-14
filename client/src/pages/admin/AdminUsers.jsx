import { useNavigate } from 'react-router-dom';
import { Users, Stethoscope, Heart, Microscope, UserPlus } from 'lucide-react';

const categories = [
  { key: 'PATIENT', label: 'Patients', icon: Users, color: 'bg-blue-50', dot: 'text-blue-600' },
  { key: 'DOCTOR', label: 'Doctors', icon: Stethoscope, color: 'bg-green-50', dot: 'text-green-600' },
  { key: 'NURSE', label: 'Nurses', icon: Heart, color: 'bg-pink-50', dot: 'text-pink-600' },
  { key: 'LAB_TECHNICIAN', label: 'Lab Techs', icon: Microscope, color: 'bg-purple-50', dot: 'text-purple-600' }
];

export default function AdminUsers() {
  const navigate = useNavigate();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button key={cat.key} onClick={() => navigate(`/admin/users/${cat.key.toLowerCase()}`)} className={`border rounded-lg p-6 bg-white hover:shadow text-left`}>
                <div className={`inline-flex p-3 rounded-lg ${cat.color} mb-3`}>
                  <Icon className={`h-6 w-6 ${cat.dot}`} />
                </div>
                <div className="font-semibold text-gray-900">{cat.label}</div>
                <div className="text-sm text-gray-600">View and manage all {cat.label.toLowerCase()}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}



