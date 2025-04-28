import { useEffect } from 'react';
import { getMoodStyles } from '../utils/utils';

const Player = () => {
  useEffect(() => {
    const selectedMood = localStorage.getItem('selectedMood');
    if (selectedMood) {
      const styles = getMoodStyles(selectedMood);
      document.body.style.background = styles.background;
      document.body.classList.add('mood-transition');
    }
    return () => {
      document.body.classList.remove('mood-transition');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-white/20 backdrop-blur-lg rounded-lg p-8 w-full max-w-md">
        {/* Player content will go here */}
        <h1 className="text-3xl font-bold text-white mb-4">Music Player</h1>
      </div>
    </div>
  );
};

export default Player;
