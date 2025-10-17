import { useEffect, useMemo, useState } from 'react';
import SurgeryTabs from './components/SurgeryTabs';
import SurgeryMiniCharts from './components/SurgeryMiniCharts';
import DoctorSidebar from './components/DoctorSidebar';
import SurgeryForm from './components/SurgeryForm';
import SurgeryViewModal from './components/SurgeryViewModal';
import { 
  getSurgeries, getCounts, getPatients, getSurgeryById,
  createSurgery, updateSurgery, deleteSurgery, completeSurgery
} from '../../services/doctorSurgeryService';
import { CheckCircle2, Hourglass, Stethoscope } from 'lucide-react';

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
    const res = await getSurgeries();
    setSurgeries(res.data.data || []);
  };

  const fetchCounts = async () => {
    const res = await getCounts();
    setCounts(res.data.data || { completed: 0, pending: 0 });
  };

  useEffect(() => {
    fetchSurgeries();
    fetchCounts();
  }, []);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const res = await getPatients();
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
        await updateSurgery({ id: editingId, condition: form.condition, urgency: form.urgency, notes: form.notes, scheduledAt: form.scheduledAt, operatingRoom: form.operatingRoom, surgeryType: form.surgeryType });
      } else {
        await createSurgery({ patientId: form.patientId, condition: form.condition, urgency: form.urgency, notes: form.notes, scheduledAt: form.scheduledAt, operatingRoom: form.operatingRoom, surgeryType: form.surgeryType });
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
    await deleteSurgery(id);
    await Promise.all([fetchSurgeries(), fetchCounts()]);
  };

  const onMarkComplete = async (id) => {
    await completeSurgery(id);
    await Promise.all([fetchSurgeries(), fetchCounts()]);
  };

  const onView = async (id) => {
    try {
      const res = await getSurgeryById(id);
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
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              Doctor Dashboard
            </h1>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-xl shadow-lg p-6 transition-transform transform hover:scale-[1.02] bg-gradient-to-br from-emerald-500 via-emerald-400 to-teal-500 text-white">
              <div className="absolute -right-6 -top-6 opacity-20">
                <CheckCircle2 className="h-24 w-24" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Completed Surgeries</div>
                  <div className="text-4xl font-bold mt-2">{counts.completed}</div>
                </div>
                <span className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl shadow-lg p-6 transition-transform transform hover:scale-[1.02] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white">
              <div className="absolute -right-6 -top-6 opacity-20">
                <Hourglass className="h-24 w-24" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Pending Surgeries</div>
                  <div className="text-4xl font-bold mt-2">{counts.pending}</div>
                </div>
                <span className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                  <Hourglass className="h-7 w-7" />
                </span>
              </div>
            </div>
          </div>

          {/* Mini Charts */}
          <SurgeryMiniCharts counts={counts} />

          {/* Form Section */}
          <SurgeryForm
            form={form}
            setForm={setForm}
            patientOptions={patientOptions}
            editingId={editingId}
            canSubmit={canSubmit}
            loading={loading}
            onSubmit={onSubmit}
            onCancel={() => { setEditingId(null); setForm(initialForm); }}
          />

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
            <SurgeryViewModal viewing={viewing} onClose={() => { setViewOpen(false); setViewing(null); }} />
          )}

        </div>
      </main>
    </div>
  );
} 