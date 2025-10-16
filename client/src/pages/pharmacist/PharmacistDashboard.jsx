import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Package,
  FileText,
  BarChart3,
  Settings,
  Bell,
  User,
  Plus,
  AlertCircle
} from 'lucide-react';

const PharmacistDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch inventory
      const inventoryRes = await fetch('http://localhost:8080/api/pharmacy/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const inventoryData = await inventoryRes.json();
      
      // Fetch prescriptions
      const prescriptionsRes = await fetch('http://localhost:8080/api/pharmacy/prescriptions/status/PENDING', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const prescriptionsData = await prescriptionsRes.json();
      
      if (inventoryData.success) {
        setInventory(inventoryData.data || []);
      }
      if (prescriptionsData.success) {
        setPrescriptions(prescriptionsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigationCards = [
    {
      title: 'Prescriptions',
      icon: FileText,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      path: '/pharmacist/prescriptions',
      count: prescriptions.length
    },
    {
      title: 'Inventory',
      icon: Package,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      path: '/pharmacist/inventory',
      count: inventory.length
    },
    {
      title: 'Reports',
      icon: BarChart3,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      path: '/pharmacist/reports'
    },
    {
      title: 'Settings',
      icon: Settings,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      path: '/pharmacist/settings'
    }
  ];

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrescriptionStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'DISPENSED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Pharmacist Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                {prescriptions.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {prescriptions.length}
                  </span>
                )}
              </button>
              <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900">
                <User className="w-6 h-6" />
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {navigationCards.map((card, index) => (
            <button
              key={index}
              onClick={() => navigate(card.path)}
              className={`${card.color} ${card.hoverColor} text-white rounded-lg p-6 shadow-lg transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex flex-col items-center space-y-3">
                <card.icon className="w-12 h-12" />
                <h3 className="text-xl font-semibold">{card.title}</h3>
                {card.count !== undefined && (
                  <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                    {card.count} items
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Prescriptions Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2 text-blue-600" />
              Pending Prescriptions
            </h2>
            <div className="space-y-3">
              {prescriptions.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No pending prescriptions</p>
              ) : (
                prescriptions.slice(0, 5).map((prescription) => (
                  <div key={prescription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{prescription.drugName}</h4>
                        <p className="text-sm text-gray-600">Patient: {prescription.patientName}</p>
                        <p className="text-sm text-gray-600">Dosage: {prescription.dosage}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPrescriptionStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => navigate(`/pharmacist/prescriptions/${prescription.id}`)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                      >
                        Dispense
                      </button>
                      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                        Request Substitution
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {prescriptions.length > 5 && (
              <button
                onClick={() => navigate('/pharmacist/prescriptions')}
                className="mt-4 w-full text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Prescriptions →
              </button>
            )}
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Package className="w-6 h-6 mr-2 text-green-600" />
              Inventory Status
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                        No inventory items
                      </td>
                    </tr>
                  ) : (
                    inventory.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.dosage}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.quantity}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockStatusColor(item.status)}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {inventory.length > 5 && (
              <button
                onClick={() => navigate('/pharmacist/inventory')}
                className="mt-4 w-full text-green-600 hover:text-green-800 font-medium"
              >
                View Full Inventory →
              </button>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        {inventory.filter(item => item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK').length > 0 && (
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-400 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
                <p className="mt-1 text-sm text-yellow-700">
                  You have {inventory.filter(item => item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK').length} items 
                  that require attention. Please review and restock.
                </p>
                <button
                  onClick={() => navigate('/pharmacist/inventory')}
                  className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900"
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/pharmacist/inventory/add')}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-110"
        title="Add New Inventory"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PharmacistDashboard;
