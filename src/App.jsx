import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';


const WelcomePage = ({ onGetStarted }) => {
  const { theme } = useTheme();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: theme.gradient,
      color: 'white',
      textAlign: 'center',
      padding: '2rem',
      animation: 'fadeIn 0.5s ease-out',
    },
    title: {
      fontSize: '3rem',
      marginBottom: '1rem',
      fontWeight: 'bold',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    subtitle: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      opacity: 0.95,
    },
    button: {
      backgroundColor: '#fff',
      color: theme.primary,
      border: 'none',
      padding: '1rem 2rem',
      fontSize: '1.1rem',
      borderRadius: '50px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    features: {
      display: 'flex',
      gap: '2rem',
      marginTop: '3rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    featureCard: {
      backgroundColor: 'rgba(255,255,255,0.12)',
      backdropFilter: 'blur(10px)',
      padding: '1.5rem',
      borderRadius: '16px',
      width: '200px',
      transition: 'transform 0.2s',
    },
    featureIcon: {
      fontSize: '2rem',
      marginBottom: '0.5rem',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🌅 Project Management Tool</h1>
      <p style={styles.subtitle}>Organize your projects, assign tasks, and track progress effortlessly</p>
      <button
        onClick={onGetStarted}
        style={styles.button}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'; }}
      >
        Get Started →
      </button>
      <div style={styles.features}>
        {[
          { icon: '📋', text: 'Create Projects' },
          { icon: '✅', text: 'Assign Tasks' },
          { icon: '📅', text: 'Set Deadlines' },
          { icon: '📊', text: 'Track Progress' },
        ].map((feature, idx) => (
          <div
            key={idx}
            style={styles.featureCard}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.featureIcon}>{feature.icon}</div>
            <div>{feature.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthPage = () => {
  const { login, register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      if (isLogin) await login(email, password);
      else await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: theme.gradient,
      animation: 'fadeIn 0.4s ease-out',
    },
    card: {
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(12px)',
      padding: '2rem',
      borderRadius: '24px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      animation: 'slideIn 0.4s ease-out',
    },
    title: {
      fontSize: '1.8rem',
      marginBottom: '1.5rem',
      textAlign: 'center',
      color: theme.text,
      fontWeight: 'bold',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem',
    },
    input: {
      padding: '0.85rem',
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      fontSize: '1rem',
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: theme.text,
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    button: {
      backgroundColor: theme.primary,
      color: 'white',
      border: 'none',
      padding: '0.85rem',
      borderRadius: '40px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      transition: 'all 0.2s',
      marginTop: '0.5rem',
    },
    toggle: {
      textAlign: 'center',
      marginTop: '1.2rem',
      color: theme.primary,
      cursor: 'pointer',
      transition: 'color 0.2s',
    },
    error: {
      color: theme.danger,
      textAlign: 'center',
      fontSize: '0.875rem',
      backgroundColor: 'rgba(231,76,60,0.15)',
      padding: '0.5rem',
      borderRadius: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLogin ? 'Welcome Back 👋' : 'Create Account ✨'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
              onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
            onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
            onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
              onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
              required
            />
          )}
          {error && <div style={styles.error}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.primaryDark}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.primary}
          >
            {loading ? '⏳ Please wait...' : (isLogin ? '🔓 Login' : '📝 Register')}
          </button>
        </form>
        <div
          style={styles.toggle}
          onClick={() => { setIsLogin(!isLogin); setError(''); setConfirmPassword(''); }}
          onMouseEnter={e => e.currentTarget.style.color = theme.secondary}
          onMouseLeave={e => e.currentTarget.style.color = theme.primary}
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </div>
      </div>
    </div>
  );
};

function AuthenticatedApp() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
      </Routes>
    </>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>Loading...</div>;
  }

  if (user) {
    return <AuthenticatedApp />;
  }

  if (!showAuth) {
    return <WelcomePage onGetStarted={() => setShowAuth(true)} />;
  }

  return <AuthPage />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
