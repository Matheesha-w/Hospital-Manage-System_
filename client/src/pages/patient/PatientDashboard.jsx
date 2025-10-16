import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaComments } from "react-icons/fa";
import Feedback from "./Feedback";
import EditProfile from "./EditProfile";

import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const PatientDashboard = () => {
	const { token } = useAuth();
	const [user, setUser] = useState(null);
	const [editing, setEditing] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;
		const loadMe = async () => {
			try {
				setLoading(true);
				setError("");
				const res = await fetch("/api/auth/me", {
					headers: {
						"Content-Type": "application/json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				});
				if (!res.ok) throw new Error("Failed to load profile");
				const body = await res.json();
				const me = body?.data || null;
				if (active) setUser(me);
			} catch (e) {
				if (active) setError(e.message || "Error loading profile");
			} finally {
				if (active) setLoading(false);
			}
		};
		loadMe();
		return () => {
			active = false;
		};
	}, [token]);

	const handleEditSave = (updated) => {
		setUser(updated);
		setEditing(false);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-2xl mx-auto text-center text-gray-600">Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-2xl mx-auto text-center text-red-600">{error}</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-slate-50 py-8">
				<div className="max-w-2xl mx-auto text-center text-gray-600">No user data.</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<div className="bg-gradient-to-r from-sky-600 to-indigo-600">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
					<h1 className="text-white text-2xl sm:text-3xl font-semibold">Patient Dashboard</h1>
					<p className="text-sky-100 mt-1">Welcome back, {`${user.firstName || ""} ${user.lastName || ""}`.trim()}.</p>
				</div>
			</div>

			{/* Profile Card */}
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
				<div className="bg-white/95 backdrop-blur rounded-xl shadow-xl border border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
					<div className="shrink-0">
						<div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-sky-50 grid place-items-center ring-2 ring-sky-100">
							<FaUserCircle className="text-5xl sm:text-6xl text-sky-600" />
						</div>
					</div>
					<div className="flex-1 min-w-0">
						<h2 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">{`${user.firstName || ""} ${user.lastName || ""}`.trim()}</h2>
						<p className="text-slate-600 mt-1 break-all">{user.email}</p>
						{/* Add more profile fields here */}
					</div>
					<div className="sm:self-start">
						<button
							className="inline-flex items-center gap-2 rounded-lg border border-sky-200 text-sky-700 hover:bg-sky-50 px-4 py-2 font-medium transition"
							onClick={() => setEditing(true)}
						>
							<FaEdit /> Edit Profile
						</button>
					</div>
				</div>
			</div>

			{editing && (
				<EditProfile user={user} onSave={handleEditSave} onCancel={() => setEditing(false)} />
			)}

			{/* Content Grid */}
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Profile details card */}
					<div className="bg-white rounded-xl shadow border border-slate-100 p-6">
						<h3 className="text-lg font-semibold text-slate-800">Profile Details</h3>
						<div className="mt-4 space-y-3 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-slate-500">Full name</span>
								<span className="text-slate-900 font-medium">{`${user.firstName || ""} ${user.lastName || ""}`.trim() || "-"}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-slate-500">Email</span>
								<span className="text-slate-900 font-medium break-all">{user.email || "-"}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-slate-500">Phone</span>
								<span className="text-slate-900 font-medium">{user.phoneNumber || "-"}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-slate-500">Address</span>
								<span className="text-slate-900 font-medium text-right truncate max-w-[60%]" title={user.address || "-"}>{user.address || "-"}</span>
							</div>
						</div>
					</div>

					{/* Feedback / actions */}
					<div className="bg-white rounded-xl shadow border border-slate-100 p-6">
						<h3 className="text-lg font-semibold text-slate-800">Actions & Feedback</h3>
						<div className="mt-4">
							<button
								className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition"
								onClick={() => setShowFeedback((v) => !v)}
							>
								<FaComments /> {showFeedback ? "Hide Feedback Form" : "Submit Feedback"}
							</button>
							{showFeedback && (
								<div className="mt-5 border-t border-slate-100 pt-5">
									<Feedback patientId={user.id} />
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PatientDashboard;
