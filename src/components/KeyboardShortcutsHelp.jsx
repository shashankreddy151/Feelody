import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './KeyboardShortcutsHelp.css';

const KeyboardShortcutsHelp = ({ isVisible, onClose }) => {
  const shortcuts = [
    { key: 'ESC', description: 'Close sidebar or help' },
    { key: '←/→', description: 'Switch between sidebar tabs' },
    { key: '↑/↓', description: 'Navigate items in active tab' },
    { key: 'Enter/Space', description: 'Select highlighted item' },
    { key: '?', description: 'Show/hide this help' },
    { key: 'M', description: 'Toggle sidebar' },
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, onClose]);

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="shortcuts-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="shortcuts-modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="shortcuts-content bg-gradient-to-br from-gray-900/95 to-purple-900/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl max-w-md w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  ⌨️ Keyboard Shortcuts
                </h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.key}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-white/80 text-sm">{shortcut.description}</span>
                    <kbd className="px-2 py-1 bg-white/20 text-white text-xs font-mono rounded border border-white/30">
                      {shortcut.key}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="mt-6 text-center text-white/60 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Press ESC or click outside to close
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcutsHelp;
