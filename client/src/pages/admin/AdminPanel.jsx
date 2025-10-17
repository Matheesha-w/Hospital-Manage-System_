import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, Eye, FileText, Users, ClipboardList, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { hasRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    if (hasRole('ADMIN')) {
      fetchRegistrationRequests();
    }
  }, [hasRole]);

  const fetchRegistrationRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/registration-requests');
      setRequests(response.data.data);
      setUpdatedAt(new Date());
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch registration requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axios.post(`/admin/registration-requests/${requestId}/approve`);
      toast.success('Registration approved successfully');
      fetchRegistrationRequests();
    } catch (err) {
      console.error(err);
      toast.error('Failed to approve registration');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.post(`/admin/registration-requests/${requestId}/reject`);
      toast.success('Registration rejected');
      fetchRegistrationRequests();
    } catch (err) {
      console.error(err);
      toast.error('Failed to reject registration');
    }
  };

  if (!hasRole('ADMIN')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-blue-100 bg-white/80 p-10 shadow-2xl shadow-blue-100/50 backdrop-blur">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">controls</span>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">IT SECTION</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Review new registration requests, approve qualified applicants, and keep care teams up to date.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Pending Requests</p>
                    <p className="text-2xl font-bold text-slate-900">{loading ? '—' : requests.length}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white/90 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Last synced</p>
                    <p className="text-sm font-medium text-slate-900">{updatedAt ? updatedAt.toLocaleString() : loading ? 'Fetching…' : '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Review Registration Requests</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Inspect applicant details, evaluate credentials, and respond in a single workflow.
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/admin/users"
              className="rounded-2xl border border-slate-100 bg-white/90 p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Manage Users</h2>
                  <p className="mt-2 text-sm text-slate-600">Add, remove, and update staff and patient accounts per role.</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-slate-100 bg-white/90 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Pending Registration Requests</h2>
                <p className="text-sm text-slate-500">Approve or reject applications to keep access controlled.</p>
              </div>
              {loading && (
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span className="h-2 w-2 animate-ping rounded-full bg-blue-500"></span>
                  Syncing
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center px-8 py-16">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-500"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <p className="text-sm font-medium text-slate-500">No pending registration requests right now.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-100/80">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        User Details
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Role
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        CV
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requested At
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white/95">
                    {requests.map((request) => (
                      <tr key={request.id} className="hover:bg-blue-50/40">
                        <td className="px-8 py-5 align-top">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-900">
                              {request.firstName} {request.lastName}
                            </p>
                            <p className="text-sm text-slate-500">{request.email}</p>
                            <p className="text-sm text-slate-500">{request.phoneNumber}</p>
                            {request.linkedIn && (
                              <a href={request.linkedIn} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 underline">
                                LinkedIn Profile
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-5 align-top">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                            {request.requestedRole?.replace('_', ' ')}
                          </span>
                          {request.specialization && (
                            <p className="mt-2 text-sm text-slate-500">{request.specialization}</p>
                          )}
                          {request.department && (
                            <p className="text-sm text-slate-500">{request.department}</p>
                          )}
                        </td>
                        <td className="px-8 py-5 align-top">
                          {request.cvFileName ? (
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700">
                              <FileText className="h-4 w-4 text-slate-500" />
                              {request.cvFileName}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400">No CV</span>
                          )}
                        </td>
                        <td className="px-8 py-5 align-top text-sm text-slate-500">
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-5 align-top text-sm">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setSelectedRequest(request)}
                              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-100"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Request Details Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
              <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-100 bg-white/95 p-8 shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Registration Request Details</h3>
                    <p className="mt-1 text-sm text-slate-500">Review applicant information before approving access.</p>
                  </div>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                  >
                    Close
                  </button>
                </div>
                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedRequest.firstName} {selectedRequest.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                    <p className="text-sm text-slate-700">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                    <p className="text-sm text-slate-700">{selectedRequest.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</p>
                    <p className="text-sm text-slate-700">{selectedRequest.address}</p>
                  </div>
                  {selectedRequest.linkedIn && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">LinkedIn</p>
                      <a
                        href={selectedRequest.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 underline"
                      >
                        {selectedRequest.linkedIn}
                      </a>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Requested Role</p>
                    <p className="text-sm font-medium text-slate-900">
                      {selectedRequest.requestedRole?.replace('_', ' ')}
                    </p>
                  </div>
                  {selectedRequest.specialization && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Specialization</p>
                      <p className="text-sm text-slate-700">{selectedRequest.specialization}</p>
                    </div>
                  )}
                  {selectedRequest.department && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Department</p>
                      <p className="text-sm text-slate-700">{selectedRequest.department}</p>
                    </div>
                  )}
                  {selectedRequest.licenseNumber && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">License Number</p>
                      <p className="text-sm text-slate-700">{selectedRequest.licenseNumber}</p>
                    </div>
                  )}
                </div>
                <div className="mt-8 flex flex-wrap justify-end gap-3">
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


