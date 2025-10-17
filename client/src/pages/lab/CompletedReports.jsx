import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { labService } from './services/labService';

const CompletedReports = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await labService.byStatus('COMPLETED');
        setReports(response.data || []);
      } catch (error) {
        console.error('Error fetching completed reports:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [token]);

  const filtered = reports.filter(r => {
    const k = search.toLowerCase();
    return (
      r.patientName?.toLowerCase().includes(k) ||
      r.testName?.toLowerCase().includes(k)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Completed Reports</h1>
        <input placeholder="Search by patient or test" value={search} onChange={(e)=>setSearch(e.target.value)} className="border rounded px-3 py-2 w-64" />
      </div>
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3">Patient</th>
                <th className="text-left px-4 py-3">Test</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="px-4 py-3">{r.patientName}</td>
                  <td className="px-4 py-3">{r.testName}</td>
                  <td className="px-4 py-3">{new Date(r.uploadDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{r.status}</span></td>
                  <td className="px-4 py-3 space-x-3">
                    {r.fileUrl && (
                      <a href={`http://localhost:8084${r.fileUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View</a>
                    )}
                    {r.fileUrl && (
                      <a href={`http://localhost:8084${r.fileUrl}`} download className="text-gray-700 hover:underline">Download</a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-6 text-center text-gray-500">No reports found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompletedReports;


