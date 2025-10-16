import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Upload, 
  Clock, 
  CheckCircle, 
  Menu, 
  X, 
  LogOut, 
  Activity,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const navItems = [
    { href: '/lab', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/lab/upload', label: 'Upload Report', icon: Upload },
    { href: '/lab/pending', label: 'Pending Reports', icon: Clock },
    { href: '/lab/completed', label: 'Completed Reports', icon: CheckCircle },
  ];

  return (
    <aside className="h-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Lab Portal</h2>
            <p className="text-xs text-blue-300">Medical Laboratory</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 lg:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-700/50 transition-all duration-200 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon className="w-5 h-5 relative z-10" />
              <span className="font-medium relative z-10">{item.label}</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all relative z-10" />
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700/50">
        <div className="bg-blue-800/50 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-xs text-blue-300 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const Topbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white shadow-md relative z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="lg:hidden p-2 bg-blue-50 rounded-lg">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Lab Portal</h1>
            <p className="text-sm text-gray-500">
              Welcome back, <span className="font-medium text-gray-700">{user?.firstName} {user?.lastName}</span>
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all border border-gray-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">Lab Technician</p>
            </div>
          </button>

          {showDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const LabLayout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] min-h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <div className="fixed h-screen w-64">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setOpen(true)}
            className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {open && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <div className="fixed z-50 top-0 left-0 h-full w-72 lg:hidden transform transition-transform duration-300 ease-out shadow-2xl">
              <Sidebar onClose={() => setOpen(false)} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex flex-col min-h-screen">
          <Topbar />
          <main className="flex-1 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            {children}
          </main>
          
          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>© 2025 Lab Portal. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>System Online</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default LabLayout;