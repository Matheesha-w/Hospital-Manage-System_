import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';
import Dashboard from './pages/user/Dashboard';
import AdminPanel from './pages/admin/AdminPanel';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDoctorsTable from './pages/admin/userCategoryTables/AdminDoctorsTable';
import AdminNursesTable from './pages/admin/userCategoryTables/AdminNursesTable';
import AdminPatientsTable from './pages/admin/userCategoryTables/AdminPatientsTable';
import AdminLabStaffTable from './pages/admin/userCategoryTables/AdminLabStaffTable';
import AdminPharmacistsTable from './pages/admin/userCategoryTables/AdminPharmacistsTable';
import AdminAdminsTable from './pages/admin/userCategoryTables/AdminAdminsTable';
import AdminContacts from './pages/admin/AdminContacts';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminLayout from './pages/admin/AdminLayout';
import Profile from './pages/user/Profile';
import PatientDashboard from './pages/patient/PatientDashboard';
import PharmacistDashboard from './pages/pharmacist/PharmacistDashboard';
import InventoryManagement from './pages/pharmacist/InventoryManagement';
import PrescriptionsManagement from './pages/pharmacist/PrescriptionsManagement';
import AddEditDrug from './pages/pharmacist/AddEditDrug';
import Contact from './pages/Contact';
import About from './pages/About';
import News from './pages/News';
import LandingPage from './pages/LandingPage';

import NurseAbout from './pages/nurse/NurseAbout';
import NurseContact from './pages/nurse/NurseContact';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import SurgeryHistory from './pages/doctor/SurgeryHistory';
import SurgeryAnalytics from './pages/doctor/SurgeryAnalytics';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import LabLayout from './pages/lab/Layout';
import LabDashboard from './pages/lab/LabDashboard';
import UploadReport from './pages/lab/UploadReport';
import PendingReports from './pages/lab/PendingReports';
import CompletedReports from './pages/lab/CompletedReports';


function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isLabRoute = location.pathname.startsWith('/lab');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster position="top-right" />
      {!isLabRoute && <Header />}
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/nurse/about" element={<NurseAbout />} />
          <Route path="/nurse/contact" element={<NurseContact />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
          />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminPanel />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/patient" element={<AdminPatientsTable />} />
            <Route path="users/doctor" element={<AdminDoctorsTable />} />
            <Route path="users/nurse" element={<AdminNursesTable />} />
            <Route path="users/lab_technician" element={<AdminLabStaffTable />} />
            <Route path="users/pharmacist" element={<AdminPharmacistsTable />} />
            <Route path="users/admin" element={<AdminAdminsTable />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="feedback" element={<AdminFeedback />} />
          </Route>
          
          {/* Pharmacist Routes */}
          <Route path="/pharmacist/dashboard" element={
            <ProtectedRoute requiredRoles={['PHARMACIST']}>
              <PharmacistDashboard />
            </ProtectedRoute>
          } />
          <Route path="/pharmacist/inventory" element={
            <ProtectedRoute requiredRoles={['PHARMACIST']}>
              <InventoryManagement />
            </ProtectedRoute>
          } />
          <Route path="/pharmacist/inventory/add" element={
            <ProtectedRoute requiredRoles={['PHARMACIST']}>
              <AddEditDrug />
            </ProtectedRoute>
          } />
          <Route path="/pharmacist/inventory/edit/:id" element={
            <ProtectedRoute requiredRoles={['PHARMACIST']}>
              <AddEditDrug />
            </ProtectedRoute>
          } />
          <Route path="/pharmacist/prescriptions" element={
            <ProtectedRoute requiredRoles={['PHARMACIST']}>
              <PrescriptionsManagement />
            </ProtectedRoute>
          } />
          <Route path="/pharmacist/reports" element={
            <ProtectedRoute requiredRoles={['PHARMACIST']}>
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Reports Page - Coming Soon</h1>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/pharmacist/settings" element={
            <ProtectedRoute requiredRoles={['PHARMACIST']}>
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold">Settings Page - Coming Soon</h1>
              </div>
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute requiredRoles={['DOCTOR']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor/profile" element={
            <ProtectedRoute requiredRoles={['DOCTOR']}>
              <DoctorProfile />
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute requiredRoles={['DOCTOR']}>
              <DoctorAppointments />
            </ProtectedRoute>
          } />
          {/* Lab Technician Routes */}
          <Route path="/lab" element={
            <ProtectedRoute requiredRoles={['LAB_TECHNICIAN']}>
              <LabLayout>
                <LabDashboard />
              </LabLayout>
            </ProtectedRoute>
          } />
          <Route path="/lab/upload" element={
            <ProtectedRoute requiredRoles={['LAB_TECHNICIAN']}>
              <LabLayout>
                <UploadReport />
              </LabLayout>
            </ProtectedRoute>
          } />
          <Route path="/lab/pending" element={
            <ProtectedRoute requiredRoles={['LAB_TECHNICIAN']}>
              <LabLayout>
                <PendingReports />
              </LabLayout>
            </ProtectedRoute>
          } />
          <Route path="/lab/completed" element={
            <ProtectedRoute requiredRoles={['LAB_TECHNICIAN']}>
              <LabLayout>
                <CompletedReports />
              </LabLayout>
            </ProtectedRoute>
          } />
          <Route path="/doctor/history" element={
            <ProtectedRoute requiredRoles={['DOCTOR']}>
              <SurgeryHistory />
            </ProtectedRoute>
          } />
          <Route path="/doctor/analytics" element={
            <ProtectedRoute requiredRoles={['DOCTOR']}>
              <SurgeryAnalytics />
            </ProtectedRoute>
          } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
