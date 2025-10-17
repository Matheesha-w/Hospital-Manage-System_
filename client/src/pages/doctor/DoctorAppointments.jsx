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
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-cyan-100">
      <DoctorSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-blue-200 pb-4">
            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
              🩺 My Appointments
            </h1>
            <button
              onClick={fetchAppointments}
              className="px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow hover:from-blue-600 hover:to-cyan-600 transition"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="bg-white/70 backdrop-blur rounded-xl shadow-md p-6 text-gray-600 text-center border border-blue-100">
              Loading appointments...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg p-4 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
              <div className="px-6 py-3 text-sm text-blue-700 bg-blue-50 font-semibold flex gap-4 rounded-t-2xl">
                <div className="w-1/5">Patient</div>
                <div className="w-1/5">Email</div>
                <div className="w-1/5">When</div>
                <div className="w-1/5">Reason</div>
                <div className="w-1/5">Status</div>
              </div>

              {appointments.length === 0 && (
                <div className="px-6 py-8 text-center text-gray-500">
                  No appointments found.
                </div>
              )}

              {appointments.map((a) => (
                <div
                  key={a.id}
                  className="px-6 py-4 text-sm text-gray-800 flex gap-4 items-center hover:bg-blue-50/40 transition-colors"
                >
                  <div className="w-1/5 font-medium truncate" title={a.patientName}>
                    {a.patientName}
                  </div>
                  <div className="w-1/5 truncate" title={a.patientEmail}>
                    {a.patientEmail}
                  </div>
                  <div className="w-1/5 text-gray-600">
                    {a.appointmentAt
                      ? new Date(a.appointmentAt).toLocaleString()
                      : '-'}
                  </div>
                  <div className="w-1/5 truncate text-gray-700" title={a.reason}>
                    {a.reason}
                  </div>
                  <div className="w-1/5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        a.status === 'Completed'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : a.status === 'Pending'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
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
