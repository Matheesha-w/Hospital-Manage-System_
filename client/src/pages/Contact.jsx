import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post('/public/contact', data);
      toast.success('Message sent!');
      reset();
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
      </div>
    </div>
  );
}


