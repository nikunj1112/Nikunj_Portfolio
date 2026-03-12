import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { statsAPI } from '../../services/api';

const ManageStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    order: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await statsAPI.getStats();
      setStats(res.data || []);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load stats. Make sure backend is running on port 3030.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingStat) {
        await statsAPI.updateStats(editingStat._id, formData);
      } else {
        await statsAPI.createStats(formData);
      }
      await loadStats();
      closeModal();
    } catch (err) {
      console.error('Error saving stat:', err);
      alert('Failed to save stat. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (stat) => {
    setEditingStat(stat);
    setFormData({
      label: stat.label || '',
      value: stat.value || '',
      order: stat.order || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stat?')) {
      try {
        await statsAPI.deleteStats(id);
        await loadStats();
      } catch (err) {
        console.error('Error deleting stat:', err);
        alert('Failed to delete stat.');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStat(null);
    setFormData({ label: '', value: '', order: '' });
  };

  const openAddModal = () => {
    setEditingStat(null);
    setFormData({ label: '', value: '', order: '' });
    setShowModal(true);
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Stats</h1>
          <p className="text-light-gray/70">Add, edit, or remove your portfolio statistics</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          + Add Stat
        </button>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          <p>{error}</p>
          <button onClick={loadStats} className="mt-2 text-sm underline">
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-secondary-dark/50 border border-soft-blue/30 rounded-xl">
              <thead>
                <tr className="border-b border-soft-blue/20">
                  <th className="p-4 text-left font-semibold text-light-gray/80">Label</th>
                  <th className="p-4 text-left font-semibold text-light-gray/80">Value</th>
                  <th className="p-4 text-left font-semibold text-light-gray/80">Order</th>
                  <th className="p-4 text-right font-semibold text-light-gray/80">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {stats.map((stat) => (
                    <motion.tr
                      key={stat._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="border-b border-soft-blue/10 hover:bg-secondary-dark/70 transition-colors"
                    >
                      <td className="p-4 font-medium">{stat.label}</td>
                      <td className="p-4 font-bold text-accent">{stat.value}</td>
                      <td className="p-4">{stat.order}</td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(stat)}
                            className="px-4 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(stat._id)}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {stats.length === 0 && !loading && !error && (
            <div className="text-center py-16 text-light-gray/50">
              <div className="text-6xl mb-4">📊</div>
              No stats added yet. Click "Add Stat" to get started.
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-6">
                {editingStat ? 'Edit Stat' : 'Add New Stat'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Label *</label>
                  <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="e.g., Projects Completed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Value *</label>
                  <input
                    type="text"
                    name="value"
                    value={formData.value}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="e.g., 25+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="0"
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-3 rounded-lg bg-secondary-dark border border-soft-blue/20 hover:bg-secondary-dark/80 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 btn-primary"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : (editingStat ? 'Update' : 'Add')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageStats;

