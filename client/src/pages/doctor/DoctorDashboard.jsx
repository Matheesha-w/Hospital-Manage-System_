import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import SurgeryTabs from './components/SurgeryTabs';
import SurgeryMiniCharts from './components/SurgeryMiniCharts';

const initialForm = { patientId: '', patientName: '', condition: '', urgency: '', notes: '', scheduledAt: '', operatingRoom: '', surgeryType: '' };

export default function DoctorDashboard() {
  const [surgeries, setSurgeries] = useState([]);
  const [counts, setCounts] = useState({ completed: 0, pending: 0 });
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [patientOptions, setPatientOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewing, setViewing] = useState(null); // holds the surgery details for modal
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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded shadow p-4 border-l-4 border-emerald-500">
          <div className="text-sm text-gray-600">Completed Surgeries</div>
          <div className="text-3xl font-semibold mt-1">{counts.completed}</div>
        </div>
        <div className="bg-white rounded shadow p-4 border-l-4 border-amber-500">
          <div className="text-sm text-gray-600">Pending Surgeries</div>
          <div className="text-3xl font-semibold mt-1">{counts.pending}</div>
        </div>
      </div>

      <SurgeryMiniCharts counts={counts} />

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Patient</label>
          <select
            className="w-full border rounded px-3 py-2"
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
          <label className="block text-sm font-medium mb-1">Condition</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Urgency</label>
          <select className="w-full border rounded px-3 py-2" value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
            <option value="">Select urgency</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="URGENT">Urgent</option>
            <option value="ELECTIVE">Elective</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Surgery Type</label>
          <select className="w-full border rounded px-3 py-2" value={form.surgeryType} onChange={(e) => setForm({ ...form, surgeryType: e.target.value })}>
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
          <label className="block text-sm font-medium mb-1">Operating Room</label>
          <select className="w-full border rounded px-3 py-2" value={form.operatingRoom} onChange={(e) => setForm({ ...form, operatingRoom: e.target.value })}>
            <option value="">Select a room</option>
            <option value="OR-1">OR-1</option>
            <option value="OR-2">OR-2</option>
            <option value="OR-3">OR-3</option>
            <option value="OR-4">OR-4</option>
            <option value="OR-5">OR-5</option>
            <option value="OR-6">OR-6</option>
            <option value="OR-7">OR-7</option>
            <option value="OR-8">OR-8</option>
            <option value="OR-9">OR-9</option>
            <option value="OR-10">OR-10</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Scheduled At</label>
          <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea className="w-full border rounded px-3 py-2" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <button disabled={!canSubmit || loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">{editingId ? 'Update' : 'Create'} Surgery</button>
          {editingId && (
            <button type="button" className="px-4 py-2 rounded border" onClick={() => { setEditingId(null); setForm(initialForm); }}>Cancel</button>
          )}
        </div>
      </form>

      <SurgeryTabs
        surgeries={surgeries}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onMarkComplete={onMarkComplete}
      />

      {viewOpen && viewing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Surgery Details</h2>
              <button className="text-gray-600" onClick={() => { setViewOpen(false); setViewing(null); }}>✕</button>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Patient:</span> {viewing.patientName}</div>
              <div><span className="font-medium">Condition:</span> {viewing.condition}</div>
              <div><span className="font-medium">Urgency:</span> {viewing.urgency}</div>
              <div><span className="font-medium">Surgery Type:</span> {viewing.surgeryType}</div>
              <div><span className="font-medium">Operating Room:</span> {viewing.operatingRoom}</div>
              <div><span className="font-medium">Scheduled At:</span> {new Date(viewing.scheduledAt).toLocaleString()}</div>
              <div><span className="font-medium">Status:</span> {viewing.status}</div>
              {viewing.notes && <div><span className="font-medium">Notes:</span> {viewing.notes}</div>}
              <div><span className="font-medium">Created:</span> {new Date(viewing.createdAt).toLocaleString()}</div>
              <div><span className="font-medium">Updated:</span> {new Date(viewing.updatedAt).toLocaleString()}</div>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 rounded border" onClick={() => { setViewOpen(false); setViewing(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


