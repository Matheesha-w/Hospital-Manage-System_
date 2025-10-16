import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Pill, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  User,
  Save,
  X
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MedicationAdministration = ({ patient, onMedicationAdministered, onBack }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [formData, setFormData] = useState({
    administeredDosage: '',
    notes: '',
    adverseReaction: '',
    verificationCode: ''
  });
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Select medication, 2: Administer, 3: Confirm

  useEffect(() => {
    if (patient) {
      loadPrescriptions();
    }
  }, [patient]);

  const loadPrescriptions = async () => {
    try {
      const response = await axios.get(`/nurse/patients/${patient.patientId}/prescriptions`);
      if (response.data.success) {
        setPrescriptions(response.data.data.filter(p => p.isActive));
      } else {
        toast.error('Failed to load prescriptions');
      }
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      toast.error('Failed to load prescriptions');
    }
  };

  const handlePrescriptionSelect = (prescription) => {
    setSelectedPrescription(prescription);
    setFormData({
      administeredDosage: prescription.dosage.toString(),
      notes: '',
      adverseReaction: '',
      verificationCode: ''
    });
    setStep(2);
  };

  const validateAdministration = async () => {
    if (!selectedPrescription) return;

    try {
      const response = await axios.post('/nurse/medications/validate', {
        patientId: patient.patientId,
        prescriptionId: selectedPrescription.id,
        medicationId: selectedPrescription.medicationId,
        administeredDosage: parseFloat(formData.administeredDosage),
        dosageUnit: selectedPrescription.dosageUnit,
        notes: formData.notes,
        adverseReaction: formData.adverseReaction,
        verificationCode: formData.verificationCode
      });

      if (response.data.success) {
        setValidation(response.data.data);
        if (response.data.data.isValid) {
          setStep(3);
        } else {
          toast.error('Validation failed: ' + response.data.data.errors.join(', '));
        }
      } else {
        toast.error('Validation failed');
      }
    } catch (error) {
      console.error('Error validating administration:', error);
      toast.error('Failed to validate medication administration');
    }
  };

  const handleAdminister = async () => {
    if (!selectedPrescription) return;

    setLoading(true);
    try {
      const response = await axios.post('/nurse/medications/administer', {
        patientId: patient.patientId,
        prescriptionId: selectedPrescription.id,
        medicationId: selectedPrescription.medicationId,
        administeredDosage: parseFloat(formData.administeredDosage),
        dosageUnit: selectedPrescription.dosageUnit,
        notes: formData.notes,
        adverseReaction: formData.adverseReaction,
        verificationCode: formData.verificationCode
      });

      if (response.data.success) {
        toast.success('Medication administered successfully');
        onMedicationAdministered();
      } else {
        toast.error(response.data.message || 'Failed to administer medication');
      }
    } catch (error) {
      console.error('Error administering medication:', error);
      toast.error('Failed to administer medication');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Administer Medication</h2>
            <p className="text-gray-600">Patient: {patient.fullName} (ID: {patient.patientId})</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          {[
            { number: 1, label: 'Select Medication', active: step >= 1 },
            { number: 2, label: 'Enter Details', active: step >= 2 },
            { number: 3, label: 'Confirm & Administer', active: step >= 3 }
          ].map((stepItem, index) => (
            <div key={stepItem.number} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                stepItem.active 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {stepItem.active ? <CheckCircle className="h-5 w-5" /> : stepItem.number}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                stepItem.active ? 'text-pink-600' : 'text-gray-500'
              }`}>
                {stepItem.label}
              </span>
              {index < 2 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  stepItem.active ? 'bg-pink-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Select Medication */}
      {step === 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Medication to Administer</h3>
          
          {prescriptions.length > 0 ? (
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handlePrescriptionSelect(prescription)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {prescription.medicationName}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-2">
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
                    </div>
                    <div className="ml-4">
                      <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                        Select
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
      )}

      {/* Step 2: Enter Details */}
      {step === 2 && selectedPrescription && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medication Administration Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Selected Medication</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Pill className="h-5 w-5 text-pink-600" />
                  <span className="font-medium text-gray-900">{selectedPrescription.medicationName}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Dosage: {selectedPrescription.fullDosage}</div>
                  <div>Frequency: {selectedPrescription.frequency}</div>
                  {selectedPrescription.instructions && (
                    <div>Instructions: {selectedPrescription.instructions}</div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Administration Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Administered Dosage
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      step="0.1"
                      name="administeredDosage"
                      value={formData.administeredDosage}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-600">
                      {selectedPrescription.dosageUnit}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter any notes about the administration..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adverse Reaction (if any)
                  </label>
                  <textarea
                    name="adverseReaction"
                    value={formData.adverseReaction}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Describe any adverse reactions observed..."
                  />
                </div>

                {selectedPrescription.medicationName.toLowerCase().includes('morphine') || 
                 selectedPrescription.medicationName.toLowerCase().includes('fentanyl') ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Verification Code (Required for controlled substances)
                    </label>
                    <input
                      type="text"
                      name="verificationCode"
                      value={formData.verificationCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Enter verification code..."
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              onClick={validateAdministration}
              className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              Validate & Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm & Administer */}
      {step === 3 && selectedPrescription && validation && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Medication Administration</h3>
          
          {/* Validation Results */}
          {validation.warnings && validation.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Warnings</span>
              </div>
              <ul className="text-sm text-yellow-700">
                {validation.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Administration Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Administration Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Patient Information</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Name: {patient.fullName}</div>
                  <div>ID: {patient.patientId}</div>
                  <div>Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years</div>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Medication Details</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Medication: {selectedPrescription.medicationName}</div>
                  <div>Dosage: {formData.administeredDosage} {selectedPrescription.dosageUnit}</div>
                  <div>Time: {new Date().toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            {formData.notes && (
              <div className="mt-4">
                <h5 className="font-medium text-gray-700 mb-2">Notes</h5>
                <p className="text-sm text-gray-600">{formData.notes}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              onClick={handleAdminister}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Administering...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Confirm & Administer</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationAdministration;

