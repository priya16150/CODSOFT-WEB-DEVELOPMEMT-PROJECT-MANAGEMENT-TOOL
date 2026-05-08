import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const styles = {
    container: {
      position: 'relative',
    },
    button: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      color: theme.text,
      border: `1px solid ${theme.border}`,
      padding: '0.5rem 1rem',
      borderRadius: '30px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s',
      backdropFilter: 'blur(4px)',
    },
    dropdown: {
      position: 'absolute',
      top: '45px',
      right: '0',
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      zIndex: 1000,
      minWidth: '180px',
      overflow: 'hidden',
      animation: 'fadeIn 0.2s ease-out',
    },
    option: {
      padding: '0.75rem 1.2rem',
      cursor: 'pointer',
      color: theme.textLight,
      borderBottom: `1px solid ${theme.border}`,
      transition: 'all 0.2s',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        style={styles.button}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'scale(1.02)'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
      >
        🎨 Theme
      </button>
      {isOpen && (
        <div style={styles.dropdown}>
          <div
            style={styles.option}
            onClick={() => {
              changeTheme('warm');
              setIsOpen(false);
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.primary; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.textLight; }}
          >
            🌅 Warm Sunset (Current)
          </div>
          {/* You can add more themes here in the future */}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;