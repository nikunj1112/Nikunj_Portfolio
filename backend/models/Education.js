const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  startYear: {
    type: String,
    default: '',
  },
  endYear: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Education', educationSchema);
