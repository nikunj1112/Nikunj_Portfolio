const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined while keeping uniqueness
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined while keeping uniqueness
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if user exists by username or email
userSchema.statics.findByCredentials = async function (identifier, password) {
  // Find by username or email
  const user = await this.findOne({
    $or: [
      { username: identifier },
      { email: identifier }
    ]
  });

  if (!user) {
    return null;
  }

  const isMatch = await user.matchPassword(password);
  return isMatch ? user : null;
};

module.exports = mongoose.model('User', userSchema);

