import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { messagesAPI } from '../../services/api';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await messagesAPI.getMessages();
      console.log('Messages response:', res.data);
      setMessages(res.data || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to load messages. Make sure backend is running on port 3030.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await messagesAPI.deleteMessage(id);
        await loadMessages();
      } catch (err) {
        console.error('Error deleting message:', err);
        alert('Failed to delete message.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Manage Messages</h1>
        <p className="text-light-gray/70">View and manage contact form submissions</p>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          <p>{error}</p>
          <button onClick={loadMessages} className="mt-2 text-sm underline">
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-12 text-light-gray/50">
          No messages yet. When someone contacts you, they'll appear here.
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <h3 className="font-bold">{message.name}</h3>
                        <p className="text-sm text-light-gray/70">{message.email}</p>
                      </div>
                      <span className="text-xs text-light-gray/50 ml-auto">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-light-gray/80">{message.message}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(message._id)}
                    className="py-2 px-4 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors self-start"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ManageMessages;
