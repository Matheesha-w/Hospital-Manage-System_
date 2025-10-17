import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, MapPin, Clock, Phone, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const { user, hasRole } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const contactDetails = [
    {
      icon: Phone,
      title: 'Emergency Line',
      value: '+1 (800) 555-2470',
      description: '24/7 support for urgent medical needs'
    },
    {
      icon: Mail,
      title: 'Email Support',
      value: 'support@hms-care.com',
      description: 'We aim to reply within one business day'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: '78 Wellness Avenue, New York, NY',
      description: 'Mon–Fri, 8:00 AM – 6:00 PM'
    },
    {
      icon: Clock,
      title: 'Appointment Hours',
      value: 'Mon–Sat, 7:00 AM – 8:00 PM',
      description: 'Flexible scheduling with our specialists'
    }
  ];

  const loadMessages = async () => {
    if (!user || !hasRole('PATIENT')) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    try {
      const res = await axios.get('/patient/contacts');
      setMessages(res.data.data || []);
    } catch (e) {
      toast.error('Failed to load your messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onSubmit = async (data) => {
    try {
      await axios.post('/public/contact', data);
      toast.success('Message sent!');
      reset();
      loadMessages();
    } catch (e) {
      toast.error('Failed to send message');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">We are here to help</span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Contact the Hospital Support Team</h1>
          <p className="mt-3 text-lg text-gray-600 sm:mx-auto sm:max-w-3xl">
            Reach out with questions about appointments, billing, or general support. Our coordinators respond promptly and keep you informed every step of the way.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-xl shadow-blue-100/50 backdrop-blur">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Send a Message</h2>
                  <p className="text-sm text-gray-500">Fill out the form and our team will reach out shortly.</p>
                </div>
              </div>
              <form className="mt-6 grid gap-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email</label>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Subject</label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  {errors.subject && <p className="text-sm text-red-600">{errors.subject.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Message</label>
                  <textarea
                    rows="6"
                    {...register('message', { required: 'Message is required' })}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {user && hasRole('PATIENT') && (
              <div className="rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-xl">
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Messages</h2>
                    <p className="text-sm text-gray-500">Track updates from our support team in one place.</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {loadingMessages ? 'Loading' : `${messages.length} message${messages.length === 1 ? '' : 's'}`}
                  </span>
                </div>
                <div className="mt-6">
                  {loadingMessages ? (
                    <p className="text-sm text-gray-600">Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10">
                      <MessageCircle className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-600">You have not contacted us yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {messages.map((m) => (
                        <div key={m.id} className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-wide text-gray-500">Submitted on {m.createdAt ? new Date(m.createdAt).toLocaleString() : 'N/A'}</p>
                              <h3 className="mt-1 text-lg font-semibold text-gray-900">{m.subject}</h3>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${m.responded ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {m.responded ? 'Responded' : 'Pending'}
                            </span>
                          </div>
                          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-700">{m.message}</p>
                          {m.responded && (
                            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                Admin reply {m.respondedAt ? `• ${new Date(m.respondedAt).toLocaleString()}` : ''}
                              </p>
                              <p className="mt-2 whitespace-pre-line text-sm text-gray-800">{m.adminResponse}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900">Reach our care coordinators</h2>
              <p className="mt-3 text-sm text-gray-600">Choose the channel that works best for you. We respond quickly and keep your records secure.</p>
              <div className="mt-6 space-y-5">
                {contactDetails.map(({ icon: Icon, title, value, description }) => (
                  <div key={title} className="flex gap-4 rounded-2xl border border-blue-50 bg-blue-50/60 p-4 transition hover:border-blue-200 hover:bg-white">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-sm text-blue-700">{value}</p>
                      <p className="text-xs text-gray-500">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl">
              <h3 className="text-xl font-semibold">Need immediate assistance?</h3>
              <p className="mt-2 text-sm text-blue-100">
                Our emergency department is open around the clock. Call the emergency line above or visit the hospital directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


