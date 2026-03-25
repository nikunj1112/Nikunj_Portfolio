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
    resume: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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
        setProfile({
          name: res.data.name || '',
          title: res.data.title || '',
          about: res.data.about || '',
          github: res.data.github || '',
          linkedin: res.data.linkedin || '',
          email: res.data.email || '',
          location: res.data.location || '',
          resume: res.data.resume || '',
        });
        setImagePreview(res.data.profileImage || '');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile. Make sure backend is running on port 3030.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage(null);
    } else {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPG, PNG, GIF)' });
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Please select an image file first' });
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      setUploadingImage(true);
      setMessage(null);
      const res = await profileAPI.uploadProfileImage(formData);
      setProfile(prev => ({ ...prev, profileImage: res.data.profileImage }));
      setSelectedFile(null);
      setImagePreview(res.data.profileImage);
      setMessage({ type: 'success', text: 'Profile image uploaded successfully!' });
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({ type: 'error', text: err.response?.data?.message || 'Upload failed. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
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
        <p className="text-light-gray/70">Update your profile information and upload profile image</p>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
          <p>{error}</p>
          <button onClick={loadProfile} className="mt-2 text-sm underline">
            Try Again
          </button>
        </div>
      )}

      {/* Profile Image Upload Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6 mb-8"
      >
        <h3 className="text-xl font-bold mb-4">Profile Image</h3>
        {message && (
          <div className={`p-4 rounded-lg mb-4 ${
            message.type === 'success' ? 'bg-green-500/20 text-green-400 border-green-500/50 border' : 'bg-red-500/20 text-red-400 border-red-500/50 border'
          }`}>
            {message.text}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Image Preview */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-accent to-soft-blue flex items-center justify-center overflow-hidden border-4 border-white/20 mx-auto md:mx-0">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-primary-dark">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'N'}
                </span>
              )}
            </div>
            {profile.profileImage && (
              <p className="text-xs text-light-gray/60 mt-2 text-center">
                Current: {profile.profileImage.split('/').pop()}
              </p>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Choose New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field file-input"
                disabled={uploadingImage}
              />
            </div>
            <motion.button
              type="button"
              onClick={handleImageUpload}
              disabled={!selectedFile || uploadingImage}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? 'Uploading...' : 'Upload Profile Image'}
            </motion.button>
            <p className="text-xs text-light-gray/60">
              Supported: JPG, PNG, GIF. Max 5MB. Replaces current image.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Profile Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="glass rounded-xl p-6 space-y-6"
      >
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
        
        <div>
          <label className="block text-sm font-medium mb-2">About Description</label>
          <textarea
            name="about"
            value={profile.about || ''}
            onChange={handleChange}
            rows="6"
            className="input-field resize-none w-full"
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
