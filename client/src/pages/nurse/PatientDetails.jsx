import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Heart, 
  AlertTriangle, 
  Pill,
  Clock,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PatientDetails = ({ patient, onAdministerMedication }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patient) {
      loadPrescriptions();
    }
  }, [patient]);

  const loadPrescriptions = async () => {
    try {
      const response = await axios.get(`/api/nurse/patients/${patient.patientId}/prescriptions`);
      if (response.data.success) {
        setPrescriptions(response.data.data);
      } else {
        toast.error('Failed to load prescriptions');
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getPrescriptionStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!patient) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No patient selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-pink-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-pink-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{patient.fullName}</h2>
              <p className="text-gray-600">Patient ID: {patient.patientId}</p>
            </div>
          </div>
          <button
            onClick={onAdministerMedication}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 flex items-center space-x-2"
          >
            <Pill className="h-4 w-4" />
            <span>Administer Medication</span>
          </button>
        </div>

        {/* Patient Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Age: {getAge(patient.dateOfBirth)} years</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">DOB: {formatDate(patient.dateOfBirth)}</span>
              </div>
              {patient.phoneNumber && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{patient.phoneNumber}</span>
                </div>
              )}
              {patient.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{patient.email}</span>
                </div>
              )}
              {patient.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{patient.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
            <div className="space-y-2 text-sm">
              {patient.bloodType && (
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Blood Type: {patient.bloodType}</span>
                </div>
              )}
              {patient.emergencyContact && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Emergency: {patient.emergencyContact}</span>
                </div>
              )}
              {patient.emergencyPhone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{patient.emergencyPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Health Alerts</h3>
            <div className="space-y-2">
              {patient.allergies && patient.allergies.length > 0 ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-800">Allergies</span>
                  </div>
                  <ul className="text-sm text-red-700">
                    {patient.allergies.map((allergy, index) => (
                      <li key={index}>• {allergy}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No known allergies</div>
              )}

              {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Medical Conditions</span>
                  </div>
                  <ul className="text-sm text-yellow-700">
                    {patient.medicalConditions.map((condition, index) => (
                      <li key={index}>• {condition}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Prescriptions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Prescriptions</h3>
          {loading && <Clock className="h-5 w-5 text-gray-400 animate-spin" />}
        </div>

        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading prescriptions...</p>
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        {prescription.medicationName}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPrescriptionStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Dosage:</span> {prescription.fullDosage}
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span> {prescription.frequency}
                      </div>
                      <div>
                        <span className="font-medium">Remaining:</span> {prescription.remainingQuantity || 'N/A'}
                      </div>
                    </div>
                    
                    {prescription.instructions && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Instructions:</span> {prescription.instructions}
                      </div>
                    )}
                    
                    {prescription.notes && (
                      <div className="mt-1 text-sm text-gray-500">
                        <span className="font-medium">Notes:</span> {prescription.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4">
                    <button
                      onClick={onAdministerMedication}
                      className="px-3 py-1 bg-pink-600 text-white text-sm rounded-md hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 flex items-center space-x-1"
                    >
                      <Pill className="h-3 w-3" />
                      <span>Administer</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No active prescriptions found for this patient.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;

