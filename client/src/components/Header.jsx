import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-gray-900">HMS</Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Home</NavLink>
          <NavLink to="/about" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>About us</NavLink>
          <NavLink to="/news" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>News</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Contact</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-gray-900 text-sm px-3 py-2 rounded-md">Sign in</Link>
              <Link to="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700">Create account</Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => navigate('/profile')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <span className="hidden sm:block text-sm">{user.firstName || user.username}</span>
                <span className="p-2 bg-gray-100 rounded-full"><User className="h-5 w-5" /></span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
