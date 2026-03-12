const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, 'Stat label is required'],
    trim: true,
    maxlength: [50, 'Label cannot exceed 50 characters']
  },
  value: {
    type: String,
    required: [true, 'Stat value is required'],
    trim: true,
    maxlength: [20, 'Value cannot exceed 20 characters']
  },
  order: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Index for sorting
statsSchema.index({ order: 1 });

// Virtual for formatted display
statsSchema.virtual('formattedValue').get(function() {
  return this.value;
});

statsSchema.set('toJSON', { virtuals: true });
statsSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Stat', statsSchema);

