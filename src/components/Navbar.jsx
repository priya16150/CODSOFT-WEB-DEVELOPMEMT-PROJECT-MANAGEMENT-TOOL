import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';
import ThemeSwitcher from './ThemeSwitcher';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const styles = {
    navbar: {
      background: theme.gradient,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: theme.shadow,
      animation: 'slideIn 0.4s ease-out',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    logo: {
      color: 'white',
      fontSize: '1.6rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
      transition: 'transform 0.2s',
      display: 'inline-block',
    },
    navLinks: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '1rem',
      padding: '0.5rem 1rem',
      borderRadius: '30px',
      transition: 'all 0.2s',
      fontWeight: '500',
      backgroundColor: 'transparent',
    },
    userInfo: {
      color: 'white',
      marginRight: '0.5rem',
      fontSize: '0.95rem',
      fontWeight: '500',
      backgroundColor: 'rgba(255,255,255,0.15)',
      padding: '0.4rem 1rem',
      borderRadius: '30px',
    },
    button: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1.2rem',
      borderRadius: '30px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
  };

  return (
    <nav style={styles.navbar}>
      <Link 
        to="/" 
        style={styles.logo}
        className="animate-bounce"
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        ⚙️ PM Tool
      </Link>
      {user && (
        <div style={styles.navLinks}>
          <Link 
            to="/" 
            style={styles.link}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Dashboard
          </Link>
          <Link 
            to="/projects" 
            style={styles.link}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Projects
          </Link>
          <ThemeSwitcher />
          <NotificationBell />
          <span style={styles.userInfo}>👋 Hello, {user.name}</span>
          <button 
            onClick={handleLogout} 
            style={styles.button}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.danger; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
            className="ripple"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;