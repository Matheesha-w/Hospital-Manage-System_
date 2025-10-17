import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { NotebookText, PlusCircle, RefreshCcw, CalendarRange, Search } from 'lucide-react';

const NurseNotes = () => {
  const [patientQuery, setPatientQuery] = useState('');
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [noteText, setNoteText] = useState('');
  const [noteDate, setNoteDate] = useState(''); // ISO local datetime string

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search patient users by query
  const searchPatients = async (q) => {
    try {
      const res = await axios.get('/nurse/patients/users', { params: { q } });
      if (res.data?.success) setPatientOptions(res.data.data || []);
      else toast.error(res.data?.message || 'Failed to search patients');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error searching patients');
    }
  };

  useEffect(() => {
    const h = setTimeout(() => {
      if (patientQuery && patientQuery.length >= 2) searchPatients(patientQuery);
      else setPatientOptions([]);
    }, 300);
    return () => clearTimeout(h);
  }, [patientQuery]);

  const onSelectPatient = (u) => {
    setSelectedPatient(u);
    setPatientQuery(u.email || u.username || `${u.firstName || ''} ${u.lastName || ''}`.trim());
    setPatientOptions([]);
    loadNotes(u.email);
  };

  const loadNotes = async (patientEmail, range = {}) => {
    if (!patientEmail) return;
    setLoading(true);
    try {
      const params = { patientEmail };
      if (range.from) params.from = range.from;
      if (range.to) params.to = range.to;
      const res = await axios.get('/nurse/notes', { params });
      if (res.data?.success) setNotes(res.data.data || []);
      else toast.error(res.data?.message || 'Failed to load notes');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error loading notes');
    } finally {
      setLoading(false);
    }
  };

  const submitNote = async (e) => {
    e.preventDefault();
    if (!selectedPatient?.email) { toast.error('Select a patient'); return; }
    if (!noteText.trim()) { toast.error('Note required'); return; }
    try {
      const body = { patientEmail: selectedPatient.email, note: noteText.trim() };
      if (noteDate) body.date = noteDate;
      const res = await axios.post('/nurse/notes', body);
      if (res.data?.success) {
        toast.success('Note added');
        setNoteText('');
        setNoteDate('');
        await loadNotes(selectedPatient.email, { from: fromDate, to: toDate });
      } else toast.error(res.data?.message || 'Failed to add note');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error adding note');
    }
  };

  const applyFilter = async (e) => {
    e.preventDefault();
    if (!selectedPatient?.email) { toast.error('Select a patient'); return; }
    await loadNotes(selectedPatient.email, { from: fromDate, to: toDate });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <NotebookText className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Daily Shift Notes</h3>
        </div>

        {/* Patient search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
          <div className="relative">
            <input
              className="w-full border rounded-md px-3 py-2 pr-10"
              placeholder="Search by name or email"
              value={patientQuery}
              onChange={(e) => { setPatientQuery(e.target.value); setSelectedPatient(null); }}
            />
            <Search className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            {patientOptions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow">
                {patientOptions.map(u => (
                  <button key={u.id} type="button" className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => onSelectPatient(u)}>
                    <div className="text-sm text-gray-900">{u.firstName || ''} {u.lastName || ''} <span className="text-gray-500">({u.email})</span></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add note */}
        <form onSubmit={submitNote} className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <textarea className="md:col-span-4 border rounded-md px-3 py-2" rows={2} placeholder="Write note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} />
          <input className="border rounded-md px-3 py-2" type="datetime-local" value={noteDate} onChange={(e) => setNoteDate(e.target.value)} />
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
            <PlusCircle className="h-4 w-4" /> Add Note
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarRange className="h-5 w-5 text-pink-600" />
          <h4 className="text-md font-semibold text-gray-900">Filter Notes</h4>
        </div>
        <form onSubmit={applyFilter} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input className="border rounded-md px-3 py-2" type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder="From" />
          <input className="border rounded-md px-3 py-2" type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder="To" />
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
            <RefreshCcw className="h-4 w-4" /> Apply
          </button>
        </form>
      </div>

      {/* Notes list */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h4 className="text-md font-semibold text-gray-900">Recent Notes</h4>
          <button onClick={() => selectedPatient?.email && loadNotes(selectedPatient.email, { from: fromDate, to: toDate })} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
        <div className="divide-y">
          {notes.map(n => (
            <div key={n.id} className="p-4">
              <div className="text-sm text-gray-500">{new Date(n.date).toLocaleString()}</div>
              <div className="text-gray-900">{n.note}</div>
              <div className="text-xs text-gray-500 mt-1">Patient ID: {n.patientId} • Nurse ID: {n.nurseId}</div>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="p-6 text-center text-gray-500 text-sm">No notes</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NurseNotes;
