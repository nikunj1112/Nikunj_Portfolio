const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  technologies: [{
    type: String,
  }],
  githubLink: {
    type: String,
    default: '',
  },
  liveLink: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'Web Development',
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);

