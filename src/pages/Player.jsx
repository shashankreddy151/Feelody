import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMoodStyles } from '../utils/utils';
import lastfmService from '../services/lastfmService';
import LoadingAnimation from '../components/LoadingAnimation';
import FallingNotes from '../components/FallingNotes';
import Sidebar from '../components/Sidebar';
import './Player.css';

const LoadingSpinner = () => (
  <div className="inline-block">
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
);

const PlayButton = ({ isPlaying, onClick, size = "small", isLoading = false }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`play-button ${
      size === "large" ? "p-4" : "p-2"
    } ${isPlaying ? 'playing' : ''} ${
      isLoading ? 'cursor-wait' : ''
    } rounded-full transition-all transform hover:scale-105 active:scale-95 relative`}
  >
    {!isLoading && isPlaying && <div className="play-button-ring" />}
    {isLoading ? (
      <LoadingSpinner />
    ) : isPlaying ? (
      <div className="equalizer-bars">
        <div className="equalizer-bar"></div>
        <div className="equalizer-bar"></div>
        <div className="equalizer-bar"></div>
        <div className="equalizer-bar"></div>
        <div className="equalizer-bar"></div>
      </div>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
        className={`${size === "large" ? "w-8 h-8" : "w-5 h-5"} text-white`}>
        <path d="M8 5.14v14l11-7-11-7z" />
      </svg>
    )}
  </button>
);

const Player = ({ onTrackPlay, currentTrack, isPlaying, isLoadingTrack }) => {
  const navigate = useNavigate();  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isKeyboardHelpVisible, setIsKeyboardHelpVisible] = useState(false);
  const scrollContainerRef = useRef(null);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('musicFavorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('musicFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (track) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => 
        fav.name === track.name && fav.artist?.name === track.artist?.name
      );
      
      if (isAlreadyFavorite) {
        return prev.filter(fav => 
          !(fav.name === track.name && fav.artist?.name === track.artist?.name)
        );
      } else {
        return [track, ...prev].slice(0, 50); // Keep only 50 favorites max
      }
    });
  };

  const isFavorite = (track) => {
    return favorites.some(fav => 
      fav.name === track.name && fav.artist?.name === track.artist?.name
    );
  };
  const handleTrackSelect = async (track) => {
    setIsLoading(true);
    try {
      const trackInfo = await lastfmService.getTrackInfo(track);
      setSelectedTrack(trackInfo);
      onTrackPlay(track);
      
      // Add to recently played
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(t => t.name !== track.name || t.artist.name !== track.artist.name);
        return [track, ...filtered].slice(0, 20); // Keep only 20 recent tracks
      });
    } catch (error) {
      console.error('Error fetching track details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodChange = (newMood) => {
    localStorage.setItem('selectedMood', newMood);
    window.location.reload(); // Simple way to reload with new mood
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const loadMoreTracks = async () => {
    const selectedMood = localStorage.getItem('selectedMood');
    if (!selectedMood) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const moreTracks = await lastfmService.getTracksByMood(selectedMood, { page: nextPage });
      setTracks(prev => [...prev, ...moreTracks]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const isNearEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 500;
    if (isNearEnd && !isLoading) {
      loadMoreTracks();
    }
  };

  const handleBackClick = () => {
    lastfmService.clearCache();
    localStorage.removeItem('selectedMood');
    document.body.style.background = '#395C7E';
    navigate('/');
  };

  // Load tracks effect
  useEffect(() => {
    const loadTracks = async () => {
      const selectedMood = localStorage.getItem('selectedMood');
      if (!selectedMood) {
        navigate('/');
        return;
      }

      try {
        const moodTracks = await lastfmService.getTracksByMood(selectedMood);
        setTracks(moodTracks);
        const styles = getMoodStyles(selectedMood);
        document.body.style.background = styles.background;
        document.body.classList.add('mood-transition');
      } catch (error) {
        console.error('Error loading tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
    return () => {
      document.body.classList.remove('mood-transition');
    };
  }, [navigate]);

  // Global keydown event listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'ArrowRight') {
        // Ctrl + Arrow Right: Play next track
        e.preventDefault();
        const currentIndex = tracks.findIndex(track => track.id === currentTrack?.id);
        const nextTrack = tracks[currentIndex + 1] || tracks[0];
        onTrackPlay(nextTrack);
      } else if (e.ctrlKey && e.key === 'ArrowLeft') {
        // Ctrl + Arrow Left: Play previous track
        e.preventDefault();
        const currentIndex = tracks.findIndex(track => track.id === currentTrack?.id);
        const prevTrack = tracks[currentIndex - 1] || tracks[tracks.length - 1];
        onTrackPlay(prevTrack);
      } else if (e.key === 'Escape') {
        // Escape: Close sidebar
        if (isSidebarOpen) {
          e.preventDefault();
          setIsSidebarOpen(false);
        }
      } else if (e.key === '?') {
        // Toggle keyboard shortcuts help
        e.preventDefault();
        setIsKeyboardHelpVisible(prev => !prev);
      } else if (['m', 'M'].includes(e.key)) {
        // Toggle sidebar
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [tracks, currentTrack, onTrackPlay, isSidebarOpen]);

  if (isLoading && tracks.length === 0) {
    return <LoadingAnimation />;
  }
  return (
    <motion.div 
      className="player-container min-h-screen flex flex-col mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FallingNotes />
      {/* Enhanced Header */}
      <motion.div 
        className="player-header sticky top-0 z-10 p-4 md:p-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleSidebarToggle}
              className="menu-button p-3 rounded-full text-white"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
            <h1 className="player-title text-3xl md:text-4xl font-bold">
              {localStorage.getItem('selectedMood')?.charAt(0).toUpperCase() + 
               localStorage.getItem('selectedMood')?.slice(1)} Vibes
            </h1>          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setIsKeyboardHelpVisible(true)}
              className="help-button p-3 rounded-full text-white/70 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Keyboard shortcuts (Press ?)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>            </motion.button>            <motion.button 
              onClick={handleBackClick}
              className="back-button px-6 py-3 rounded-full text-white font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Moods
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="flex-1 overflow-x-hidden p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">          <section className="mb-8">
            <motion.h2 
              className="section-header text-xl md:text-2xl font-semibold mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              🎵 Recommended Tracks
            </motion.h2>
            
            <AnimatePresence mode="wait">
              <motion.div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 pb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {tracks.map((track, index) => (
                  <motion.div
                    key={`${track.artist.name}-${track.name}`}
                    className={`track-card group relative aspect-square rounded-xl overflow-hidden cursor-pointer ${
                      isPlaying && currentTrack?.id === track.id ? 'track-playing' : ''
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div onClick={() => handleTrackSelect(track)}>
                      {/* Album Art */}
                      <img 
                        src={track.image?.[3]?.['#text'] || `https://via.placeholder.com/300x300/1a1a2e/ffffff?text=${encodeURIComponent(track.name)}`}
                        alt={track.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/300x300/1a1a2e/ffffff?text=${encodeURIComponent(track.name)}`;
                        }}
                      />
                    </div>
                    
                    {/* Favorite Button */}
                    <motion.button
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm z-20 ${
                        isFavorite(track) 
                          ? 'bg-red-500/80 text-white' 
                          : 'bg-black/40 text-white/70 hover:text-white'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 + 0.2 }}
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill={isFavorite(track) ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                    </motion.button>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <PlayButton 
                        isPlaying={isPlaying && currentTrack?.id === track.id}
                        isLoading={isLoadingTrack && currentTrack?.id === track.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTrackPlay(track);
                        }}
                      />
                    </div>
                    
                    {/* Enhanced Track Info */}
                    <div className="track-info absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <h3 className="text-white font-medium text-sm md:text-base truncate mb-1">
                        {track.name}
                      </h3>
                      <p className="text-white/80 text-xs md:text-sm truncate">
                        {track.artist.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>          {/* Enhanced Selected Track Info */}
          <AnimatePresence mode="wait">
            {selectedTrack && (
              <motion.section
                key={selectedTrack.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-6 lg:gap-8"
              >
                <motion.div 
                  className="selected-track-card rounded-2xl p-6 md:p-8"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={selectedTrack.image?.[3]?.['#text'] || `https://via.placeholder.com/300x300/1a1a2e/ffffff?text=${encodeURIComponent(selectedTrack.name)}`}
                        alt={selectedTrack.name}
                        className="selected-track-image w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/300x300/1a1a2e/ffffff?text=${encodeURIComponent(selectedTrack.name)}`;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                        <PlayButton 
                          isPlaying={isPlaying && selectedTrack?.id === selectedTrack.id}
                          isLoading={isLoadingTrack}
                          onClick={() => onTrackPlay(selectedTrack)}
                          size="large"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 truncate">
                        {selectedTrack.name}
                      </h2>
                      <p className="text-white/80 text-lg md:text-xl mb-3 truncate">
                        {selectedTrack.artist.name}
                      </p>
                      {selectedTrack.listeners && (
                        <div className="flex items-center gap-2 text-white/60">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>{parseInt(selectedTrack.listeners).toLocaleString()} listeners</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedTrack.wiki?.summary && (
                    <motion.div 
                      className="mt-6 p-4 bg-white/5 rounded-lg backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="text-white font-medium mb-2">About this track</h4>
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-4">
                        {selectedTrack.wiki.summary.replace(/<[^>]*>/g, '')}
                      </p>
                    </motion.div>
                  )}
                </motion.div>

                {/* Enhanced Similar Tracks */}
                {selectedTrack.similarTracks?.length > 0 && (
                  <motion.div 
                    className="selected-track-card rounded-2xl p-6 md:p-8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="section-header text-xl md:text-2xl font-semibold mb-6">
                      🎶 Similar Tracks
                    </h3>
                    <div className="space-y-3">
                      {selectedTrack.similarTracks.slice(0, 6).map((similar, index) => (
                        <motion.div 
                          key={`${similar.artist.name}-${similar.name}`}
                          className="similar-track-item flex items-center gap-4 p-3 rounded-lg cursor-pointer group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleTrackSelect(similar)}
                        >
                          <img 
                            src={similar.image?.[1]?.['#text'] || `https://via.placeholder.com/100x100/1a1a2e/ffffff?text=${encodeURIComponent(similar.name)}`}
                            alt={similar.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/100x100/1a1a2e/ffffff?text=${encodeURIComponent(similar.name)}`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-white group-hover:text-white/90 transition-colors truncate font-medium">
                              {similar.name}
                            </div>
                            <div className="text-white/70 text-sm truncate">
                              {similar.artist.name}
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-white/40 group-hover:text-white/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </motion.div>      {/* Enhanced Loading Indicator */}
      <AnimatePresence>
        {isLoading && tracks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="loading-indicator px-6 py-3 rounded-full flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-white text-sm font-medium">Loading more tracks...</span>
            </div>
          </motion.div>
        )}      </AnimatePresence>

      {/* Enhanced Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        currentMood={localStorage.getItem('selectedMood')}
        recentlyPlayed={recentlyPlayed}
        favorites={favorites}
        onMoodChange={handleMoodChange}
        onTrackSelect={handleTrackSelect}
      />

      {/* Keyboard Shortcuts Help */}
      <AnimatePresence>
        {isKeyboardHelpVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm p-4"
          >
            <div className="max-w-3xl w-full rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6">
                <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
                  Keyboard Shortcuts
                </h2>
                <p className="text-white/90 mb-4">
                  Use these shortcuts to navigate and control the player:
                </p>
                <div className="grid grid-cols-2 gap-4 text-white">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Play/Pause</div>
                      <div className="text-xs text-white/70">Spacebar</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Next Track</div>
                      <div className="text-xs text-white/70">Ctrl + Right Arrow</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Previous Track</div>
                      <div className="text-xs text-white/70">Ctrl + Left Arrow</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Toggle Sidebar</div>
                      <div className="text-xs text-white/70">M</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 mr-3">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Close Sidebar</div>
                      <div className="text-xs text-white/70">Esc</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-4">
                <button
                  onClick={() => setIsKeyboardHelpVisible(false)}
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 transition-all px-4 py-2 text-white font-semibold"
                >
                  Got it!
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Player;
