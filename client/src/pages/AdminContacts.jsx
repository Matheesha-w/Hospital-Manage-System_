import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);
  const [responseText, setResponseText] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/admin/contacts');
      setMessages(res.data.data || []);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const sendResponse = async (id) => {
    try {
      await axios.post(`/admin/contacts/${id}/respond`, { response: responseText });
      toast.success('Response saved');
      setRespondingId(null);
      setResponseText('');
      load();
    } catch {
      toast.error('Failed to respond');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Messages</h1>
        <div className="bg-white shadow-sm rounded-lg">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6">Loading...</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map(m => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-gray-900 font-medium">{m.name}</div>
                        <div className="text-gray-500">{m.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{m.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{m.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${m.responded ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {m.responded ? 'Responded' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {respondingId === m.id ? (
                          <div className="flex items-center gap-2">
                            <input value={responseText} onChange={e => setResponseText(e.target.value)} className="border rounded-md px-2 py-1" placeholder="Type response..." />
                            <button onClick={() => sendResponse(m.id)} className="text-blue-600 hover:text-blue-900">Send</button>
                            <button onClick={() => { setRespondingId(null); setResponseText(''); }} className="text-gray-600 hover:text-gray-900">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setRespondingId(m.id)} className="text-blue-600 hover:text-blue-900">Respond</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


