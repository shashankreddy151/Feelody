import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';

const Sidebar = ({ 
  isOpen = false, 
  onClose, 
  currentMood = null, 
  recentlyPlayed = [], 
  favorites = [], 
  onMoodChange,
  onTrackSelect 
}) => {
  const [activeTab, setActiveTab] = useState('moods');
  const [isVisible, setIsVisible] = useState(isOpen);
  const [selectedMoodIndex, setSelectedMoodIndex] = useState(0);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);

  const quickMoods = [
    { mood: 'happy', icon: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-500' },
    { mood: 'calm', icon: '🧘‍♀️', label: 'Calm', color: 'from-green-400 to-teal-500' },
    { mood: 'energetic', icon: '⚡', label: 'Energetic', color: 'from-red-500 to-purple-600' },
    { mood: 'melancholy', icon: '😔', label: 'Melancholy', color: 'from-indigo-900 to-purple-900' },
  ];

  const tabs = [
    { id: 'moods', label: 'Quick Moods', icon: '🎭' },
    { id: 'recent', label: 'Recent', icon: '🕒' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' }
  ];

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e) => {
    if (!isVisible) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose?.();
        break;
        
      case 'ArrowLeft':
      case 'ArrowRight':
        e.preventDefault();
        const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
        const nextTabIndex = e.key === 'ArrowRight' 
          ? (currentTabIndex + 1) % tabs.length
          : (currentTabIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[nextTabIndex].id);
        setSelectedMoodIndex(0);
        setSelectedTrackIndex(0);
        break;
        
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        if (activeTab === 'moods') {
          const nextIndex = e.key === 'ArrowDown'
            ? (selectedMoodIndex + 1) % quickMoods.length
            : (selectedMoodIndex - 1 + quickMoods.length) % quickMoods.length;
          setSelectedMoodIndex(nextIndex);
        } else if (activeTab === 'recent' && recentlyPlayed.length > 0) {
          const nextIndex = e.key === 'ArrowDown'
            ? (selectedTrackIndex + 1) % Math.min(recentlyPlayed.length, 8)
            : (selectedTrackIndex - 1 + Math.min(recentlyPlayed.length, 8)) % Math.min(recentlyPlayed.length, 8);
          setSelectedTrackIndex(nextIndex);
        } else if (activeTab === 'favorites' && favorites.length > 0) {
          const nextIndex = e.key === 'ArrowDown'
            ? (selectedTrackIndex + 1) % Math.min(favorites.length, 8)
            : (selectedTrackIndex - 1 + Math.min(favorites.length, 8)) % Math.min(favorites.length, 8);
          setSelectedTrackIndex(nextIndex);
        }
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeTab === 'moods') {
          handleMoodSelect(quickMoods[selectedMoodIndex].mood);
        } else if (activeTab === 'recent' && recentlyPlayed.length > 0) {
          handleTrackPlay(recentlyPlayed[selectedTrackIndex]);
        } else if (activeTab === 'favorites' && favorites.length > 0) {
          handleTrackPlay(favorites[selectedTrackIndex]);
        }
        break;
        
      case 'Tab':
        // Allow default tab behavior for better accessibility
        break;
        
      default:
        break;
    }
  }, [isVisible, activeTab, selectedMoodIndex, selectedTrackIndex, quickMoods, recentlyPlayed, favorites, onClose, handleMoodSelect, handleTrackPlay, tabs]);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) {
      setSelectedMoodIndex(0);
      setSelectedTrackIndex(0);
      // Add keyboard event listener when sidebar opens
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // Remove keyboard event listener when sidebar closes
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleMoodSelect = (mood) => {
    onMoodChange?.(mood);
    onClose?.();
  };

  const handleTrackPlay = (track) => {
    onTrackSelect?.(track);
    onClose?.();
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedMoodIndex(0);
    setSelectedTrackIndex(0);
  };

  const sidebarVariants = {
    hidden: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      }
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            className="sidebar-overlay fixed inset-0 z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Sidebar Container */}
          <motion.aside
            className="sidebar fixed left-0 top-0 h-full z-50 w-80"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Enhanced Header */}
            <div className="sidebar-header flex items-center justify-between p-6">
              <motion.h2 
                className="sidebar-title text-xl font-bold text-white"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                🎵 Music Hub
              </motion.h2>
              <motion.button
                className="close-button p-2 rounded-full"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3 }}
              >
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Enhanced Tab Navigation */}
            <div className="tab-navigation flex mb-6 mx-6">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  className={`tab-button flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                  onClick={() => handleTabChange(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <span className="mr-1">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Content Area */}
            <div className="sidebar-content flex-1 overflow-y-auto px-6 pb-6">
              <AnimatePresence mode="wait">
                {/* Quick Moods Tab */}
                {activeTab === 'moods' && (
                  <motion.div
                    key="moods"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="section-title text-white/80 text-sm font-semibold mb-4">
                      Quick Mood Switch
                    </h3>                    {quickMoods.map((mood, index) => (
                      <motion.div
                        key={mood.mood}
                        className={`mood-item p-3 rounded-xl cursor-pointer transition-all ${
                          currentMood === mood.mood ? 'active' : ''
                        } ${selectedMoodIndex === index && activeTab === 'moods' ? 'keyboard-selected' : ''}`}
                        onClick={() => handleMoodSelect(mood.mood)}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{mood.icon}</span>
                          <div className="flex-1">
                            <div className="text-white font-medium">{mood.label}</div>
                            <div className="text-white/60 text-xs">Switch to {mood.label.toLowerCase()} vibes</div>
                          </div>
                          {currentMood === mood.mood && (
                            <motion.div
                              className="current-indicator w-2 h-2 bg-white rounded-full"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              layoutId="activeMood"
                            />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Recently Played Tab */}
                {activeTab === 'recent' && (
                  <motion.div
                    key="recent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="section-title text-white/80 text-sm font-semibold mb-4">
                      Recently Played
                    </h3>
                    {recentlyPlayed.length > 0 ? (                      recentlyPlayed.slice(0, 8).map((track, index) => (
                        <motion.div
                          key={`${track.artist?.name || 'unknown'}-${track.name}`}
                          className={`track-item p-3 rounded-lg cursor-pointer ${
                            selectedTrackIndex === index && activeTab === 'recent' ? 'keyboard-selected' : ''
                          }`}
                          onClick={() => handleTrackPlay(track)}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={track.image?.[1]?.['#text'] || `https://via.placeholder.com/40x40/1a1a2e/ffffff?text=${encodeURIComponent(track.name.charAt(0))}`}
                              alt={track.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/40x40/1a1a2e/ffffff?text=${encodeURIComponent(track.name.charAt(0))}`;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-medium truncate">
                                {track.name}
                              </div>
                              <div className="text-white/60 text-xs truncate">
                                {track.artist?.name || 'Unknown Artist'}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        className="empty-state text-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="text-4xl mb-2">🎵</div>
                        <div className="text-white/60 text-sm">No recent tracks yet</div>
                        <div className="text-white/40 text-xs mt-1">Start playing music to see your history</div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Favorites Tab */}
                {activeTab === 'favorites' && (
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <h3 className="section-title text-white/80 text-sm font-semibold mb-4">
                      Your Favorites
                    </h3>
                    {favorites.length > 0 ? (                      favorites.slice(0, 8).map((track, index) => (
                        <motion.div
                          key={`${track.artist?.name || 'unknown'}-${track.name}`}
                          className={`track-item p-3 rounded-lg cursor-pointer ${
                            selectedTrackIndex === index && activeTab === 'favorites' ? 'keyboard-selected' : ''
                          }`}
                          onClick={() => handleTrackPlay(track)}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={track.image?.[1]?.['#text'] || `https://via.placeholder.com/40x40/1a1a2e/ffffff?text=${encodeURIComponent(track.name.charAt(0))}`}
                              alt={track.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://via.placeholder.com/40x40/1a1a2e/ffffff?text=${encodeURIComponent(track.name.charAt(0))}`;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-white text-sm font-medium truncate">
                                {track.name}
                              </div>
                              <div className="text-white/60 text-xs truncate">
                                {track.artist?.name || 'Unknown Artist'}
                              </div>
                            </div>
                            <motion.div
                              className="favorite-indicator text-red-400"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.8 + index * 0.05 }}
                            >
                              ❤️
                            </motion.div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        className="empty-state text-center py-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="text-4xl mb-2">❤️</div>
                        <div className="text-white/60 text-sm">No favorites yet</div>
                        <div className="text-white/40 text-xs mt-1">Like tracks to add them here</div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced Footer */}
            <motion.div
              className="sidebar-footer p-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-white/40 text-xs mb-2">
                  🎵 Feelody Music Player
                </div>
                <div className="text-white/30 text-xs">
                  Discover music through emotions
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;