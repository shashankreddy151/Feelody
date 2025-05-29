import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AudioPlayerBar.css';

const AudioPlayerBar = ({ 
  trackUrl,
  trackInfo,
  onPlayStateChange,
  onNextTrack,
  onPrevTrack,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.7);
  
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isRepeatOn) {
        audio.currentTime = 0;
        audio.play();
      } else {
        setIsPlaying(false);
        onNextTrack?.();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeatOn, onNextTrack]);

  useEffect(() => {
    if (trackUrl) {
      const audio = audioRef.current;
      audio.src = trackUrl;
      audio.load();
      if (isPlaying) audio.play();
    }
  }, [trackUrl]);

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
    onPlayStateChange?.(!isPlaying);
  };

  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * duration;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      audio.volume = prevVolume;
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      audio.volume = 0;
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };
  return (
    <motion.div 
      className="audio-player-bar fixed bottom-0 left-0 right-0 h-24 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Enhanced Progress Bar */}
      <div className="progress-bar-container absolute top-0 left-0 right-0 h-1 cursor-pointer group">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="progress-input absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div className="progress-track h-full">
          <motion.div 
            className="progress-fill h-full relative"
            style={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            <motion.div 
              className="progress-thumb"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
            />
          </motion.div>
        </div>
      </div>

      <div className="player-content max-w-screen-2xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Enhanced Left Section */}
        <div className="left-section flex items-center gap-4 w-[30%] min-w-[180px]">
          <AnimatePresence mode="wait">
            {trackInfo?.artwork && (
              <motion.img 
                key={trackInfo.artwork}
                src={trackInfo.artwork} 
                alt={trackInfo.title} 
                className="track-artwork w-14 h-14 rounded-lg shadow-lg object-cover"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </AnimatePresence>
          
          <div className="track-details flex flex-col min-w-0">
            <div className="flex items-center gap-3">
              <motion.h3 
                className="track-title text-white text-sm font-medium truncate"
                animate={{ opacity: trackInfo?.title ? 1 : 0.6 }}
              >
                {trackInfo?.title || 'No track playing'}
              </motion.h3>
              <motion.button 
                onClick={() => onToggleFavorite?.()}
                className={`favorite-button ${isFavorite ? 'active' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </motion.button>
            </div>
            <motion.span 
              className="artist-name text-white/60 text-xs truncate"
              animate={{ opacity: trackInfo?.artist ? 1 : 0.4 }}
            >
              {trackInfo?.artist || 'Unknown artist'}
            </motion.span>
          </div>
        </div>        {/* Enhanced Center Section */}
        <div className="center-section flex flex-col items-center max-w-[40%] w-full">
          <div className="controls-container flex items-center gap-6">
            <motion.button 
              onClick={() => setIsShuffleOn(!isShuffleOn)}
              className={`control-button ${isShuffleOn ? 'active' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </motion.button>

            <motion.button 
              onClick={onPrevTrack}
              className="control-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
              </svg>
            </motion.button>

            <motion.button 
              onClick={handlePlayPause}
              className="play-button w-10 h-10 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14h3V5H8zm5 0v14h3V5h-3z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </motion.button>

            <motion.button 
              onClick={onNextTrack}
              className="control-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
              </svg>
            </motion.button>

            <motion.button 
              onClick={() => setIsRepeatOn(!isRepeatOn)}
              className={`control-button ${isRepeatOn ? 'active' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
            </motion.button>
          </div>
          
          <motion.div 
            className="time-display flex items-center gap-2 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="current-time text-xs text-white/70">{formatTime(currentTime)}</span>
            <span className="separator text-white/40">•</span>
            <span className="total-time text-xs text-white/70">{formatTime(duration)}</span>
          </motion.div>
        </div>        {/* Enhanced Right Section */}
        <div className="right-section flex items-center gap-4 w-[30%] justify-end">
          <motion.button 
            onClick={() => setShowLyrics(!showLyrics)}
            className={`control-button ${showLyrics ? 'active' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </motion.button>

          <motion.button 
            onClick={toggleMute}
            className="control-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted || volume === 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </motion.button>

          <div className="volume-section w-24 flex items-center group">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider w-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AudioPlayerBar;