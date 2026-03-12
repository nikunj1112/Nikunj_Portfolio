import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profileAPI } from '../../services/api';

const ManageProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    about: '',
    github: '',
    linkedin: '',
    email: '',
    location: '',
    profileImage: '',
    resume: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await profileAPI.getProfile();
      console.log('Profile data:', res.data);
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to load profile. Make sure backend is running on port 3030.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await profileAPI.updateProfile(profile);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Manage Profile</h1>
        <p className="text-light-gray/70">Update your profile information</p>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          <p>{error}</p>
          <button onClick={loadProfile} className="mt-2 text-sm underline">
            Try Again
          </button>
        </div>
      )}

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="glass rounded-xl p-6 space-y-6"
      >
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={profile.title || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">GitHub URL</label>
            <input
              type="url"
              name="github"
              value={profile.github || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
            <input
              type="url"
              name="linkedin"
              value={profile.linkedin || ''}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Profile Image URL</label>
            <input
              type="url"
              name="profileImage"
              value={profile.profileImage || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Resume URL</label>
            <input
              type="url"
              name="resume"
              value={profile.resume || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/resume.pdf"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">About Description</label>
          <textarea
            name="about"
            value={profile.about || ''}
            onChange={handleChange}
            rows="6"
            className="input-field resize-none"
          />
        </div>

        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary px-8 py-3 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default ManageProfile;
