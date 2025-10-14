import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle, XCircle, Eye, FileText, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { hasRole } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    if (hasRole('ADMIN')) {
      fetchRegistrationRequests();
    }
  }, [hasRole]);

  const fetchRegistrationRequests = async () => {
    try {
      const response = await axios.get('/admin/registration-requests');
      setRequests(response.data.data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">Manage user registrations and system settings</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/users" className="bg-white border rounded-lg p-6 hover:shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Manage Users</h2>
                <p className="text-sm text-gray-600">Add, remove, and update users by category</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Registration Requests</h2>
          </div>

          {requests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No pending registration requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CV
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requested At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.firstName} {request.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                          <div className="text-sm text-gray-500">{request.phoneNumber}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {request.requestedRole?.replace('_', ' ')}
                        </span>
                        {request.specialization && (
                          <div className="text-sm text-gray-500 mt-1">
                            {request.specialization}
                          </div>
                        )}
                        {request.department && (
                          <div className="text-sm text-gray-500">
                            {request.department}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.cvFileName ? (
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{request.cvFileName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No CV</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-4 w-4" />
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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Registration Request Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm text-gray-900">
                      {selectedRequest.firstName} {selectedRequest.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{selectedRequest.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm text-gray-900">{selectedRequest.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Requested Role</label>
                    <p className="text-sm text-gray-900">
                      {selectedRequest.requestedRole?.replace('_', ' ')}
                    </p>
                  </div>
                  {selectedRequest.specialization && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Specialization</label>
                      <p className="text-sm text-gray-900">{selectedRequest.specialization}</p>
                    </div>
                  )}
                  {selectedRequest.department && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-sm text-gray-900">{selectedRequest.department}</p>
                    </div>
                  )}
                  {selectedRequest.licenseNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">License Number</label>
                      <p className="text-sm text-gray-900">{selectedRequest.licenseNumber}</p>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;


