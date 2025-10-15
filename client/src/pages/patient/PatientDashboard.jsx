import React, { useState } from "react";
import { FaUserCircle, FaEdit, FaComments } from "react-icons/fa";
import Feedback from "./Feedback";
import EditProfile from "./EditProfile";

// Dummy user data for demonstration; replace with real user context or API
const dummyUser = {
	id: "patient123",
	name: "John Doe",
	email: "john.doe@example.com",
	// Add more fields as needed
};

const PatientDashboard = () => {
	const [user, setUser] = useState(dummyUser);
	const [editing, setEditing] = useState(false);
	const [showFeedback, setShowFeedback] = useState(false);

	const handleEditSave = (updated) => {
		setUser(updated);
		setEditing(false);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col items-center">
					<FaUserCircle className="text-6xl text-blue-500 mb-2" />
					<h1 className="text-2xl font-bold mb-1">{user.name}</h1>
					<p className="text-gray-600 mb-2">{user.email}</p>
					{/* Add more profile fields here */}
					<button
						className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-2"
						onClick={() => setEditing(true)}
					>
						<FaEdit /> Edit Profile
					</button>
				</div>

				{editing && (
					<EditProfile user={user} onSave={handleEditSave} onCancel={() => setEditing(false)} />
				)}

				<div className="bg-white rounded-lg shadow p-6 flex flex-col items-center mt-6">
					<button
						className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
						onClick={() => setShowFeedback((v) => !v)}
					>
						<FaComments /> {showFeedback ? "Hide Feedback Form" : "Submit Feedback"}
					</button>
					{showFeedback && <Feedback patientId={user.id} />}
				</div>
			</div>
		</div>
	);
};

export default PatientDashboard;
