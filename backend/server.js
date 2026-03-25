const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const upload = require('./middleware/multerConfig');
app.use('/uploads', express.static('uploads'));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/education', require('./routes/educationRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/github', require('./routes/githubRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Seed route for initial data (run once)
const seedDatabase = async () => {
  const Skill = require('./models/Skill');
  const Project = require('./models/Project');
  const Profile = require('./models/Profile');
  const User = require('./models/User');
  const Message = require('./models/Message');
  const bcrypt = require('bcryptjs');

  try {
    // Clear existing data
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Message.deleteMany({});

    // Check if admin exists, if not create one (supports both username and email)
    // Use email from environment variable
    const adminEmail = process.env.EMAIL_USER || 'admin@example.com';
    let admin = await User.findOne({ username: 'Nikunj rana' });
    if (!admin) {
      // Also check by email from env
      admin = await User.findOne({ email: adminEmail });
    }

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Nikunj@2004', salt);
      admin = await User.create({
        username: 'Nikunj rana',
        email: adminEmail,
        password: hashedPassword,
      });
      console.log(`Admin user created: Nikunj rana / ${adminEmail} / Nikunj@2004`);
    } else {
      console.log('Admin user already exists');
    }

    // Seed Skills
    const skills = [
      { name: 'React', icon: '⚛️', category: 'Frontend' },
      { name: 'Node.js', icon: '🟢', category: 'Backend' },
      { name: 'Express', icon: '🚀', category: 'Backend' },
      { name: 'MongoDB', icon: '🍃', category: 'Database' },
      { name: 'JavaScript', icon: '📜', category: 'Frontend' },
      { name: 'TypeScript', icon: '💠', category: 'Frontend' },
      { name: 'Tailwind CSS', icon: '💨', category: 'Frontend' },
      { name: 'Git', icon: '📊', category: 'Tools' },
      { name: 'HTML', icon: '📄', category: 'Frontend' },
      { name: 'CSS', icon: '🎨', category: 'Frontend' },
      { name: 'Python', icon: '🐍', category: 'Backend' },
      { name: 'Docker', icon: '🐳', category: 'Tools' },
    ];
    await Skill.insertMany(skills);
    console.log('Skills seeded');

    // Seed Projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with cart, checkout, and payment integration.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        githubLink: 'https://github.com/nikunj1112',
        liveLink: 'https://example.com',
        category: 'Full Stack',
      },
      {
        title: 'Social Media App',
        description: 'A social media application with real-time messaging, posts, and user authentication.',
        technologies: ['React', 'Socket.io', 'MongoDB', 'Express'],
        githubLink: 'https://github.com/nikunj1112',
        liveLink: 'https://example.com',
        category: 'Web Development',
      },
      {
        title: 'Task Management System',
        description: 'Collaborative task management tool with drag-and-drop kanban boards.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Redux'],
        githubLink: 'https://github.com/nikunj1112',
        liveLink: 'https://example.com',
        category: 'Web Development',
      },
      {
        title: 'Portfolio Website',
        description: 'A modern portfolio website with glassmorphism design and animations.',
        technologies: ['React', 'Tailwind CSS', 'Framer Motion'],
        githubLink: 'https://github.com/nikunj1112',
        liveLink: 'https://example.com',
        category: 'Web Development',
      },
    ];
    await Project.insertMany(projects);
    console.log('Projects seeded');

    // Seed Profile
    const profile = {
      name: 'Nikunj Rana',
      title: 'Full Stack Developer',
      about: 'I am a passionate Full Stack Developer with expertise in building modern web applications. I love creating beautiful and functional websites using the latest technologies.',
      email: 'nikunj@example.com',
      location: 'India',
      github: 'https://github.com/nikunj1112',
      linkedin: 'https://linkedin.com/in/nikunj1112',
      profileImage: '',
      resume: '',
    };

    await Profile.deleteMany({});
    await Profile.create(profile);
    console.log('Profile seeded');

    console.log('All data seeded successfully!');
    return true;
  } catch (err) {
    console.error('Seed error:', err);
    return false;
  }
};

// Seed endpoint
app.post('/api/seed', async (req, res) => {
  const result = await seedDatabase();
  const adminEmail = process.env.EMAIL_USER || 'admin@example.com';
  if (result) {
    res.json({ message: 'Database seeded successfully!', credentials: `Nikunj rana / ${adminEmail} / Nikunj@2004` });
  } else {
    res.status(500).json({ message: 'Error seeding database' });
  }
});


const PORT = process.env.PORT || 3030;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Auto-create admin user on server start
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');

  try {
    const adminEmail = process.env.EMAIL_USER || '8891nikunjrana@gmail.com';
    const adminUsername = 'Nikunj rana';
    const adminPassword = 'Nikunj@2004';

    // Check if admin exists
    const adminExists = await User.findOne({
      $or: [
        { username: adminUsername },
        { email: adminEmail }
      ]
    });

    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword
      });


    }
  } catch (err) {
    console.error('Admin creation error:', err.message);
  }
});

