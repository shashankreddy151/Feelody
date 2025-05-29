import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { getMoodStyles } from '../utils/utils';
import FallingNotes from './FallingNotes';
import './MoodSelector.css';

const MOODS = [
  { 
    mood: 'happy', 
    icon: '😊', 
    label: 'Happy', 
    color: 'from-yellow-400/90 to-orange-500/90',
    bgGradient: 'from-yellow-200/20 via-orange-300/20 to-pink-300/20',
    description: 'Uplifting & joyful vibes'
  },
  { 
    mood: 'exuberant', 
    icon: '🤩', 
    label: 'Exuberant', 
    color: 'from-orange-400/90 to-pink-500/90',
    bgGradient: 'from-orange-200/20 via-pink-300/20 to-red-300/20',
    description: 'High energy & excitement'
  },
  { 
    mood: 'energetic', 
    icon: '⚡', 
    label: 'Energetic', 
    color: 'from-red-500/90 to-purple-600/90',
    bgGradient: 'from-red-200/20 via-purple-300/20 to-indigo-300/20',
    description: 'Power & motivation'
  },
  { 
    mood: 'frantic', 
    icon: '🤯', 
    label: 'Frantic', 
    color: 'from-purple-500/90 to-indigo-600/90',
    bgGradient: 'from-purple-200/20 via-indigo-300/20 to-blue-300/20',
    description: 'Intense & overwhelming'
  },
  { 
    mood: 'anxious', 
    icon: '😰', 
    label: 'Anxious', 
    color: 'from-blue-600/90 to-indigo-900/90',
    bgGradient: 'from-blue-200/20 via-indigo-300/20 to-purple-300/20',
    description: 'Restless & worried'
  },
  { 
    mood: 'depression', 
    icon: '😔', 
    label: 'Melancholy', 
    color: 'from-indigo-900/90 to-purple-900/90',
    bgGradient: 'from-indigo-200/20 via-purple-300/20 to-gray-400/20',
    description: 'Deep & contemplative'
  },
  { 
    mood: 'calm', 
    icon: '🧘‍♀️', 
    label: 'Calm', 
    color: 'from-green-400/90 to-teal-500/90',
    bgGradient: 'from-green-200/20 via-teal-300/20 to-cyan-300/20',
    description: 'Peaceful & serene'
  },
  { 
    mood: 'contentment', 
    icon: '☺️', 
    label: 'Content', 
    color: 'from-teal-400/90 to-cyan-500/90',
    bgGradient: 'from-teal-200/20 via-cyan-300/20 to-blue-300/20',
    description: 'Satisfied & balanced'
  },
];

const MoodSelector = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [hoveredMood, setHoveredMood] = useState(null);
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    localStorage.setItem('selectedMood', mood);
    navigate('/player');
  };

  useEffect(() => {
    if (selectedMood) {
      const styles = getMoodStyles(selectedMood);
      document.body.style.background = styles.background;
      document.body.classList.add('mood-transition');
    }
    return () => {
      document.body.classList.remove('mood-transition');
    };
  }, [selectedMood]);
  return (
    <div className="mood-selector relative z-10 px-4">
      <FallingNotes />
      
      {/* Enhanced background with animated gradients */}
      <motion.div 
        className="fixed inset-0 transition-all duration-700 ease-out"
        animate={{
          background: hoveredMood 
            ? `linear-gradient(135deg, ${MOODS.find(m => m.mood === hoveredMood)?.bgGradient}), linear-gradient(45deg, rgba(0,0,0,0.3), rgba(0,0,0,0.6))`
            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 69, 19, 0.1)), linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.7))'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 8 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Enhanced header */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center justify-center gap-6 mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span 
              className="text-6xl md:text-7xl filter drop-shadow-lg"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🎧
            </motion.span>
            <motion.h1 
              className="mood-header text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              How are you feeling?
            </motion.h1>
            <motion.span 
              className="text-6xl md:text-7xl filter drop-shadow-lg"
              animate={{ 
                rotate: [0, -5, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              🎵
            </motion.span>
          </motion.div>
          
          <motion.p
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Choose your current mood and let us curate the perfect soundtrack for your emotions
          </motion.p>
        </div>

        {/* Enhanced mood grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {MOODS.map(({ mood, icon, label, color, description }, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.8 + index * 0.1,
                ease: "easeOut"
              }}
              key={mood}
              className={`mood-card group bg-gradient-to-br ${color} backdrop-blur-xl relative overflow-hidden ${
                selectedMood === mood ? 'ring-4 ring-white/40 scale-105' : ''
              }`}
              onClick={() => handleMoodSelect(mood)}
              onHoverStart={() => setHoveredMood(mood)}
              onHoverEnd={() => setHoveredMood(null)}
              whileHover={{ 
                scale: 1.08,
                rotateY: 5,
                transition: { 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { 
                  duration: 0.1,
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }
              }}
            >
              {/* Card shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                whileHover={{
                  translateX: "200%",
                  transition: { duration: 0.6, ease: "easeInOut" }
                }}
              />
              
              {/* Card content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                <motion.div 
                  className="mood-icon text-5xl md:text-6xl mb-4 filter drop-shadow-lg"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {icon}
                </motion.div>
                
                <div className="text-center">
                  <div className="mood-label text-white text-lg md:text-xl font-semibold mb-2">
                    {label}
                  </div>
                  <motion.div 
                    className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    {description}
                  </motion.div>
                </div>
              </div>

              {/* Pulsing ring effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white/20"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <p className="text-white/60 text-sm md:text-base">
            ✨ Tap any mood to start your personalized music journey ✨
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodSelector;
