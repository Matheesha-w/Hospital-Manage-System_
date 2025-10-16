import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaComments } from "react-icons/fa";
import Feedback from "./Feedback";
import EditProfile from "./EditProfile";

import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const PatientDashboard = () => {
	const { token } = useAuth();
	const [user, setUser] = useState(null);
	const [editing, setEditing] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	// Surgeries state
	const [upcomingSurgeries, setUpcomingSurgeries] = useState([]);
	const [completedSurgeries, setCompletedSurgeries] = useState([]);
	const [surgeriesLoading, setSurgeriesLoading] = useState(false);
	const [surgeriesError, setSurgeriesError] = useState("");

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

	// Load surgeries for current patient
	useEffect(() => {
		let active = true;
		const loadSurgeries = async () => {
			if (!token) return;
			setSurgeriesLoading(true);
			setSurgeriesError("");
			try {
				const [upRes, compRes] = await Promise.all([
					axios.get("/patient/surgeries"),
					axios.get("/patient/surgeries/completed"),
				]);
				const up = upRes?.data?.data || [];
				const comp = compRes?.data?.data || [];
				if (active) {
					setUpcomingSurgeries(up);
					setCompletedSurgeries(comp);
				}
			} catch (e) {
				if (active) setSurgeriesError(e.response?.data?.message || e.message || "Failed to load surgeries");
			} finally {
				if (active) setSurgeriesLoading(false);
			}
		};
		loadSurgeries();
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

				{/* Surgeries grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
					{/* Upcoming surgeries */}
					<div className="bg-white rounded-xl shadow border border-slate-100 p-6">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-semibold text-slate-800">Upcoming Surgeries</h3>
							{surgeriesLoading && <span className="text-sm text-slate-500">Loading...</span>}
						</div>
						{surgeriesError && <div className="text-sm text-red-600 mt-2">{surgeriesError}</div>}
						<div className="mt-4 space-y-4">
							{(upcomingSurgeries || []).length === 0 && !surgeriesLoading ? (
								<div className="text-slate-500 text-sm">No upcoming surgeries.</div>
							) : (
								upcomingSurgeries.map((s) => (
									<div key={s.id} className="border border-slate-100 rounded-lg p-4 hover:bg-slate-50 transition">
										<div className="flex items-center justify-between">
											<div className="text-slate-900 font-medium">{s.condition} <span className="text-slate-500 text-sm">• {s.surgeryType}</span></div>
											<div className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">{s.urgency}</div>
										</div>
										<div className="mt-1 text-sm text-slate-600">Room: <span className="text-slate-800 font-medium">{s.operatingRoom}</span></div>
										<div className="mt-1 text-sm text-slate-600">Scheduled: <span className="text-slate-800 font-medium">{s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : '-'}</span></div>
										<div className="mt-2 text-sm text-slate-600">Doctor: <span className="text-slate-800 font-medium">{s.doctorName || '-'}</span> <span className="text-slate-400">•</span> <span className="break-all">{s.doctorEmail || '-'}</span></div>
										{s.notes && <div className="mt-2 text-sm text-slate-600">Notes: <span className="text-slate-700">{s.notes}</span></div>}
									</div>
								))
							)}
						</div>
					</div>

					{/* Completed surgeries */}
					<div className="bg-white rounded-xl shadow border border-slate-100 p-6">
						<h3 className="text-lg font-semibold text-slate-800">Completed Surgeries</h3>
						<div className="mt-4 space-y-4">
							{(completedSurgeries || []).length === 0 && !surgeriesLoading ? (
								<div className="text-slate-500 text-sm">No completed surgeries.</div>
							) : (
								completedSurgeries.map((s) => (
									<div key={s.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50">
										<div className="flex items-center justify-between">
											<div className="text-slate-900 font-medium">{s.condition} <span className="text-slate-500 text-sm">• {s.surgeryType}</span></div>
											<div className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">COMPLETED</div>
										</div>
										<div className="mt-1 text-sm text-slate-600">Room: <span className="text-slate-800 font-medium">{s.operatingRoom}</span></div>
										<div className="mt-1 text-sm text-slate-600">Scheduled: <span className="text-slate-800 font-medium">{s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : '-'}</span></div>
										<div className="mt-1 text-sm text-slate-600">Completed: <span className="text-slate-800 font-medium">{s.completedAt ? new Date(s.completedAt).toLocaleString() : '-'}</span></div>
										<div className="mt-2 text-sm text-slate-600">Doctor: <span className="text-slate-800 font-medium">{s.doctorName || '-'}</span> <span className="text-slate-400">•</span> <span className="break-all">{s.doctorEmail || '-'}</span></div>
										{s.notes && <div className="mt-2 text-sm text-slate-600">Notes: <span className="text-slate-700">{s.notes}</span></div>}
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PatientDashboard;
