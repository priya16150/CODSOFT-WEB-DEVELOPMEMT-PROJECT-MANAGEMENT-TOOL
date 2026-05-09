import React, { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  warm: {
    name: 'Warm Sunset',
    background: '#120808',
    gradient: 'linear-gradient(135deg, #2d0a0a 0%, #5a2020 50%, #2d0a0a 100%)',
    cardBg: 'rgba(65, 35, 25, 0.95)',
    cardBlur: 'blur(10px)',
    cardBorder: '1px solid rgba(255, 140, 66, 0.6)',
    cardBgHover: 'rgba(85, 45, 35, 0.98)',
    text: '#ffffff',
    textLight: '#fff0e0',
    textMuted: '#ffddbb',
    primary: '#ff8c42',
    primaryDark: '#e67e22',
    secondary: '#ffb347',
    accent: '#ff6b6b',
    accentWarm: '#ffaa66',
    success: '#2ecc71',
    danger: '#e74c3c',
    warning: '#f1c40f',
    info: '#ff8c42',
    border: 'rgba(255, 140, 66, 0.5)',
    shadow: '0 8px 25px rgba(0,0,0,0.5)',
    glow: '0 0 18px rgba(255,140,66,0.7)',
  },
};

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('warm');

  useEffect(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved && themes[saved]) setTheme(saved);
  }, []);

  const changeTheme = (name) => {
    if (themes[name]) {
      setTheme(name);
      localStorage.setItem('app-theme', name);
    }
  };

  const current = themes[theme];

  const globalStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background: #120808;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: ${current.text};
    }
  
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.08); opacity: 0.9; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
   
    .animate-fadeUp { animation: fadeInUp 0.5s ease-out; }
    .animate-fadeLeft { animation: fadeInLeft 0.4s ease-out; }
    .animate-fadeRight { animation: fadeInRight 0.4s ease-out; }
    .animate-zoom { animation: zoomIn 0.3s ease-out; }
    .animate-bounce:hover { animation: bounce 0.5s ease; }
    .animate-shake { animation: shake 0.4s ease; }
    .hover-pulse:hover { animation: pulse 0.3s ease; }
   
    .ripple {
      position: relative;
      overflow: hidden;
    }
    .ripple:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      transform: translate(-50%, -50%);
      transition: width 0.4s, height 0.4s;
    }
    .ripple:active:after {
      width: 200%;
      height: 200%;
    }
   
    .stagger > * {
      animation: fadeInUp 0.4s ease-out backwards;
    }
    .stagger > *:nth-child(1) { animation-delay: 0.05s; }
    .stagger > *:nth-child(2) { animation-delay: 0.1s; }
    .stagger > *:nth-child(3) { animation-delay: 0.15s; }
    .stagger > *:nth-child(4) { animation-delay: 0.2s; }
    .stagger > *:nth-child(5) { animation-delay: 0.25s; }
    .stagger > *:nth-child(6) { animation-delay: 0.3s; }
   
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: #2d1a1a; border-radius: 10px; }
    ::-webkit-scrollbar-thumb { background: ${current.primary}; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: ${current.secondary}; }
  
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255,140,66,0.3);
      border-top-color: ${current.primary};
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  `;

  return (
    <ThemeContext.Provider value={{ theme: current, themeName: theme, changeTheme, themes }}>
      <style>{globalStyles}</style>
      <div style={{
        minHeight: '100vh',
        background: current.background,
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,140,66,0.08) 0%, rgba(0,0,0,0) 70%)',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }} className="animate-fadeUp">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
