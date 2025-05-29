import { motion } from 'framer-motion';
import FallingNotes from './FallingNotes';

const LoadingAnimation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <FallingNotes />
      
      {/* Enhanced Loading Container */}
      <motion.div 
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >        {/* Enhanced Bright Glassmorphism Container */}
        <div className="bg-gradient-to-br from-white/20 via-blue-400/20 to-purple-500/20 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-500/10 to-pink-400/10 rounded-3xl blur-xl"></div>
          
          {/* Music Note Icon */}
          <motion.div 
            className="flex justify-center mb-8 relative z-10"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/40 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>              <svg className="w-10 h-10 text-white relative z-10 filter drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          </motion.div>

          {/* Enhanced Bright Loading Dots */}
          <motion.div 
            className="flex gap-6 justify-center mb-8 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 shadow-xl border border-white/50"
                animate={{
                  y: [-16, 0, -16],
                  scale: [0.8, 1.3, 0.8],
                  opacity: [0.4, 1, 0.4],
                  boxShadow: [
                    '0 4px 15px rgba(59, 130, 246, 0.3)',
                    '0 8px 25px rgba(168, 85, 247, 0.6)',
                    '0 4px 15px rgba(59, 130, 246, 0.3)'
                  ]
                }}                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Enhanced Bright Loading Text */}
          <motion.div 
            className="text-center relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-3 filter drop-shadow-lg">
              Loading Your Vibes
            </h2>
            <p className="text-white/90 text-base font-medium">
              Curating the perfect mood for you...
            </p>
          </motion.div>

          {/* Enhanced Bright Progress Ring */}
          <motion.div 
            className="flex justify-center mt-10 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  stroke="url(#brightGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
                  }}
                />
                <defs>
                  <linearGradient id="brightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="33%" stopColor="#a855f7" />
                    <stop offset="66%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Bright Floating Elements */}
        <motion.div
          className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-blue-400/40 to-purple-500/40 rounded-full blur-sm shadow-xl"
          animate={{
            y: [-15, 15, -15],
            x: [-8, 8, -8],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-purple-400/40 via-pink-400/40 to-orange-400/40 rounded-full blur-sm shadow-xl"
          animate={{
            y: [15, -15, 15],
            x: [8, -8, 8],
            scale: [1.3, 1, 1.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-4 w-8 h-8 bg-gradient-to-br from-green-400/30 to-blue-400/30 rounded-full blur-sm shadow-lg"
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute top-2/3 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400/30 to-red-400/30 rounded-full blur-sm shadow-lg"
          animate={{
            y: [8, -8, 8],
            x: [3, -3, 3],
            scale: [1.1, 1, 1.1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;