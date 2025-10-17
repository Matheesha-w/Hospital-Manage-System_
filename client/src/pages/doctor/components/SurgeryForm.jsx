import { ClipboardList, Syringe, CalendarClock, Hash, User as UserIcon, Hourglass } from 'lucide-react';

export default function SurgeryForm({ form, setForm, patientOptions, editingId, canSubmit, loading, onSubmit, onCancel }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-blue-600" />
        {editingId ? 'Edit Surgery Details' : 'Schedule New Surgery'}
      </h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-base font-bold mb-1 text-blue-600">Patient</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={form.patientId}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selected = patientOptions.find(p => String(p.patientId) === String(selectedId));
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
          <p className="mt-1 text-xs text-gray-500">Choose from your assigned patients</p>
        </div>

        <div>
          <label className="block text-base font-bold mb-1 text-blue-600">Condition</label>
          <div className="relative">
            <ClipboardList className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-base font-bold mb-1 text-blue-600">Urgency</label>
          <div className="relative">
            <Hourglass className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={form.urgency}
              onChange={(e) => setForm({ ...form, urgency: e.target.value })}
            >
              <option value="">Select urgency</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="URGENT">Urgent</option>
              <option value="ELECTIVE">Elective</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-base font-bold mb-1 text-blue-600">Surgery Type</label>
          <div className="relative">
            <Syringe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={form.surgeryType}
              onChange={(e) => setForm({ ...form, surgeryType: e.target.value })}
            >
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
        </div>

        <div>
          <label className="block text-base font-bold mb-1 text-blue-600">Operating Room</label>
          <div className="relative">
            <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <select
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={form.operatingRoom}
              onChange={(e) => setForm({ ...form, operatingRoom: e.target.value })}
            >
              <option value="">Select a room</option>
              {[...Array(10)].map((_, i) => (
                <option key={i} value={`OR-${i + 1}`}>OR-{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-base font-bold mb-1 text-blue-600">Scheduled At</label>
          <div className="relative">
            <CalendarClock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="datetime-local"
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-base font-bold mb-1 text-blue-600">Notes</label>
          <div className="relative">
            <ClipboardList className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <textarea
              className="w-full border rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>

        <div className="md:col-span-2 flex gap-3 mt-3">
          <button
            disabled={!canSubmit || loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Syringe className="h-4 w-4" />
            {editingId ? 'Update' : 'Create'} Surgery
          </button>
          {editingId && (
            <button
              type="button"
              className="px-6 py-2 rounded-lg border hover:bg-gray-50 transition"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
