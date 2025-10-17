import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Activity, Thermometer, HeartPulse, Search, Droplets, Stethoscope, RefreshCcw } from 'lucide-react';

const initialForm = {
  patientEmail: '',
  temperature: '',
  bloodPressure: '',
  pulse: '',
  spo2: '',
  dateTime: '',
  notes: '',
};

const NurseVitals = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [vitals, setVitals] = useState([]);
  const [search, setSearch] = useState('');
  const [searchingPatients, setSearchingPatients] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const canLoadList = useMemo(() => form.patientEmail.trim().length > 0, [form.patientEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const pickPatient = (email) => {
    setForm((f) => ({ ...f, patientEmail: email }));
    setSuggestions([]);
  };

  const searchPatients = async (q) => {
    setSearchingPatients(true);
    try {
      const res = await axios.get('/nurse/patients/users', { params: { q } });
      if (res.data?.success) setSuggestions(res.data.data || []);
      else toast.error(res.data?.message || 'Failed to search patients');
    } catch (e) {
      if (e.response?.status === 401) toast.error('Session expired. Please log in again.');
      else toast.error('Error searching patients');
    } finally {
      setSearchingPatients(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (search && search.trim().length >= 2) searchPatients(search.trim());
      else setSuggestions([]);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadVitals = async () => {
    if (!canLoadList) {
      toast.error('Enter a patient email to load vitals');
      return;
    }
    setLoadingList(true);
    try {
      const res = await axios.get('/nurse/vitals', { params: { patientEmail: form.patientEmail.trim() } });
      if (res.data?.success) setVitals(res.data.data || []);
      else toast.error(res.data?.message || 'Failed to load vitals');
    } catch (err) {
      if (err.response?.status === 401) toast.error('Unauthorized! Please log in again.');
      else toast.error(err.response?.data?.message || 'Failed to load vitals');
    } finally {
      setLoadingList(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const required = ['patientEmail', 'temperature', 'bloodPressure', 'pulse', 'spo2'];
    for (const k of required) {
      if (!String(form[k] ?? '').trim()) {
        toast.error(`Please fill ${k}`);
        return;
      }
    }
    setSubmitting(true);
    try {
      const payload = {
        patientEmail: form.patientEmail.trim(),
        temperature: Number(form.temperature),
        bloodPressure: form.bloodPressure.trim(),
        pulse: Number(form.pulse),
        spo2: Number(form.spo2),
        dateTime: form.dateTime ? new Date(form.dateTime).toISOString() : null,
        notes: form.notes?.trim() || null,
      };
      const res = await axios.post('/nurse/vitals', payload);
      if (res.data?.success) {
        toast.success('Vitals recorded');
        setForm((f) => ({ ...initialForm, patientEmail: f.patientEmail }));
        await loadVitals();
      } else {
        toast.error(res.data?.message || 'Failed to record vitals');
      }
    } catch (err) {
      if (err.response?.status === 401) toast.error('Unauthorized! Please log in again.');
      else toast.error(err.response?.data?.message || 'Failed to record vitals');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Select Patient</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search patients (name/email/phone)
            </label>
            <div className="relative">
              <input
                className="w-full border rounded-md px-3 py-2 pr-10"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="h-4 w-4 text-gray-400 absolute right-3 top-3" />
            </div>
            {suggestions.length > 0 && (
              <div className="mt-2 max-h-48 overflow-auto border rounded-md">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => pickPatient(s.email)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  >
                    <div className="text-sm text-gray-900">
                      {s.firstName} {s.lastName}
                    </div>
                    <div className="text-xs text-gray-600">{s.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
            <input
              name="patientEmail"
              type="email"
              value={form.patientEmail}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="patient@example.com"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Record Vitals</h3>
        </div>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
            <div className="relative">
              <input
                name="temperature"
                type="number"
                step="0.1"
                value={form.temperature}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 pr-8"
                placeholder="37.0"
              />
              <Thermometer className="h-4 w-4 text-gray-400 absolute right-2 top-3" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (mmHg)</label>
            <input
              name="bloodPressure"
              value={form.bloodPressure}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="120/80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pulse (bpm)</label>
            <div className="relative">
              <input
                name="pulse"
                type="number"
                value={form.pulse}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 pr-8"
                placeholder="80"
              />
              <HeartPulse className="h-4 w-4 text-gray-400 absolute right-2 top-3" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SpO₂ (%)</label>
            <div className="relative">
              <input
                name="spo2"
                type="number"
                value={form.spo2}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 pr-8"
                placeholder="98"
              />
              <Droplets className="h-4 w-4 text-gray-400 absolute right-2 top-3" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time (optional)</label>
            <input
              name="dateTime"
              type="datetime-local"
              value={form.dateTime}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Any observations..."
            />
          </div>
          <div className="md:col-span-3 flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
            >
              <Stethoscope className="h-4 w-4" />
              {submitting ? 'Saving...' : 'Save Vitals'}
            </button>
            <button
              type="button"
              onClick={loadVitals}
              disabled={!canLoadList || loadingList}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCcw className={`h-4 w-4 ${loadingList ? 'animate-spin' : ''}`} />
              {loadingList ? 'Loading...' : 'Load Vitals'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h4 className="text-md font-semibold text-gray-900">Vitals History</h4>
          <span className="text-sm text-gray-500">{vitals.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temp (°C)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BP (mmHg)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pulse (bpm)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SpO₂ (%)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nurse</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vitals.map((vt) => (
                <tr key={vt.id || vt.vitalId}>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {vt.dateTime ? new Date(vt.dateTime).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vt.temperature}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vt.bloodPressure}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vt.pulse}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vt.spo2}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{vt.nurseId}</td>
                </tr>
              ))}
              {vitals.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 text-sm">
                    No vitals recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NurseVitals;
