import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { studentName, sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isExam = location.pathname === '/exam';

  function handleHamburger() {
    if (!isExam) setSidebarOpen(o => !o);
  }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className={`navbar-hamburger${isExam ? ' navbar-hamburger--exam' : ''}`}
          onClick={handleHamburger}
          aria-label="Toggle menu"
          aria-hidden={isExam}
        >
          {sidebarOpen && !isExam ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        <button className="navbar-logo" onClick={() => navigate('/subjects')}>
          PassIt
        </button>
      </div>

      {studentName && (
        <div className="navbar-right">
          <span className="navbar-avatar">{studentName.charAt(0).toUpperCase()}</span>
          <span className="navbar-name">{studentName}</span>
        </div>
      )}
    </header>
  );
}
