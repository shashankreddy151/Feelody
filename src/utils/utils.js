export const getMoodStyles = (mood) => {
  const styles = {
    happy: {
      background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
      cardBg: 'rgba(255, 255, 255, 0.2)',
      textColor: '#2d3748'
    },
    exuberant: {
      background: 'linear-gradient(120deg, #FFE259 0%, #FFA751 100%)',
      cardBg: 'rgba(255, 255, 255, 0.2)',
      textColor: '#2d3748'
    },
    energetic: {
      background: 'linear-gradient(120deg, #ff4b1f 0%, #ff9068 100%)',
      cardBg: 'rgba(255, 255, 255, 0.2)',
      textColor: '#ffffff',
      animation: 'energetic-flash 2s infinite'
    },
    frantic: {
      background: 'linear-gradient(120deg, #f93d66 0%, #6d47d9 100%)',
      cardBg: 'rgba(255, 255, 255, 0.2)',
      textColor: '#ffffff'
    },
    anxious: {
      background: 'linear-gradient(120deg, #4b6cb7 0%, #182848 100%)',
      cardBg: 'rgba(255, 255, 255, 0.15)',
      textColor: '#ffffff'
    },
    depression: {
      background: 'linear-gradient(120deg, #141e30 0%, #243b55 100%)',
      cardBg: 'rgba(255, 255, 255, 0.1)',
      textColor: '#ffffff'
    },
    calm: {
      background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
      cardBg: 'rgba(255, 255, 255, 0.2)',
      textColor: '#2d3748'
    },
    contentment: {
      background: 'linear-gradient(120deg, #a8edea 0%, #fed6e3 100%)',
      cardBg: 'rgba(255, 255, 255, 0.2)',
      textColor: '#2d3748'
    }
  };

  return styles[mood] || styles.calm;
};