import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Heart } from 'lucide-react';

export default function Header() {
  const { user, logout, hasRole } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Hide header on admin pages
  if (pathname.startsWith('/admin')) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if user is a nurse
  const isNurse = user && hasRole('NURSE');

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          to={isNurse ? "/dashboard" : "/"} 
          className="flex items-center space-x-2 text-lg font-semibold text-gray-900"
        >
          {isNurse ? (
            <>
              <Heart className="h-6 w-6 text-pink-500" />
              <span>HMS - Nurse Portal</span>
            </>
          ) : (
            <span>HMS</span>
          )}
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {isNurse ? (
            // Nurse navigation
            <>
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => 
                  isActive ? 'text-pink-600 font-medium' : 'text-gray-700 hover:text-gray-900'
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/nurse/about" 
                className={({isActive}) => 
                  isActive ? 'text-pink-600 font-medium' : 'text-gray-700 hover:text-gray-900'
                }
              >
                About Us
              </NavLink>
              <NavLink 
                to="/nurse/contact" 
                className={({isActive}) => 
                  isActive ? 'text-pink-600 font-medium' : 'text-gray-700 hover:text-gray-900'
                }
              >
                Contact Us
              </NavLink>
            </>
          ) : (
            // Regular user navigation
            <>
              <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Home</NavLink>
              <NavLink to="/about" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>About us</NavLink>
              <NavLink to="/news" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>News</NavLink>
              <NavLink to="/contact" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Contact</NavLink>
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-gray-900 text-sm px-3 py-2 rounded-md">Sign in</Link>
              <Link to="/register" className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700">Create account</Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="hidden sm:block text-sm">Welcome, {user?.firstName || user?.username}</span>
                <span className={`p-2 rounded-full ${isNurse ? 'bg-pink-100' : 'bg-gray-100'}`}>
                  <User className={`h-5 w-5 ${isNurse ? 'text-pink-600' : ''}`} />
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
