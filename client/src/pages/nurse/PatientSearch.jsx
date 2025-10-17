import React, { useState } from 'react';
import { Search, User, Phone, Mail, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PatientSearch = ({ onPatientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchPatients = async (q = '') => {
    setLoading(true);
    try {
      const response = await axios.get('/nurse/patients/users', {
        params: q ? { q } : {}
      });
      if (response.data?.success) {
        setPatients(response.data.data || []);
        setHasSearched(true);
      } else {
        toast.error(response.data?.message || 'Failed to load patients');
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchPatients(searchTerm.trim());
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Load all patients on mount
  React.useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Patients</h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, username, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
          
          <button
            onClick={() => fetchPatients(searchTerm.trim())}
            disabled={loading}
            className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Patients ({patients.length} found)
          </h4>

          {patients.length > 0 ? (
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3"/>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((p) => {
                    const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ');
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          {fullName || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{p.username}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{p.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{p.phoneNumber || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {p.dateOfBirth ? formatDate(p.dateOfBirth) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {p.dateOfBirth ? `${getAge(p.dateOfBirth)} yrs` : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                            {p.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => onPatientSelect(p)}
                            className="px-3 py-1.5 bg-pink-600 text-white text-xs rounded-md hover:bg-pink-700"
                          >
                            Select
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No patients found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;

