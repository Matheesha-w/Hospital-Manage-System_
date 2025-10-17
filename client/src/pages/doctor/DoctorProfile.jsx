import { useAuth } from '../../contexts/AuthContext';
import DoctorSidebar from './components/DoctorSidebar';

export default function DoctorProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100">
      <DoctorSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-sky-800 flex items-center gap-2">
              🩺 My Profile
            </h1>
          </div>

          {/* Profile Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-sky-100 p-8 transition-all hover:shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              
              <div className="p-4 bg-sky-50 rounded-lg border-l-4 border-sky-400 hover:bg-sky-100 transition">
                <div className="text-gray-500">Name</div>
                <div className="text-sky-900 font-semibold text-base">
                  Dr. {user.firstName} {user.lastName}
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 hover:bg-blue-100 transition">
                <div className="text-gray-500">Username</div>
                <div className="text-blue-900 font-semibold text-base">{user.username}</div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400 hover:bg-teal-100 transition">
                <div className="text-gray-500">Email</div>
                <div className="text-teal-900 font-semibold text-base">{user.email}</div>
              </div>

              <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400 hover:bg-cyan-100 transition">
                <div className="text-gray-500">Phone</div>
                <div className="text-cyan-900 font-semibold text-base">{user.phoneNumber || '-'}</div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 hover:bg-indigo-100 transition">
                <div className="text-gray-500">Specialization</div>
                <div className="text-indigo-900 font-semibold text-base">{user.specialization || '-'}</div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400 hover:bg-emerald-100 transition">
                <div className="text-gray-500">License Number</div>
                <div className="text-emerald-900 font-semibold text-base">{user.licenseNumber || '-'}</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 hover:bg-blue-100 transition">
                <div className="text-gray-500">Department</div>
                <div className="text-blue-900 font-semibold text-base">{user.department || '-'}</div>
              </div>

              <div className="p-4 bg-sky-50 rounded-lg border-l-4 border-sky-400 hover:bg-sky-100 transition">
                <div className="text-gray-500">Date of Birth</div>
                <div className="text-sky-900 font-semibold text-base">
                  {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg border-l-4 border-teal-400 hover:bg-teal-100 transition">
                <div className="text-gray-500">Address</div>
                <div className="text-teal-900 font-semibold text-base break-words">{user.address || '-'}</div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 hover:bg-indigo-100 transition">
                <div className="text-gray-500">Roles</div>
                <div className="text-indigo-900 font-semibold text-base">
                  {Array.isArray(user.roles) ? user.roles.join(', ') : ''}
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400 hover:bg-emerald-100 transition">
                <div className="text-gray-500">Approval Status</div>
                <div
                  className={`font-semibold text-base ${
                    user.isApproved ? 'text-emerald-700' : 'text-amber-600'
                  }`}
                >
                  {user.isApproved ? 'Approved ✅' : 'Pending ⏳'}
                </div>
              </div>

              <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400 hover:bg-cyan-100 transition">
                <div className="text-gray-500">Active</div>
                <div
                  className={`font-semibold text-base ${
                    user.isActive ? 'text-green-700' : 'text-red-600'
                  }`}
                >
                  {user.isActive ? 'Active 🟢' : 'Inactive 🔴'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="text-center text-gray-500 text-xs mt-8">
            Empowered by <span className="text-sky-600 font-semibold">Healthcare Dashboard</span>
          </div>
        </div>
      </main>
    </div>
  );
}
