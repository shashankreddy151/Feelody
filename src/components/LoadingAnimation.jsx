import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div 
        className="flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-white rounded-full"
            animate={{
              y: [-10, 0, -10],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;