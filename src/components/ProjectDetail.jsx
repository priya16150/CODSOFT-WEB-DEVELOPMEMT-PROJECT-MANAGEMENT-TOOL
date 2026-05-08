import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { useTheme } from '../context/ThemeContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchProjectAndTasks();
    fetchUsers();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get('/projects'),
        api.get(`/tasks/project/${id}`)
      ]);
      const foundProject = projectRes.data.find(p => p._id === id);
      setProject(foundProject);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleTaskCreated = () => {
    fetchProjectAndTasks();
    setShowTaskForm(false);
  };

  const handleTaskUpdate = () => {
    fetchProjectAndTasks();
  };

  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const progress = tasks.length === 0 ? 0 : (completedTasks / tasks.length) * 100;

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      animation: 'fadeIn 0.4s ease-out',
    },
    header: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.2rem',
      color: theme.text,
      marginBottom: '0.5rem',
      fontWeight: 'bold',
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    description: {
      color: theme.textLight,
      fontSize: '1.1rem',
      marginBottom: '1rem',
      lineHeight: '1.5',
    },
    progressSection: {
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(8px)',
      padding: '1.5rem',
      borderRadius: '20px',
      marginBottom: '2rem',
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
    },
    progressLabel: {
      marginBottom: '0.5rem',
      fontWeight: '600',
      color: theme.text,
      fontSize: '0.95rem',
    },
    progressBar: {
      width: '100%',
      height: '12px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    progressFill: {
      width: `${progress}%`,
      height: '100%',
      backgroundColor: theme.success,
      transition: 'width 0.5s ease',
      borderRadius: '10px',
    },
    stats: {
      display: 'flex',
      gap: '2rem',
      marginTop: '1rem',
      flexWrap: 'wrap',
    },
    stat: {
      fontSize: '0.9rem',
      color: theme.textLight,
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: '0.3rem 0.8rem',
      borderRadius: '20px',
    },
    addButton: {
      backgroundColor: theme.primary,
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.8rem',
      borderRadius: '40px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      transition: 'all 0.2s',
      boxShadow: theme.shadow,
    },
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: theme.text, fontSize: '1.1rem' }}>Loading project details...</div>;
  if (!project) return <div style={{ textAlign: 'center', padding: '2rem', color: theme.text }}>Project not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 {project.name}</h1>
        <p style={styles.description}>{project.description}</p>
      </div>
      <div style={styles.progressSection}>
        <div style={styles.progressLabel}>📊 Overall Progress</div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>
        <div style={styles.stats}>
          <span style={styles.stat}>{progress.toFixed(1)}% Complete</span>
          <span style={styles.stat}>✅ {completedTasks} / {tasks.length} Tasks Done</span>
        </div>
      </div>
      <button 
        onClick={() => setShowTaskForm(true)} 
        style={styles.addButton}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.backgroundColor = theme.primaryDark; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = theme.primary; }}
      >
        + Add New Task
      </button>
      <TaskList tasks={tasks} users={users} onTaskUpdate={handleTaskUpdate} />
      {showTaskForm && (
        <TaskForm
          projectId={id}
          users={users}
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default ProjectDetail;