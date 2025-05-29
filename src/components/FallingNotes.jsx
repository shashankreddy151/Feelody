import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import './FallingNotes.css';

const NOTE_SYMBOLS = ['♩', '♪', '♫', '♬', '𝄞', '𝄢', '𝄟', '𝄠', '♯', '♭'];
const COLORS = [
  'rgba(255, 255, 255, 0.8)',
  'rgba(59, 130, 246, 0.7)',
  'rgba(147, 51, 234, 0.7)',
  'rgba(236, 72, 153, 0.7)',
  'rgba(245, 158, 11, 0.7)',
  'rgba(34, 197, 94, 0.7)',
];

const FallingNotes = () => {
  const [notes, setNotes] = useState([]);
  const maxNotes = 25; // Reduced for better performance

  useEffect(() => {
    // Create a new note at a random position
    const createNote = () => {
      const note = {
        id: Math.random(),
        symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        scale: 0.4 + Math.random() * 1.2,
        duration: 3 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        blur: Math.random() * 2,
      };

      setNotes(prev => {
        // Remove oldest note if we've reached the maximum
        if (prev.length >= maxNotes) {
          const [_, ...rest] = prev;
          return [...rest, note];
        }
        return [...prev, note];
      });

      // Remove the note after its duration
      setTimeout(() => {
        setNotes(prev => prev.filter(n => n.id !== note.id));
      }, note.duration * 1000);
    };

    // Create initial notes with staggered timing
    for (let i = 0; i < maxNotes / 3; i++) {
      setTimeout(() => createNote(), i * 200);
    }

    // Periodically create new notes
    const interval = setInterval(createNote, 1500);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="background-notes">
      <AnimatePresence>
        {notes.map(note => (
          <motion.div
            key={note.id}
            className="music-note"
            initial={{ 
              opacity: 0, 
              scale: 0,
              rotate: note.rotation,
              filter: `blur(${note.blur}px)`
            }}
            animate={{ 
              opacity: [0, 0.8, 0.6, 0], 
              scale: [0, note.scale * 0.8, note.scale, 0],
              rotate: [note.rotation, note.rotation + 180, note.rotation + 360],
              y: [0, -50, -100],
              x: [0, Math.sin(Date.now() + note.id) * 20, Math.cos(Date.now() + note.id) * 30],
            }}
            transition={{ 
              duration: note.duration,
              ease: "easeOut",
              times: [0, 0.2, 0.8, 1]
            }}
            style={{
              left: note.left,
              top: note.top,
              color: note.color,
              textShadow: `0 0 10px ${note.color}, 0 0 20px ${note.color}40`,
            }}
          >
            {note.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Additional ambient effects */}
      <div className="ambient-glow">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="glow-orb"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
              x: [0, 100, -50, 0],
              y: [0, -80, -40, 0],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FallingNotes;