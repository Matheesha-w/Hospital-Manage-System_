import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { User, Stethoscope, Calendar, BarChart3, LogOut } from 'lucide-react';

const navItems = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: Stethoscope },
  { to: '/doctor/profile', label: 'Profile', icon: User },
  { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
  { to: '/doctor/history', label: 'History', icon: Calendar },
  { to: '/doctor/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function DoctorSidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4">
        {/* User Profile Section */}
        <div className="flex items-center gap-3 mb-6 p-3 bg-blue-50 rounded-lg">
          <span className="p-2 bg-blue-100 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Doctor</div>
            <div className="text-sm font-semibold text-gray-900 truncate">
              Dr. {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.to;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 hover:text-red-800 transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
