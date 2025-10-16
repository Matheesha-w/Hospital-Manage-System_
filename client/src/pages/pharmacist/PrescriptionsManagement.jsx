import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Search, Check, X, AlertTriangle } from 'lucide-react';

const PrescriptionsManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [substitutionReason, setSubstitutionReason] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    filterPrescriptions();
  }, [searchTerm, filterStatus, prescriptions]);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/pharmacy/prescriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setPrescriptions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPrescriptions = () => {
    let filtered = prescriptions;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    setFilteredPrescriptions(filtered);
  };

  const handleDispense = async () => {
    if (!selectedPrescription) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pharmacy/dispense/${selectedPrescription.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pharmacistId: user.id,
          pharmacistName: `${user.firstName} ${user.lastName}`
        })
      });
      const data = await response.json();

      if (data.success) {
        alert('Prescription dispensed successfully');
        setShowDispenseModal(false);
        fetchPrescriptions();
      } else {
        alert(data.message || 'Failed to dispense prescription');
      }
    } catch (error) {
      console.error('Error dispensing prescription:', error);
      alert('Error dispensing prescription');
    }
  };

  const handleSubstitution = async () => {
    if (!selectedPrescription || !substitutionReason) {
      alert('Please provide a reason for substitution');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/pharmacy/request-substitution/${selectedPrescription.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          substitutionReason: substitutionReason
        })
      });
      const data = await response.json();

      if (data.success) {
        alert('Substitution request submitted successfully');
        setShowSubstitutionModal(false);
        setSubstitutionReason('');
        fetchPrescriptions();
      } else {
        alert('Failed to submit substitution request');
      }
    } catch (error) {
      console.error('Error requesting substitution:', error);
      alert('Error requesting substitution');
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
      case 'SUBSTITUTION_REQUESTED':
        return 'bg-blue-100 text-blue-800';
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/pharmacist/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            Prescriptions Management
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by patient, drug, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="DISPENSED">Dispensed</option>
              <option value="SUBSTITUTION_REQUESTED">Substitution Requested</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-600 text-sm font-medium">Total Prescriptions</h3>
            <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-4">
            <h3 className="text-yellow-600 text-sm font-medium">Pending</h3>
            <p className="text-2xl font-bold text-yellow-900">
              {prescriptions.filter(p => p.status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-4">
            <h3 className="text-green-600 text-sm font-medium">Dispensed</h3>
            <p className="text-2xl font-bold text-green-900">
              {prescriptions.filter(p => p.status === 'DISPENSED').length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg shadow p-4">
            <h3 className="text-blue-600 text-sm font-medium">Substitution Requested</h3>
            <p className="text-2xl font-bold text-blue-900">
              {prescriptions.filter(p => p.status === 'SUBSTITUTION_REQUESTED').length}
            </p>
          </div>
        </div>

        {/* Prescriptions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Drug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No prescriptions found
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <tr key={prescription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{prescription.drugName}</div>
                        <div className="text-sm text-gray-500">{prescription.dosage}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.doctorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPrescriptionStatusColor(prescription.status)}`}>
                          {prescription.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {prescription.status === 'PENDING' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedPrescription(prescription);
                                setShowDispenseModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 flex items-center"
                              title="Dispense"
                            >
                              <Check className="w-5 h-5 mr-1" />
                              Dispense
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPrescription(prescription);
                                setShowSubstitutionModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                              title="Request Substitution"
                            >
                              <AlertTriangle className="w-5 h-5 mr-1" />
                              Substitute
                            </button>
                          </div>
                        )}
                        {prescription.status === 'DISPENSED' && (
                          <div className="text-sm text-gray-500">
                            Dispensed by: {prescription.pharmacistName}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dispense Modal */}
      {showDispenseModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Dispense Prescription</h2>
            <div className="space-y-3 mb-6">
              <div>
                <span className="text-sm text-gray-600">Patient:</span>
                <p className="text-gray-900 font-medium">{selectedPrescription.patientName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Drug:</span>
                <p className="text-gray-900 font-medium">{selectedPrescription.drugName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Dosage:</span>
                <p className="text-gray-900 font-medium">{selectedPrescription.dosage}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Quantity:</span>
                <p className="text-gray-900 font-medium">{selectedPrescription.quantity}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to dispense this prescription?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDispense}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Confirm Dispense
              </button>
              <button
                onClick={() => setShowDispenseModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Substitution Modal */}
      {showSubstitutionModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Substitution</h2>
            <div className="space-y-3 mb-4">
              <div>
                <span className="text-sm text-gray-600">Current Drug:</span>
                <p className="text-gray-900 font-medium">{selectedPrescription.drugName}</p>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Substitution
              </label>
              <textarea
                value={substitutionReason}
                onChange={(e) => setSubstitutionReason(e.target.value)}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter reason for requesting substitution..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSubstitution}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Submit Request
              </button>
              <button
                onClick={() => {
                  setShowSubstitutionModal(false);
                  setSubstitutionReason('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsManagement;
