import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-[#282828] h-24 z-50">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#4d4d4d] cursor-pointer group">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <div 
          className="h-full bg-red-500 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transform translate-x-1/2" />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
          {trackInfo?.artwork && (
            <img 
              src={trackInfo.artwork} 
              alt={trackInfo.title} 
              className="w-14 h-14 rounded shadow"
            />
          )}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white text-sm font-medium truncate">
                {trackInfo?.title || 'No track playing'}
              </h3>
              <button 
                onClick={() => onToggleFavorite?.()}
                className={`text-sm ${isFavorite ? 'text-red-500' : 'text-white/60 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
              </button>
            </div>
            <span className="text-white/60 text-xs truncate">
              {trackInfo?.artist || 'Unknown artist'}
            </span>
          </div>
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-center max-w-[40%] w-full">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsShuffleOn(!isShuffleOn)}
              className={`p-2 ${isShuffleOn ? 'text-red-500' : 'text-white/60 hover:text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.293 15.707a1 1 0 010-1.414L12.586 12H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                <path d="M9.707 4.293a1 1 0 010 1.414L7.414 8H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
              </svg>
            </button>

            <button 
              onClick={onPrevTrack}
              className="text-white/60 hover:text-white p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>

            <button 
              onClick={handlePlayPause}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button 
              onClick={onNextTrack}
              className="text-white/60 hover:text-white p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
              </svg>
            </button>

            <button 
              onClick={() => setIsRepeatOn(!isRepeatOn)}
              className={`p-2 ${isRepeatOn ? 'text-red-500' : 'text-white/60 hover:text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3v2a5 5 0 00-3.54 8.54l-1.41 1.41A7 7 0 0110 3zm4.95 2.05A7 7 0 0110 17v-2a5 5 0 003.54-8.54l1.41-1.41zM10 20l-4-4 4-4v8zm0-12V0l4 4-4 4z" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-white/60">{formatTime(currentTime)}</span>
            <span className="text-xs text-white/60">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 w-[30%] justify-end">
          <button 
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-2 ${showLyrics ? 'text-red-500' : 'text-white/60 hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v1H5V6zm0 3h10v1H5V9zm0 3h10v1H5v-1z" clipRule="evenodd" />
            </svg>
          </button>

          <button 
            onClick={toggleMute}
            className="text-white/60 hover:text-white p-2"
          >
            {isMuted || volume === 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
              </svg>
            )}
          </button>

          <div className="w-24 flex items-center group">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerBar;