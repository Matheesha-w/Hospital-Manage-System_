import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Package,
  AlertTriangle,
  DollarSign,
  Activity,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PharmacyReports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [expandedReport, setExpandedReport] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // API base URL configuration
  const API_BASE_URL = 'http://localhost:8084/api/pharmacy';

  // Quick stats state
  const [quickStats, setQuickStats] = useState({
    totalRevenue: 0,
    totalDispensed: 0,
    lowStockItems: 0,
    totalDrugs: 0
  });

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6b7280'];

  useEffect(() => {
    fetchAllReports();
    generateQuickStats();
  }, []);

  const fetchAllReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        alert('Unauthorized. Please log in again.');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setReports(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const generateQuickStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch inventory summary
      const response = await fetch(`${API_BASE_URL}/reports/inventory-summary?generatedBy=${user?.username || 'system'}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const reportData = data.data.data;
          setQuickStats({
            totalRevenue: reportData.totalValue || 0,
            totalDispensed: reportData.totalQuantity || 0,
            lowStockItems: reportData.lowStockItems || 0,
            totalDrugs: reportData.totalDrugs || 0
          });
        }
      }
    } catch (error) {
      console.error('Error generating quick stats:', error);
    }
  };

  const generateReport = async (reportType) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/reports/${reportType}?generatedBy=${user?.username || 'pharmacist'}`;
      
      // Add date range for sales reports
      if (reportType === 'sales' && dateRange.startDate && dateRange.endDate) {
        url += `&startDate=${dateRange.startDate}T00:00:00&endDate=${dateRange.endDate}T23:59:59`;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        alert('Unauthorized. Please log in again.');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        alert('Report generated successfully!');
        setSelectedReport(data.data);
        fetchAllReports();
      } else {
        alert(data.message || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (report) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.reportType}_${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reportTypes = [
    {
      id: 'sales',
      title: 'Sales Report',
      icon: DollarSign,
      color: 'bg-green-500',
      description: 'Revenue and sales analysis',
      requiresDateRange: true
    },
    {
      id: 'stock-distribution',
      title: 'Stock Distribution',
      icon: Package,
      color: 'bg-blue-500',
      description: 'Inventory status breakdown'
    },
    {
      id: 'inventory-summary',
      title: 'Inventory Summary',
      icon: BarChart3,
      color: 'bg-purple-500',
      description: 'Complete inventory overview'
    },
    {
      id: 'low-stock-alert',
      title: 'Low Stock Alert',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      description: 'Items requiring restock'
    }
  ];

  const renderStockDistributionChart = (reportData) => {
    if (!reportData) return null;

    const data = [
      { name: 'In Stock', value: reportData.inStockCount || 0 },
      { name: 'Low Stock', value: reportData.lowStockCount || 0 },
      { name: 'Out of Stock', value: reportData.outOfStockCount || 0 },
      { name: 'Expired', value: reportData.expiredCount || 0 }
    ];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderSalesChart = (reportData) => {
    if (!reportData || !reportData.topSellingDrugs) return null;

    const data = reportData.topSellingDrugs.map(drug => ({
      name: drug.drugName,
      sales: drug.count
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="sales" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const toggleReportExpansion = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => navigate('/pharmacist/dashboard')}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-8 h-8 mr-3 text-purple-600" />
                Pharmacy Reports
              </h1>
              <p className="text-gray-600 mt-1">Generate and view pharmacy analytics</p>
            </div>
            <button
              onClick={fetchAllReports}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${quickStats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Drugs</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.totalDrugs}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.totalDispensed}</p>
              </div>
              <Activity className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.lowStockItems}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Report Generation Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reportTypes.map((report) => (
              <div key={report.id} className="bg-white rounded-lg shadow-md p-6">
                <div className={`${report.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <report.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                
                {report.requiresDateRange && (
                  <div className="mb-4 space-y-2">
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Start Date"
                    />
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="End Date"
                    />
                  </div>
                )}
                
                <button
                  onClick={() => generateReport(report.id)}
                  disabled={loading || (report.requiresDateRange && (!dateRange.startDate || !dateRange.endDate))}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Generating...' : 'Generate'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Report Display */}
        {selectedReport && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Latest Generated Report</h2>
              <button
                onClick={() => downloadReport(selectedReport)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
            </div>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-sm text-gray-600">Report Type</p>
              <p className="text-lg font-semibold text-gray-900">{selectedReport.reportType}</p>
              <p className="text-sm text-gray-600 mt-2">{selectedReport.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                Generated on: {new Date(selectedReport.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Render Charts */}
            {selectedReport.reportType === 'STOCK_DISTRIBUTION' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Distribution</h3>
                {renderStockDistributionChart(selectedReport.data)}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{selectedReport.data.inStockCount}</p>
                    <p className="text-sm text-gray-600">In Stock</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{selectedReport.data.lowStockCount}</p>
                    <p className="text-sm text-gray-600">Low Stock</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{selectedReport.data.outOfStockCount}</p>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-600">{selectedReport.data.expiredCount}</p>
                    <p className="text-sm text-gray-600">Expired</p>
                  </div>
                </div>
              </div>
            )}

            {selectedReport.reportType === 'MONTHLY_SALES' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedReport.data.totalRevenue?.toFixed(2) || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Prescriptions Dispensed</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedReport.data.totalPrescriptionsDispensed || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Medications Sold</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Object.values(selectedReport.data.medicationsSold || {}).reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                </div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Top Selling Drugs</h4>
                {renderSalesChart(selectedReport.data)}
              </div>
            )}

            {selectedReport.reportType === 'INVENTORY_SUMMARY' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Drugs</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedReport.data.totalDrugs}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Quantity</p>
                    <p className="text-2xl font-bold text-green-600">{selectedReport.data.totalQuantity}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${selectedReport.data.totalValue?.toFixed(2) || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">Low Stock Items</p>
                    <p className="text-2xl font-bold text-yellow-600">{selectedReport.data.lowStockItems}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedReport.reportType === 'LOW_STOCK_ALERT' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Items</h3>
                <div className="mb-4">
                  <p className="text-3xl font-bold text-yellow-600">{selectedReport.data.lowStockCount}</p>
                  <p className="text-sm text-gray-600">items require attention</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drug Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dosage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedReport.data.lowStockDrugs?.map((drug, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{drug.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.dosage}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{drug.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              drug.status === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {drug.status.replace('_', ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report History</h2>
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reports generated yet</p>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 10).map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg">
                  <div
                    onClick={() => toggleReportExpansion(report.id)}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{report.reportType}</h3>
                            <p className="text-sm text-gray-600">{report.description}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 ml-8">
                          {new Date(report.createdAt).toLocaleString()} • Generated by {report.generatedBy}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadReport(report);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                        {expandedReport === report.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {expandedReport === report.id && (
                    <div className="px-4 pb-4 border-t border-gray-200">
                      <pre className="mt-4 p-4 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(report.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyReports;