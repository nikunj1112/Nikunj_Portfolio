import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { educationAPI } from '../../services/api';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    startYear: '',
    endYear: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await educationAPI.getEducation();
      console.log('Education response:', res.data);
      setEducation(res.data || []);
    } catch (err) {
      console.error('Error loading education:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to load education. Make sure backend is running on port 3030.');
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
      if (editingEducation) {
        await educationAPI.updateEducation(editingEducation._id, formData);
      } else {
        await educationAPI.createEducation(formData);
      }
      await loadEducation();
      closeModal();
    } catch (err) {
      console.error('Error saving education:', err);
      alert('Failed to save education. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (edu) => {
    setEditingEducation(edu);
    setFormData({
      degree: edu.degree || '',
      institution: edu.institution || '',
      startYear: edu.startYear || '',
      endYear: edu.endYear || '',
      description: edu.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this education record?')) {
      try {
        await educationAPI.deleteEducation(id);
        await loadEducation();
      } catch (err) {
        console.error('Error deleting education:', err);
        alert('Failed to delete education.');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEducation(null);
    setFormData({ degree: '', institution: '', startYear: '', endYear: '', description: '' });
  };

  const openAddModal = () => {
    setEditingEducation(null);
    setFormData({ degree: '', institution: '', startYear: '', endYear: '', description: '' });
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
          <h1 className="text-3xl font-bold mb-2">Manage Education</h1>
          <p className="text-light-gray/70">Add, edit, or remove your education records</p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          + Add Education
        </button>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          <p>{error}</p>
          <button
            onClick={loadEducation}
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
            {education.map((edu) => (
              <motion.div
                key={edu._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{edu.degree}</h3>
                    <p className="text-light-gray/70 text-sm mb-2">{edu.institution}</p>
                    {(edu.startYear || edu.endYear) && (
                      <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent">
                        {edu.startYear} {edu.startYear && edu.endYear ? '-' : ''} {edu.endYear}
                      </span>
                    )}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-sm text-light-gray/60 mb-4 line-clamp-2">{edu.description}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(edu)}
                    className="flex-1 py-2 px-4 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(edu._id)}
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

      {education.length === 0 && !loading && !error && (
        <div className="text-center py-12 text-light-gray/50">
          No education records added yet. Click "Add Education" to get started.
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
                {editingEducation ? 'Edit Education' : 'Add New Education'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Degree / Certificate</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="e.g., Bachelor of Science in Information Technology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Institution</label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="e.g., Vidhyadeep University"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Year</label>
                    <input
                      type="text"
                      name="startYear"
                      value={formData.startYear}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 2023"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Year</label>
                    <input
                      type="text"
                      name="endYear"
                      value={formData.endYear}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., 2026"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="input-field"
                    placeholder="e.g., 3rd Semester Completed"
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
                    {saving ? 'Saving...' : (editingEducation ? 'Update' : 'Add')}
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

export default Education;

