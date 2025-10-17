import React, { useState, useEffect, useCallback } from "react";
import { FaUserCircle, FaEdit, FaComments, FaClock, FaCheckCircle, FaProcedures, FaHospital, FaCalendarPlus } from "react-icons/fa";
import Feedback from "./Feedback";
import EditProfile from "./EditProfile";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const PatientDashboard = () => {
	const { token } = useAuth();
	const [user, setUser] = useState(null);
	const [editing, setEditing] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [doctorList, setDoctorList] = useState([]);
	const [doctorLoading, setDoctorLoading] = useState(false);
	const [doctorError, setDoctorError] = useState("");
	const [appointments, setAppointments] = useState([]);
	const [appointmentsLoading, setAppointmentsLoading] = useState(false);
	const [appointmentsError, setAppointmentsError] = useState("");
	const [appointmentForm, setAppointmentForm] = useState({ doctorId: "", appointmentAt: "", reason: "" });
	const [createLoading, setCreateLoading] = useState(false);
	const [createError, setCreateError] = useState("");
	const [createSuccess, setCreateSuccess] = useState("");

	// Surgeries state
	const [upcomingSurgeries, setUpcomingSurgeries] = useState([]);
	const [completedSurgeries, setCompletedSurgeries] = useState([]);
	const [surgeriesLoading, setSurgeriesLoading] = useState(false);
	const [surgeriesError, setSurgeriesError] = useState("");
	const [activeSurgeryTab, setActiveSurgeryTab] = useState("pending");

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

	const loadDoctors = useCallback(async () => {
		if (!token) return;
		setDoctorLoading(true);
		setDoctorError("");
		try {
			const res = await axios.get("/patient/appointments/doctors");
			setDoctorList(res?.data?.data || []);
		} catch (e) {
			setDoctorError(e.response?.data?.message || e.message || "Failed to load doctors");
		} finally {
			setDoctorLoading(false);
		}
	}, [token]);

	const loadAppointments = useCallback(async () => {
		if (!token) return;
		setAppointmentsLoading(true);
		setAppointmentsError("");
		try {
			const res = await axios.get("/patient/appointments");
			setAppointments(res?.data?.data || []);
		} catch (e) {
			setAppointmentsError(e.response?.data?.message || e.message || "Failed to load appointments");
		} finally {
			setAppointmentsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		loadDoctors();
	}, [loadDoctors]);

	useEffect(() => {
		loadAppointments();
	}, [loadAppointments]);

	const handleCreateAppointment = async (e) => {
		e.preventDefault();
		setCreateError("");
		setCreateSuccess("");
		if (!appointmentForm.doctorId || !appointmentForm.appointmentAt || !appointmentForm.reason.trim()) {
			setCreateError("All fields are required");
			return;
		}
		const date = new Date(appointmentForm.appointmentAt);
		if (Number.isNaN(date.getTime())) {
			setCreateError("Choose a valid date and time");
			return;
		}
		try {
			setCreateLoading(true);
			await axios.post("/patient/appointments", {
				doctorId: appointmentForm.doctorId,
				appointmentAt: date.toISOString(),
				reason: appointmentForm.reason.trim(),
			});
			setCreateSuccess("Appointment created successfully");
			setAppointmentForm({ doctorId: "", appointmentAt: "", reason: "" });
			await loadAppointments();
		} catch (e) {
			setCreateError(e.response?.data?.message || e.message || "Failed to create appointment");
		} finally {
			setCreateLoading(false);
		}
	};

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
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
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

				{/* Appointments card */}
				<div className="mt-6">
					<div className="bg-white rounded-2xl shadow border border-slate-100 p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div>
								<h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
									<FaCalendarPlus className="text-sky-600" />
									Doctor Appointments
								</h3>
								<p className="text-sm text-slate-500">Schedule your next visit and review upcoming appointments.</p>
							</div>
						</div>
						<div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div>
								<h4 className="text-base font-semibold text-slate-700">Book an appointment</h4>
								<form className="mt-4 space-y-4" onSubmit={handleCreateAppointment}>
									<div>
										<label className="block text-sm font-medium text-slate-600">Select doctor</label>
										<select
											className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
											value={appointmentForm.doctorId}
											onChange={(e) => setAppointmentForm((prev) => ({ ...prev, doctorId: e.target.value }))}
											disabled={doctorLoading}
										>
											<option value="">Choose a doctor</option>
											{doctorList.map((doc) => (
												<option key={doc.id} value={doc.id}>
													{doc.name} {doc.specialization ? `• ${doc.specialization}` : ""}
												</option>
											))}
										</select>
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-600">Date &amp; time</label>
										<input
											type="datetime-local"
											className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
											value={appointmentForm.appointmentAt}
											onChange={(e) => setAppointmentForm((prev) => ({ ...prev, appointmentAt: e.target.value }))}
											required
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-slate-600">Reason</label>
										<textarea
											className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
											rows={3}
											value={appointmentForm.reason}
											onChange={(e) => setAppointmentForm((prev) => ({ ...prev, reason: e.target.value }))}
											required
										/>
									</div>
									{doctorError && <p className="text-sm text-red-600">{doctorError}</p>}
									{createError && <p className="text-sm text-red-600">{createError}</p>}
									{createSuccess && <p className="text-sm text-emerald-600">{createSuccess}</p>}
									<button
										type="submit"
										className="inline-flex items-center gap-2 bg-sky-600 text-white px-4 py-2.5 rounded-lg hover:bg-sky-700 transition disabled:opacity-60"
										disabled={doctorLoading || createLoading}
									>
										{createLoading ? "Booking..." : "Book Appointment"}
									</button>
								</form>
							</div>
							<div>
								<h4 className="text-base font-semibold text-slate-700">Upcoming appointments</h4>
								<div className="mt-4 space-y-4">
									{appointmentsLoading && <div className="text-sm text-slate-500">Loading appointments...</div>}
									{appointmentsError && <div className="text-sm text-red-600">{appointmentsError}</div>}
									{!appointmentsLoading && !appointmentsError && appointments.length === 0 && (
										<div className="border border-dashed border-slate-200 rounded-xl p-4 text-sm text-slate-500">
											No appointments scheduled yet.
										</div>
									)}
									{appointments.map((appt) => (
										<div key={appt.id} className="border border-slate-100 rounded-xl p-4">
											<div className="text-sm text-slate-500">{new Date(appt.appointmentAt).toLocaleString()}</div>
											<div className="mt-1 text-slate-800 font-semibold">{appt.doctorName || "Doctor"}</div>
											{appt.doctorSpecialization && <div className="text-xs text-slate-500">{appt.doctorSpecialization}</div>}
											<div className="mt-2 text-sm text-slate-600">Reason: {appt.reason}</div>
											<div className="mt-2"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">{appt.status || "SCHEDULED"}</span></div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Surgeries card */}
				<div className="mt-6">
					<div className="bg-white rounded-2xl shadow border border-slate-100 p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div>
								<h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
									<FaProcedures className="text-sky-600" />
									Surgery Schedule
								</h3>
								<p className="text-sm text-slate-500">Track your upcoming procedures and review completed surgeries.</p>
							</div>
							<div className="inline-flex rounded-full bg-slate-100 p-1">
								<button
									type="button"
									className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition ${
										activeSurgeryTab === "pending"
											? "bg-white shadow text-sky-600"
											: "text-slate-500 hover:text-slate-700"
									}`}
									onClick={() => setActiveSurgeryTab("pending")}
								>
									<FaClock /> Pending
									<span className="ml-1 inline-flex items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs px-2 py-0.5">
										{upcomingSurgeries.length}
									</span>
								</button>
								<button
									type="button"
									className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition ${
										activeSurgeryTab === "completed"
											? "bg-white shadow text-emerald-600"
											: "text-slate-500 hover:text-slate-700"
									}`}
									onClick={() => setActiveSurgeryTab("completed")}
								>
									<FaCheckCircle /> Completed
									<span className="ml-1 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5">
										{completedSurgeries.length}
									</span>
								</button>
							</div>
						</div>
						{surgeriesLoading && (
							<div className="mt-4 text-sm text-slate-500 flex items-center gap-2">
								<FaHospital className="text-slate-400" /> Loading surgeries...
							</div>
						)}
						{surgeriesError && <div className="mt-4 text-sm text-red-600">{surgeriesError}</div>}
						<div className="mt-6 space-y-4">
							{(activeSurgeryTab === "pending" ? upcomingSurgeries : completedSurgeries).length === 0 && !surgeriesLoading ? (
								<div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
									{activeSurgeryTab === "pending" ? "No pending surgeries scheduled." : "No completed surgeries yet."}
								</div>
							) : (
								(activeSurgeryTab === "pending" ? upcomingSurgeries : completedSurgeries).map((s) => (
									<div
										key={s.id}
										className={`border border-slate-100 rounded-xl p-5 transition ${
											activeSurgeryTab === "completed" ? "bg-emerald-50/60" : "hover:bg-slate-50"
										}`}
									>
										<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
											<div>
												<div className="text-slate-900 font-semibold text-base flex items-center gap-2">
													{activeSurgeryTab === "completed" ? (
														<FaCheckCircle className="text-emerald-500" />
													) : (
														<FaClock className="text-amber-500" />
													)}
													{s.condition}
												</div>
												<div className="text-sm text-slate-500 mt-0.5">{s.surgeryType}</div>
											</div>
											<div className="flex items-center gap-2">
												<span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
													activeSurgeryTab === "completed"
														? "bg-emerald-100 text-emerald-700"
														: "bg-amber-100 text-amber-700"
												}`}>{activeSurgeryTab === "completed" ? "Completed" : s.urgency}</span>
											</div>
										</div>
										<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
											<div>
												<span className="font-medium text-slate-700">Operating Room:</span> {s.operatingRoom}
											</div>
											<div>
												<span className="font-medium text-slate-700">Scheduled:</span> {s.scheduledAt ? new Date(s.scheduledAt).toLocaleString() : "-"}
											</div>
											{activeSurgeryTab === "completed" && (
												<div>
													<span className="font-medium text-slate-700">Completed:</span> {s.completedAt ? new Date(s.completedAt).toLocaleString() : "-"}
												</div>
											)}
											<div>
												<span className="font-medium text-slate-700">Doctor:</span> {s.doctorName || "-"}
												<div className="text-xs text-slate-500 break-all">{s.doctorEmail || "-"}</div>
											</div>
										</div>
										{s.notes && (
											<div className="mt-3 text-sm text-slate-600">
												<span className="font-medium text-slate-700">Notes:</span> {s.notes}
											</div>
										)}
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
