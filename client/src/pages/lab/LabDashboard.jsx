import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { Activity, FileText, Clock, CheckCircle, Upload, TrendingUp } from 'lucide-react';

// Modern Card Component with Icon
const StatCard = ({ title, value, icon: Icon, gradient, trend }) => (
  <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}></div>
    <div className="relative p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  </div>
);

// Modern Progress Bar with Animation
const ProgressStats = ({ completed = 0, pending = 0 }) => {
  const total = Math.max(1, completed + pending);
  const completedPct = Math.round((completed / total) * 100);
  const pendingPct = 100 - completedPct;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Report Analytics</h3>
          <p className="text-sm text-gray-500 mt-1">Performance overview</p>
        </div>
        <div className="px-3 py-1 bg-blue-50 rounded-lg">
          <span className="text-sm font-semibold text-blue-600">Last 30 days</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-gray-100">
          <div 
            className="absolute h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${completedPct}%` }}
          />
          <div 
            className="absolute h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${pendingPct}%`, left: `${completedPct}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-green-600 font-medium">Completed</p>
              <p className="text-xl font-bold text-green-700">{completed}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xs text-amber-600 font-medium">Pending</p>
              <p className="text-xl font-bold text-amber-700">{pending}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Action Button
const ActionButton = ({ href, icon: Icon, title, gradient, description }) => (
  <a 
    href={href} 
    className={`group relative overflow-hidden bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
  >
    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
    <div className="relative flex items-start gap-4">
      <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </div>
  </a>
);

const LabDashboard = () => {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState({ totalPatients: 0, pendingReports: 0, completedReports: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      if (!token) {
        setError('No authentication token available');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/lab/reports/summary');
        if (response.data.success) {
          setSummary(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load summary');
        }
      } catch (e) {
        console.error('Error fetching summary:', e);
        setError('Failed to load summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  const stats = useMemo(() => ({
    total: summary.totalPatients || 0,
    pending: summary.pendingReports || 0,
    completed: summary.completedReports || 0,
  }), [summary]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 absolute top-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600 mt-1">Lab Technician Dashboard • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Patients" 
            value={stats.total} 
            icon={Activity}
            gradient="from-blue-500 to-blue-600"
            trend="+12% this month"
          />
          <StatCard 
            title="Pending Reports" 
            value={stats.pending} 
            icon={Clock}
            gradient="from-amber-500 to-orange-600"
          />
          <StatCard 
            title="Completed Reports" 
            value={stats.completed} 
            icon={CheckCircle}
            gradient="from-green-500 to-emerald-600"
            trend="+8% this week"
          />
        </div>

        {/* Progress Stats */}
        <ProgressStats completed={stats.completed} pending={stats.pending} />

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionButton 
            href="/lab/upload"
            icon={Upload}
            title="Upload Report"
            gradient="from-blue-600 to-indigo-700"
            description="Add new lab results"
          />
          <ActionButton 
            href="/lab/pending"
            icon={Clock}
            title="Pending Reports"
            gradient="from-amber-500 to-orange-600"
            description="Review awaiting reports"
          />
          <ActionButton 
            href="/lab/completed"
            icon={CheckCircle}
            title="Completed Reports"
            gradient="from-green-600 to-emerald-700"
            description="View finished reports"
          />
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;