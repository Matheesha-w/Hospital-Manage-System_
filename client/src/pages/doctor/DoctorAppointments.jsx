import { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorSidebar from './components/DoctorSidebar';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/doctor/appointments');
      setAppointments(res.data?.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <DoctorSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Appointments</h1>
            <button
              onClick={fetchAppointments}
              className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="bg-white rounded shadow p-6 text-gray-600">Loading...</div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded p-4">{error}</div>
          )}

          {!loading && !error && (
            <div className="bg-white rounded shadow divide-y">
              <div className="px-4 py-3 text-sm text-gray-600 flex gap-4">
                <div className="w-1/5 font-medium">Patient</div>
                <div className="w-1/5 font-medium">Email</div>
                <div className="w-1/5 font-medium">When</div>
                <div className="w-1/5 font-medium">Reason</div>
                <div className="w-1/5 font-medium">Status</div>
              </div>
              {appointments.length === 0 && (
                <div className="px-4 py-6 text-gray-500">No appointments found.</div>
              )}
              {appointments.map((a) => (
                <div key={a.id} className="px-4 py-3 text-sm text-gray-800 flex gap-4 items-center">
                  <div className="w-1/5 truncate" title={a.patientName}>{a.patientName}</div>
                  <div className="w-1/5 truncate" title={a.patientEmail}>{a.patientEmail}</div>
                  <div className="w-1/5">{a.appointmentAt ? new Date(a.appointmentAt).toLocaleString() : '-'}</div>
                  <div className="w-1/5 truncate" title={a.reason}>{a.reason}</div>
                  <div className="w-1/5">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {a.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
