import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProjectForm from './ProjectForm';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// ==================== SKELETON LOADER COMPONENT ====================
const ProjectSkeleton = () => {
  const { theme } = useTheme();
  return (
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '20px',
      padding: '1.5rem',
      animation: 'shimmer 1.5s infinite',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
      backgroundSize: '200% 100%',
      border: `1px solid ${theme.border}`,
    }}>
      <div style={{ height: '1.5rem', width: '70%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '1rem' }}></div>
      <div style={{ height: '3rem', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '1rem' }}></div>
      <div style={{ height: '0.5rem', width: '100%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}></div>
    </div>
  );
};

const ProjectList = () => {
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasksByProject, setTasksByProject] = useState({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
      const tasksMap = {};
      for (const project of data) {
        const tasksRes = await api.get(`/tasks/project/${project._id}`);
        tasksMap[project._id] = tasksRes.data;
      }
      setTasksByProject(tasksMap);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? All tasks will also be deleted.')) {
      try {
        await api.delete(`/projects/${id}`);
        setProjects(projects.filter(p => p._id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const getProjectProgress = (projectId) => {
    const tasks = tasksByProject[projectId] || [];
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'Done').length;
    return (completed / tasks.length) * 100;
  };

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      animation: 'fadeInUp 0.4s ease-out',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    title: {
      fontSize: '2.2rem',
      color: theme.text,
      fontWeight: 'bold',
      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
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
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s',
      boxShadow: theme.shadow,
    },
    projectGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem',
    },
    projectCard: {
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(8px)',
      borderRadius: '20px',
      padding: '1.5rem',
      boxShadow: theme.shadow,
      transition: 'transform 0.2s, box-shadow 0.2s',
      border: `1px solid ${theme.border}`,
      animation: 'fadeInUp 0.4s backwards',
    },
    projectName: {
      fontSize: '1.35rem',
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: '0.5rem',
    },
    projectDesc: {
      color: theme.textLight,
      marginBottom: '1rem',
      lineHeight: '1.5',
      fontSize: '0.9rem',
    },
    progressBar: {
      width: '100%',
      height: '10px',
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '0.5rem',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.success,
      transition: 'width 0.5s ease',
      borderRadius: '10px',
    },
    progressText: {
      fontSize: '0.8rem',
      color: theme.textMuted,
      marginBottom: '1rem',
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem',
    },
    viewButton: {
      backgroundColor: theme.primary,
      color: 'white',
      textDecoration: 'none',
      padding: '0.6rem 1rem',
      borderRadius: '30px',
      textAlign: 'center',
      flex: 1,
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    deleteButton: {
      backgroundColor: theme.danger,
      color: 'white',
      border: 'none',
      padding: '0.6rem 1rem',
      borderRadius: '30px',
      cursor: 'pointer',
      flex: 1,
      fontSize: '0.9rem',
      fontWeight: '500',
      transition: 'all 0.2s',
    },
    emptyMessage: {
      textAlign: 'center',
      padding: '3rem',
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(8px)',
      borderRadius: '20px',
      color: theme.textLight,
      border: `1px solid ${theme.border}`,
    },
  };

  // ==================== SKELETON LOADER VIEW ====================
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📁 My Projects</h1>
          <div style={{ ...styles.addButton, opacity: 0.5, cursor: 'default' }}>➕ New Project</div>
        </div>
        <div style={styles.projectGrid}>
          {[1, 2, 3].map(i => <ProjectSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📁 My Projects</h1>
        <button 
          onClick={() => setShowForm(true)} 
          style={styles.addButton}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.backgroundColor = theme.primaryDark; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = theme.primary; }}
          className="ripple"
        >
          ➕ New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={styles.emptyMessage}>
          <p>📭 No projects yet. Click "New Project" to create your first project!</p>
        </div>
      ) : (
        <div style={styles.projectGrid}>
          {projects.map((project, index) => {
            const progress = getProjectProgress(project._id);
            const completedCount = tasksByProject[project._id]?.filter(t => t.status === 'Done').length || 0;
            const totalCount = tasksByProject[project._id]?.length || 0;
            return (
              <div 
                key={project._id} 
                style={{ 
                  ...styles.projectCard, 
                  animationDelay: `${0.05 * (index % 6)}s` 
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = theme.glow;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = theme.shadow;
                }}
              >
                <h3 style={styles.projectName}>{project.name}</h3>
                <p style={styles.projectDesc}>
                  {project.description.length > 100 
                    ? project.description.substring(0, 100) + '...' 
                    : project.description}
                </p>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
                </div>
                <div style={styles.progressText}>
                  📊 Progress: {progress.toFixed(1)}% ({completedCount} / {totalCount} tasks)
                </div>
                <div style={styles.buttonGroup}>
                  <Link 
                    to={`/projects/${project._id}`} 
                    style={styles.viewButton}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.primaryDark}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.primary}
                  >
                    👁️ View Tasks
                  </Link>
                  <button 
                    onClick={() => handleDelete(project._id)} 
                    style={styles.deleteButton}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c0392b'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.danger}
                    className="ripple"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ProjectForm 
          onClose={() => setShowForm(false)} 
          onProjectCreated={() => {
            setShowForm(false);
            fetchProjects();
          }} 
        />
      )}
    </div>
  );
};

export default ProjectList;