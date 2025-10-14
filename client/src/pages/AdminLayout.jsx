import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/contacts', label: 'Contacts' },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r p-4">
        <div className="flex items-center gap-3 mb-6">
          <span className="p-2 bg-blue-50 rounded-full"><User className="h-6 w-6 text-blue-600" /></span>
          <div>
            <div className="text-sm text-gray-500">Signed in as</div>
            <div className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map(item => (
            <Link key={item.to} to={item.to} className={`block px-3 py-2 rounded-md ${pathname === item.to ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}>{item.label}</Link>
          ))}
          <button onClick={() => { logout(); navigate('/'); }} className="mt-4 block w-full text-left px-3 py-2 rounded-md text-red-700 hover:bg-red-50">Logout</button>
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}


