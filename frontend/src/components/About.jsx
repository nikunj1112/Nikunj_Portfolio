import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { profileAPI, projectsAPI, skillsAPI, statsAPI } from '../services/api';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes, statsRes] = await Promise.all([
          profileAPI.getProfile(),
          projectsAPI.getProjects(),
          skillsAPI.getSkills(),
          statsAPI.getStats(),
        ]);
        setProfile(profileRes.data);
        setStatsData(statsRes.data.map(stat => ({ label: stat.label, value: stat.value }))); // Use all stats directly from MongoDB, sorted by order
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  const statItems = statsData;

  return (
    <section id="about" className="section-padding relative">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-light-gray/70 max-w-2xl mx-auto">
            Get to know more about me and my journey as a developer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-accent rounded-2xl" />
              <div className="relative glass rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent to-soft-blue flex items-center justify-center">
                    {profile?.profileImage ? (
                      <img 
                        src={profile.profileImage} 
                        alt={profile.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-primary-dark">
                        {profile?.name?.charAt(0) || 'N'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{profile?.name || 'Your Name'}</h3>
                  <p className="text-accent">{profile?.title || 'Full Stack Developer'}</p>
                  {profile?.location && (
                    <p className="text-light-gray/60 mt-2 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6">
              Passionate About Building <span className="text-accent">Amazing Web Experiences</span>
            </h3>
            <p className="text-light-gray/70 mb-6 leading-relaxed">
              {profile?.about || 'I am a dedicated Full Stack MERN Developer with a passion for creating efficient, scalable, and user-friendly web applications. With expertise in React, Node.js, MongoDB, and Express, I have successfully delivered multiple projects that meet client requirements and provide exceptional user experiences.'}
            </p>
            <p className="text-light-gray/70 mb-8 leading-relaxed">
              My journey in web development started with a curiosity for building things, and it has evolved into a professional career where I continuously learn and adapt to new technologies. I believe in writing clean, maintainable code and following best practices.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {statItems.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass p-4 rounded-xl text-center"
                >
                  <div className="text-3xl font-bold text-accent">{stat.value}</div>
                  <div className="text-sm text-light-gray/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

