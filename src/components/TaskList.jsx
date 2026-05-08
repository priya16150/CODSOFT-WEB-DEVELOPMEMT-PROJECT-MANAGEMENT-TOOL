import React, { useState } from 'react';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

const TaskList = ({ tasks, users, onTaskUpdate }) => {
  const { theme } = useTheme();
  const [editingTask, setEditingTask] = useState(null);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        onTaskUpdate();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Done': return theme.success;
      case 'In Progress': return theme.warning;
      default: return theme.textMuted;
    }
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  const styles = {
    container: {
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      animation: 'fadeIn 0.4s ease-out',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '1rem',
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderBottom: `2px solid ${theme.border}`,
      fontWeight: '600',
      color: theme.text,
      fontSize: '0.95rem',
    },
    td: {
      padding: '1rem',
      borderBottom: `1px solid ${theme.border}`,
      color: theme.textLight,
      transition: 'background-color 0.2s',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    select: {
      padding: '0.5rem',
      borderRadius: '8px',
      border: `1px solid ${theme.border}`,
      backgroundColor: 'rgba(0,0,0,0.3)',
      color: theme.text,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    deleteButton: {
      backgroundColor: theme.danger,
      color: 'white',
      border: 'none',
      padding: '0.35rem 0.8rem',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    overdue: {
      color: theme.danger,
      fontWeight: '600',
    },
    normal: {
      color: theme.success,
    },
    emptyMessage: {
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      color: theme.textLight,
      border: `1px solid ${theme.border}`,
    },
  };

  if (tasks.length === 0) {
    return <div style={styles.emptyMessage}>📭 No tasks yet. Create your first task!</div>;
  }

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>📌 Title</th>
            <th style={styles.th}>👤 Assigned To</th>
            <th style={styles.th}>📅 Deadline</th>
            <th style={styles.th}>🔄 Status</th>
            <th style={styles.th}>⚙️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => {
            const assignedUser = users.find(u => u._id === task.assignedTo?._id || u._id === task.assignedTo);
            const userName = assignedUser?.name || task.assignedTo?.name || 'Unassigned';
            const overdue = isOverdue(task.deadline) && task.status !== 'Done';
            return (
              <tr 
                key={task._id}
                style={{ animation: `fadeInLeft ${0.2 + index * 0.05}s ease-out` }}
                className="hover-pulse"
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={styles.td}>
                  <strong style={{ color: theme.text }}>{task.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: theme.textMuted, marginTop: '0.2rem' }}>{task.description}</div>
                </td>
                <td style={styles.td}>{userName}</td>
                <td style={styles.td}>
                  <span style={overdue ? styles.overdue : styles.normal}>
                    {new Date(task.deadline).toLocaleDateString()}
                    {overdue && ' ⚠️ Overdue'}
                  </span>
                </td>
                <td style={styles.td}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    style={styles.select}
                    onFocus={e => e.currentTarget.style.borderColor = theme.primary}
                    onBlur={e => e.currentTarget.style.borderColor = theme.border}
                  >
                    <option value="To Do">⏳ To Do</option>
                    <option value="In Progress">🔄 In Progress</option>
                    <option value="Done">✅ Done</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <button 
                    onClick={() => handleDelete(task._id)} 
                    style={styles.deleteButton}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.danger}
                    className="ripple"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;