import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { User, LogIn, UserPlus } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Hospital Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to HMS
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A comprehensive Hospital Management System designed to streamline healthcare operations
            and improve patient care.
          </p>
        </div>

        {/* User Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="/src/assets/authassets/patient-groups.jpg"
              alt="Patients"
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Patients</h3>
            <p className="text-gray-600 text-sm mb-4">
              Book appointments, view medical history, and manage your healthcare journey.
            </p>
              <Link
                to="/register?role=PATIENT"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Register as Patient
              </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="/src/assets/authassets/doctors2.png"
              alt="Doctors"
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Doctors</h3>
            <p className="text-gray-600 text-sm mb-4">
              Manage patients, appointments, and provide comprehensive medical care.
            </p>
              <Link
                to="/register?role=DOCTOR"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700"
              >
                Apply as Doctor
              </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="/src/assets/authassets/nurse.jpg"
              alt="Nurses"
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nurses</h3>
            <p className="text-gray-600 text-sm mb-4">
              Provide patient care, record vitals, and assist in medical procedures.
            </p>
              <Link
                to="/register?role=NURSE"
                className="inline-block bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700"
              >
                Apply as Nurse
              </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src="/src/assets/authassets/laboratorians.jpg"
              alt="Lab Technicians"
              className="w-24 h-24 mx-auto mb-4 rounded-full object-cover"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lab Technicians</h3>
            <p className="text-gray-600 text-sm mb-4">
              Conduct laboratory tests, analyze samples, and provide accurate results.
            </p>
              <Link
                to="/register?role=LAB_TECHNICIAN"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
              >
                Apply as Lab Tech
              </Link>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Authentication</h3>
              <p className="text-gray-600">
                Role-based access control with JWT authentication for secure access.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">
                Comprehensive user management with approval workflows for staff.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Analytics</h3>
              <p className="text-gray-600">
                Real-time dashboard with role-specific information and analytics.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Hospital Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
