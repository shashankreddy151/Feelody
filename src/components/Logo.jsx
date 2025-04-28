import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Logo.css';

const Logo = () => {
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    localStorage.removeItem('selectedMood');
    document.body.style.background = '#395C7E';
    navigate('/');
  };

  return (
    <Link to="/" className="logo-container" onClick={handleHomeClick}>
      <div className="logo">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-icon"
        >
          <path
            className="heart"
            d="M50 88.5C48.5 88.5 47 88 46 87C26.5 69 15 58.5 15 44.5C15 33.5 23.5 25 34.5 25C41.5 25 48 28.5 50 33.5C52 28.5 58.5 25 65.5 25C76.5 25 85 33.5 85 44.5C85 58.5 73.5 69 54 87C53 88 51.5 88.5 50 88.5Z"
          />
          <path
            className="music-note"
            d="M45 45C45 45 60 40 65 38.5C66 38 67 38.5 67 39.5V60C67 63.5 64.5 66 61 66C57.5 66 55 63.5 55 60C55 56.5 57.5 54 61 54C62 54 63 54.5 64 54.5V45L50 49.5V65C50 68.5 47.5 71 44 71C40.5 71 38 68.5 38 65C38 61.5 40.5 59 44 59C45 59 46 59.5 47 59.5V46C47 45.5 46 45 45 45Z"
          />
        </svg>
        <span className="logo-text">Feelody</span>
      </div>
    </Link>
  );
};

export default Logo;