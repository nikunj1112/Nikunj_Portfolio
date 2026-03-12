import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profileAPI, skillsAPI, projectsAPI, messagesAPI, educationAPI, githubAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    messages: 0,
    githubStats: null,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [skillsRes, projectsRes, messagesRes, educationRes, githubRes, profileRes] = await Promise.all([
        skillsAPI.getSkills(),
        projectsAPI.getProjects(),
        messagesAPI.getMessages(),
        educationAPI.getEducations(),
        githubAPI.getStats(),
        profileAPI.getProfile(),
      ]);
      const educations = educationRes.data || [];

      console.log('Dashboard Stats:', {
        skills: skillsRes.data,
        projects: projectsRes.data,
        messages: messagesRes.data,
        github: githubRes.data,
        profile: profileRes.data
      });

  setStats({
        skills: skillsRes.data?.length || 0,
        projects: projectsRes.data?.length || 0,
        messages: messagesRes.data?.length || 0,
        educations,
        githubStats: githubRes.data,
      });
      
      // Get recent projects (latest 3)
       setRecentProjects(projectsRes.data?.slice(0, 3) || []);
      
      // Get profile
      if (profileRes.data) {
        setProfile(profileRes.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
      console.error('Error response:', err.response?.data);
      setError('Failed to load dashboard data. Please make sure the backend is running on port 3030.');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Skills', value: stats.skills, icon: '💼', color: 'from-blue-500 to-blue-600' },
    { label: 'Total Projects', value: stats.projects, icon: '🚀', color: 'from-purple-500 to-purple-600' },
    { label: 'Messages', value: stats.messages, icon: '💬', color: 'from-green-500 to-green-600' },
    { label: 'Education Records', value: stats.educations?.length || 0, icon: '🎓', color: 'from-indigo-500 to-indigo-600' },
    { label: 'GitHub Followers', value: stats.githubStats?.followers || 0, icon: '🐙', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {profile?.name || 'Admin'}! 👋
        </h1>
        <p className="text-light-gray/70">Here's what's happening with your portfolio today</p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400"
        >
          <p>{error}</p>
          <button
            onClick={loadStats}
            className="mt-2 px-4 py-2 bg-red-500/30 rounded hover:bg-red-500/40"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-light-gray/70 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recent Projects Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Recent Projects</h2>
          <Link
            to="/admin/projects"
            className="text-accent hover:text-accent/80 text-sm"
          >
            View All →
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="loader" />
          </div>
        ) : recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map((project, index) => (
              <motion.div
                key={project._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="glass rounded-xl overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-accent/20 to-soft-blue/20 flex items-center justify-center">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">🚀</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{project.title}</h3>
                  <p className="text-light-gray/70 text-sm line-clamp-2 mb-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies?.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-secondary-dark">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-light-gray/70 mb-4">No projects yet. Start adding your work!</p>
            <Link
              to="/admin/projects"
              className="btn-primary inline-block"
            >
              + Add Your First Project
            </Link>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/projects"
            className="glass rounded-xl p-6 hover:bg-accent/20 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="font-semibold">Add New Project</h3>
                <p className="text-light-gray/70 text-sm">Showcase your latest work</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/skills"
            className="glass rounded-xl p-6 hover:bg-accent/20 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">💼</span>
              </div>
              <div>
                <h3 className="font-semibold">Manage Skills</h3>
                <p className="text-light-gray/70 text-sm">Update your skills</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/education"
            className="glass rounded-xl p-6 hover:bg-accent/20 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎓</span>
              </div>
              <div>
                <h3 className="font-semibold">Manage Education</h3>
                <p className="text-light-gray/70 text-sm">Add your education records</p>
              </div>
            </div>
          </Link>
          <Link
            to="/admin/messages"
            className="glass rounded-xl p-6 hover:bg-accent/20 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold">View Messages</h3>
                <p className="text-light-gray/70 text-sm">{stats.messages} new messages</p>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

