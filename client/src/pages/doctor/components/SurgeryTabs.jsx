import { useState, useMemo } from 'react';

export default function SurgeryTabs({ surgeries, onView, onEdit, onDelete, onMarkComplete }) {
  const [active, setActive] = useState('PENDING');

  const grouped = useMemo(() => {
    const byStatus = { PENDING: [], COMPLETED: [] };
    (surgeries || []).forEach(s => {
      const status = s.status || 'PENDING';
      if (status === 'COMPLETED') byStatus.COMPLETED.push(s); else byStatus.PENDING.push(s);
    });
    return byStatus;
  }, [surgeries]);

  const list = active === 'COMPLETED' ? grouped.COMPLETED : grouped.PENDING;

  return (
    <div className="bg-white rounded shadow">
      <div className="flex items-center border-b">
        <button
          className={`px-4 py-3 font-medium ${active === 'PENDING' ? 'border-b-2 border-amber-500 text-amber-700' : 'text-gray-600'}`}
          onClick={() => setActive('PENDING')}
        >
          Pending
        </button>
        <button
          className={`px-4 py-3 font-medium ${active === 'COMPLETED' ? 'border-b-2 border-emerald-500 text-emerald-700' : 'text-gray-600'}`}
          onClick={() => setActive('COMPLETED')}
        >
          Completed
        </button>
      </div>
      <ul>
        {list.map(s => (
          <li key={s.id} className="p-4 border-b last:border-b-0 flex items-center justify-between">
            <div>
              <div className="font-medium flex items-center gap-2">
                <span>{s.condition} — {s.patientName} ({s.urgency || 'N/A'})</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{s.status || 'PENDING'}</span>
              </div>
              <div className="text-sm text-gray-600">{new Date(s.scheduledAt).toLocaleString()}</div>
              {s.notes && <div className="text-sm text-gray-600">Notes: {s.notes}</div>}
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded border" onClick={() => onView(s.id)}>View</button>
              {s.status !== 'COMPLETED' && (
                <button className="px-3 py-1 rounded border" onClick={() => onEdit(s)}>Edit</button>
              )}
              {s.status !== 'COMPLETED' && (
                <button className="px-3 py-1 rounded border bg-emerald-600 text-white" onClick={() => onMarkComplete(s.id)}>Mark Completed</button>
              )}
              <button className="px-3 py-1 rounded border text-red-600" onClick={() => onDelete(s.id)}>Delete</button>
            </div>
          </li>
        ))}
        {list.length === 0 && (
          <li className="p-4 text-gray-600">No surgeries in this tab.</li>
        )}
      </ul>
    </div>
  );
}


