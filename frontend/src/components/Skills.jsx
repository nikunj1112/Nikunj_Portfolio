import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillsAPI } from '../services/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const res = await skillsAPI.getSkills();
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from database skills
  const categories = ['All', ...new Set(skills.map(skill => skill.category))];

  const filteredSkills = filter === 'All' 
    ? skills 
    : skills.filter(skill => skill.category === filter);

  return (
    <section id="skills" className="section-padding relative bg-secondary-dark/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-light-gray/70 max-w-2xl mx-auto">
            A collection of technologies and tools I work with
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                filter === category
                  ? 'bg-accent text-white'
                  : 'glass hover:bg-accent/30'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid */}
        {loading ? (
          <div className="flex justify-center">
            <div className="loader" />
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill._id || skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="glass p-6 rounded-xl text-center card-hover cursor-pointer group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {skill.icon || '💻'}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{skill.name}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-accent/20 text-accent">
                    {skill.category}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredSkills.length === 0 && !loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-light-gray/50"
          >
            No skills in this category yet.
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Skills;

