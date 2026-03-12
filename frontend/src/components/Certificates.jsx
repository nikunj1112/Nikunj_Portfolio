import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import { certificateAPI } from '../services/api';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const response = await certificateAPI.getCertificates();
      setCertificates(response.data || []);
    } catch (error) {
      console.error('Error loading certificates:', error);
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
    <section id="certificates" className="section-padding bg-secondary-dark/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Certifications & <span className="gradient-text">Achievements</span>
          </h2>
          <p className="text-light-gray/70 max-w-2xl mx-auto">
            Verified certificates showcasing technical expertise
          </p>
        </motion.div>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="glass rounded-2xl p-6 h-full flex flex-col border border-white/20 hover:border-accent/60 transition-all duration-700 relative overflow-hidden bg-gradient-to-b from-transparent via-white/5 hover:via-accent/5 to-transparent hover:shadow-[0_25px_50px_-12px_rgba(18,78,102,0.4)] hover:shadow-accent/30 hover:-translate-y-3 hover:rotate-[1deg] hover:scale-[1.02] cursor-pointer">
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/30 via-transparent to-gradient-purple/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl scale-150" />
                  
                  {/* Top Image */}
                  <div className="mb-6 relative z-10">
                    {cert.image ? (
                      <div className="h-32 w-full rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={cert.image} 
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-32 rounded-xl bg-gradient-to-br from-accent/20 to-gradient-purple/20 flex items-center justify-center group-hover:from-accent/30 group-hover:to-gradient-purple/30 transition-all duration-500">
                        <FaImage className="text-4xl text-light-gray/50 group-hover:text-accent" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 relative z-10">
                    <h3 className="font-black text-xl mb-3 line-clamp-2 bg-gradient-to-r from-white via-light-gray/90 to-accent bg-clip-text text-transparent group-hover:from-white group-hover:to-gradient-purple transition-all duration-500">
                      {cert.title}
                    </h3>
                    <h4 className="text-white/50 font-bold text-lg mb-4 drop-shadow-md">
                      {cert.organization}
                    </h4>
                    {cert.description && (
                      <p className="text-light-gray/85 text-sm leading-relaxed line-clamp-3 mb-6">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/10 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 backdrop-blur-sm rounded-xl border border-accent/30">
                        <FaCalendarAlt className="text-white/60 text-sm" />
                        <span className="text-sm font-semibold text-white/60">
                          {new Date(cert.issueDate).getFullYear()}
                        </span>
                      </div>
                    </div>
                    {cert.certificateLink && (
                      <a
                        href={cert.certificateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group-hover/btn flex items-center gap-2 w-full bg-gradient-to-r from-accent/90 to-gradient-purple/90 hover:from-accent hover:to-gradient-purple text-white font-bold py-3 px-5 rounded-xl shadow-lg hover:shadow-accent/50 hover:scale-105 hover:-translate-y-1 transition-all duration-500 backdrop-blur-sm border border-accent/50 group-hover/btn:bg-opacity-100"
                      >
                        <span>View Certificate</span>
                        <FaExternalLinkAlt className="text-sm group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="mx-auto w-28 h-28 glass rounded-3xl flex items-center justify-center shadow-2xl mb-8 bg-gradient-to-br from-accent/20 to-gradient-purple/20">
              <FaCertificate className="text-5xl text-accent" />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-light-gray/60">
              No Certificates Added
            </h3>
            <p className="text-light-gray/70 max-w-lg mx-auto">
              Add your achievements through the admin panel
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Certificates;

