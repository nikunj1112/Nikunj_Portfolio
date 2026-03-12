const Education = require('../models/Education');

// @desc    Get all education records
// @route   GET /api/education
// @access  Public
const getEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({ createdAt: -1 });
    res.json(educations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new education
// @route   POST /api/education
// @access  Private (Admin)
const createEducation = async (req, res) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update education
// @route   PUT /api/education/:id  
// @access  Private (Admin)
const updateEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!education) {
      return res.status(404).json({ message: 'Education record not found' });
    }
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete education
// @route   DELETE /api/education/:id
// @access  Private (Admin)
const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({ message: 'Education record not found' });
    }
    res.json({ message: 'Education record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getEducations, 
  createEducation, 
  updateEducation, 
  deleteEducation 
};
