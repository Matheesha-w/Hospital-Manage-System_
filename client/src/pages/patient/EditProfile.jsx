import React, { useState } from "react";
import { FaUserEdit } from "react-icons/fa";

import { useAuth } from "../../contexts/AuthContext";

const EditProfile = ({ user, onSave, onCancel }) => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    address: user.address || "",
    dateOfBirth: user.dateOfBirth || "",
  });
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
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-2xl mx-auto">
      <h2 className="flex items-center gap-2 text-xl font-bold text-blue-700 mb-2">
        <FaUserEdit className="text-2xl" /> Edit Profile
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="w-full border border-gray-300 rounded-md p-2"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          className="w-full border border-gray-300 rounded-md p-2"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
      </div>
      <input
        className="w-full border border-gray-300 rounded-md p-2"
        name="username"
        value={form.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        className="w-full border border-gray-300 rounded-md p-2"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="w-full border border-gray-300 rounded-md p-2"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <input
          className="w-full border border-gray-300 rounded-md p-2"
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth || ""}
          onChange={handleChange}
        />
      </div>
      <input
        className="w-full border border-gray-300 rounded-md p-2"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
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
