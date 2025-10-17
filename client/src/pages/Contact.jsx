import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();
  const { user, hasRole } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm text-gray-700">Name</label>
              <input {...register('name', { required: 'Name is required' })} className="mt-1 w-full border rounded-md px-3 py-2" />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input type="email" {...register('email', { required: 'Email is required' })} className="mt-1 w-full border rounded-md px-3 py-2" />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700">Subject</label>
              <input {...register('subject', { required: 'Subject is required' })} className="mt-1 w-full border rounded-md px-3 py-2" />
              {errors.subject && <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700">Message</label>
              <textarea rows="5" {...register('message', { required: 'Message is required' })} className="mt-1 w-full border rounded-md px-3 py-2" />
              {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Sending...' : 'Send Message'}</button>
          </form>
        </div>

        {user && hasRole('PATIENT') && (
          <div className="mt-6 bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Messages</h2>
            {loadingMessages ? (
              <p className="text-sm text-gray-600">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-gray-600">You have not contacted us yet.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Submitted on {m.createdAt ? new Date(m.createdAt).toLocaleString() : 'N/A'}</p>
                        <h3 className="text-lg font-medium text-gray-900">{m.subject}</h3>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${m.responded ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {m.responded ? 'Responded' : 'Pending'}
                      </span>
                    </div>
                    <p className="mt-3 text-gray-700 whitespace-pre-line">{m.message}</p>
                    {m.responded && (
                      <div className="mt-4 border-t pt-3">
                        <p className="text-sm text-gray-500">Admin reply {m.respondedAt ? `on ${new Date(m.respondedAt).toLocaleString()}` : ''}</p>
                        <p className="mt-1 text-gray-800 whitespace-pre-line">{m.adminResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


