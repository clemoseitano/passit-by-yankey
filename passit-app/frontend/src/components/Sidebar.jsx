import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import WarningModal from './WarningModal';
import '../styles/Sidebar.css';

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const SwapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M4 4v5h5M20 20v-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 9A9 9 0 005.64 5.64M3.51 15a9 9 0 0014.85 3.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default function Sidebar() {
  const {
    sidebarOpen, setSidebarOpen,
    setSelectedSubject, setSelectedYear,
    setAnswers, setScore,
    setYearModalOpen, selectedSubject,
  } = useApp();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [showWarning, setShowWarning]     = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const examInProgress = location.pathname === '/exam';

  // CSS forces sidebar open on desktop (/exam + @media 768px).
  // On mobile, sidebar stays toggle-controlled so it doesn't block the screen.
  const showBackdrop = sidebarOpen && !examInProgress;

  function guardedNav(action) {
    if (examInProgress) {
      setPendingAction(() => action);
      setShowWarning(true);
    } else {
      action();
      setSidebarOpen(false);
    }
  }

  function handleLeave() {
    setShowWarning(false);
    setAnswers({});
    setScore(null);
    if (pendingAction) pendingAction();
    setSidebarOpen(false);
  }

  const items = [
    {
      icon: <HomeIcon />,
      label: 'Home',
      action: () => guardedNav(() => navigate('/subjects')),
    },
    {
      icon: <GridIcon />,
      label: 'Subjects',
      action: () => guardedNav(() => navigate('/subjects')),
    },
    {
      icon: <SwapIcon />,
      label: 'Change Subject',
      action: () => guardedNav(() => {
        setSelectedSubject('');
        setSelectedYear('');
        navigate('/subjects');
      }),
    },
    {
      icon: <CalendarIcon />,
      label: 'Change Year',
      action: () => guardedNav(() => {
        if (!selectedSubject) {
          navigate('/subjects');
        } else {
          setYearModalOpen(true);
        }
      }),
    },
  ];

  return (
    <>
      {showBackdrop && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar${sidebarOpen ? ' sidebar--open' : ''}${examInProgress ? ' sidebar--exam' : ''}`}>
        {examInProgress && (
          <div className="sidebar-exam-label">
            <span>In Progress</span>
          </div>
        )}
        <nav className="sidebar-nav">
          {items.map(item => (
            <button
              key={item.label}
              className={`sidebar-item${examInProgress ? ' sidebar-item--exam' : ''}`}
              onClick={item.action}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {showWarning && (
        <WarningModal
          onStay={() => setShowWarning(false)}
          onLeave={handleLeave}
        />
      )}
    </>
  );
}
