import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full border-4 border-accent/30" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent"
            />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold gradient-text"
        >
          Nikunj Rana
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-light-gray/70 mt-2"
        >
          Loading Portfolio...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Loader;

