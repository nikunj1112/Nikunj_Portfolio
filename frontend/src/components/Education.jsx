import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { educationAPI } from '../services/api';
import { FaGraduationCap, FaUniversity, FaCalendarAlt, FaBook, FaAward } from 'react-icons/fa';

const Education = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEducations();
  }, []);

  const loadEducations = async () => {
    try {
      const res = await educationAPI.getEducations();
      setEducations(res.data || []);
    } catch (err) {
      console.error('Error loading educations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom flex justify-center">
          <div className="loader" />
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="section-padding relative bg-secondary-dark/30">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block mb-8 p-4 bg-accent/20 rounded-2xl"
          >
            <FaGraduationCap className="text-5xl text-accent" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Education</span>
          </h2>
          <p className="text-light-gray/70 max-w-2xl mx-auto">
            Academic journey and certifications
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <AnimatePresence>
            {educations.map((education, index) => (
              <motion.div
                key={education._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="glass rounded-3xl p-8 h-full border border-accent/30 hover:border-accent/50 hover:bg-accent/5 transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-3">
                  {/* Card header with icon */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-accent to-soft-blue rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FaUniversity className="text-2xl text-primary-dark" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold rounded-full">
                          {education.startYear}-{education.endYear || 'Present'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2 leading-tight">
                        {education.degree}
                      </h3>
                    </div>
                  </div>

                  {/* Institution */}
                  <div className="flex items-center gap-3 mb-6 p-3 bg-secondary-dark/50 rounded-2xl">
                    <FaBook className="text-accent text-xl" />
                    <h4 className="font-bold text-light-gray group-hover:text-accent transition-colors">
                      {education.institution}
                    </h4>
                  </div>

                  {/* Description */}
                  {education.description && (
                    <p className="text-light-gray/80 mb-6 leading-relaxed text-sm">
                      {education.description}
                    </p>
                  )}

                  {/* Stats ribbon */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-accent to-soft-blue text-primary-dark text-xs font-bold px-4 py-2 rounded-bl-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <FaAward className="inline mr-1" /> Degree
                  </div>

                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-soft-blue/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10" />
                  
                  {/* Bottom gradient line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-transparent to-soft-blue rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {educations.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full md:col-span-2 text-center py-24"
            >
              <div className="w-32 h-32 mx-auto mb-8 glass rounded-3xl flex items-center justify-center text-4xl shadow-2xl border-2 border-dashed border-accent/50 animate-pulse">
                <FaGraduationCap className="text-accent" />
              </div>
              <h3 className="text-3xl font-bold mb-6 text-light-gray/60">
                No Education Records
              </h3>
              <p className="text-light-gray/70 max-w-md mx-auto">
                Add education details via admin panel
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Education;
