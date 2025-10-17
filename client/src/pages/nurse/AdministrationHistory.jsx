import React, { useState, useEffect } from 'react';
import { 
  History, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Filter,
  Search,
  Calendar
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdministrationHistory = ({ patientId, nurseId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, today, week, month
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdverseReactions, setShowAdverseReactions] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [patientId, nurseId, filter]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      let response;
      if (patientId) {
        response = await axios.get(`/nurse/patients/${patientId}/administration-history`);
      } else {
        response = await axios.get('/nurse/administration-history');
      }

      if (response.data.success) {
        let filteredHistory = response.data.data;
        
        // Apply date filter
        const now = new Date();
        switch (filter) {
          case 'today':
            filteredHistory = filteredHistory.filter(record => 
              new Date(record.administrationTime).toDateString() === now.toDateString()
            );
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredHistory = filteredHistory.filter(record => 
              new Date(record.administrationTime) >= weekAgo
            );
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredHistory = filteredHistory.filter(record => 
              new Date(record.administrationTime) >= monthAgo
            );
            break;
        }

        // Apply search filter
        if (searchTerm) {
          filteredHistory = filteredHistory.filter(record =>
            record.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.notes?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Apply adverse reactions filter
        if (showAdverseReactions) {
          filteredHistory = filteredHistory.filter(record => record.hasAdverseReaction);
        }

        setHistory(filteredHistory);
      } else {
        toast.error('Failed to load administration history');
      }
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load administration history');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'FAILED':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleSearch = () => {
    loadHistory();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <History className="h-6 w-6 text-pink-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {patientId ? 'Patient Administration History' : 'My Administration History'}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by medication name or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          {/* Date Filter */}
          <div className="sm:w-48">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Adverse Reactions Filter */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="adverseReactions"
              checked={showAdverseReactions}
              onChange={(e) => setShowAdverseReactions(e.target.checked)}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="adverseReactions" className="text-sm text-gray-700">
              Show adverse reactions only
            </label>
          </div>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        {loading ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading administration history...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {history.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {record.medicationName}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1">{record.status}</span>
                      </span>
                      {record.hasAdverseReaction && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Adverse Reaction
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Dosage:</span> {record.fullDosage}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDateTime(record.administrationTime)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Record ID:</span> {record.recordId}
                      </div>
                    </div>

                    {record.notes && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">Notes:</span>
                        <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                      </div>
                    )}

                    {record.adverseReaction && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-red-800">Adverse Reaction</span>
                        </div>
                        <p className="text-sm text-red-700">{record.adverseReaction}</p>
                      </div>
                    )}

                    {record.verificationCode && (
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Verification Code:</span> {record.verificationCode}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {patientId 
                ? 'No administration records found for this patient.' 
                : 'No administration records found.'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {history.filter(r => r.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Adverse Reactions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {history.filter(r => r.hasAdverseReaction).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {history.filter(r => r.status === 'PENDING').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <History className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Records</p>
                <p className="text-2xl font-semibold text-gray-900">{history.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministrationHistory;

