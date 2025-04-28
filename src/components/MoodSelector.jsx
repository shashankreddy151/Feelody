import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { getMoodStyles } from '../utils/utils';
import './MoodSelector.css';

const MOODS = [
  { mood: 'happy', icon: '😊', label: 'Happy', color: 'from-yellow-400/80 to-orange-500/80' },
  { mood: 'exuberant', icon: '😄', label: 'Exuberant', color: 'from-orange-400/80 to-pink-500/80' },
  { mood: 'energetic', icon: '⚡', label: 'Energetic', color: 'from-red-500/80 to-purple-600/80' },
  { mood: 'frantic', icon: '😵', label: 'Frantic', color: 'from-purple-500/80 to-indigo-600/80' },
  { mood: 'anxious', icon: '😟', label: 'Anxious/Sad', color: 'from-blue-600/80 to-indigo-900/80' },
  { mood: 'depression', icon: '😔', label: 'Depression', color: 'from-indigo-900/80 to-purple-900/80' },
  { mood: 'calm', icon: '🧘', label: 'Calm', color: 'from-green-400/80 to-teal-500/80' },
  { mood: 'contentment', icon: '😊', label: 'Contentment', color: 'from-teal-400/80 to-cyan-500/80' },
];

const MoodSelector = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [hoveredMood, setHoveredMood] = useState(null);
  const navigate = useNavigate();

  const handleMouseMove = useCallback((e) => {
    const glowEl = document.querySelector('.mood-glow');
    if (glowEl) {
      glowEl.style.setProperty('--mouse-x', `${e.clientX}px`);
      glowEl.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

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
    <div className="mood-selector relative z-10">
      <div className="mood-glow" />
      
      {/* Background gradient that changes on hover */}
      <motion.div 
        className="fixed inset-0 opacity-60 transition-all duration-500"
        animate={{
          background: hoveredMood 
            ? `linear-gradient(to bottom right, ${MOODS.find(m => m.mood === hoveredMood)?.color.split(' ')[0]}, ${MOODS.find(m => m.mood === hoveredMood)?.color.split(' ')[1]})`
            : 'linear-gradient(to bottom right, rgba(0,0,0,0.4), rgba(0,0,0,0.6))'
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-4 mb-12">
          <motion.h1 
            className="mood-header text-5xl md:text-6xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Pick Your Mood
          </motion.h1>
          <motion.span 
            className="headphones-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            🎧
          </motion.span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {MOODS.map(({ mood, icon, label, color }, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              key={mood}
              className={`mood-card bg-gradient-to-br ${color} backdrop-blur-lg ${
                selectedMood === mood ? 'ring-4 ring-white/30' : ''
              }`}
              onClick={() => handleMoodSelect(mood)}
              onHoverStart={() => setHoveredMood(mood)}
              onHoverEnd={() => setHoveredMood(null)}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="mood-icon text-4xl md:text-5xl mb-4"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {icon}
              </motion.div>
              <div className="mood-label text-white text-lg md:text-xl font-medium">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodSelector;
