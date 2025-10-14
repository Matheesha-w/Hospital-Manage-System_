import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Name</div>
              <div className="text-gray-900">{user.firstName} {user.lastName}</div>
            </div>
            <div>
              <div className="text-gray-500">Username</div>
              <div className="text-gray-900">{user.username}</div>
            </div>
            <div>
              <div className="text-gray-500">Email</div>
              <div className="text-gray-900">{user.email}</div>
            </div>
            <div>
              <div className="text-gray-500">Roles</div>
              <div className="text-gray-900">{Array.isArray(user.roles) ? user.roles.join(', ') : ''}</div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => { logout(); navigate('/'); }} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Logout</button>
            {user.roles?.includes('ADMIN') && (
              <button onClick={() => navigate('/admin')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Go to Admin</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


