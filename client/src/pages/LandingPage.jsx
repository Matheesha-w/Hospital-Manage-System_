import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Stethoscope, ShieldCheck, Users } from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
              Manage your hospital, effortlessly
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
              Streamlined workflows for appointments, staff, labs, and patients — secured by role-based access.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="bg-blue-600 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-700">
                Get started
              </Link>
              <Link to="/login" className="px-5 py-3 rounded-md font-medium text-blue-700 bg-blue-100 hover:bg-blue-200">
                I already have an account
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">99.9%</p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">Role</p>
                <p className="text-xs text-gray-500">based access</p>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">HIPAA</p>
                <p className="text-xs text-gray-500">minded design</p>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 bg-blue-200/40 blur-3xl rounded-full"></div>
            <div className="relative bg-white border rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Today</p>
                  <p className="text-base font-semibold text-gray-900">14 appointments scheduled</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-2xl font-bold text-gray-900">8</p>
                  <p className="text-xs text-gray-500">Doctors</p>
                </div>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-gray-500">Nurses</p>
                </div>
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <p className="text-xs text-gray-500">Lab techs</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <p className="text-sm text-gray-700">JWT secured API with granular permissions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Everything you need to run smoothly</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Users className="h-6 w-6 text-blue-600" />} title="Role oriented" desc="Separate portals for admins, doctors, nurses, lab." />
            <FeatureCard icon={<Stethoscope className="h-6 w-6 text-blue-600" />} title="Appointments" desc="Fast scheduling and queue management." />
            <FeatureCard icon={<ShieldCheck className="h-6 w-6 text-blue-600" />} title="Secure by default" desc="JWT auth and route protection built-in." />
            <FeatureCard icon={<Activity className="h-6 w-6 text-blue-600" />} title="Analytics" desc="Operational insights at a glance." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h3 className="text-xl font-semibold text-gray-900">Ready to modernize your hospital operations?</h3>
          <p className="mt-2 text-gray-600">Start with a free account and invite your staff in minutes.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/register" className="bg-blue-600 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-700">
              Create your HealthCare Portal account
            </Link>
            <Link to="/login" className="px-5 py-3 rounded-md font-medium text-blue-700 bg-blue-100 hover:bg-blue-200">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} HealthCare Portal. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Security</span>
            <span>Status</span>
            <span>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="rounded-xl border p-5 bg-gray-50">
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
};

export default LandingPage;
