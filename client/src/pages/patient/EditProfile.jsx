import React, { useState } from "react";
import { FaUserEdit } from "react-icons/fa";

const EditProfile = ({ user, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Replace with your actual API endpoint
      const res = await fetch(`/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      if (onSave) onSave(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-lg mx-auto">
      <h2 className="flex items-center gap-2 text-xl font-bold text-blue-700 mb-2">
        <FaUserEdit className="text-2xl" /> Edit Profile
      </h2>
      <input
        className="w-full border border-gray-300 rounded-md p-2"
        name="name"
        value={form.name || ""}
        onChange={handleChange}
        placeholder="Full Name"
        required
      />
      <input
        className="w-full border border-gray-300 rounded-md p-2"
        name="email"
        type="email"
        value={form.email || ""}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      {/* Add more fields as needed */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
};

export default EditProfile;
