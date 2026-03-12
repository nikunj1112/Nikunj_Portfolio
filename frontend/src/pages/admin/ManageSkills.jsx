import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillsAPI } from '../../services/api';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    category: 'Frontend',
  });
  const [saving, setSaving] = useState(false);

  const categories = ['Frontend', 'Backend', 'Database', 'Tools'];

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await skillsAPI.getSkills();
      console.log('Skills response:', res.data);
      setSkills(res.data || []);
    } catch (err) {
      console.error('Error loading skills:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to load skills. Make sure backend is running on port 3030.');
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
      if (editingSkill) {
        await skillsAPI.updateSkill(editingSkill._id, formData);
      } else {
        await skillsAPI.createSkill(formData);
      }
      await loadSkills();
      closeModal();
    } catch (err) {
      console.error('Error saving skill:', err);
      alert('Failed to save skill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      icon: skill.icon || '',
      category: skill.category || 'Frontend',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await skillsAPI.deleteSkill(id);
        await loadSkills();
      } catch (err) {
        console.error('Error deleting skill:', err);
        alert('Failed to delete skill.');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSkill(null);
    setFormData({ name: '', icon: '', category: 'Frontend' });
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({ name: '', icon: '', category: 'Frontend' });
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
          <h1 className="text-3xl font-bold mb-2">Manage Skills</h1>
          <p className="text-light-gray/70">Add, edit, or remove your skills</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          + Add Skill
        </button>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          <p>{error}</p>
          <button
            onClick={loadSkills}
            className="mt-2 text-sm underline"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loader" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {skills.map((skill) => (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{skill.icon || '💻'}</div>
                    <div>
                      <h3 className="font-bold">{skill.name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="flex-1 py-2 px-4 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="flex-1 py-2 px-4 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {skills.length === 0 && !loading && !error && (
        <div className="text-center py-12 text-light-gray/50">
          No skills added yet. Click "Add Skill" to get started.
        </div>
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
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Skill Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="e.g., React, Node.js"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                  <input
                    type="text"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., ⚛️"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
                    {saving ? 'Saving...' : (editingSkill ? 'Update' : 'Add')}
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

export default ManageSkills;
