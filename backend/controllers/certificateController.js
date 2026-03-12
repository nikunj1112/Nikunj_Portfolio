const Certificate = require('../models/Certificate');
const asyncHandler = require('express-async-handler');

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
const getCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find().sort({ order: 1, issueDate: -1 });
  res.json(certificates);
});

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Public
const getCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }
  res.json(certificate);
});

// @desc    Create certificate
// @route   POST /api/certificates
// @access  Private/Admin
const createCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.create(req.body);
  res.status(201).json(certificate);
});

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private/Admin
const updateCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  const updatedCertificate = await Certificate.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(updatedCertificate);
});

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
const deleteCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);
  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  await Certificate.findByIdAndDelete(req.params.id);
  res.json({ message: 'Certificate deleted' });
});

module.exports = {
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate
};
