import { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorSidebar from './components/DoctorSidebar';
import { Calendar, Clock, User, MapPin, FileText, CheckCircle, Eye } from 'lucide-react';

export default function SurgeryHistory() {
  const [completedSurgeries, setCompletedSurgeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurgery, setSelectedSurgery] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const fetchCompletedSurgeries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/doctor/surgeries/completed');
      setCompletedSurgeries(response.data.data || []);
    } catch (error) {
      console.error('Error fetching completed surgeries:', error);
      setCompletedSurgeries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedSurgeries();
  }, []);

  const handleViewSurgery = async (surgeryId) => {
    try {
      const response = await axios.get(`/doctor/surgeries/${surgeryId}`);
      setSelectedSurgery(response.data.data);
      setViewModalOpen(true);
    } catch (error) {
      console.error('Error fetching surgery details:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'EMERGENCY': return 'text-red-600 bg-red-50';
      case 'URGENT': return 'text-orange-600 bg-orange-50';
      case 'ELECTIVE': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSurgeryTypeColor = (type) => {
    switch (type) {
      case 'CARDIAC': return 'text-red-600 bg-red-50';
      case 'NEURO': return 'text-purple-600 bg-purple-50';
      case 'ORTHOPEDIC': return 'text-green-600 bg-green-50';
      case 'GYNECOLOGY': return 'text-pink-600 bg-pink-50';
      case 'UROLOGY': return 'text-blue-600 bg-blue-50';
      case 'ENT': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

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
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Surgery History</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>{completedSurgeries.length} Completed Surgeries</span>
            </div>
          </div>

          {completedSurgeries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Surgeries</h3>
              <p className="text-gray-600">You haven't completed any surgeries yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedSurgeries.map((surgery) => (
                <div key={surgery.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{surgery.condition}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(surgery.urgency)}`}>
                          {surgery.urgency}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSurgeryTypeColor(surgery.surgeryType)}`}>
                          {surgery.surgeryType}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span className="font-medium">Patient:</span>
                          <span>{surgery.patientName}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">Room:</span>
                          <span>{surgery.operatingRoom}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">Scheduled:</span>
                          <span>{formatDate(surgery.scheduledAt)}</span>
                        </div>
                      </div>

                      {surgery.notes && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                          <FileText className="h-4 w-4 mt-0.5" />
                          <span className="font-medium">Notes:</span>
                          <span className="flex-1">{surgery.notes}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Completed: {formatDate(surgery.completedAt || surgery.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleViewSurgery(surgery.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Surgery Details Modal */}
      {viewModalOpen && selectedSurgery && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Surgery Details</h2>
                <button
                  onClick={() => { setViewModalOpen(false); setSelectedSurgery(null); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                    <p className="text-sm text-gray-900">{selectedSurgery.patientName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                    <p className="text-sm text-gray-900">{selectedSurgery.condition}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(selectedSurgery.urgency)}`}>
                      {selectedSurgery.urgency}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Surgery Type</label>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getSurgeryTypeColor(selectedSurgery.surgeryType)}`}>
                      {selectedSurgery.surgeryType}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operating Room</label>
                    <p className="text-sm text-gray-900">{selectedSurgery.operatingRoom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3" />
                      {selectedSurgery.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled At</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedSurgery.scheduledAt)}</p>
                </div>

                {selectedSurgery.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedSurgery.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                    <p className="text-xs text-gray-500">{formatDate(selectedSurgery.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-xs text-gray-500">{formatDate(selectedSurgery.updatedAt)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => { setViewModalOpen(false); setSelectedSurgery(null); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
