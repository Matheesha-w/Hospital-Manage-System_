import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Shield, Stethoscope, Heart, Microscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-8 w-8 text-red-500" />;
      case 'DOCTOR':
        return <Stethoscope className="h-8 w-8 text-blue-500" />;
      case 'NURSE':
        return <Heart className="h-8 w-8 text-pink-500" />;
      case 'LAB_TECHNICIAN':
        return <Microscope className="h-8 w-8 text-green-500" />;
      case 'PATIENT':
        return <User className="h-8 w-8 text-indigo-500" />;
      default:
        return <User className="h-8 w-8 text-gray-500" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'DOCTOR':
        return 'bg-blue-100 text-blue-800';
      case 'NURSE':
        return 'bg-pink-100 text-pink-800';
      case 'LAB_TECHNICIAN':
        return 'bg-green-100 text-green-800';
      case 'PATIENT':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h2>
              <p className="mt-2 text-gray-600">
                Here's what's happening in your Hospital Management System today.
              </p>
            </div>
            <div className="flex space-x-2">
              {user?.roles?.map((role) => (
                <span
                  key={role}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role)}`}
                >
                  {role.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasRole('ADMIN') && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Panel</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/admin')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Manage Registrations
                  </button>
                  <button
                    onClick={() => navigate('/admin/users')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => navigate('/admin/reports')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    System Reports
                  </button>
                </div>
              </div>
            </>
          )}

          {hasRole('DOCTOR') && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Panel</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/doctor/patients')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    View Patients
                  </button>
                  <button
                    onClick={() => navigate('/doctor/appointments')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Manage Appointments
                  </button>
                  <button
                    onClick={() => navigate('/doctor/prescriptions')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Write Prescriptions
                  </button>
                </div>
              </div>
            </>
          )}

          {hasRole('NURSE') && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nurse Panel</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/nurse/patients')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Patient Care
                  </button>
                  <button
                    onClick={() => navigate('/nurse/vitals')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Record Vitals
                  </button>
                  <button
                    onClick={() => navigate('/nurse/medications')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Medication Management
                  </button>
                </div>
              </div>
            </>
          )}

          {hasRole('LAB_TECHNICIAN') && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Technician Panel</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/lab/tests')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Lab Tests
                  </button>
                  <button
                    onClick={() => navigate('/lab/results')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Test Results
                  </button>
                  <button
                    onClick={() => navigate('/lab/equipment')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Equipment Management
                  </button>
                </div>
              </div>
            </>
          )}

          {hasRole('PATIENT') && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Panel</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/patient/appointments')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => navigate('/patient/medical-history')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    Medical History
                  </button>
                  <button
                    onClick={() => navigate('/patient/prescriptions')}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    View Prescriptions
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Stethoscope className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Doctors</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Nurses</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Microscope className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Lab Tests</p>
                <p className="text-2xl font-semibold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


