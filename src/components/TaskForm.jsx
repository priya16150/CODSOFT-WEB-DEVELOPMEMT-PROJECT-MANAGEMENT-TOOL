import React, { useState } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const TaskForm = ({ projectId, users, onClose, onTaskCreated }) => {
  const { theme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('To Do');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !assignedTo || !deadline) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/tasks', {
        title,
        description,
        project: projectId,
        assignedTo,
        deadline,
        status,
      });
      onTaskCreated();
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create task');
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
      maxHeight: '90vh',
      overflowY: 'auto',
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
      minHeight: '80px',
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: theme.text,
      fontFamily: 'inherit',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    select: {
      padding: '0.85rem',
      border: `1px solid ${theme.border}`,
      borderRadius: '12px',
      fontSize: '1rem',
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: theme.text,
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
        <h2 style={styles.title}>✨ Create New Task</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="📌 Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
            onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <textarea
            placeholder="📝 Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
            onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={styles.select}
            onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
            onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <option value="">👤 Assign to...</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={styles.input}
            onFocus={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.boxShadow = `0 0 5px ${theme.primary}`; }}
            onBlur={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.select}
          >
            <option value="To Do">⏳ To Do</option>
            <option value="In Progress">🔄 In Progress</option>
            <option value="Done">✅ Done</option>
          </select>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.buttonGroup}>
            <button 
              type="submit" 
              disabled={loading} 
              style={styles.submitButton}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#27ae60'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.success}
            >
              {loading ? '⏳ Creating...' : '✅ Create Task'}
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

export default TaskForm;