import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import ProjectForm from './ProjectForm';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { theme } = useTheme();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Modal visibility states
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showDeadlinesModal, setShowDeadlinesModal] = useState(false);
  const [showOverdueModal, setShowOverdueModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsRes = await api.get('/projects');
      const allProjects = projectsRes.data;
      setProjects(allProjects);
      
      const allTasks = [];
      for (const project of allProjects) {
        const tasksRes = await api.get(`/tasks/project/${project._id}`);
        allTasks.push(...tasksRes.data);
      }
      setTasks(allTasks);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = () => {
    fetchData();
    setShowProjectForm(false);
  };

  // Calculations
  const completedTasks = tasks.filter(t => t.status === 'Done').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks === 0 ? 0 : ((completedTasks / totalTasks) * 100).toFixed(1);
  
  const today = new Date();
  const upcomingDeadlines = tasks.filter(t => new Date(t.deadline) > today && t.status !== 'Done');
  const overdueTasks = tasks.filter(t => new Date(t.deadline) < today && t.status !== 'Done');

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const overdueDays = (deadline) => {
    const diffTime = today - new Date(deadline);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Modal Styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease-out',
  };
  const modalContentStyle = {
    backgroundColor: theme.cardBg,
    backdropFilter: 'blur(12px)',
    borderRadius: '20px',
    padding: '2rem',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: theme.shadow,
    border: `1px solid ${theme.border}`,
    animation: 'zoomIn 0.3s ease-out',
  };
  const modalTitleStyle = {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: theme.text,
    borderBottom: `3px solid ${theme.primary}`,
    paddingBottom: '0.5rem',
  };
  const closeButtonStyle = {
    backgroundColor: theme.primaryDark,
    color: 'white',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: '30px',
    cursor: 'pointer',
    marginTop: '1rem',
    float: 'right',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  };
  const listItemStyle = {
    padding: '0.75rem',
    borderBottom: `1px solid ${theme.border}`,
    color: theme.textLight,
  };
  const taskStatusBadge = (status) => ({
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    backgroundColor: status === 'Done' ? theme.success : status === 'In Progress' ? theme.warning : theme.textMuted,
    color: 'white',
    marginLeft: '0.5rem',
  });

  // Modal Components
  const ProjectsModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowProjectsModal(false)}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h2 style={modalTitleStyle}>📁 All Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <p style={{ color: theme.textLight }}>No projects yet. Create one!</p>
        ) : (
          projects.map(proj => (
            <div key={proj._id} style={listItemStyle}>
              <strong style={{ color: theme.text, fontSize: '1.1rem' }}>{proj.name}</strong>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: theme.textLight }}>{proj.description}</p>
            </div>
          ))
        )}
        <button onClick={() => setShowProjectsModal(false)} style={closeButtonStyle}>Close</button>
      </div>
    </div>
  );

  const TasksModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowTasksModal(false)}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h2 style={modalTitleStyle}>✅ All Tasks ({totalTasks})</h2>
        {totalTasks === 0 ? (
          <p style={{ color: theme.textLight }}>No tasks yet.</p>
        ) : (
          tasks.map(task => {
            const project = projects.find(p => p._id === task.project?._id || p._id === task.project);
            return (
              <div key={task._id} style={listItemStyle}>
                <div>
                  <strong style={{ color: theme.text, fontSize: '1rem' }}>{task.title}</strong>
                  <span style={taskStatusBadge(task.status)}>{task.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: theme.textMuted }}>
                  Project: {project?.name || 'Unknown'} | Deadline: {formatDate(task.deadline)}
                </div>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: theme.textLight }}>{task.description}</p>
              </div>
            );
          })
        )}
        <button onClick={() => setShowTasksModal(false)} style={closeButtonStyle}>Close</button>
      </div>
    </div>
  );

  const CompletionModal = () => {
    const pendingTasks = tasks.filter(t => t.status !== 'Done');
    return (
      <div style={modalOverlayStyle} onClick={() => setShowCompletionModal(false)}>
        <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
          <h2 style={modalTitleStyle}>📊 Completion Details</h2>
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(255,140,66,0.2)', borderRadius: '12px' }}>
            <p><strong style={{ color: theme.text }}>Completed:</strong> <span style={{ color: theme.success, fontWeight: 'bold' }}>{completedTasks}</span> / {totalTasks}</p>
            <p><strong style={{ color: theme.text }}>Completion Rate:</strong> <span style={{ color: theme.primary, fontWeight: 'bold' }}>{completionRate}%</span></p>
          </div>
          
          <h3 style={{ color: theme.success, marginTop: '1rem' }}>✅ Completed Tasks ({completedTasks})</h3>
          {completedTasks === 0 ? <p style={{ color: theme.textLight }}>No completed tasks.</p> : (
            tasks.filter(t => t.status === 'Done').map(task => (
              <div key={task._id} style={listItemStyle}>
                <strong style={{ color: theme.text }}>{task.title}</strong> - {task.project?.name || 'Unknown'}
              </div>
            ))
          )}
          
          <h3 style={{ marginTop: '1rem', color: theme.warning }}>⏳ Pending Tasks ({pendingTasks.length})</h3>
          {pendingTasks.length === 0 ? <p style={{ color: theme.textLight }}>All tasks completed! 🎉</p> : (
            pendingTasks.map(task => (
              <div key={task._id} style={listItemStyle}>
                <strong style={{ color: theme.text }}>{task.title}</strong> - {task.project?.name || 'Unknown'} (Status: {task.status})
              </div>
            ))
          )}
          <button onClick={() => setShowCompletionModal(false)} style={closeButtonStyle}>Close</button>
        </div>
      </div>
    );
  };

  const DeadlinesModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowDeadlinesModal(false)}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h2 style={modalTitleStyle}>⏰ Upcoming Deadlines ({upcomingDeadlines.length})</h2>
        {upcomingDeadlines.length === 0 ? (
          <p style={{ color: theme.textLight }}>No upcoming deadlines. Great job!</p>
        ) : (
          upcomingDeadlines.sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).map(task => (
            <div key={task._id} style={listItemStyle}>
              <div><strong style={{ color: theme.text }}>{task.title}</strong> - {task.project?.name || 'Unknown'}</div>
              <div style={{ fontSize: '0.85rem', color: theme.warning }}>
                Due: {formatDate(task.deadline)} (Status: {task.status})
              </div>
            </div>
          ))
        )}
        <button onClick={() => setShowDeadlinesModal(false)} style={closeButtonStyle}>Close</button>
      </div>
    </div>
  );

  const OverdueModal = () => (
    <div style={modalOverlayStyle} onClick={() => setShowOverdueModal(false)}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h2 style={modalTitleStyle}>⚠️ Overdue Tasks ({overdueTasks.length})</h2>
        {overdueTasks.length === 0 ? (
          <p style={{ color: theme.textLight }}>No overdue tasks. Keep it up!</p>
        ) : (
          overdueTasks.sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).map(task => (
            <div key={task._id} style={{ ...listItemStyle, backgroundColor: 'rgba(231,76,60,0.15)', borderRadius: '8px', marginBottom: '0.5rem' }}>
              <div><strong style={{ color: theme.text }}>{task.title}</strong> - {task.project?.name || 'Unknown'}</div>
              <div style={{ fontSize: '0.85rem', color: theme.danger }}>
                Deadline: {formatDate(task.deadline)} (Overdue by {overdueDays(task.deadline)} days)
              </div>
              <div style={{ fontSize: '0.85rem', color: theme.textLight }}>Status: {task.status}</div>
            </div>
          ))
        )}
        <button onClick={() => setShowOverdueModal(false)} style={closeButtonStyle}>Close</button>
      </div>
    </div>
  );

  // Main styles
  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      animation: 'fadeInUp 0.5s ease-out',
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
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    createButton: {
      backgroundColor: theme.primary,
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.8rem',
      borderRadius: '40px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
      transition: 'all 0.2s',
      boxShadow: theme.shadow,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(8px)',
      padding: '1.5rem',
      borderRadius: '20px',
      boxShadow: theme.shadow,
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      border: `1px solid ${theme.border}`,
      animation: 'fadeInUp 0.4s backwards',
    },
    statValue: {
      fontSize: '2.8rem',
      fontWeight: 'bold',
      color: theme.primary,
      marginBottom: '0.5rem',
      textShadow: '0 0 5px rgba(255,140,66,0.3)',
    },
    statLabel: {
      color: theme.textLight,
      fontSize: '0.95rem',
      fontWeight: '500',
    },
    projectsSection: {
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(8px)',
      padding: '1.5rem',
      borderRadius: '20px',
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
    },
    sectionTitle: {
      fontSize: '1.6rem',
      marginBottom: '1rem',
      color: theme.text,
    },
    projectList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    projectItem: {
      padding: '1rem',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background 0.2s',
    },
    projectName: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: theme.text,
    },
    projectLink: {
      color: theme.text,
      textDecoration: 'none',
      padding: '0.5rem 1.2rem',
      borderRadius: '30px',
      backgroundColor: theme.primary,
      transition: 'all 0.2s',
      fontWeight: '500',
    },
  };

  // Stagger animation delays for stat cards
  const cardDelays = ['0.05s', '0.1s', '0.15s', '0.2s', '0.25s'];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ color: theme.text, marginTop: '1rem' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Dashboard</h1>
        <button
          onClick={() => setShowProjectForm(true)}
          style={styles.createButton}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = theme.glow; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = theme.shadow; }}
          className="ripple"
        >
          + Create New Project
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div
          style={{ ...styles.statCard, animationDelay: cardDelays[0] }}
          onClick={() => setShowProjectsModal(true)}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = theme.glow; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = theme.shadow; }}
        >
          <div style={styles.statValue}>{projects.length}</div>
          <div style={styles.statLabel}>📁 Total Projects</div>
          <div style={{ fontSize: '0.7rem', color: theme.primary, marginTop: '0.3rem' }}>click to view</div>
        </div>

        <div
          style={{ ...styles.statCard, animationDelay: cardDelays[1] }}
          onClick={() => setShowTasksModal(true)}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = theme.glow; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = theme.shadow; }}
        >
          <div style={styles.statValue}>{totalTasks}</div>
          <div style={styles.statLabel}>✅ Total Tasks</div>
          <div style={{ fontSize: '0.7rem', color: theme.primary, marginTop: '0.3rem' }}>click to view</div>
        </div>

        <div
          style={{ ...styles.statCard, animationDelay: cardDelays[2] }}
          onClick={() => setShowCompletionModal(true)}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = theme.glow; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = theme.shadow; }}
        >
          <div style={styles.statValue}>{completionRate}%</div>
          <div style={styles.statLabel}>📊 Completion Rate</div>
          <div style={{ fontSize: '0.7rem', color: theme.primary, marginTop: '0.3rem' }}>click to view</div>
        </div>

        <div
          style={{ ...styles.statCard, animationDelay: cardDelays[3] }}
          onClick={() => setShowDeadlinesModal(true)}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = theme.glow; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = theme.shadow; }}
        >
          <div style={styles.statValue}>{upcomingDeadlines.length}</div>
          <div style={styles.statLabel}>⏰ Upcoming Deadlines</div>
          <div style={{ fontSize: '0.7rem', color: theme.primary, marginTop: '0.3rem' }}>click to view</div>
        </div>

        <div
          style={{ ...styles.statCard, animationDelay: cardDelays[4] }}
          onClick={() => setShowOverdueModal(true)}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = theme.glow; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = theme.shadow; }}
        >
          <div style={styles.statValue}>{overdueTasks.length}</div>
          <div style={styles.statLabel}>⚠️ Overdue Tasks</div>
          <div style={{ fontSize: '0.7rem', color: theme.primary, marginTop: '0.3rem' }}>click to view</div>
        </div>
      </div>

      <div style={styles.projectsSection}>
        <h2 style={styles.sectionTitle}>📌 Recent Projects</h2>
        <div style={styles.projectList}>
          {projects.slice(0, 5).map((project, idx) => (
            <div
              key={project._id}
              style={styles.projectItem}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={styles.projectName}>{project.name}</span>
              <Link
                to={`/projects/${project._id}`}
                style={styles.projectLink}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = theme.primaryDark}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = theme.primary}
              >
                View Details →
              </Link>
            </div>
          ))}
          {projects.length === 0 && <p style={{ color: theme.textLight }}>No projects yet. Create one using the button above.</p>}
        </div>
      </div>

      {/* Modals */}
      {showProjectsModal && <ProjectsModal />}
      {showTasksModal && <TasksModal />}
      {showCompletionModal && <CompletionModal />}
      {showDeadlinesModal && <DeadlinesModal />}
      {showOverdueModal && <OverdueModal />}
      {showProjectForm && <ProjectForm onClose={() => setShowProjectForm(false)} onProjectCreated={handleProjectCreated} />}
    </div>
  );
};

export default Dashboard;