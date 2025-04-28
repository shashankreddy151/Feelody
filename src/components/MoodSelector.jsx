import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { getMoodStyles } from '../utils/utils';
import './MoodSelector.css';

const MoodSelector = () => {
  const [selectedMood, setSelectedMood] = useState(null);
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
    <div className="mood-selector">
      <div className="flex items-center justify-center gap-4 mb-12">
        <h1 className="mood-header text-5xl font-bold">Pick Your Mood</h1>
        <span className="headphones-icon">🎧</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { mood: 'happy', icon: '😊', label: 'Happy' },
          { mood: 'exuberant', icon: '😄', label: 'Exuberant' },
          { mood: 'energetic', icon: '⚡', label: 'Energetic' },
          { mood: 'frantic', icon: '😵', label: 'Frantic' },
          { mood: 'anxious', icon: '😟', label: 'Anxious/Sad' },
          { mood: 'depression', icon: '😔', label: 'Depression' },
          { mood: 'calm', icon: '🧘', label: 'Calm' },
          { mood: 'contentment', icon: '😊', label: 'Contentment' },
        ].map(({ mood, icon, label }) => (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={mood}
            className={`mood-card ${selectedMood === mood ? 'selected' : ''}`}
            onClick={() => handleMoodSelect(mood)}
          >
            <div className="mood-icon">{icon}</div>
            <div className="mood-label">{label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;
