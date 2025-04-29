import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getMoodStyles } from '../utils/utils';
import lastfmService from '../services/lastfmService';
import audiusService from '../services/audiusService';
import LoadingAnimation from '../components/LoadingAnimation';
import FallingNotes from '../components/FallingNotes';
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
    className={`${
      size === "large" ? "p-4" : "p-2"
    } bg-white/20 hover:bg-white/30 rounded-full transition-all transform hover:scale-105 active:scale-95 ${
      isLoading ? 'cursor-wait' : ''
    }`}
  >
    {isLoading ? (
      <LoadingSpinner />
    ) : isPlaying ? (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
        className={`${size === "large" ? "w-8 h-8" : "w-5 h-5"} text-white`}>
        <path d="M6.75 5.25h2v13.5h-2v-13.5zm8.5 0h2v13.5h-2v-13.5z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
        className={`${size === "large" ? "w-8 h-8" : "w-5 h-5"} text-white`}>
        <path d="M8 5.14v14l11-7-11-7z" />
      </svg>
    )}
  </button>
);

const Player = ({ onTrackPlay, currentTrack, isPlaying, isLoadingTrack }) => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [artistInfo, setArtistInfo] = useState(null);
  const scrollContainerRef = useRef(null);

  const handleTrackSelect = async (track) => {
    setIsLoading(true);
    try {
      const [trackInfo, artistDetails] = await Promise.all([
        lastfmService.getTrackInfo(track),
        lastfmService.getArtistInfo(track.artist.name)
      ]);
      setSelectedTrack(trackInfo);
      setArtistInfo(artistDetails);
      onTrackPlay(track);
    } catch (error) {
      console.error('Error fetching track details:', error);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading && tracks.length === 0) {
    return <LoadingAnimation />;
  }

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-gradient-to-b from-black/40 to-black/60 mt-8" // Reduced from mt-16 to mt-8
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FallingNotes />
      {/* Header with floating effect */}
      <motion.div 
        className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 p-4 md:p-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">
            {localStorage.getItem('selectedMood')?.charAt(0).toUpperCase() + 
             localStorage.getItem('selectedMood')?.slice(1)} Vibes
          </h1>
          <button 
            onClick={handleBackClick}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
          >
            Back
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="flex-1 overflow-x-hidden p-4 md:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <section className="mb-8">
            <motion.h2 
              className="text-xl font-semibold text-white/90 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Recommended Tracks
            </motion.h2>
            
            <AnimatePresence mode="wait">
              <motion.div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {tracks.map((track, index) => (
                  <motion.div
                    key={`${track.artist.name}-${track.name}`}
                    className="group relative aspect-square bg-white/5 rounded-md overflow-hidden cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.02]"
                  >
                    <div onClick={() => handleTrackSelect(track)}>
                      {/* Album Art */}
                      <img 
                        src={track.image?.[3]?.['#text'] || `https://via.placeholder.com/300?text=${encodeURIComponent(track.name)}`}
                        alt={track.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/300?text=${encodeURIComponent(track.name)}`;
                        }}
                      />
                      
                      {/* Hover Overlay - Dark vintage effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayButton 
                        isPlaying={isPlaying && currentTrack?.id === track.id}
                        isLoading={isLoadingTrack && currentTrack?.id === track.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTrackPlay(track);
                        }}
                      />
                    </div>
                    
                    {/* Track Info Container */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-medium text-sm sm:text-base truncate mb-1">
                        {track.name}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm truncate">
                        {track.artist.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Selected Track Info with fade transitions */}
          <AnimatePresence mode="wait">
            {selectedTrack && (
              <motion.section
                key={selectedTrack.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <div className="bg-white/5 rounded-xl p-6 backdrop-blur-md">
                  <div className="flex gap-6">
                    <div className="relative">
                      <img 
                        src={selectedTrack.image?.[3]?.['#text'] || `https://via.placeholder.com/300?text=${encodeURIComponent(selectedTrack.name)}`}
                        alt={selectedTrack.name}
                        className="w-32 h-32 rounded-lg shadow-lg object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/300?text=${encodeURIComponent(selectedTrack.name)}`;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayButton 
                          isPlaying={isPlaying && selectedTrack?.id === selectedTrack.id}
                          isLoading={isLoadingTrack}
                          onClick={() => onTrackPlay(selectedTrack)}
                          size="large"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedTrack.name}</h2>
                      <p className="text-white/80 text-lg">{selectedTrack.artist.name}</p>
                      <p className="text-white/60 mt-2">
                        {selectedTrack.listeners && `${parseInt(selectedTrack.listeners).toLocaleString()} listeners`}
                      </p>
                    </div>
                  </div>
                  {selectedTrack.wiki?.summary && (
                    <div className="mt-6">
                      <p className="text-white/70 text-sm line-clamp-4">{selectedTrack.wiki.summary}</p>
                    </div>
                  )}
                </div>

                {/* Similar Tracks */}
                {selectedTrack.similarTracks?.length > 0 && (
                  <div className="bg-white/5 rounded-xl p-6 backdrop-blur-md">
                    <h3 className="text-xl font-semibold text-white mb-4">Similar Tracks</h3>
                    <div className="space-y-3">
                      {selectedTrack.similarTracks.map(similar => (
                        <motion.div 
                          key={`${similar.artist.name}-${similar.name}`}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
                          whileHover={{ scale: 1.01 }}
                        >
                          <img 
                            src={similar.image?.[1]?.['#text'] || `https://via.placeholder.com/300?text=${encodeURIComponent(similar.name)}`}
                            alt={similar.name}
                            className="w-12 h-12 rounded object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://via.placeholder.com/300?text=${encodeURIComponent(similar.name)}`;
                            }}
                          />
                          <div>
                            <div className="text-white group-hover:text-white/90 transition-colors truncate">
                              {similar.name}
                            </div>
                            <div className="text-white/70 text-sm truncate">
                              {similar.artist.name}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Loading indicator for infinite scroll */}
      <AnimatePresence>
        {isLoading && tracks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
          >
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full">
              <div className="text-white text-sm">Loading more tracks...</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Player;
