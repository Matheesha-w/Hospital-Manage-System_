export default function SurgeryViewModal({ viewing, onClose }) {
  if (!viewing) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-700">Surgery Details</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        <div className="space-y-2 text-base font-bold text-green-900">
          <div><span className="font-bold text-gray-900">Patient:</span> {viewing.patientName}</div>
          <div><span className="font-bold text-gray-900">Condition:</span> {viewing.condition}</div>
          <div><span className="font-bold text-gray-900">Urgency:</span> {viewing.urgency}</div>
          <div><span className="font-bold text-gray-900">Surgery Type:</span> {viewing.surgeryType}</div>
          <div><span className="font-bold text-gray-900">Operating Room:</span> {viewing.operatingRoom}</div>
          <div><span className="font-bold text-gray-900">Scheduled At:</span> {new Date(viewing.scheduledAt).toLocaleString()}</div>
          <div><span className="font-bold text-gray-900">Status:</span> {viewing.status}</div>
          {viewing.notes && <div><span className="font-bold text-gray-900">Notes:</span> {viewing.notes}</div>}
          <div><span className="font-bold text-gray-900">Created:</span> {new Date(viewing.createdAt).toLocaleString()}</div>
          <div><span className="font-bold text-gray-900">Updated:</span> {new Date(viewing.updatedAt).toLocaleString()}</div>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="px-5 py-2 rounded-lg border hover:bg-green-400 transition" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
