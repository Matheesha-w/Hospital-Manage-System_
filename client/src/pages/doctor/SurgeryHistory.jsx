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
      case 'EMERGENCY': return 'text-red-700 bg-red-100';
      case 'URGENT': return 'text-orange-700 bg-orange-100';
      case 'ELECTIVE': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-700 bg-gray-100';
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
      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-cyan-100">
        <DoctorSidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-cyan-50 to-white">
      <DoctorSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-blue-200">
            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
              🩺 Surgery History
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 px-3 py-1.5 rounded-full shadow-sm border border-blue-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{completedSurgeries.length} Completed Surgeries</span>
            </div>
          </div>

          {/* Empty State */}
          {completedSurgeries.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-12 text-center">
              <Calendar className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">No Completed Surgeries</h3>
              <p className="text-gray-600">You haven’t completed any surgeries yet.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {completedSurgeries.map((surgery) => (
                <div
                  key={surgery.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h3 className="text-xl font-semibold text-blue-900">{surgery.condition}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(surgery.urgency)}`}>
                          {surgery.urgency}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSurgeryTypeColor(surgery.surgeryType)}`}>
                          {surgery.surgeryType}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Patient:</span> {surgery.patientName}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-cyan-600" />
                          <span className="font-medium">Room:</span> {surgery.operatingRoom}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Scheduled:</span> {formatDate(surgery.scheduledAt)}
                        </div>
                      </div>

                      {surgery.notes && (
                        <div className="flex items-start gap-2 text-sm text-gray-700 mb-4">
                          <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                          <span className="font-medium">Notes:</span>
                          <span>{surgery.notes}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <Clock className="h-3 w-3 text-blue-400" />
                        <span>Completed: {formatDate(surgery.completedAt || surgery.updatedAt)}</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => handleViewSurgery(surgery.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
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

      {/* Modal */}
      {viewModalOpen && selectedSurgery && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 border-b border-blue-100 pb-3">
                <h2 className="text-2xl font-semibold text-blue-800">Surgery Details</h2>
                <button
                  onClick={() => { setViewModalOpen(false); setSelectedSurgery(null); }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  ✖
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Info label="Patient Name" value={selectedSurgery.patientName} />
                  <Info label="Condition" value={selectedSurgery.condition} />
                  <Info label="Urgency" badge={getUrgencyColor(selectedSurgery.urgency)} value={selectedSurgery.urgency} />
                  <Info label="Surgery Type" badge={getSurgeryTypeColor(selectedSurgery.surgeryType)} value={selectedSurgery.surgeryType} />
                  <Info label="Operating Room" value={selectedSurgery.operatingRoom} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-green-700 bg-green-100 border border-green-200">
                      <CheckCircle className="h-3 w-3" />
                      {selectedSurgery.status}
                    </span>
                  </div>
                </div>

                <Info label="Scheduled At" value={formatDate(selectedSurgery.scheduledAt)} />

                {selectedSurgery.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <p className="text-sm text-gray-800 bg-blue-50/50 border border-blue-100 p-3 rounded-lg">{selectedSurgery.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-100 text-xs text-gray-500">
                  <Info label="Created" value={formatDate(selectedSurgery.createdAt)} small />
                  <Info label="Last Updated" value={formatDate(selectedSurgery.updatedAt)} small />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => { setViewModalOpen(false); setSelectedSurgery(null); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
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

function Info({ label, value, badge, small }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {badge ? (
        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${badge}`}>{value}</span>
      ) : (
        <p className={`text-sm ${small ? 'text-gray-500' : 'text-gray-900'}`}>{value}</p>
      )}
    </div>
  );
}
