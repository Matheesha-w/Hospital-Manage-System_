import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";

const Feedback = ({ patientId, onFeedbackSubmitted }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/patient/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, message }),
      });
      if (!res.ok) throw new Error("Failed to submit feedback");
      setSuccess(true);
      setMessage("");
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto mt-6">
      <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-blue-700">
        <FaRegCommentDots className="text-2xl" /> Submit Feedback
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="Share your experience or suggestions..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !message.trim()}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
        {success && <div className="text-green-600">Thank you for your feedback!</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default Feedback;
