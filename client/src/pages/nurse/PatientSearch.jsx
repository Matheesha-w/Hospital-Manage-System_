import React, { useState } from 'react';
import { Search, User, Phone, Mail, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PatientSearch = ({ onPatientSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('ALL');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchPatients = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setLoading(true);
    try {
      console.log('Searching patients with:', { searchTerm, searchType });
      const response = await axios.post('/nurse/patients/search', {
        searchTerm: searchTerm.trim(),
        searchType
      });

      console.log('Search response:', response.data);
      if (response.data.success) {
        setPatients(response.data.data);
        setHasSearched(true);
        if (response.data.data.length === 0) {
          toast.info('No patients found matching your search');
        }
      } else {
        toast.error(response.data.message || 'Failed to search patients');
      }
    } catch (error) {
      console.error('Error searching patients:', error);
      toast.error('Failed to search patients. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchPatients();
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
                placeholder="Enter patient name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="ALL">All Fields</option>
              <option value="NAME">Name Only</option>
              <option value="ID">Patient ID</option>
              <option value="EMAIL">Email</option>
            </select>
          </div>
          
          <button
            onClick={searchPatients}
            disabled={loading}
            className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">
            Search Results ({patients.length} found)
          </h4>
          
          {patients.length > 0 ? (
            <div className="grid gap-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onPatientSelect(patient)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <h5 className="text-lg font-semibold text-gray-900">
                          {patient.fullName}
                        </h5>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          ID: {patient.patientId}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Age: {getAge(patient.dateOfBirth)} years</span>
                        </div>
                        
                        {patient.phoneNumber && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phoneNumber}</span>
                          </div>
                        )}
                        
                        {patient.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{patient.email}</span>
                          </div>
                        )}
                      </div>
                      
                      {patient.allergies && patient.allergies.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-red-600">Allergies: </span>
                          <span className="text-sm text-red-600">
                            {patient.allergies.join(', ')}
                          </span>
                        </div>
                      )}
                      
                      {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-600">Conditions: </span>
                          <span className="text-sm text-gray-600">
                            {patient.medicalConditions.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4">
                      <button className="px-4 py-2 bg-pink-600 text-white text-sm rounded-md hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                        Select Patient
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No patients found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;

