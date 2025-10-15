
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaRegCommentDots } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthContext";

const AdminFeedback = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [pendingRes, approvedRes] = await Promise.all([
        fetch("/api/admin/feedback/pending", { headers }).then((r) => r.json()),
        fetch("/api/admin/feedback/approved", { headers }).then((r) => r.json()),
      ]);
      setPending(pendingRes);
      setApproved(approvedRes);
    } catch (err) {
    //   toast.error("Failed to load feedbacks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line
  }, [token]);

  const approveFeedback = async (id) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/admin/feedback/approve/${id}`, { method: "POST", headers });
      if (!res.ok) throw new Error();
      toast.success("Feedback approved!");
      fetchFeedbacks();
    } catch {
      toast.error("Failed to approve feedback");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700">
        <FaRegCommentDots /> Manage Patient Feedback
      </h1>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Pending Feedback</h2>
        {loading ? (
          <div>Loading...</div>
        ) : pending.length === 0 ? (
          <div className="text-gray-500">No pending feedback.</div>
        ) : (
          <ul className="space-y-4">
            {pending.map((fb) => (
              <li key={fb.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                <div>
                  <div className="font-medium">{fb.message}</div>
                  <div className="text-xs text-gray-500 mt-1">Patient ID: {fb.patientId}</div>
                </div>
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
                  onClick={() => approveFeedback(fb.id)}
                >
                  <FaCheckCircle /> Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Approved Feedback</h2>
        {loading ? (
          <div>Loading...</div>
        ) : approved.length === 0 ? (
          <div className="text-gray-500">No approved feedback yet.</div>
        ) : (
          <ul className="space-y-4">
            {approved.map((fb) => (
              <li key={fb.id} className="bg-gray-50 p-4 rounded shadow">
                <div className="font-medium">{fb.message}</div>
                <div className="text-xs text-gray-500 mt-1">Patient ID: {fb.patientId}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
