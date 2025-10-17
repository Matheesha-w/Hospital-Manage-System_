import { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorSidebar from './components/DoctorSidebar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Clock, Activity, 
  AlertCircle, CheckCircle, BarChart3 
} from 'lucide-react';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function SurgeryAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    counts: { completed: 0, pending: 0 },
    surgeriesByType: [],
    surgeriesByUrgency: [],
    monthlyTrends: [],
    weeklyTrends: [],
    completionRate: 0,
    averageCompletionTime: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError('');
      const [countsRes, surgeriesRes] = await Promise.all([
        axios.get('/doctor/surgeries/counts'),
        axios.get('/doctor/surgeries')
      ]);

      const counts = countsRes?.data?.data || { completed: 0, pending: 0 };
      const surgeries = Array.isArray(surgeriesRes?.data?.data) ? surgeriesRes.data.data : [];

      // Process data for charts
      const surgeriesByType = processSurgeriesByType(surgeries);
      const surgeriesByUrgency = processSurgeriesByUrgency(surgeries);
      const monthlyTrends = processMonthlyTrends(surgeries);
      const weeklyTrends = processWeeklyTrends(surgeries);
      const total = (counts.completed || 0) + (counts.pending || 0);
      const completionRate = total > 0 ? (counts.completed || 0) / total * 100 : 0;
      const averageCompletionTime = calculateAverageCompletionTime(surgeries);

      setAnalyticsData({
        counts,
        surgeriesByType,
        surgeriesByUrgency,
        monthlyTrends,
        weeklyTrends,
        completionRate: isNaN(completionRate) ? 0 : completionRate,
        averageCompletionTime,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(error.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const processSurgeriesByType = (surgeries) => {
    const typeCount = {};
    surgeries.forEach(surgery => {
      typeCount[surgery.surgeryType] = (typeCount[surgery.surgeryType] || 0) + 1;
    });
    return Object.entries(typeCount).map(([type, count]) => ({ type, count }));
  };

  const processSurgeriesByUrgency = (surgeries) => {
    const urgencyCount = {};
    surgeries.forEach(surgery => {
      urgencyCount[surgery.urgency] = (urgencyCount[surgery.urgency] || 0) + 1;
    });
    return Object.entries(urgencyCount).map(([urgency, count]) => ({ urgency, count }));
  };

  const processMonthlyTrends = (surgeries) => {
    const monthlyData = {};
    surgeries.forEach(surgery => {
      const createdAt = surgery?.createdAt ? new Date(surgery.createdAt) : null;
      if (!createdAt || isNaN(createdAt)) return;
      const y = createdAt.getFullYear();
      const m = createdAt.getMonth();
      const key = y * 12 + m;
      const label = createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthlyData[key]) {
        monthlyData[key] = { key, month: label, completed: 0, pending: 0 };
      }
      if (surgery.status === 'COMPLETED') {
        monthlyData[key].completed++;
      } else {
        monthlyData[key].pending++;
      }
    });
    return Object.values(monthlyData).sort((a, b) => a.key - b.key).map(({ key, ...rest }) => rest);
  };

  const processWeeklyTrends = (surgeries) => {
    const weeklyData = {};
    surgeries.forEach(surgery => {
      const createdAt = surgery?.createdAt ? new Date(surgery.createdAt) : null;
      if (!createdAt || isNaN(createdAt)) return;
      const { label, startMs } = getWeekInfo(createdAt);
      if (!weeklyData[startMs]) {
        weeklyData[startMs] = { week: label, startMs, count: 0 };
      }
      weeklyData[startMs].count++;
    });
    return Object.values(weeklyData).sort((a, b) => a.startMs - b.startMs).map(({ startMs, ...rest }) => rest);
  };

  const getWeekInfo = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day; // week starts on Sunday
    start.setHours(0, 0, 0, 0);
    start.setDate(diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const label = `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
    return { label, startMs: start.getTime() };
  };

  const calculateAverageCompletionTime = (surgeries) => {
    const completedSurgeries = surgeries.filter(s => s.status === 'COMPLETED' && s.completedAt);
    if (completedSurgeries.length === 0) return 0;
    
    const totalTime = completedSurgeries.reduce((sum, surgery) => {
      const created = new Date(surgery.createdAt);
      const completed = new Date(surgery.completedAt);
      return sum + (completed - created);
    }, 0);
    
    return Math.round(totalTime / completedSurgeries.length / (1000 * 60 * 60 * 24)); // days
  };

  // Removed hardcoded prediction logic

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <DoctorSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 overflow-auto bg-gray-200">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 rounded p-4">
              {error}
            </div>
          )}
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">Surgery Analytics</h1>
              <p className="text-gray-600">Comprehensive insights into your surgery performance</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BarChart3 className="h-5 w-5" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Surgeries</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.counts.completed + analyticsData.counts.pending}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">{analyticsData.counts.completed} completed</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.completionRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                Based on current completed vs pending surgeries
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Completion Time</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.averageCompletionTime}</p>
                  <p className="text-sm text-gray-500">days</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Surgeries</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.counts.pending}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-orange-600">Requires attention</span>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Surgery Types Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Surgeries by Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.surgeriesByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Urgency Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgency Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.surgeriesByUrgency}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ urgency, percent }) => `${urgency} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.surgeriesByUrgency.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Surgery Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analyticsData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Completed" />
                <Area type="monotone" dataKey="pending" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Activity & Predictions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            
          </div>

          {/* Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Most Common Surgery Type</h4>
                <p className="text-blue-700">
                  {analyticsData.surgeriesByType.length > 0 
                    ? `${analyticsData.surgeriesByType[0].type} (${analyticsData.surgeriesByType[0].count} surgeries)`
                    : 'No data available'
                  }
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Completion Efficiency</h4>
                <p className="text-green-700">
                  {analyticsData.completionRate > 80 
                    ? 'Excellent completion rate!'
                    : analyticsData.completionRate > 60 
                    ? 'Good completion rate'
                    : 'Consider improving completion efficiency'
                  }
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Average Processing Time</h4>
                <p className="text-purple-700">
                  {analyticsData.averageCompletionTime > 0 
                    ? `${analyticsData.averageCompletionTime} days average`
                    : 'No completed surgeries yet'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
