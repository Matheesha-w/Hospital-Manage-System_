import { useMemo } from 'react';

// Lightweight bar-like visualization using plain divs (no external deps)
export default function SurgeryMiniCharts({ counts = { completed: 0, pending: 0 } }) {
  const { completed, pending } = counts;
  const total = Math.max(1, completed + pending);
  const completedPct = Math.round((completed / total) * 100);
  const pendingPct = 100 - completedPct;

  const bars = useMemo(() => ([
    { label: 'Completed', value: completed, pct: completedPct, color: 'bg-emerald-500' },
    { label: 'Pending', value: pending, pct: pendingPct, color: 'bg-amber-500' }
  ]), [completed, pending, completedPct, pendingPct]);

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold mb-2">Overview</div>
      <div className="space-y-3">
        {bars.map(b => (
          <div key={b.label}>
            <div className="flex justify-between text-sm mb-1">
              <span>{b.label}</span>
              <span>{b.value} ({b.pct}%)</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div className={`h-2 rounded ${b.color}`} style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


