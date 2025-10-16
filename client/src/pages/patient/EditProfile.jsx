import React, { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

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

    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.put('/auth/me', form);
      if (onSave) onSave(data?.data || form);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "An error occurred while updating your profile");
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