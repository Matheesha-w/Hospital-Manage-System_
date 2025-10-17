import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Syringe, Search, RefreshCcw, CheckCircle, XCircle, ClipboardList } from 'lucide-react';

const NurseMedicationAdmin = () => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [patient, setPatient] = useState(null); // { id, email, firstName, lastName }

  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const patientLabel = useMemo(() => {
    if (!patient) return 'No patient selected';
    const name = [patient.firstName, patient.lastName].filter(Boolean).join(' ').trim();
    return `${name || patient.username || patient.email} (${patient.email})`;
    // relies on NursePatientListItem fields
  }, [patient]);

  const searchPatients = async (q) => {
    setLoadingSuggestions(true);
    try {
      const res = await axios.get('/nurse/patients/users', { params: { q } });
      if (res.data?.success) setSuggestions(res.data.data || []);
      else toast.error(res.data?.message || 'Failed to search patients');
    } catch (e) {
      toast.error('Error searching patients');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      if (search.trim().length >= 2) searchPatients(search.trim());
      else setSuggestions([]);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const pickPatient = (p) => {
    setPatient(p);
    setSuggestions([]);
    loadPrescriptionsByEmail(p.email);
    loadHistoryByUserId(p.id);
  };

  const loadPrescriptionsByEmail = async (email) => {
    setLoadingPrescriptions(true);
    try {
      const res = await axios.get('/nurse/prescriptions', { params: { patientEmail: email } });
      if (res.data?.success) setPrescriptions(res.data.data || []);
      else toast.error(res.data?.message || 'Failed to load prescriptions');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error loading prescriptions');
    } finally {
      setLoadingPrescriptions(false);
    }
  };

  const loadHistoryByUserId = async (userId) => {
    if (!userId) return;
    setLoadingHistory(true);
    try {
      const res = await axios.get(`/nurse/patients/${userId}/administration-history`);
      if (res.data?.success) setHistory(res.data.data || []);
    } catch (e) {
      // non-fatal
    } finally {
      setLoadingHistory(false);
    }
  };

  const administer = async (rx) => {
    if (!patient?.id) {
      toast.error('Select a patient first');
      return;
    }
    try {
      const body = {
        patientId: patient.id,
        prescriptionId: rx.prescriptionId,
        medicationId: rx.medicationId,
        administeredDosage: rx.dosage,
        dosageUnit: rx.dosageUnit,
        notes: `Given via nurse UI`,
      };
      const res = await axios.post('/nurse/medications/administer', body);
      if (res.data?.success) {
        toast.success('Medication marked as Given');
        await loadHistoryByUserId(patient.id);
        await loadPrescriptionsByEmail(patient.email);
      } else {
        toast.error(res.data?.message || 'Failed to administer');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error administering');
    }
  };

  const markMissed = async (rx) => {
    if (!patient?.id) {
      toast.error('Select a patient first');
      return;
    }
    try {
      const body = {
        patientId: patient.id,
        prescriptionId: rx.prescriptionId,
        medicationId: rx.medicationId,
        notes: 'Missed dose',
      };
      const res = await axios.post('/nurse/medications/miss', body);
      if (res.data?.success) {
        toast.success('Marked as Missed');
        await loadHistoryByUserId(patient.id);
      } else {
        toast.error(res.data?.message || 'Failed to mark missed');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error marking missed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient picker */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Select Patient</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search patients</label>
            <div className="relative">
              <input
                className="w-full border rounded-md px-3 py-2 pr-10"
                placeholder="Type name/email/phone"
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
                    onClick={() => pickPatient(s)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                  >
                    <div className="text-sm text-gray-900">{s.firstName} {s.lastName}</div>
                    <div className="text-xs text-gray-600">{s.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Selected</label>
            <div className="border rounded-md px-3 py-2 min-h-[38px] text-sm text-gray-800">
              {patientLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions list */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-pink-600" />
            <h4 className="text-md font-semibold text-gray-900">Active Prescriptions</h4>
          </div>
          <button
            type="button"
            onClick={() => patient?.email && loadPrescriptionsByEmail(patient.email)}
            disabled={!patient || loadingPrescriptions}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${loadingPrescriptions ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions.map((rx) => (
                <tr key={rx.prescriptionId}>
                  <td className="px-4 py-3 text-sm text-gray-900">{rx.medicationName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{rx.dosage} {rx.dosageUnit}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{rx.remainingQuantity ?? '-'}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => administer(rx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Give
                      </button>
                      <button
                        type="button"
                        onClick={() => markMissed(rx)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Missed
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {prescriptions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500 text-sm">No prescriptions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Administration history */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-pink-600" />
            <h4 className="text-md font-semibold text-gray-900">Administration History</h4>
          </div>
          <button
            type="button"
            onClick={() => patient?.id && loadHistoryByUserId(patient.id)}
            disabled={!patient || loadingHistory}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${loadingHistory ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((h) => (
                <tr key={h.recordId}>
                  <td className="px-4 py-3 text-sm text-gray-900">{h.administrationTime ? new Date(h.administrationTime).toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{h.medicationName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{typeof h.administeredDosage === 'number' ? `${h.administeredDosage} ${h.dosageUnit || ''}` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{h.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{h.notes || '-'}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500 text-sm">No history</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NurseMedicationAdmin;
