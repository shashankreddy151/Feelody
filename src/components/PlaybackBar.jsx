import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './PlaybackBar.css';

const PlaybackBar = ({ 
  currentTrack, 
  audiusTrack,
  isPlaying, 
  progress, 
  volume,
  isLoading,
  error,
  onPlayPause,
  onProgressChange,
  onVolumeChange,
  onNextTrack,
  onPrevTrack
}) => {
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: no repeat, 1: repeat all, 2: repeat one
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);

  if (!currentTrack) return null;

  const duration = audiusTrack?.duration || 0;
  const currentTime = (progress / 100) * duration;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeClick = () => {
    if (!isMuted) {
      setPreviousVolume(volume);
      onVolumeChange({ target: { value: 0 } });
    } else {
      onVolumeChange({ target: { value: previousVolume } });
    }
    setIsMuted(!isMuted);
  };

  const handleRepeatClick = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const getVolumeIcon = () => {
    if (volume === 0 || isMuted) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
          <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    } else if (volume < 0.5) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      );
    }
  };
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="playback-bar fixed bottom-0 left-0 right-0 h-24 z-50 flex items-center px-4 md:px-6"
    >
      {/* Left Section - Enhanced Track Info */}
      <div className="flex items-center w-[30%] min-w-[180px] gap-4">
        <motion.img 
          src={currentTrack.image?.[2]?.['#text'] || `https://via.placeholder.com/64x64/1a1a2e/ffffff?text=${encodeURIComponent(currentTrack.name)}`}
          alt={currentTrack.name}
          className="track-image w-16 h-16 object-cover"
          whileHover={{ scale: 1.05 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/64x64/1a1a2e/ffffff?text=${encodeURIComponent(currentTrack.name)}`;
          }}
        />
        <div className="track-info flex-1 min-w-0">
          <h3 className="text-sm font-medium truncate hover:underline cursor-pointer mb-1">
            {currentTrack.name}
          </h3>
          <p className="text-xs hover:underline cursor-pointer truncate">
            {currentTrack.artist.name}
          </p>
        </div>
        <motion.button 
          className="heart-button p-2 rounded-full"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </motion.button>
      </div>      {/* Center Section - Enhanced Controls */}
      <div className="flex flex-col items-center flex-1 max-w-[722px] mx-auto">
        <div className="flex items-center gap-4 mb-3">
          {/* Shuffle Button */}
          <motion.button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`control-button p-2 ${isShuffle ? 'active' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
          </motion.button>

          {/* Previous Button */}
          <motion.button 
            onClick={onPrevTrack}
            className="control-button p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
            </svg>
          </motion.button>

          {/* Enhanced Play/Pause Button */}
          <motion.button 
            onClick={onPlayPause}
            disabled={isLoading}
            className="play-button w-12 h-12 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <div className="loading-spinner w-5 h-5 rounded-full" />
            ) : isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14h3V5H8zm5 0v14h3V5h-3z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </motion.button>

          {/* Next Button */}
          <motion.button 
            onClick={onNextTrack}
            className="control-button p-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6h2v12h-2V6zm-3.5 6l-8.5 6V6l8.5 6z"/>
            </svg>
          </motion.button>

          {/* Repeat Button */}
          <motion.button 
            onClick={handleRepeatClick}
            className={`control-button p-2 relative ${repeatMode > 0 ? 'active' : ''}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 2l2 2-2 2M3 11v-1a4 4 0 014-4h12M7 22l-2-2 2-2M21 13v1a4 4 0 01-4 4H5"/>
            </svg>
            {repeatMode === 2 && (
              <span className="absolute -top-1 -right-1 text-xs bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center text-white font-bold">
                1
              </span>
            )}
          </motion.button>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="time-display">
            {formatTime(currentTime)}
          </span>
          <div 
            className="progress-container flex-1 relative cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = (x / rect.width) * 100;
              onProgressChange({ target: { value: Math.max(0, Math.min(100, percentage)) } });
            }}
          >
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <div 
              className="progress-thumb"
              style={{ left: `${progress}%` }}
            />
          </div>
          <span className="time-display">
            {formatTime(duration)}
          </span>
        </div>
      </div>      {/* Right Section - Enhanced Volume & Controls */}
      <div className="w-[30%] min-w-[180px] flex items-center justify-end gap-3">
        {/* Queue Button */}
        <motion.button 
          className="control-button queue-button p-2"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
          </svg>
        </motion.button>

        {/* Enhanced Volume Control */}
        <motion.div 
          className="volume-control hidden md:flex"
          onHoverStart={() => setIsVolumeVisible(true)}
          onHoverEnd={() => setIsVolumeVisible(false)}
          initial={false}
          animate={{ width: isVolumeVisible ? 140 : 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <motion.button 
            onClick={handleVolumeClick}
            className="control-button p-2 flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {getVolumeIcon()}
          </motion.button>
          <motion.input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={onVolumeChange}
            className="volume-slider"
            initial={{ opacity: 0, width: 0 }}
            animate={{ 
              opacity: isVolumeVisible ? 1 : 0,
              width: isVolumeVisible ? 100 : 0 
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

        {/* Additional Controls */}
        <motion.button 
          className="control-button p-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PlaybackBar;