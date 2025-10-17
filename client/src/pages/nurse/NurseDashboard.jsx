import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Heart
} from 'lucide-react';
// Change the path from "../../components/nurse/..." to "./" or just the filename
import PatientSearch from "./PatientSearch";
import NursePrescriptions from "./NursePrescriptions";
import toast from 'react-hot-toast';
import axios from 'axios';

const NurseDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    pendingAdministrations: 0,
    completedToday: 0,
    adverseReactions: 0
  });

  useEffect(() => {
    // Load dashboard statistics
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      console.log('Loading dashboard stats...');
      const response = await axios.get('/nurse/dashboard/stats');
      console.log('Dashboard stats response:', response.data);
      if (response.data.success) {
        setDashboardStats(response.data.data);
      } else {
        console.log('API returned success: false');
        // Fallback to default stats if API fails
        setDashboardStats({
          totalPatients: 45,
          pendingAdministrations: 12,
          completedToday: 28,
          adverseReactions: 2
        });
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Fallback to default stats
      setDashboardStats({
        totalPatients: 45,
        pendingAdministrations: 12,
        completedToday: 28,
        adverseReactions: 2
      });
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    toast.success(`Selected patient: ${patient.firstName ? patient.firstName + ' ' + (patient.lastName || '') : (patient.username || patient.email)}`);
  };

  const tabs = [
    { id: 'search', label: 'Patient Search', icon: Search },
    { id: 'prescriptions', label: 'Prescriptions', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white shadow-sm border-b rounded-lg mb-8">
          <div className="px-6 py-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-500 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nurse Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.firstName}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium text-gray-900">{user?.department || 'General Ward'}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Administrations</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardStats.pendingAdministrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Today</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardStats.completedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Adverse Reactions</p>
                <p className="text-2xl font-semibold text-gray-900">{dashboardStats.adverseReactions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => !tab.disabled && setActiveTab(tab.id)}
                    disabled={tab.disabled}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-pink-500 text-pink-600'
                        : tab.disabled
                        ? 'border-transparent text-gray-400 cursor-not-allowed'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'search' && (
              <PatientSearch onPatientSelect={handlePatientSelect} />
            )}

            {activeTab === 'prescriptions' && (
              <NursePrescriptions />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;

