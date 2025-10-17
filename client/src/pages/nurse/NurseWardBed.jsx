import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Bed as BedIcon, Building2, RefreshCcw, PlusCircle, Search as UserSearch, DoorOpen, Wrench } from 'lucide-react';

const NurseWardBed = () => {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({ wardNo: '', status: '' });

  const [createForm, setCreateForm] = useState({ wardNo: '', bedNo: '' });
  const [assignForm, setAssignForm] = useState({ wardNo: '', bedNo: '', patientEmail: '', patientId: '' });
  const [statusForm, setStatusForm] = useState({ wardNo: '', bedNo: '', status: 'MAINTENANCE' });

  const statusOptions = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'];

  const loadBeds = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.wardNo) params.wardNo = filters.wardNo.trim();
      if (filters.status) params.status = filters.status;
      const res = await axios.get('/nurse/beds', { params });
      if (res.data?.success) setBeds(res.data.data || []);
      else toast.error(res.data?.message || 'Failed to load beds');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error loading beds');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBeds(); }, []);

  const createBed = async (e) => {
    e.preventDefault();
    if (!createForm.wardNo || !createForm.bedNo) { toast.error('Ward and Bed are required'); return; }
    try {
      const res = await axios.post('/nurse/beds', { wardNo: createForm.wardNo.trim(), bedNo: createForm.bedNo.trim() });
      if (res.data?.success) {
        toast.success('Bed created');
        setCreateForm({ wardNo: '', bedNo: '' });
        await loadBeds();
      } else toast.error(res.data?.message || 'Failed to create bed');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error creating bed');
    }
  };

  const findPatientByEmail = async (email) => {
    try {
      // use users search to resolve id
      const res = await axios.get('/nurse/patients/users', { params: { q: email } });
      const list = res.data?.data || [];
      const match = list.find(u => u.email?.toLowerCase() === email.toLowerCase());
      return match?.id || null;
    } catch {
      return null;
    }
  };

  const assignBed = async (e) => {
    e.preventDefault();
    const { wardNo, bedNo, patientEmail } = assignForm;
    if (!wardNo || !bedNo || !patientEmail) { toast.error('All fields required'); return; }
    try {
      let userId = assignForm.patientId;
      if (!userId) {
        userId = await findPatientByEmail(patientEmail.trim());
        if (!userId) { toast.error('Patient (users) not found for email'); return; }
      }
      const body = { wardNo: wardNo.trim(), bedNo: bedNo.trim(), patientId: userId };
      const res = await axios.post('/nurse/beds/assign', body);
      if (res.data?.success) {
        toast.success('Bed assigned');
        setAssignForm({ wardNo: '', bedNo: '', patientEmail: '', patientId: '' });
        await loadBeds();
      } else toast.error(res.data?.message || 'Failed to assign');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error assigning bed');
    }
  };

  const releaseBed = async (wardNo, bedNo) => {
    try {
      const res = await axios.post('/nurse/beds/release', null, { params: { wardNo, bedNo } });
      if (res.data?.success) { toast.success('Bed released'); await loadBeds(); }
      else toast.error(res.data?.message || 'Failed to release');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error releasing bed');
    }
  };

  const updateStatus = async (e) => {
    e.preventDefault();
    const { wardNo, bedNo, status } = statusForm;
    if (!wardNo || !bedNo || !status) { toast.error('Ward, Bed and Status are required'); return; }
    try {
      const res = await axios.put('/nurse/beds/status', { wardNo: wardNo.trim(), bedNo: bedNo.trim(), status });
      if (res.data?.success) { toast.success('Status updated'); await loadBeds(); }
      else toast.error(res.data?.message || 'Failed to update');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error updating status');
    }
  };

  const deleteBed = async (wardNo, bedNo) => {
    try {
      const res = await axios.delete('/nurse/beds', { params: { wardNo, bedNo } });
      if (res.data?.success) { toast.success('Bed deleted'); await loadBeds(); }
      else toast.error(res.data?.message || 'Failed to delete');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error deleting bed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and actions */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900">Ward / Bed Management</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
            <input className="w-full border rounded-md px-3 py-2" value={filters.wardNo} onChange={(e) => setFilters({ ...filters, wardNo: e.target.value })} placeholder="A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full border rounded-md px-3 py-2" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">All</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={loadBeds} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 disabled:opacity-50">
              <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Create bed */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle className="h-5 w-5 text-pink-600" />
          <h4 className="text-md font-semibold text-gray-900">Create Bed</h4>
        </div>
        <form onSubmit={createBed} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="border rounded-md px-3 py-2" placeholder="Ward (e.g. A)" value={createForm.wardNo} onChange={(e) => setCreateForm({ ...createForm, wardNo: e.target.value })} />
          <input className="border rounded-md px-3 py-2" placeholder="Bed (e.g. 1)" value={createForm.bedNo} onChange={(e) => setCreateForm({ ...createForm, bedNo: e.target.value })} />
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">
            <BedIcon className="h-4 w-4" />
            Create
          </button>
        </form>
      </div>

      {/* Assign bed */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserSearch className="h-5 w-5 text-pink-600" />
          <h4 className="text-md font-semibold text-gray-900">Assign Patient to Bed</h4>
        </div>
        <form onSubmit={assignBed} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input className="border rounded-md px-3 py-2" placeholder="Ward" value={assignForm.wardNo} onChange={(e) => setAssignForm({ ...assignForm, wardNo: e.target.value })} />
          <input className="border rounded-md px-3 py-2" placeholder="Bed" value={assignForm.bedNo} onChange={(e) => setAssignForm({ ...assignForm, bedNo: e.target.value })} />
          <input className="border rounded-md px-3 py-2" placeholder="Patient Email" value={assignForm.patientEmail} onChange={(e) => setAssignForm({ ...assignForm, patientEmail: e.target.value, patientId: '' })} />
          <input className="border rounded-md px-3 py-2" placeholder="(Optional) Patient ID" value={assignForm.patientId} onChange={(e) => setAssignForm({ ...assignForm, patientId: e.target.value })} />
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">Assign</button>
        </form>
      </div>

      {/* Update bed status */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-5 w-5 text-pink-600" />
          <h4 className="text-md font-semibold text-gray-900">Update Bed Status</h4>
        </div>
        <form onSubmit={updateStatus} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input className="border rounded-md px-3 py-2" placeholder="Ward" value={statusForm.wardNo} onChange={(e) => setStatusForm({ ...statusForm, wardNo: e.target.value })} />
          <input className="border rounded-md px-3 py-2" placeholder="Bed" value={statusForm.bedNo} onChange={(e) => setStatusForm({ ...statusForm, bedNo: e.target.value })} />
          <select className="border rounded-md px-3 py-2" value={statusForm.status} onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}>
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700">Update</button>
        </form>
      </div>

      {/* Beds table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h4 className="text-md font-semibold text-gray-900">Beds</h4>
          <button onClick={loadBeds} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ward</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {beds.map(b => (
                <tr key={b.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{b.wardNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{b.bedNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{b.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{b.patientId || '-'}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="inline-flex gap-2">
                      {b.status === 'OCCUPIED' && (
                        <button onClick={() => releaseBed(b.wardNo, b.bedNo)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
                          <DoorOpen className="h-4 w-4" /> Release
                        </button>
                      )}
                      <button onClick={() => deleteBed(b.wardNo, b.bedNo)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {beds.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500 text-sm">No beds</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NurseWardBed;
