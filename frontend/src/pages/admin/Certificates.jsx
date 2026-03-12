import { useState, useEffect } from 'react';
import { certificateAPI } from '../../services/api.js';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    issueDate: '',
    credentialId: '',
    certificateLink: '',
    image: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await certificateAPI.getCertificates();
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await certificateAPI.updateCertificate(editingId, formData);
      } else {
        await certificateAPI.createCertificate(formData);
      }
      setFormData({
        title: '',
        organization: '',
        issueDate: '',
        credentialId: '',
        certificateLink: '',
        image: '',
        description: ''
      });
      setEditingId(null);
      loadCertificates();
    } catch (error) {
      console.error('Error saving certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (certificate) => {
    setFormData({
      title: certificate.title,
      organization: certificate.organization,
      issueDate: certificate.issueDate.split('T')[0],
      credentialId: certificate.credentialId || '',
      certificateLink: certificate.certificateLink || '',
      image: certificate.image || '',
      description: certificate.description || ''
    });
    setEditingId(certificate._id);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      try {
        await certificateAPI.deleteCertificate(id);
        loadCertificates();
      } catch (error) {
        console.error('Error deleting certificate:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Certificates Management</h1>
        <button
          onClick={() => {
            setFormData({
              title: '',
              organization: '',
              issueDate: '',
              credentialId: '',
              certificateLink: '',
              image: '',
              description: ''
            });
            setEditingId(null);
          }}
          className="px-6 py-2 bg-accent text-white rounded-xl hover:bg-opacity-90 transition-all font-semibold"
        >
          {editingId ? 'Cancel Edit' : 'Add New Certificate'}
        </button>
      </div>

      {/* Form */}
      <div className="glass p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Certificate' : 'Add Certificate'}</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-light-gray">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-light-gray">Organization *</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-light-gray">Issue Date *</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              className="input-field w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-light-gray">Credential ID</label>
            <input
              type="text"
              name="credentialId"
              value={formData.credentialId}
              onChange={handleInputChange}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-light-gray">Certificate Link</label>
            <input
              type="url"
              name="certificateLink"
              value={formData.certificateLink}
              onChange={handleInputChange}
              className="input-field w-full"
              placeholder="https://credentials.example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-light-gray">Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="input-field w-full"
              placeholder="https://example.com/cert-image.jpg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-light-gray">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="input-field w-full resize-vertical"
              placeholder="Brief description of the certificate..."
            />
          </div>
          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent text-white py-3 px-6 rounded-xl font-bold hover:bg-opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update Certificate' : 'Add Certificate'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="flex-1 bg-secondary-dark text-light-gray py-3 px-6 rounded-xl font-bold hover:bg-accent transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Certificates List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Certificates ({certificates.length})</h2>
        {certificates.length === 0 ? (
          <div className="glass p-12 rounded-2xl text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h3 className="text-2xl font-bold text-light-gray/50 mb-2">No certificates yet</h3>
            <p className="text-light-gray/60">Add your first certificate using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert._id} className="glass p-6 rounded-2xl hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 group h-[280px] flex flex-col">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{cert.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-accent/20 px-3 py-1 rounded-lg text-accent text-sm font-bold">
                      {cert.organization}
                    </div>
                    <span className="text-sm font-mono text-light-gray/70">
                      {new Date(cert.issueDate).getFullYear()}
                    </span>
                  </div>
                  {cert.description && (
                    <p className="text-light-gray/70 text-sm line-clamp-3 mb-4">
                      {cert.description}
                    </p>
                  )}
                  {cert.credentialId && (
                    <div className="text-xs text-light-gray/50 mb-2">
                      ID: <span className="font-mono">{cert.credentialId}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="flex-1 bg-accent/10 hover:bg-accent text-accent hover:text-white py-2 px-3 rounded-lg text-sm font-medium transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cert._id)}
                    className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-2 px-3 rounded-lg text-sm font-medium transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;
