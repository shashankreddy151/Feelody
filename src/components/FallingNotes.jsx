import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import './FallingNotes.css';

const NOTE_SYMBOLS = ['♩', '♪', '♫', '♬', '𝄞'];

const FallingNotes = () => {
  const [notes, setNotes] = useState([]);
  const maxNotes = 40; // Maximum number of notes visible at once

  useEffect(() => {
    // Create a new note at a random position
    const createNote = () => {
      const note = {
        id: Math.random(),
        symbol: NOTE_SYMBOLS[Math.floor(Math.random() * NOTE_SYMBOLS.length)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        scale: 0.5 + Math.random() * 1,
        duration: 2 + Math.random() * 3
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

    // Create initial notes
    for (let i = 0; i < maxNotes / 2; i++) {
      createNote();
    }

    // Periodically create new notes
    const interval = setInterval(createNote, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="background-notes">
      <AnimatePresence>
        {notes.map(note => (
          <motion.div
            key={note.id}
            className="music-note"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0], // Increased from [0, 0.4, 0]
              scale: [0, note.scale, 0]
            }}
            transition={{ 
              duration: note.duration,
              ease: "easeInOut"
            }}
            style={{
              left: note.left,
              top: note.top
            }}
          >
            {note.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FallingNotes;