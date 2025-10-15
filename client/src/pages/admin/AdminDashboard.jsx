import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h3>
      <div className="space-y-3">
        <button
          onClick={() => navigate('/admin')}
          className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
        >
          Manage Registrations
        </button>
        <button
          onClick={() => navigate('/admin/users')}
          className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
        >
          Manage Users
        </button>
        <button
          onClick={() => navigate('/admin/reports')}
          className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
        >
          System Reports
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
