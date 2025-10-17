import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Stethoscope, ShieldCheck, Users } from 'lucide-react';
import { ramzy, yaseen, prasadh, matheesha, maleesha } from '../assets/team';

const LandingPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,197,253,0.15),transparent_50%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">Modern Healthcare Management</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
              Manage your hospital,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400"> effortlessly</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              Streamlined workflows for appointments, staff, labs, and patients — secured by role-based access control.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="group relative bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-200 transform hover:-translate-y-0.5">
                Get started free
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              </Link>
              <Link to="/login" className="px-8 py-4 rounded-xl font-semibold text-blue-700 bg-white border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all">
                Sign in
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">99.9%</p>
                <p className="text-sm text-gray-500 mt-1">Uptime</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">Role</p>
                <p className="text-sm text-gray-500 mt-1">based access</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">HIPAA</p>
                <p className="text-sm text-gray-500 mt-1">minded design</p>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-blue-100 blur-3xl opacity-30 rounded-3xl"></div>
            <div className="relative bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
                  <Stethoscope className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Today's Schedule</p>
                  <p className="text-lg font-bold text-gray-900">14 appointments scheduled</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border border-blue-100">
                  <p className="text-3xl font-bold text-gray-900">8</p>
                  <p className="text-xs text-gray-600 mt-1">Doctors</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border border-blue-100">
                  <p className="text-3xl font-bold text-gray-900">24</p>
                  <p className="text-xs text-gray-600 mt-1">Nurses</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border border-blue-100">
                  <p className="text-3xl font-bold text-gray-900">6</p>
                  <p className="text-xs text-gray-600 mt-1">Lab techs</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-green-50 rounded-2xl p-4 border border-green-100">
                <ShieldCheck className="h-6 w-6 text-green-600 flex-shrink-0" />
                <p className="text-sm text-gray-700 font-medium">JWT secured API with granular permissions</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Everything you need to run smoothly</h2>
            <p className="mt-4 text-lg text-gray-600">Powerful features designed for modern healthcare facilities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Users className="h-6 w-6 text-blue-600" />} title="Role oriented" desc="Separate portals for admins, doctors, nurses, lab." />
            <FeatureCard icon={<Stethoscope className="h-6 w-6 text-blue-600" />} title="Appointments" desc="Fast scheduling and queue management." />
            <FeatureCard icon={<ShieldCheck className="h-6 w-6 text-blue-600" />} title="Secure by default" desc="JWT auth and route protection built-in." />
            <FeatureCard icon={<Activity className="h-6 w-6 text-blue-600" />} title="Analytics" desc="Operational insights at a glance." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h3 className="text-3xl font-bold text-white">Ready to modernize your hospital operations?</h3>
          <p className="mt-4 text-xl text-blue-100">Start with a free account and invite your staff in minutes.</p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5">
              Create your HMS account
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-400 transition-all border-2 border-blue-400">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Meet Our Team</h2>
            <p className="mt-4 text-lg text-gray-600">The talented developers behind HMS</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
               <TeamMember name="Prasadh" image={prasadh} />
               <TeamMember name="Matheesha" image={matheesha} />
               <TeamMember name="Maleesha" image={maleesha} />
               <TeamMember name="Yaseen" image={yaseen} />
               <TeamMember name="Ramzy" image={ramzy} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} HMS. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-medium">
            <span className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Security</span>
            <span className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Status</span>
            <span className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="group relative rounded-2xl border border-gray-200 p-8 bg-white hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h4 className="font-bold text-gray-900 text-lg mb-2">{title}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

const TeamMember = ({ name, image }) => {
  return (
    <div className="group text-center">
      <div className="relative mb-4 inline-block">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
        <img 
          src={image} 
          alt={name}
          className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg group-hover:scale-105 transition-transform bg-gray-50"
        />
      </div>
      <h4 className="font-semibold text-gray-900 text-lg">{name}</h4>
      <p className="text-sm text-gray-500 mt-1">Developer</p>
    </div>
  );
};

export default LandingPage;