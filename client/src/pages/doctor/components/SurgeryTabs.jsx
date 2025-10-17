import { useState, useMemo } from 'react';
import { ClipboardList, CheckCircle2, Hourglass, Eye, Pencil, Trash2, CalendarClock, User } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="flex items-center border-b">
        <button
          className={`px-4 py-3 font-medium flex items-center gap-2 ${active === 'PENDING' ? 'border-b-2 border-amber-500 text-amber-700' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActive('PENDING')}
        >
          <Hourglass className="h-4 w-4" />
          Pending
        </button>
        <button
          className={`px-4 py-3 font-medium flex items-center gap-2 ${active === 'COMPLETED' ? 'border-b-2 border-emerald-500 text-emerald-700' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActive('COMPLETED')}
        >
          <CheckCircle2 className="h-4 w-4" />
          Completed
        </button>
      </div>
      <ul>
        {list.map(s => (
          <li
            key={s.id}
            className={`p-4 border-b last:border-b-0 flex items-center justify-between ${s.status === 'COMPLETED' ? 'border-l-4 border-l-emerald-400' : 'border-l-4 border-l-amber-400'}`}
          >
            <div>
              <div className="font-medium flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-600" />
                <span>{s.condition}</span>
                <span className="text-gray-400">—</span>
                <User className="h-4 w-4 text-gray-500" />
                <span>{s.patientName}</span>
                <span className="text-gray-400">•</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{s.urgency || 'N/A'}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{s.status || 'PENDING'}</span>
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2 mt-0.5">
                <CalendarClock className="h-4 w-4 text-gray-400" />
                {new Date(s.scheduledAt).toLocaleString()}
              </div>
              {s.notes && <div className="text-sm text-gray-600 mt-1">Notes: {s.notes}</div>}
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg border hover:bg-gray-50 inline-flex items-center gap-1" onClick={() => onView(s.id)}>
                <Eye className="h-4 w-4" />
                View
              </button>
              {s.status !== 'COMPLETED' && (
                <button className="px-3 py-1 rounded-lg border hover:bg-gray-50 inline-flex items-center gap-1" onClick={() => onEdit(s)}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              )}
              {s.status !== 'COMPLETED' && (
                <button className="px-3 py-1 rounded-lg border bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-1" onClick={() => onMarkComplete(s.id)}>
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Completed
                </button>
              )}
              <button className="px-3 py-1 rounded-lg border text-red-600 hover:bg-red-50 inline-flex items-center gap-1" onClick={() => onDelete(s.id)}>
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
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


