import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ClipboardList, Plus, RefreshCcw } from 'lucide-react';

const initialForm = {
  patientEmail: '',
  medicationName: '',
  dosage: '',
  dosageUnit: 'mg',
  frequency: '',
  startDate: '',
  endDate: '',
  totalQuantity: '',
  instructions: '',
  notes: ''
};

const NursePrescriptions = () => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);

  const canLoadList = useMemo(() => form.patientEmail.trim().length > 0, [form.patientEmail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const resetForm = () => setForm(initialForm);

  const loadPrescriptions = async () => {
    if (!canLoadList) {
      toast.error('Enter a patient email to load prescriptions');
      return;
    }
    setLoadingList(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/nurse/prescriptions', {
        params: { patientEmail: form.patientEmail.trim() },
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Accept': 'application/json'
        },
        withCredentials: false,
      });
      if (res.data?.success) {
        setPrescriptions(res.data.data || []);
      } else {
        toast.error(res.data?.message || 'Failed to load prescriptions');
      }
    } catch (err) {
      console.error('Load prescriptions error', err);
      toast.error(err.response?.data?.message || 'Failed to load prescriptions');
    } finally {
      setLoadingList(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    // Basic validation
    const required = ['patientEmail', 'medicationName', 'dosage', 'dosageUnit', 'frequency', 'startDate', 'totalQuantity'];
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
        medicationName: form.medicationName.trim(),
        dosage: Number(form.dosage),
        dosageUnit: form.dosageUnit,
        frequency: form.frequency.trim(),
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
        totalQuantity: Number(form.totalQuantity),
        instructions: form.instructions?.trim() || null,
        notes: form.notes?.trim() || null,
      };
      const token = localStorage.getItem('token');
      const res = await axios.post('/nurse/prescriptions', payload, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false,
      });
      if (res.data?.success) {
        toast.success('Prescription created');
        resetForm();
        // refresh list if email still present
        if (payload.patientEmail) await loadPrescriptions();
      } else {
        toast.error(res.data?.message || 'Failed to create prescription');
      }
    } catch (err) {
      console.error('Create prescription error', err);
      toast.error(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // auto load when email is typed and blurred could be added; manual for clarity
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="h-5 w-5 text-pink-600"/>
          <h3 className="text-lg font-semibold text-gray-900">Create Prescription</h3>
        </div>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
            <input name="patientEmail" type="email" value={form.patientEmail} onChange={handleChange}
                   className="w-full border rounded-md px-3 py-2" placeholder="patient@example.com"/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
            <input name="medicationName" value={form.medicationName} onChange={handleChange}
                   className="w-full border rounded-md px-3 py-2" placeholder="Paracetamol"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
              <input name="dosage" type="number" step="0.01" value={form.dosage} onChange={handleChange}
                     className="w-full border rounded-md px-3 py-2" placeholder="500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select name="dosageUnit" value={form.dosageUnit} onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2">
                <option value="mg">mg</option>
                <option value="ml">ml</option>
                <option value="g">g</option>
                <option value="mcg">mcg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <input name="frequency" value={form.frequency} onChange={handleChange}
                   className="w-full border rounded-md px-3 py-2" placeholder="Twice daily"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange}
                     className="w-full border rounded-md px-3 py-2"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
              <input name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange}
                     className="w-full border rounded-md px-3 py-2"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Quantity</label>
            <input name="totalQuantity" type="number" value={form.totalQuantity} onChange={handleChange}
                   className="w-full border rounded-md px-3 py-2" placeholder="10"/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (optional)</label>
            <input name="instructions" value={form.instructions} onChange={handleChange}
                   className="w-full border rounded-md px-3 py-2" placeholder="After meals"/>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea name="notes" rows={3} value={form.notes} onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2" placeholder="Any additional notes..."/>
          </div>

          <div className="md:col-span-2 flex items-center gap-3 pt-2">
            <button type="submit" disabled={submitting}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50">
              <Plus className="h-4 w-4"/>
              {submitting ? 'Creating...' : 'Create Prescription'}
            </button>
            <button type="button" onClick={loadPrescriptions} disabled={!canLoadList || loadingList}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50">
              <RefreshCcw className={`h-4 w-4 ${loadingList ? 'animate-spin' : ''}`}/>
              {loadingList ? 'Loading...' : 'Load Prescriptions'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h4 className="text-md font-semibold text-gray-900">Prescriptions</h4>
          <span className="text-sm text-gray-500">{prescriptions.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prescription ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions.map((pr) => (
                <tr key={pr.prescriptionId}>
                  <td className="px-4 py-3 text-sm text-gray-900">{pr.prescriptionId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pr.medicationName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pr.dosage} {pr.dosageUnit}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pr.frequencyPerDay}x/day</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pr.startDate ? new Date(pr.startDate).toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pr.endDate ? new Date(pr.endDate).toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pr.remainingQuantity ?? '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pr.status}</td>
                </tr>
              ))}
              {prescriptions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500 text-sm">No prescriptions to display</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NursePrescriptions;
