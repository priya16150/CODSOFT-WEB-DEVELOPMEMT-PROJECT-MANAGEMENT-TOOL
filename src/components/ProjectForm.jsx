import React, { useState } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const ProjectForm = ({ onClose, onProjectCreated }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/projects', { name, description });
      onProjectCreated();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '2rem',
      width: '90%',
      maxWidth: '500px',
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      animation: 'slideIn 0.3s ease-out',
    },
    title: {
      fontSize: '1.8rem',
      marginBottom: '1.5rem',
      color: theme.text,
      textAlign: 'center',
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
    textarea: {
      padding: '0.85rem',
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      fontSize: '1rem',
      minHeight: '100px',
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: theme.text,
      fontFamily: 'inherit',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '0.5rem',
    },
    submitButton: {
      backgroundColor: theme.success,
      color: 'white',
      border: 'none',
      padding: '0.85rem',
      borderRadius: '40px',
      cursor: 'pointer',
      flex: 1,
      fontSize: '1rem',
      fontWeight: 'bold',
      transition: 'all 0.2s',
    },
    cancelButton: {
      backgroundColor: theme.danger,
      color: 'white',
      border: 'none',
      padding: '0.85rem',
      borderRadius: '40px',
      cursor: 'pointer',
      flex: 1,
      fontSize: '1rem',
      fontWeight: 'bold',
      transition: 'all 0.2s',
    },
    error: {
      color: theme.danger,
      fontSize: '0.875rem',
      textAlign: 'center',
      backgroundColor: 'rgba(231,76,60,0.15)',
      padding: '0.5rem',
      borderRadius: '10px',
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>✨ Create New Project</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="📁 Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
            onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <textarea
            placeholder="📝 Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
            onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
          />
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={loading} 
              style={styles.submitButton}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#27ae60'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.success}
            >
              {loading ? '⏳ Creating...' : '✅ Create Project'}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              style={styles.cancelButton}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.danger}
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;