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
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          to={isNurse ? "/dashboard" : "/"} 
          className="flex items-center space-x-2 text-lg font-bold text-gray-900 group"
        >
          {isNurse ? (
            <>
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg group-hover:shadow-pink-200 transition-shadow">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">HMS - Nurse Portal</span>
            </>
          ) : (
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">HMS</span>
          )}
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {isNurse ? (
            // Nurse navigation
            <>
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => 
                  isActive 
                    ? 'text-pink-600 font-semibold bg-pink-50 px-4 py-2 rounded-lg' 
                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-all'
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/nurse/about" 
                className={({isActive}) => 
                  isActive 
                    ? 'text-pink-600 font-semibold bg-pink-50 px-4 py-2 rounded-lg' 
                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-all'
                }
              >
                About Us
              </NavLink>
              <NavLink 
                to="/nurse/contact" 
                className={({isActive}) => 
                  isActive 
                    ? 'text-pink-600 font-semibold bg-pink-50 px-4 py-2 rounded-lg' 
                    : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-all'
                }
              >
                Contact Us
              </NavLink>
            </>
          ) : (
            // Regular user navigation
            <>
              <NavLink 
                to="/" 
                className={({isActive}) => 
                  isActive 
                    ? 'text-blue-600 font-semibold bg-blue-50 px-4 py-2 rounded-lg' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all'
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({isActive}) => 
                  isActive 
                    ? 'text-blue-600 font-semibold bg-blue-50 px-4 py-2 rounded-lg' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all'
                }
              >
                About us
              </NavLink>
              <NavLink 
                to="/news" 
                className={({isActive}) => 
                  isActive 
                    ? 'text-blue-600 font-semibold bg-blue-50 px-4 py-2 rounded-lg' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all'
                }
              >
                News
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({isActive}) => 
                  isActive 
                    ? 'text-blue-600 font-semibold bg-blue-50 px-4 py-2 rounded-lg' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all'
                }
              >
                Contact
              </NavLink>
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                Sign in
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5"
              >
                Create account
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  Welcome, {user?.firstName || user?.username}
                </span>
                <span className={`p-2 rounded-lg ${isNurse ? 'bg-gradient-to-br from-pink-500 to-pink-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} shadow-md`}>
                  <User className="h-4 w-4 text-white" />
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
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