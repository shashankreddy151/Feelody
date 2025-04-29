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
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-[#121212] to-[#181818] h-24 z-50 flex items-center px-4"
    >
      {/* Left Section - Track Info */}
      <div className="flex items-center w-[30%] min-w-[180px]">
        <img 
          src={currentTrack.image?.[2]?.['#text'] || `https://via.placeholder.com/64?text=${encodeURIComponent(currentTrack.name)}`}
          alt={currentTrack.name}
          className="w-16 h-16 rounded shadow-lg"
        />
        <div className="ml-4">
          <h3 className="text-white text-sm font-medium truncate hover:underline cursor-pointer">
            {currentTrack.name}
          </h3>
          <p className="text-gray-400 text-xs hover:underline cursor-pointer">
            {currentTrack.artist.name}
          </p>
        </div>
        <button className="ml-4 text-gray-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Center Section - Controls */}
      <div className="flex flex-col items-center flex-1">
        <div className="flex items-center gap-4 mb-2">
          {/* Shuffle Button */}
          <button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`text-sm p-2 rounded-full ${isShuffle ? 'text-green-500' : 'text-gray-400'} hover:text-white transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
            </svg>
          </button>

          {/* Previous Button */}
          <button 
            onClick={onPrevTrack}
            className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z"/>
            </svg>
          </button>

          {/* Play/Pause Button */}
          <button 
            onClick={onPlayPause}
            disabled={isLoading}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="black">
                <path d="M8 5v14h3V5H8zm5 0v14h3V5h-3z"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="black">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next Button */}
          <button 
            onClick={onNextTrack}
            className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 6h2v12h-2V6zm-3.5 6l-8.5 6V6l8.5 6z"/>
            </svg>
          </button>

          {/* Repeat Button */}
          <button 
            onClick={handleRepeatClick}
            className={`text-sm p-2 rounded-full relative ${
              repeatMode > 0 ? 'text-green-500' : 'text-gray-400'
            } hover:text-white transition-colors`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 2l2 2-2 2M3 11v-1a4 4 0 014-4h12M7 22l-2-2 2-2M21 13v1a4 4 0 01-4 4H5"/>
            </svg>
            {repeatMode === 2 && (
              <span className="absolute -top-1 -right-1 text-xs">1</span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[722px] flex items-center gap-2 group">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div 
            className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden cursor-pointer relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = (x / rect.width) * 100;
              onProgressChange({ target: { value: percentage } });
            }}
          >
            <div 
              className="h-full bg-white group-hover:bg-green-500 transition-colors"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 translate-x-1/2 shadow-lg" />
            </div>
          </div>
          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right Section - Volume & Additional Controls */}
      <div className="w-[30%] min-w-[180px] flex items-center justify-end gap-3">
        {/* Queue Button */}
        <button className="text-gray-400 hover:text-white p-2 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
          </svg>
        </button>

        {/* Volume Control */}
        <div 
          className="flex items-center gap-2 group relative"
          onMouseEnter={() => setIsVolumeVisible(true)}
          onMouseLeave={() => setIsVolumeVisible(false)}
        >
          <button 
            onClick={handleVolumeClick}
            className="text-gray-400 hover:text-white p-2 rounded-full transition-colors"
          >
            {getVolumeIcon()}
          </button>
          <div className={`w-24 transition-all ${isVolumeVisible ? 'opacity-100' : 'opacity-0'}`}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={onVolumeChange}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        </div>

        {/* Additional Controls */}
        <button className="text-gray-400 hover:text-white p-2 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default PlaybackBar;