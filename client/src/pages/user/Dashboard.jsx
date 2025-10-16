import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Shield, Stethoscope, Heart, Microscope, Pill } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// Import role dashboards here
import AdminDashboard from '../admin/AdminDashboard'; // admin dashboard
import PatientDashboard from '../patient/PatientDashboard'; // patient dashboard
<<<<<<< HEAD
import PharmacistDashboard from '../pharmacist/PharmacistDashboard'; // pharmacist dashboard

=======
import DoctorDashboard from '../doctor/DoctorDashboard';
>>>>>>> origin/main

const Dashboard = () => {
  const { hasRole } = useAuth();


  // return each dashboard respective to role
  if (hasRole('ADMIN')) return <AdminDashboard />;
<<<<<<< HEAD
  if (hasRole('PHARMACIST')) return <PharmacistDashboard />;
  if (hasRole('DOCTOR')) return <><h1>Set your dashboard here</h1></>;
=======
  if (hasRole('DOCTOR')) return <DoctorDashboard />;
>>>>>>> origin/main
  if (hasRole('NURSE')) return <><h1>Set your dashboard here</h1></>;
  if (hasRole('LAB_TECHNICIAN')) return <><h1>Set your dashboard here</h1></>;
  if (hasRole('PATIENT')) return <PatientDashboard />;


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">No dashboard available</h2>
        <p className="text-gray-600">Your role does not have a dashboard yet.</p>
      </div>
    </div>
  );
};

export default Dashboard;


