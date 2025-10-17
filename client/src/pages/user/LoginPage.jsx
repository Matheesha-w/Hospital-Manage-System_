import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, HeartPulse, CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const featureHighlights = [
    {
      icon: ShieldCheck,
      title: 'Secure Access',
      description: 'Single sign-on across all hospital departments with enterprise-grade security.'
    },
    {
      icon: HeartPulse,
      title: 'Patient-Centric',
      description: 'Instant visibility into patient records, scheduling, and care coordination.'
    },
    {
      icon: CalendarCheck,
      title: 'Shift Ready',
      description: 'Manage appointments, shifts, and approvals from a single dashboard.'
    }
  ];

  const onSubmit = async (data) => {
    const result = await login(data);
    
    if (result.success) {
      toast.success('Login successful!');
      const roles = result.data?.roles || [];
      const target = roles.includes('ADMIN') ? '/admin' : from;
      navigate(target, { replace: true });
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          <div className="relative rounded-3xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/70 lg:p-10">
            <div className="absolute inset-x-10 -top-6 flex justify-center">
              <div className="inline-flex items-center rounded-full bg-white px-6 py-2 text-xs font-semibold uppercase tracking-wide text-blue-600 shadow-lg shadow-blue-200">Secure Sign-in</div>
            </div>
            <form className="mt-6 space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-slate-800">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="name@hospital.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-rose-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    {...register('password', { required: 'Password is required' })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-12 py-3 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 transition hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-rose-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-300 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>

              <div className="text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-600 transition hover:text-blue-500">
                  Create one now
                </Link>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-white/80 p-10 shadow-2xl shadow-blue-100/60 backdrop-blur">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">Welcome back</span>
            <h2 className="mt-6 text-3xl font-bold text-slate-900 sm:text-4xl">Hospital Staff Portal</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Access patient updates, manage schedules, and collaborate securely with the clinical care team—all from one intuitive dashboard.
            </p>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featureHighlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-blue-50 bg-blue-50/60 p-4 transition hover:border-blue-200 hover:bg-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-600/10 p-5 text-sm text-blue-700">
              Need assistance? Contact the IT helpdesk via <span className="font-semibold">support@hms-care.com</span> or dial <span className="font-semibold">+1 (800) 555-9824</span>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


