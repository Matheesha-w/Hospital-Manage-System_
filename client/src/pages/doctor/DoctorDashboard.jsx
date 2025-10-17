import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import SurgeryTabs from './components/SurgeryTabs';
import SurgeryMiniCharts from './components/SurgeryMiniCharts';
import DoctorSidebar from './components/DoctorSidebar';

const initialForm = { patientId: '', patientName: '', condition: '', urgency: '', notes: '', scheduledAt: '', operatingRoom: '', surgeryType: '' };

export default function DoctorDashboard() {
  const [surgeries, setSurgeries] = useState([]);
  const [counts, setCounts] = useState({ completed: 0, pending: 0 });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [patientOptions, setPatientOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const canSubmit = useMemo(() => {
    return form.patientId && form.condition && form.urgency && form.scheduledAt && form.surgeryType && form.operatingRoom;
  }, [form]);

  const fetchSurgeries = async () => {
    const res = await axios.get('/doctor/surgeries');
    setSurgeries(res.data.data || []);
  };

  const fetchCounts = async () => {
    const res = await axios.get('/doctor/surgeries/counts');
    setCounts(res.data.data || { completed: 0, pending: 0 });
  };

  useEffect(() => {
    fetchSurgeries();
    fetchCounts();
  }, []);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await axios.get('/doctor/surgeries/patients');
        setPatientOptions(res.data.data || []);
      } catch (e) {
        setPatientOptions([]);
      }
    };
    loadPatients();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      if (editingId) {
        await axios.put('/doctor/surgeries', { id: editingId, condition: form.condition, urgency: form.urgency, notes: form.notes, scheduledAt: form.scheduledAt, operatingRoom: form.operatingRoom, surgeryType: form.surgeryType });
      } else {
        await axios.post('/doctor/surgeries', { patientId: form.patientId, condition: form.condition, urgency: form.urgency, notes: form.notes, scheduledAt: form.scheduledAt, operatingRoom: form.operatingRoom, surgeryType: form.surgeryType });
      }
      setForm(initialForm);
      setEditingId(null);
      await Promise.all([fetchSurgeries(), fetchCounts()]);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (s) => {
    setEditingId(s.id);
    setForm({ patientId: s.patientId, patientName: s.patientName, condition: s.condition, urgency: s.urgency || '', notes: s.notes || '', scheduledAt: s.scheduledAt?.slice(0, 16), operatingRoom: s.operatingRoom || '', surgeryType: s.surgeryType || '' });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this surgery?')) return;
    await axios.delete(`/doctor/surgeries/${id}`);
    await Promise.all([fetchSurgeries(), fetchCounts()]);
  };

  const onMarkComplete = async (id) => {
    await axios.put(`/doctor/surgeries/${id}/complete`);
    await Promise.all([fetchSurgeries(), fetchCounts()]);
  };

  const onView = async (id) => {
    try {
      const res = await axios.get(`/doctor/surgeries/${id}`);
      setViewing(res.data.data);
      setViewOpen(true);
    } catch (e) {
      // noop
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-emerald-50 to-indigo-100">
      <DoctorSidebar />
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-8 space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Doctor Dashboard
            </h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105">
              <div className="text-sm opacity-90">Completed Surgeries</div>
              <div className="text-4xl font-bold mt-2">{counts.completed}</div>
            </div>
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl shadow-lg p-6 transition-transform transform hover:scale-105">
              <div className="text-sm opacity-90">Pending Surgeries</div>
              <div className="text-4xl font-bold mt-2">{counts.pending}</div>
            </div>
          </div>

          {/* Mini Charts */}
          <SurgeryMiniCharts counts={counts} />

          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingId ? 'Edit Surgery Details' : 'Schedule New Surgery'}
            </h2>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Patient</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  value={form.patientId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selected = patientOptions.find(p => p.patientId === selectedId);
                    setForm({ ...form, patientId: selectedId, patientName: selected?.patientName || '' });
                  }}
                  disabled={!!editingId}
                >
                  <option value="">Select a patient</option>
                  {patientOptions.map(p => (
                    <option key={p.patientId} value={p.patientId}>{p.patientName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Condition</label>
                <input type="text" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Urgency</label>
                <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
                  <option value="">Select urgency</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="URGENT">Urgent</option>
                  <option value="ELECTIVE">Elective</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Surgery Type</label>
                <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={form.surgeryType} onChange={(e) => setForm({ ...form, surgeryType: e.target.value })}>
                  <option value="">Select a type</option>
                  <option value="GENERAL">General</option>
                  <option value="ORTHOPEDIC">Orthopedic</option>
                  <option value="CARDIAC">Cardiac</option>
                  <option value="NEURO">Neuro</option>
                  <option value="ENT">ENT</option>
                  <option value="GYNECOLOGY">Gynecology</option>
                  <option value="UROLOGY">Urology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Operating Room</label>
                <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={form.operatingRoom} onChange={(e) => setForm({ ...form, operatingRoom: e.target.value })}>
                  <option value="">Select a room</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={`OR-${i + 1}`}>OR-{i + 1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Scheduled At</label>
                <input type="datetime-local" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-600">Notes</label>
                <textarea className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div className="md:col-span-2 flex gap-3 mt-3">
                <button disabled={!canSubmit || loading} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition disabled:opacity-50">
                  {editingId ? 'Update' : 'Create'} Surgery
                </button>
                {editingId && (
                  <button type="button" className="px-6 py-2 rounded-lg border hover:bg-gray-50 transition" onClick={() => { setEditingId(null); setForm(initialForm); }}>Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* Surgery Tabs */}
          <SurgeryTabs
            surgeries={surgeries}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onMarkComplete={onMarkComplete}
          />

          {/* View Modal */}
          {viewOpen && viewing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-blue-700">Surgery Details</h2>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => { setViewOpen(false); setViewing(null); }}>✕</button>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div><span className="font-medium text-gray-900">Patient:</span> {viewing.patientName}</div>
                  <div><span className="font-medium text-gray-900">Condition:</span> {viewing.condition}</div>
                  <div><span className="font-medium text-gray-900">Urgency:</span> {viewing.urgency}</div>
                  <div><span className="font-medium text-gray-900">Surgery Type:</span> {viewing.surgeryType}</div>
                  <div><span className="font-medium text-gray-900">Operating Room:</span> {viewing.operatingRoom}</div>
                  <div><span className="font-medium text-gray-900">Scheduled At:</span> {new Date(viewing.scheduledAt).toLocaleString()}</div>
                  <div><span className="font-medium text-gray-900">Status:</span> {viewing.status}</div>
                  {viewing.notes && <div><span className="font-medium text-gray-900">Notes:</span> {viewing.notes}</div>}
                  <div><span className="font-medium text-gray-900">Created:</span> {new Date(viewing.createdAt).toLocaleString()}</div>
                  <div><span className="font-medium text-gray-900">Updated:</span> {new Date(viewing.updatedAt).toLocaleString()}</div>
                </div>
                <div className="mt-5 flex justify-end">
                  <button className="px-5 py-2 rounded-lg border hover:bg-gray-100 transition" onClick={() => { setViewOpen(false); setViewing(null); }}>Close</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
