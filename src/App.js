import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import MoodSelector from "./components/MoodSelector";
import Player from "./pages/Player";
import Logo from "./components/Logo";
import PlaybackBar from "./components/PlaybackBar";
import audiusService from "./services/audiusService";
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLoadingTrack, setIsLoadingTrack] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [audiusTrack, setAudiusTrack] = useState(null);
  const audioRef = useRef(new Audio());
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const updateProgress = () => {
      if (audio && audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setAudioError('Failed to load audio');
      setIsLoadingTrack(false);
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setAudioError(null);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [volume]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleProgressChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    const audio = audioRef.current;
    
    // Only update if we have a valid audio duration
    if (audio && !isNaN(audio.duration) && isFinite(audio.duration)) {
      setProgress(newProgress);
      const newTime = (newProgress / 100) * audio.duration;
      
      // Ensure the new time is valid before setting
      if (!isNaN(newTime) && isFinite(newTime) && newTime >= 0) {
        audio.currentTime = newTime;
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const initializeStream = async (streamUrl) => {
    const audio = audioRef.current;
    audio.src = streamUrl;
    
    try {
      await audio.load();
      await audio.play();
      setIsPlaying(true);
      setAudioError(null);
    } catch (error) {
      console.error('Stream initialization error:', error);
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setAudioError(`Retrying playback... (${retryCount + 1}/${MAX_RETRIES})`);
        // Wait a bit before retrying
        setTimeout(() => initializeStream(streamUrl), 1000);
      } else {
        setAudioError('Failed to play track after multiple attempts');
        setIsPlaying(false);
      }
    }
  };

  const playTrack = async (track) => {
    if (!track) return;

    try {
      setIsLoadingTrack(true);
      setCurrentTrack(track);
      setAudioError(null);
      setRetryCount(0);

      console.log('Searching for track:', track.name, 'by', track.artist.name);
      const audiusResults = await audiusService.searchTracks(`${track.name} ${track.artist.name}`);
      console.log('Audius search results:', audiusResults);

      if (audiusResults.length > 0) {
        const audiusTrack = audiusResults[0];
        setAudiusTrack(audiusTrack);

        if (audiusTrack.is_streamable) {
          const streamUrl = await audiusService.getStreamUrl(audiusTrack.id);
          console.log('Stream URL:', streamUrl);

          if (streamUrl) {
            await initializeStream(streamUrl);
          } else {
            setAudioError('Stream not available');
          }
        } else {
          setAudioError('Track is not streamable');
        }
      } else {
        setAudioError('Track not found on Audius');
      }
    } catch (error) {
      console.error('Error playing track:', error);
      setAudioError('Failed to load track');
    } finally {
      setIsLoadingTrack(false);
    }
  };

  // Update PlaybackBar props to include audiusTrack for duration
  return (
    <div className="relative min-h-screen pt-12">
      <Logo />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <div className="min-h-[calc(100vh-3rem)] flex flex-col items-center justify-center">
                <MoodSelector />
              </div>
            }
          />
          <Route
            path="/player"
            element={
              <Player 
                onTrackPlay={playTrack}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                isLoadingTrack={isLoadingTrack}
              />
            }
          />
        </Routes>
      </AnimatePresence>

      <PlaybackBar
        currentTrack={currentTrack}
        audiusTrack={audiusTrack}
        isPlaying={isPlaying}
        isLoading={isLoadingTrack}
        progress={progress}
        volume={volume}
        error={audioError}
        onPlayPause={handlePlayPause}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
        onNextTrack={() => {}}
        onPrevTrack={() => {}}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
