
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Use email from environment variable
    const adminEmail = process.env.EMAIL_USER || 'admin@example.com';

    // Check for existing admin by username or email
    const adminExists = await User.findOne({
      $or: [
        { username: 'Nikunj rana' },
        { email: adminEmail }
      ]
    });
    
    if (adminExists) {
      console.log('Admin user already exists');
      if (adminExists.email) {
        console.log(`Email: ${adminExists.email}`);
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Nikunj@2004', salt);
      
      const admin = await User.create({
        username: 'Nikunj rana',
        email: adminEmail,
        password: hashedPassword,
      });
      
      console.log('Admin user created successfully!');
      console.log('Username: Nikunj rana');
      console.log(`Email: ${adminEmail}`);
      console.log('Password: Nikunj@2004');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};


createAdmin();

