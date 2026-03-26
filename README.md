# Nikunj Rana - Full Stack MERN Developer Portfolio

A fully dynamic portfolio website with admin dashboard for managing all portfolio content.

## 🌟 Features

- **Dynamic Profile Management** - Update name, title, about, social links, resume
- 
- **Skills Management** - Full CRUD for technical skills with categories
- **Project Management** - Add, edit, delete portfolio projects
- **GitHub Integration** - Automatic fetch of repositories, stats, and languages
- **Contact Form** - Visitors can send messages stored in MongoDB
- **Admin Dashboard** - Secure JWT-based authentication
- **Modern UI** - Glassmorphism design with smooth animations
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- React Router DOM
- Axios


### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

## 📁 Project Structure

```
nikunj-rana-portfolio/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── skillController.js
│   │   ├── projectController.js
│   │   ├── messageController.js
│   │   └── githubController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Skill.js
│   │   ├── Project.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── messageRoutes.js
│   │   └── githubRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── GitHubStats.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── ManageProfile.jsx
│   │   │       ├── ManageSkills.jsx
│   │   │       ├── ManageProjects.jsx
│   │   │       └── ManageMessages.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd nikunj-rana-portfolio
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Configuration

1. **Backend - Update .env file**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret_key
   PORT=5000
   ```

2. **Frontend - Update API URL** (if needed)
   - Edit `frontend/src/services/api.js`
   - Change `API_URL` to your backend URL

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on http://localhost:5173

### Creating Admin Account

After starting the backend, create an admin user:

```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your_password"}'
```

Or use Postman/Insomnia to send a POST request to `/api/auth/create-admin`.

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Profile
- `GET /api/profile` - Get profile
- `PUT /api/profile` - Update profile (protected)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (protected)
- `PUT /api/skills/:id` - Update skill (protected)
- `DELETE /api/skills/:id` - Delete skill (protected)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Messages
- `GET /api/messages` - Get all messages (protected)
- `POST /api/messages` - Create message (public)
- `DELETE /api/messages/:id` - Delete message (protected)

### GitHub
- `GET /api/github/stats` - Get GitHub stats
- `GET /api/github/repos` - Get GitHub repositories

## 🎨 Color Palette

| Color Name | Hex Code |
|------------|----------|
| Primary Dark | #212A31 |
| Secondary Dark | #2E3944 |
| Accent | #124E66 |
| Soft Blue | #748D92 |
| Light Gray | #D3D9D4 |

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Deploy as Node.js service

### Database (MongoDB Atlas)
1. Create free cluster
2. Get connection string
3. Add to backend .env

## 📄 License

MIT License

## 👨‍💻 Developer

**Nikunj Rana**
- Role: Full Stack MERN Developer
- GitHub: https://github.com/nikunj1112

---

Made with ❤️ using MERN Stack



