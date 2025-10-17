import { useAuth } from '../../contexts/AuthContext';
import DoctorSidebar from './components/DoctorSidebar';

export default function DoctorProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>
          <div className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-gray-500">Name</div>
              <div className="text-gray-900 font-medium">Dr. {user.firstName} {user.lastName}</div>
            </div>
            <div>
              <div className="text-gray-500">Username</div>
              <div className="text-gray-900 font-medium">{user.username}</div>
            </div>
            <div>
              <div className="text-gray-500">Email</div>
              <div className="text-gray-900 font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-gray-500">Phone</div>
              <div className="text-gray-900 font-medium">{user.phoneNumber || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Specialization</div>
              <div className="text-gray-900 font-medium">{user.specialization || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">License Number</div>
              <div className="text-gray-900 font-medium">{user.licenseNumber || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Department</div>
              <div className="text-gray-900 font-medium">{user.department || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Date of Birth</div>
              <div className="text-gray-900 font-medium">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Address</div>
              <div className="text-gray-900 font-medium break-words">{user.address || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500">Roles</div>
              <div className="text-gray-900 font-medium">{Array.isArray(user.roles) ? user.roles.join(', ') : ''}</div>
            </div>
            <div>
              <div className="text-gray-500">Approval Status</div>
              <div className="text-gray-900 font-medium">{user.isApproved ? 'Approved' : 'Pending'}</div>
            </div>
            <div>
              <div className="text-gray-500">Active</div>
              <div className="text-gray-900 font-medium">{user.isActive ? 'Active' : 'Inactive'}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
