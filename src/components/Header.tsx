import React, { useState } from 'react';

interface HeaderProps {
  onUploadClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUploadClick }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('toka_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('toka_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Set initial theme
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <header>
      <div className="header-content">
        <a href="/" className="logo" onClick={(e) => {
          e.preventDefault();
          window.location.href = '/';
        }}>
          TOKA
        </a>
        <div className="header-actions">
          <button 
            className="btn-icon" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="btn-primary" onClick={onUploadClick}>
            Upload Song
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
