import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getMoodStyles } from '../utils/utils';

const Player = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    localStorage.removeItem('selectedMood');
    document.body.style.background = '#395C7E';
    navigate('/');
  };

  useEffect(() => {
    const selectedMood = localStorage.getItem('selectedMood');
    if (selectedMood) {
      const styles = getMoodStyles(selectedMood);
      document.body.style.background = styles.background;
      document.body.classList.add('mood-transition');
    }
    return () => {
      document.body.classList.remove('mood-transition');
    };
  }, []);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white/20 backdrop-blur-lg rounded-lg p-8 w-full max-w-md"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold text-white mb-4">Music Player</h1>
        <button 
          onClick={handleBackClick}
          className="px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
        >
          Back to Mood Selection
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Player;
